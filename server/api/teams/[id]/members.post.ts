import type { TeamDetailResponse } from '#shared/types/api'

import { addTeamMemberSchema } from '#shared/schemas'
import { can } from '#shared/utils/permissions'

import { getManagedUserIds, requireAuth } from '../../../utils/auth'
import { errors, readValidated } from '../../../utils/http'
import { canEditTeam } from '#shared/utils/member-scope'
import { ledTeamIds, rejectSecondMembership } from '../../../utils/members'
import { createTenantClient } from '../../../utils/tenant'

/**
 * Add someone to a team.
 *
 * OWNER/ADMIN, or a MANAGER who leads this team. A manager may only pull in
 * people they can already see, so this endpoint cannot be used to hoover up
 * staff from another part of the company.
 *
 * Two structural rules are enforced here because the UI cannot:
 *
 *  - **one primary team per person.** `TeamMember` carries a unique
 *    `(companyId, userId)`, so a second membership is rejected rather than
 *    silently replacing the first. Moving someone is a two-step, deliberate
 *    act on the member's profile.
 *  - **`role: LEAD` is admin-only.** The `LEAD` team role is what grants
 *    `team:manage:assigned` scope, so letting a manager hand it out would let
 *    them multiply their own reach.
 */
export default defineEventHandler(async (event): Promise<TeamDetailResponse> => {
  const auth = requireAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw errors.notFound('تیم پیدا نشد')

  const input = await readValidated(event, addTeamMemberSchema)
  const db = createTenantClient(auth)

  const team = await db.team.findUnique({ where: { id }, select: { id: true } })
  if (!team) throw errors.notFound('تیم پیدا نشد')

  const led = await ledTeamIds(auth)
  if (!canEditTeam(auth, team.id, led)) throw errors.notFound('تیم پیدا نشد')

  if (input.role === 'LEAD' && !can(auth.role, 'team:manage')) {
    throw errors.forbidden('تعیین سرپرست تیم در اختیار مدیران شرکت است')
  }

  const user = await db.user.findUnique({
    where: { id: input.userId },
    select: { id: true, fullName: true, status: true },
  })
  if (!user) throw errors.notFound('کاربر انتخاب‌شده پیدا نشد')
  if (user.status !== 'ACTIVE') throw errors.conflict('این کاربر فعال نیست')

  // A manager may only add people already inside their scope.
  if (!can(auth.role, 'member:manage')) {
    const managed = await getManagedUserIds(auth.companyId, auth.userId)
    if (!managed.includes(user.id) && user.id !== auth.userId) {
      throw errors.forbidden('فقط می‌توانید اعضای تیم خودتان را به تیم اضافه کنید')
    }
  }

  const existing = await db.teamMember.findFirst({
    where: { userId: user.id },
    select: { id: true, teamId: true, team: { select: { name: true } } },
  })
  if (existing?.teamId === team.id) {
    throw errors.conflict('این کاربر عضو همین تیم است')
  }
  // Different team: same 409 wording as the lead-assignment path, rather than
  // a 500 off the unique index.
  rejectSecondMembership(existing)

  const managerId = input.managerId || null
  if (managerId) {
    if (managerId === user.id) {
      throw errors.badRequest('MANAGER_SELF', 'مدیر مستقیم نمی‌تواند خود فرد باشد')
    }
    const inTeam = await db.teamMember.findFirst({
      where: { teamId: team.id, userId: managerId },
      select: { id: true },
    })
    if (!inTeam) throw errors.badRequest('MANAGER_NOT_IN_TEAM', 'مدیر انتخاب‌شده عضو این تیم نیست')
  }

  await db.teamMember.create({
    data: {
      companyId: auth.companyId,
      teamId: team.id,
      userId: user.id,
      role: input.role,
      managerId,
    },
  })

  await db.auditLog.create({
    data: {
      companyId: auth.companyId,
      actorId: auth.userId,
      action: 'team.member_add',
      targetType: 'Team',
      targetId: team.id,
      ip: getRequestIP(event, { xForwardedFor: true }),
      data: { userId: user.id, role: input.role },
    },
  })

  return teamDetail(db, team.id)
})
