import type { Prisma } from '#prisma/client'
import type { H3Event } from 'h3'

import { DEFAULT_LEVELS } from '#shared/constants'

import { usePrisma } from './db'
import { errors } from './http'

/**
 * Self-service registration bridge.
 *
 * A phone number that passes OTP verification but has no account yet cannot be
 * given a session — there is no user, no company and therefore no tenant to
 * scope anything to. Instead it receives a short-lived **onboarding ticket**:
 *
 *   1. `issueOnboardingTicket` stores a row and puts its id in an httpOnly,
 *      SameSite=Lax cookie. The browser never sees the id, so it cannot be
 *      lifted by script or leak into logs/history.
 *   2. `requireOnboardingTicket` re-reads the cookie on the onboarding pages
 *      and checks the row is still unconsumed and unexpired.
 *   3. `consumeOnboardingTicket` marks it used inside the transaction that
 *      creates the company, so the ticket is genuinely single-use.
 *
 * Backing the ticket with a row (rather than a stateless JWT) is what makes it
 * revocable and replay-proof: a stateless token could mint unlimited companies
 * for the whole TTL.
 */

const COOKIE_NAME = 'workquest_onboarding'

function onboardingConfig() {
  const config = useRuntimeConfig()
  return {
    ttlSeconds: Number(config.onboardingTicketTtlSeconds ?? 60 * 15),
    secure: String(config.secureCookies ?? 'true') !== 'false',
  }
}

export interface OnboardingTicket {
  id: string
  phone: string
  expiresAt: Date
}

/** Create a ticket for a verified phone and set the httpOnly cookie. */
export async function issueOnboardingTicket(
  event: H3Event,
  phone: string,
): Promise<OnboardingTicket> {
  const db = usePrisma()
  const { ttlSeconds, secure } = onboardingConfig()
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000)

  // Supersede any earlier ticket for this phone so only the newest one works.
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

export function readOnboardingCookie(event: H3Event): string | undefined {
  const value = getCookie(event, COOKIE_NAME)
  return value && value.length > 0 ? value : undefined
}

export function clearOnboardingCookie(event: H3Event): void {
  const { secure } = onboardingConfig()
  deleteCookie(event, COOKIE_NAME, { httpOnly: true, secure, sameSite: 'lax', path: '/' })
}

/**
 * Resolve the pending ticket from the cookie, or `null` when there is none.
 * Used by `GET /api/auth/onboarding` so the page can render its state.
 */
export async function findOnboardingTicket(
  event: H3Event,
): Promise<OnboardingTicket | null> {
  const id = readOnboardingCookie(event)
  if (!id) return null

  const ticket = await usePrisma().onboardingTicket.findUnique({ where: { id } })
  if (!ticket || ticket.consumedAt || ticket.expiresAt.getTime() < Date.now()) return null

  return { id: ticket.id, phone: ticket.phone, expiresAt: ticket.expiresAt }
}

/** Like `findOnboardingTicket` but answers 401 through the standard envelope. */
export async function requireOnboardingTicket(
  event: H3Event,
): Promise<OnboardingTicket> {
  const ticket = await findOnboardingTicket(event)
  if (!ticket) {
    throw errors.unauthorized('نشست ثبت‌نام معتبر نیست؛ لطفاً دوباره کد ورود بگیرید')
  }
  return ticket
}

/**
 * Mark the ticket used as part of the caller's transaction.
 *
 * Re-checking `consumedAt` inside the transaction is the race guard: two
 * concurrent submits both holding the same cookie can only create one company.
 */
export async function consumeOnboardingTicket(
  tx: Prisma.TransactionClient,
  ticketId: string,
): Promise<void> {
  const { count } = await tx.onboardingTicket.updateMany({
    where: { id: ticketId, consumedAt: null },
    data: { consumedAt: new Date() },
  })

  if (count === 0) {
    throw errors.conflict('این نشست ثبت‌نام قبلاً استفاده شده است')
  }
}

/**
 * Slug handling for new companies.
 *
 * Slugs are globally unique, so the founder's suggestion is normalised and then
 * de-duplicated with a numeric suffix rather than rejected — nobody should be
 * blocked from creating a company because two others picked the same name.
 */
export async function reserveCompanySlug(
  db: Prisma.TransactionClient | ReturnType<typeof usePrisma>,
  requested: string,
): Promise<string> {
  const base = requested.slice(0, 50)

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`
    const existing = await db.company.findUnique({ where: { slug: candidate }, select: { id: true } })
    if (!existing) return candidate
  }

  // 20 collisions on the same base is pathological; fall back to a random tail.
  return `${base}-${Math.random().toString(36).slice(2, 8)}`
}

/**
 * Give a new tenant the baseline every page assumes exists: the level ladder
 * (so `UserProgress.levelId` always resolves) and a zeroed progress row.
 */
export async function bootstrapCompanyDefaults(
  tx: Prisma.TransactionClient,
  companyId: string,
  ownerId: string,
): Promise<void> {
  await tx.level.createMany({
    data: DEFAULT_LEVELS.map(level => ({ companyId, ...level })),
  })

  const firstLevel = await tx.level.findFirst({
    where: { companyId },
    orderBy: { level: 'asc' },
    select: { id: true },
  })

  await tx.userProgress.create({
    data: {
      companyId,
      userId: ownerId,
      xp: 0,
      coins: 0,
      levelId: firstLevel?.id ?? null,
    },
  })

  // Wallets are created eagerly so every member has one from day one;
  // `applyCoinDelta` can create them lazily, but an always-present row keeps
  // read paths simple and avoids a first-payout write amplification.
  await tx.wallet.create({ data: { companyId, userId: ownerId } })

  // Seed the company's economy at v1 so payouts are governed by an explicit,
  // auditable rule row rather than by code defaults.
  await tx.rewardRule.create({ data: { companyId, version: 1, isActive: true } })
}
