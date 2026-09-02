import type { TeamDetailResponse } from '#shared/types/api'

import { can } from '#shared/utils/permissions'

import { getManagedUserIds, requireAuth } from '../../utils/auth'
import { errors } from '../../utils/http'
import { canEditTeam } from '#shared/utils/member-scope'
import { ledTeamIds } from '../../utils/members'
import { createTenantClient } from '../../utils/tenant'

/**
 * One team, with its roster.
 *
 * Visibility: OWNER/ADMIN see every team. Anyone else sees a team only if they
 * lead it, belong to it, or manage someone in it — the same predicate
 * `GET /api/teams` uses, so the list and the detail cannot disagree.
 *
 * `candidates` is the pool of company members without a team, included only
 * for callers who may actually add someone, so an EMPLOYEE never receives a
 * roster of the whole company as a side effect of opening a team page.
 */
export default defineEventHandler(async (event): Promise<TeamDetailResponse> => {
  const auth = requireAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw errors.notFound('تیم پیدا نشد')

  const db = createTenantClient(auth)

  const team = await db.team.findUnique({
    where: { id },
    include: {
      lead: { select: { id: true, fullName: true } },
      members: {
        include: {
          user: { select: { id: true, fullName: true, avatarUrl: true, jobTitle: true, role: true } },
          manager: { select: { id: true, fullName: true } },
        },
        orderBy: { joinedAt: 'asc' },
      },
    },
  })
  if (!team) throw errors.notFound('تیم پیدا نشد')

  const led = await ledTeamIds(auth)
  const isMember = team.members.some(member => member.userId === auth.userId)
  const managesHere = can(auth.role, 'team:manage')
    || team.members.some(member => member.managerId === auth.userId)

  if (!can(auth.role, 'team:manage') && !led.includes(team.id) && !isMember && !managesHere) {
    // Not 403: the endpoint should not confirm that a team exists.
    throw errors.notFound('تیم پیدا نشد')
  }

  const edit = canEditTeam(auth, team.id, led)

  let candidates: TeamDetailResponse['candidates'] = []
  if (edit) {
    const managedIds = can(auth.role, 'member:manage') ? null : await getManagedUserIds(auth.companyId, auth.userId)

    const rows = await db.user.findMany({
      where: {
        status: 'ACTIVE',
        teamMemberships: { none: {} },
        // A manager may only pull from people they can already see.
        ...(managedIds ? { id: { in: [...managedIds, auth.userId] } } : {}),
      },
      select: { id: true, fullName: true, jobTitle: true },
      orderBy: { fullName: 'asc' },
    })
    candidates = rows
  }

  return {
    team: {
      id: team.id,
      name: team.name,
      slug: team.slug,
      description: team.description,
      lead: team.lead,
      members: team.members.map(member => ({
        id: member.id,
        userId: member.user.id,
        fullName: member.user.fullName,
        jobTitle: member.user.jobTitle,
        avatarUrl: member.user.avatarUrl,
        role: member.role,
        companyRole: member.user.role as TeamDetailResponse['team']['members'][number]['companyRole'],
        manager: member.manager,
        joinedAt: member.joinedAt.toISOString(),
      })),
      createdAt: team.createdAt.toISOString(),
    },
    canEdit: edit,
    candidates,
  }
})
