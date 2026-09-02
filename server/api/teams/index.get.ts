import { can } from '#shared/utils/permissions'

import { getManagedUserIds, requireAuth } from '../../utils/auth'
import { createTenantClient } from '../../utils/tenant'

/**
 * Teams the caller may see.
 * OWNER/ADMIN see every team; managers only the ones they lead or staff.
 */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const db = createTenantClient(auth)

  const where = can(auth.role, 'team:manage')
    ? {}
    : {
        OR: [
          { leadId: auth.userId },
          { members: { some: { userId: auth.userId } } },
          { members: { some: { managerId: auth.userId } } },
        ],
      }

  const teams = await db.team.findMany({
    where,
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      lead: { select: { id: true, fullName: true, avatarUrl: true } },
      members: {
        select: {
          id: true,
          role: true,
          joinedAt: true,
          user: { select: { id: true, fullName: true, avatarUrl: true, jobTitle: true, role: true } },
          manager: { select: { id: true, fullName: true } },
        },
      },
      _count: { select: { tasks: true } },
    },
  })

  const managedUserIds = can(auth.role, 'team:manage')
    ? null
    : await getManagedUserIds(auth.companyId, auth.userId)

  return {
    teams: teams.map(team => ({
      id: team.id,
      name: team.name,
      slug: team.slug,
      description: team.description,
      lead: team.lead,
      taskCount: team._count.tasks,
      memberCount: team.members.length,
      members: team.members.map(member => ({
        id: member.user.id,
        fullName: member.user.fullName,
        avatarUrl: member.user.avatarUrl,
        jobTitle: member.user.jobTitle,
        role: member.user.role,
        teamRole: member.role,
        managerName: member.manager?.fullName ?? null,
        joinedAt: member.joinedAt.toISOString(),
      })),
    })),
    managedUserIds,
  }
})
