import type { AcceptInvitationResponse } from '#shared/types/api'

import { acceptInvitationSchema } from '#shared/schemas'

import { getAuth, issueSession, startSession, toCompanySummary, toUserSummary } from '../../../utils/auth'
import { usePrisma } from '../../../utils/db'
import { errors, readValidated } from '../../../utils/http'
import { clearInvitationCookie, consumeInvitationTicket, requireInvitationTicket } from '../../../utils/invitation'
import { notify } from '../../../utils/notifications'

/**
 * Accept an invitation and join the company.
 *
 * This is the moment a `User` row is created for the invitee. The security
 * properties mirror self-service registration:
 *
 *  - **phone** comes from the verified ticket, so an invitee cannot claim an
 *    invitation addressed to a number they do not control;
 *  - **company, role, team, name and job title** all come from the invitation
 *    row, so the invitee cannot negotiate themselves into `ADMIN`;
 *  - the ticket and the invitation are both closed inside one transaction, so
 *    neither a double submit nor a concurrent revoke can produce two accounts.
 *
 * Pre-auth, therefore unscoped `usePrisma()`. Scoping is re-established the
 * moment the session is issued: every later request goes through the tenant
 * client keyed to the invitation's `companyId`.
 */
export default defineEventHandler(async (event): Promise<AcceptInvitationResponse> => {
  if (getAuth(event)) {
    throw errors.conflict('شما پیش‌تر وارد شده‌اید')
  }

  const ticket = await requireInvitationTicket(event)
  const input = await readValidated(event, acceptInvitationSchema)
  const db = usePrisma()

  // Read outside the transaction for a good error message; the *claim* inside
  // the transaction is what actually decides the outcome.
  const invitation = await db.invitation.findUnique({
    where: { id: input.invitationId },
    include: {
      company: true,
      team: { select: { id: true, name: true } },
    },
  })

  if (!invitation || invitation.phone !== ticket.phone) {
    // Same answer for "does not exist" and "not yours" — the endpoint must not
    // confirm which invitations are out there.
    throw errors.notFound('دعوت‌نامه پیدا نشد')
  }
  if (invitation.status !== 'PENDING') {
    throw errors.conflict('این دعوت‌نامه قبلاً بسته شده است')
  }
  if (invitation.expiresAt.getTime() < Date.now()) {
    throw errors.conflict('مهلت این دعوت‌نامه به پایان رسیده است')
  }
  if (!invitation.company.isActive) {
    throw errors.conflict('شرکت دعوت‌کننده غیرفعال است')
  }

  // The same phone may already hold an account in this company (e.g. invited
  // twice, or reactivated). Joining must not create a duplicate.
  const existing = await db.user.findFirst({
    where: { companyId: invitation.companyId, phone: ticket.phone },
    select: { id: true, fullName: true, role: true },
  })
  if (existing) {
    throw errors.conflict('این شماره پیش‌تر عضو این شرکت شده است؛ لطفاً وارد شوید')
  }

  const ip = getRequestIP(event, { xForwardedFor: true })

  const { user, company, team } = await db.$transaction(async (tx) => {
    await consumeInvitationTicket(tx, ticket.id)

    // Claim the invitation. Conditional on PENDING + the ticket's phone, so a
    // concurrent accept or revoke loses here rather than silently succeeding.
    const claimed = await tx.invitation.updateMany({
      where: { id: invitation.id, status: 'PENDING', phone: ticket.phone },
      data: { status: 'ACCEPTED', acceptedAt: new Date(), pendingPhone: null },
    })
    if (claimed.count === 0) {
      throw errors.conflict('این دعوت‌نامه قبلاً بسته شده است')
    }

    const newUser = await tx.user.create({
      data: {
        companyId: invitation.companyId,
        phone: ticket.phone,
        fullName: invitation.fullName,
        jobTitle: invitation.jobTitle,
        role: invitation.role,
        status: 'ACTIVE',
        locale: invitation.company.locale,
        timezone: invitation.company.timezone,
      },
    })

    // Every page assumes a progress row exists and that `levelId` resolves.
    const firstLevel = await tx.level.findFirst({
      where: { companyId: invitation.companyId },
      orderBy: { level: 'asc' },
      select: { id: true },
    })
    await tx.userProgress.create({
      data: {
        companyId: invitation.companyId,
        userId: newUser.id,
        xp: 0,
        coins: 0,
        levelId: firstLevel?.id ?? null,
      },
    })

    await tx.wallet.create({
      data: { companyId: invitation.companyId, userId: newUser.id },
    })

    if (invitation.teamId) {
      // `managerId` is left null on purpose: the inviter is not automatically
      // the direct manager, and inventing that edge would silently widen what
      // they can see.
      await tx.teamMember.create({
        data: {
          companyId: invitation.companyId,
          teamId: invitation.teamId,
          userId: newUser.id,
        },
      })
    }

    // Tell the inviter their invite landed.
    await notify(tx, {
      companyId: invitation.companyId,
      userId: invitation.invitedById,
      actorId: newUser.id,
      type: 'INVITATION',
      title: `${invitation.fullName} به شرکت پیوست`,
      message: invitation.jobTitle
        ? `دعوت‌نامه پذیرفته شد و ${invitation.fullName} با عنوان «${invitation.jobTitle}» عضو شد.`
        : `دعوت‌نامه پذیرفته شد و ${invitation.fullName} عضو شرکت شد.`,
      metadata: { invitationId: invitation.id, userId: newUser.id },
    })

    await tx.invitation.update({
      where: { id: invitation.id },
      data: { acceptedById: newUser.id },
    })

    await tx.auditLog.create({
      data: {
        companyId: invitation.companyId,
        actorId: newUser.id,
        action: 'member.joined',
        targetType: 'User',
        targetId: newUser.id,
        ip,
        data: { invitationId: invitation.id, role: invitation.role },
      },
    })

    return { user: newUser, company: invitation.company, team: invitation.team }
  })

  const session = await issueSession(event, user)
  startSession(event, session)
  clearInvitationCookie(event)

  return {
    status: 'authenticated',
    user: toUserSummary(user),
    company: toCompanySummary(company),
    invitation: {
      id: invitation.id,
      fullName: invitation.fullName,
      jobTitle: invitation.jobTitle,
      role: invitation.role,
      team,
    },
  }
})
