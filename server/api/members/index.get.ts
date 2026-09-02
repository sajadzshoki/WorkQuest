import type { MemberListResponse, MemberSummary } from '#shared/types/api'
import type { Role } from '#shared/utils/permissions'

import { memberListSchema } from '#shared/schemas'
import { can } from '#shared/utils/permissions'

import { getManagedUserIds, requireAuth } from '../../utils/auth'
import { errors, readValidatedQuery } from '../../utils/http'
import { visibleMemberScope } from '#shared/utils/member-scope'
import { MEMBER_SELECT } from '../../utils/members'
import { createTenantClient } from '../../utils/tenant'

/**
 * Company members, scoped by role.
 *
 * `scope=all` is OWNER/ADMIN only and returns every member. `scope=mine`
 * (the default) returns the caller plus their transitive reports, so a MANAGER
 * sees exactly the people they are accountable for. `scope=team` narrows to the
 * teams the caller leads or belongs to.
 *
 * Visibility is computed server-side; a MANAGER asking for `scope=all` gets a
 * 403 rather than a widened list.
 */
export default defineEventHandler(async (event): Promise<MemberListResponse> => {
  const auth = requireAuth(event)
  const query = readValidatedQuery(event, memberListSchema)
  const db = createTenantClient(auth)

  const isCompanyWide = can(auth.role, 'member:manage')
  const managedUserIds = isCompanyWide ? [] : await getManagedUserIds(auth.companyId, auth.userId)
  const allowedIds = visibleMemberScope(auth, managedUserIds)

  if (query.scope === 'all' && allowedIds !== null) {
    throw errors.forbidden('دسترسی لازم برای مشاهده همه اعضای شرکت را ندارید')
  }

  // Filters combine with AND so `teamId` + `scope=team` stack rather than
  // overwrite each other.
  const and: Array<Record<string, unknown>> = []

  const effectiveIds = query.scope === 'all' ? null : allowedIds
  if (effectiveIds !== null) and.push({ id: { in: effectiveIds } })
  if (query.role) and.push({ role: query.role })
  if (query.teamId) and.push({ teamMemberships: { some: { teamId: query.teamId } } })

  if (query.scope === 'team') {
    if (isCompanyWide) {
      and.push({ teamMemberships: { some: {} } })
    }
    else {
      const teams = await db.team.findMany({
        where: {
          OR: [{ leadId: auth.userId }, { members: { some: { userId: auth.userId } } }],
        },
        select: { id: true },
      })
      and.push({ teamMemberships: { some: { teamId: { in: teams.map(t => t.id) } } } })
    }
  }

  if (query.search) {
    const term = query.search.trim()
    and.push({
      OR: [
        { fullName: { contains: term, mode: 'insensitive' } },
        { jobTitle: { contains: term, mode: 'insensitive' } },
        { phone: { contains: term } },
      ],
    })
  }

  const where = and.length > 0 ? { AND: and } : {}

  if (effectiveIds !== null && effectiveIds.length === 0) {
    return {
      members: [],
      total: 0,
      page: query.page,
      pageSize: query.pageSize,
      scope: 'mine',
      canManageRoles: isCompanyWide,
    }
  }

  const [rows, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { fullName: 'asc' },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: MEMBER_SELECT,
    }),
    db.user.count({ where }),
  ])

  // Subordinate counts for the ids on this page only.
  const managerRows = await db.teamMember.findMany({
    where: { managerId: { in: rows.map(row => row.id) } },
    select: { managerId: true, userId: true },
  })
  const reportCounts = new Map<string, Set<string>>()
  for (const row of managerRows) {
    if (!row.managerId) continue
    const set = reportCounts.get(row.managerId) ?? new Set<string>()
    set.add(row.userId)
    reportCounts.set(row.managerId, set)
  }

  const members: MemberSummary[] = rows.map((user) => {
    const membership = user.teamMemberships[0] ?? null
    return {
      id: user.id,
      fullName: user.fullName,
      phone: user.phone ?? '',
      email: user.email,
      avatarUrl: user.avatarUrl,
      jobTitle: user.jobTitle,
      role: user.role as Role,
      status: user.status as MemberSummary['status'],
      lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
      team: membership?.team ?? null,
      manager: membership?.manager ?? null,
      teamRole: (membership?.role ?? null) as MemberSummary['teamRole'],
      subordinateCount: reportCounts.get(user.id)?.size ?? 0,
    }
  })

  return {
    members,
    total,
    page: query.page,
    pageSize: query.pageSize,
    scope: effectiveIds === null ? 'all' : 'mine',
    canManageRoles: isCompanyWide,
  }
})
