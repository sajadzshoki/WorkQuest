import type { TeamDetailResponse } from '#shared/types/api'

import { requireAuth } from '../../../../utils/auth'
import { errors } from '../../../../utils/http'
import { canEditTeam } from '#shared/utils/member-scope'
import { ledTeamIds, teamDetail } from '../../../../utils/members'
import { createTenantClient } from '../../../../utils/tenant'

/**
 * Remove someone from a team.
 *
 * OWNER/ADMIN, or a MANAGER who leads the team. The membership row is deleted;
 * the user is untouched, because leaving a team is not leaving the company.
 *
 * Removing a lead clears `Team.leadId` first — leaving it pointing at a user
 * who is no longer in the team would make the scope rules incoherent.
 */
export default defineEventHandler(async (event): Promise<TeamDetailResponse> => {
  const auth = requireAuth(event)
  const id = getRouterParam(event, 'id')
  const userId = getRouterParam(event, 'userId')
  if (!id || !userId) throw errors.notFound('عضو پیدا نشد')

  const db = createTenantClient(auth)

  const team = await db.team.findUnique({ where: { id }, select: { id: true, leadId: true } })
  if (!team) throw errors.notFound('تیم پیدا نشد')

  const led = await ledTeamIds(auth)
  if (!canEditTeam(auth, team.id, led)) throw errors.notFound('تیم پیدا نشد')

  const membership = await db.teamMember.findFirst({
    where: { teamId: team.id, userId },
    select: { id: true, userId: true },
  })
  if (!membership) throw errors.notFound('عضو پیدا نشد')

  await db.$transaction(async (tx) => {
    if (team.leadId === membership.userId) {
      await tx.team.update({ where: { id: team.id }, data: { leadId: null } })
    }

    // Anyone whose `managerId` pointed at this member loses the edge, so the
    // scope graph cannot keep a dangling pointer into the team.
    await tx.teamMember.updateMany({
      where: { teamId: team.id, managerId: membership.userId },
      data: { managerId: null },
    })

    await tx.teamMember.delete({ where: { id: membership.id } })

    await tx.auditLog.create({
      data: {
        companyId: auth.companyId,
        actorId: auth.userId,
        action: 'team.member_remove',
        targetType: 'Team',
        targetId: team.id,
        ip: getRequestIP(event, { xForwardedFor: true }),
        data: { userId: membership.userId },
      },
    })
  })

  return teamDetail(db, team.id)
})
