import { requirePermission } from '../../utils/auth'
import { errors } from '../../utils/http'
import { createTenantClient } from '../../utils/tenant'

/**
 * Delete a team.
 *
 * OWNER/ADMIN only (`team:manage`) — a manager leads teams but must not be able
 * to dissolve one, since that would silently strip scope from everyone in it.
 *
 * Members are *not* deleted: their `TeamMember` rows go away (cascading from
 * the team), the users stay, and their tasks lose their team link but keep
 * their assignee. Losing a team is an organisational change, not a data purge.
 */
export default defineEventHandler(async (event): Promise<{ ok: boolean }> => {
  const auth = requirePermission(event, 'team:manage')
  const id = getRouterParam(event, 'id')
  if (!id) throw errors.notFound('تیم پیدا نشد')

  const db = createTenantClient(auth)

  const team = await db.team.findUnique({
    where: { id },
    select: { id: true, name: true, _count: { select: { members: true, tasks: true } } },
  })
  if (!team) throw errors.notFound('تیم پیدا نشد')

  await db.$transaction(async (tx) => {
    // `Task.teamId` is `ON DELETE SET NULL`, so tasks survive with their
    // assignee intact and only lose the team link. `TeamMember` rows cascade
    // away with the team; the users themselves are untouched.
    await tx.team.delete({ where: { id: team.id } })

    await tx.auditLog.create({
      data: {
        companyId: auth.companyId,
        actorId: auth.userId,
        action: 'team.delete',
        targetType: 'Team',
        targetId: team.id,
        ip: getRequestIP(event, { xForwardedFor: true }),
        data: { name: team.name, members: team._count.members, tasks: team._count.tasks },
      },
    })
  })

  return { ok: true }
})
