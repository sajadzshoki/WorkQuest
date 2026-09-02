import type { Prisma } from '#prisma/client'
import type { AuthContext, InvitationDetail } from '#shared/types/api'
import type { H3Event } from 'h3'

import { usePrisma } from './db'
import { errors } from './http'
import { createTenantClient } from './tenant'

/**
 * The invitation half of the join flow.
 *
 * A phone that passes OTP verification may already be *invited* by one or more
 * companies. Such a phone cannot be given a session either — there is still no
 * `User` row — so it receives the same treatment as self-service registration:
 * a short-lived **ticket** in an httpOnly cookie, backed by a row, that lets the
 * invitee read their pending invitations and accept exactly one.
 *
 * The ticket is separate from `OnboardingTicket` on purpose:
 *
 *  - an onboarding ticket lets the holder *create a company*;
 *  - an invitation ticket only lets the holder *join an existing one*, and only
 *    the ones addressed to that phone.
 *
 * Keeping them apart means a leaked invitation ticket can never mint a tenant.
 */

const COOKIE_NAME = 'workquest_invitation'

function invitationConfig() {
  const config = useRuntimeConfig()
  return {
    // Reuses the onboarding TTL: both are "finish this join now" windows.
    ttlSeconds: Number(config.onboardingTicketTtlSeconds ?? 60 * 15),
    secure: String(config.secureCookies ?? 'true') !== 'false',
  }
}

export interface InvitationTicket {
  id: string
  phone: string
  expiresAt: Date
}

/** Create an invitation ticket for a verified phone and set the cookie. */
export async function issueInvitationTicket(
  event: H3Event,
  phone: string,
): Promise<InvitationTicket> {
  const db = usePrisma()
  const { ttlSeconds, secure } = invitationConfig()
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000)

  // Supersede earlier tickets so only the newest one works.
  await db.onboardingTicket.updateMany({
    where: { phone, consumedAt: null },
    data: { consumedAt: new Date() },
  })

  const ticket = await db.onboardingTicket.create({
    data: {
      phone,
      expiresAt,
      ip: getRequestIP(event, { xForwardedFor: true }),
      userAgent: getHeader(event, 'user-agent'),
    },
  })

  setCookie(event, COOKIE_NAME, ticket.id, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: ttlSeconds,
  })

  return { id: ticket.id, phone: ticket.phone, expiresAt: ticket.expiresAt }
}

export function readInvitationCookie(event: H3Event): string | undefined {
  const value = getCookie(event, COOKIE_NAME)
  return value && value.length > 0 ? value : undefined
}

export function clearInvitationCookie(event: H3Event): void {
  const { secure } = invitationConfig()
  deleteCookie(event, COOKIE_NAME, { httpOnly: true, secure, sameSite: 'lax', path: '/' })
}

/** Resolve the pending ticket from the cookie, or `null`. */
export async function findInvitationTicket(
  event: H3Event,
): Promise<InvitationTicket | null> {
  const id = readInvitationCookie(event)
  if (!id) return null

  const ticket = await usePrisma().onboardingTicket.findUnique({ where: { id } })
  if (!ticket || ticket.consumedAt || ticket.expiresAt.getTime() < Date.now()) return null

  return { id: ticket.id, phone: ticket.phone, expiresAt: ticket.expiresAt }
}

export async function requireInvitationTicket(
  event: H3Event,
): Promise<InvitationTicket> {
  const ticket = await findInvitationTicket(event)
  if (!ticket) {
    throw errors.unauthorized('نشست دعوت‌نامه معتبر نیست؛ لطفاً دوباره کد ورود بگیرید')
  }
  return ticket
}

/** Mark the ticket used inside the caller's transaction (single-use). */
export async function consumeInvitationTicket(
  tx: Prisma.TransactionClient,
  ticketId: string,
): Promise<void> {
  const { count } = await tx.onboardingTicket.updateMany({
    where: { id: ticketId, consumedAt: null },
    data: { consumedAt: new Date() },
  })

  if (count === 0) {
    throw errors.conflict('این نشست دعوت‌نامه قبلاً استفاده شده است')
  }
}

/**
 * Pending invitations for a phone, newest first, skipping expired ones.
 *
 * Deliberately unscoped — it runs *before* any session exists, so it cannot use
 * the tenant client. It only ever reads rows whose `phone` matches the ticket.
 */
export async function listPendingInvitationsForPhone(
  phone: string,
): Promise<InvitationDetail[]> {
  const db = usePrisma()
  const now = new Date()

  const rows = await db.invitation.findMany({
    where: { phone, status: 'PENDING', expiresAt: { gt: now } },
    include: {
      company: { select: { id: true, name: true, slug: true, logoUrl: true } },
      team: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return rows.map(toInvitationDetail)
}

export function toInvitationDetail(
  invitation: {
    id: string
    status: string
    fullName: string
    jobTitle: string | null
    phone: string
    role: string
    expiresAt: Date
    company: { id: string, name: string, slug: string, logoUrl: string | null }
    team: { id: string, name: string } | null
  },
): InvitationDetail {
  return {
    id: invitation.id,
    company: invitation.company,
    fullName: invitation.fullName,
    jobTitle: invitation.jobTitle,
    phone: invitation.phone,
    role: invitation.role as InvitationDetail['role'],
    team: invitation.team,
    expiresAt: invitation.expiresAt.toISOString(),
    status: invitation.status as InvitationDetail['status'],
  }
}

/**
 * Lazily expire the caller's company's overdue invitations.
 *
 * Cheaper and more predictable than a cron: the list is corrected whenever
 * someone opens the invitations page, and `accept` re-checks the deadline
 * anyway so an expired row can never be used.
 *
 * Clearing `pendingPhone` frees the unique slot so the same phone can be
 * invited again.
 */
export async function expireStaleInvitations(auth: AuthContext): Promise<number> {
  const { count } = await createTenantClient(auth).invitation.updateMany({
    where: { status: 'PENDING', expiresAt: { lte: new Date() } },
    data: { status: 'EXPIRED', pendingPhone: null },
  })
  return count
}
