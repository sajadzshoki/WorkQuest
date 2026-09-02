import type { TeamDetailResponse } from '#shared/types/api'

import { updateTeamMemberSchema } from '#shared/schemas'
import { can } from '#shared/utils/permissions'

import { requireAuth } from '../../../../utils/auth'
import { errors, readValidated } from '../../../../utils/http'
import { canEditTeam } from '#shared/utils/member-scope'
import { ledTeamIds, teamDetail } from '../../../../utils/members'
import { createTenantClient } from '../../../../utils/tenant'

/**
 * Edit a membership: the team-level role and the direct manager.
 *
 * `role: LEAD` is OWNER/ADMIN only, exactly as in the add endpoint — the LEAD
 * team role is what grants `team:manage:assigned`, so a manager handing it out
 * would be widening their own reach.
 *
 * `managerId` is the hierarchy edge the manager scope walks, so it is validated
 * twice: it must be a different person, and that person must already be in this
 * team. A manager outside the team would otherwise gain visibility into it.
 */
export default defineEventHandler(async (event): Promise<TeamDetailResponse> => {
  const auth = requireAuth(event)
  const id = getRouterParam(event, 'id')
  const userId = getRouterParam(event, 'userId')
  if (!id || !userId) throw errors.notFound('عضو پیدا نشد')

  const input = await readValidated(event, updateTeamMemberSchema)
  const db = createTenantClient(auth)

  const team = await db.team.findUnique({ where: { id }, select: { id: true, leadId: true } })
  if (!team) throw errors.notFound('تیم پیدا نشد')

  const led = await ledTeamIds(auth)
  if (!canEditTeam(auth, team.id, led)) throw errors.notFound('تیم پیدا نشد')

  const membership = await db.teamMember.findFirst({
    where: { teamId: team.id, userId },
    select: { id: true, userId: true, role: true },
  })
  if (!membership) throw errors.notFound('عضو پیدا نشد')

  if (input.role === 'LEAD' && !can(auth.role, 'team:manage')) {
    throw errors.forbidden('تعیین سرپرست تیم در اختیار مدیران شرکت است')
  }

  const data: Record<string, unknown> = {}
  if (input.role !== undefined) data.role = input.role

  if (input.managerId !== undefined) {
    const managerId = input.managerId || null
    if (managerId === membership.userId) {
      throw errors.badRequest('MANAGER_SELF', 'مدیر مستقیم نمی‌تواند خود فرد باشد')
    }
    if (managerId) {
      const inTeam = await db.teamMember.findFirst({
        where: { teamId: team.id, userId: managerId },
        select: { id: true },
      })
      if (!inTeam) throw errors.badRequest('MANAGER_NOT_IN_TEAM', 'مدیر انتخاب‌شده عضو این تیم نیست')
    }
    data.managerId = managerId
  }

  await db.$transaction(async (tx) => {
    await tx.teamMember.update({ where: { id: membership.id }, data })

    // Promoting to LEAD keeps `Team.leadId` and the membership in step, and
    // demotes the previous lead's membership so there is exactly one LEAD.
    if (input.role === 'LEAD' && team.leadId !== membership.userId) {
      if (team.leadId) {
        const previous = await tx.teamMember.findFirst({
          where: { teamId: team.id, userId: team.leadId },
          select: { id: true },
        })
        if (previous) await tx.teamMember.update({ where: { id: previous.id }, data: { role: 'MEMBER' } })
      }
      await tx.team.update({ where: { id: team.id }, data: { leadId: membership.userId } })
    }

    if (input.role === 'MEMBER' && team.leadId === membership.userId) {
      await tx.team.update({ where: { id: team.id }, data: { leadId: null } })
    }

    await tx.auditLog.create({
      data: {
        companyId: auth.companyId,
        actorId: auth.userId,
        action: 'team.member_update',
        targetType: 'Team',
        targetId: team.id,
        ip: getRequestIP(event, { xForwardedFor: true }),
        data: { userId: membership.userId, fields: Object.keys(input) },
      },
    })
  })

  return teamDetail(db, team.id)
})
