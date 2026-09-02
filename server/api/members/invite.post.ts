import type { InvitationSummary } from '#shared/types/api'
import type { Role } from '#shared/utils/permissions'

import { inviteMemberSchema } from '#shared/schemas'

import { requirePermission } from '../../utils/auth'
import { errors, readValidated } from '../../utils/http'
import { canEditTeam, maxAssignableRole, roleAtMost } from '#shared/utils/member-scope'
import { ledTeamIds } from '../../utils/members'
import { createTenantClient } from '../../utils/tenant'

/** How long an invitation stays open when the caller does not say. */
const MAX_INVITATION_DAYS = 30

/**
 * Invite an employee by phone number.
 *
 * This creates an `Invitation`, **not** a `User`: the invitee has no account
 * yet, and creating a phantom user would put a row in the people list that
 * cannot log in and cannot be distinguished from a real member.
 *
 * The invitee later signs in with an OTP; `POST /api/auth/otp/verify` notices
 * the pending invitation and routes them to the accept screen instead of
 * onboarding.
 *
 * Scope rules:
 *  - OWNER/ADMIN may invite into any team with any role up to ADMIN;
 *  - MANAGER may invite **EMPLOYEE only**, and only into a team they lead.
 *    A manager must never be able to mint a peer or an admin.
 */
export default defineEventHandler(async (event): Promise<{ invitation: InvitationSummary }> => {
  const auth = requirePermission(event, 'member:invite')
  const input = await readValidated(event, inviteMemberSchema)
  const db = createTenantClient(auth)

  // --- role the caller is allowed to grant -------------------------------
  const ceiling = maxAssignableRole(auth.role)
  if (!roleAtMost(input.role, ceiling)) {
    throw errors.forbidden('اجازه تعیین این نقش را ندارید')
  }

  // --- team the caller is allowed to invite into -------------------------
  const led = await ledTeamIds(auth)
  const teamId = input.teamId || null
  if (teamId) {
    const team = await db.team.findUnique({ where: { id: teamId }, select: { id: true, name: true } })
    if (!team) throw errors.notFound('تیم انتخاب‌شده پیدا نشد')
    if (!canEditTeam(auth, teamId, led)) {
      throw errors.forbidden('فقط می‌توانید به تیم‌های زیر نظر خودتان نیرو دعوت کنید')
    }
  }

  const phone = input.phone

  // --- already a member? -------------------------------------------------
  const existing = await db.user.findFirst({
    where: { phone },
    select: { id: true, fullName: true, status: true },
  })
  if (existing && existing.status !== 'DEACTIVATED') {
    throw errors.conflict('این شماره قبلاً عضو شرکت است')
  }

  // --- already invited? --------------------------------------------------
  const duplicate = await db.invitation.findFirst({
    where: { pendingPhone: phone },
    select: { id: true, fullName: true },
  })
  if (duplicate) {
    throw errors.conflict('برای این شماره دعوت‌نامه باز وجود دارد')
  }

  const days = Math.min(Math.max(input.expiresInDays, 1), MAX_INVITATION_DAYS)
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000)

  const invitation = await db.invitation.create({
    data: {
      // Explicit even though the tenant client would inject it: Prisma's
      // checked-input type needs either this or a `company` connect.
      companyId: auth.companyId,
      phone,
      pendingPhone: phone,
      fullName: input.fullName,
      jobTitle: input.jobTitle || null,
      teamId,
      role: input.role as Role,
      invitedById: auth.userId,
      expiresAt,
    },
    include: {
      team: { select: { id: true, name: true } },
      invitedBy: { select: { id: true, fullName: true } },
    },
  })

  await db.auditLog.create({
    data: {
      companyId: auth.companyId,
      actorId: auth.userId,
      action: 'member.invite',
      targetType: 'Invitation',
      targetId: invitation.id,
      ip: getRequestIP(event, { xForwardedFor: true }),
      data: { phone, role: invitation.role, teamId },
    },
  })

  return {
    invitation: {
      id: invitation.id,
      fullName: invitation.fullName,
      phone: invitation.phone,
      jobTitle: invitation.jobTitle,
      role: invitation.role as InvitationSummary['role'],
      status: invitation.status,
      team: invitation.team,
      invitedBy: invitation.invitedBy,
      expiresAt: invitation.expiresAt.toISOString(),
      acceptedAt: null,
      acceptedBy: null,
      createdAt: invitation.createdAt.toISOString(),
    },
  }
})
