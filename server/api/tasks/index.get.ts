import { taskFilterSchema } from '#shared/schemas'

import { requireAuth, resolveVisibleUserIds } from '../../utils/auth'
import { readValidatedQuery } from '../../utils/http'
import { createTenantClient } from '../../utils/tenant'

/**
 * Task list with role-aware scoping.
 *
 * `scope=mine` is available to everyone, `team` to managers and up, `all` to
 * admins. Visibility is resolved server-side — the client cannot widen it.
 */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const query = readValidatedQuery(event, taskFilterSchema)
  const db = createTenantClient(auth)

  const visibleUserIds = await resolveVisibleUserIds(auth, query.scope)
  if (visibleUserIds !== null && visibleUserIds.length === 0) {
    return { items: [], total: 0, page: query.page, pageSize: query.pageSize }
  }

  const where = {
    ...(query.status ? { status: query.status } : {}),
    ...(visibleUserIds ? { assigneeId: { in: visibleUserIds } } : {}),
  }

  const [items, total] = await Promise.all([
    db.task.findMany({
      where,
      orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        xpReward: true,
        coinReward: true,
        createdAt: true,
        assignee: { select: { id: true, fullName: true, avatarUrl: true } },
        team: { select: { id: true, name: true } },
      },
    }),
    db.task.count({ where }),
  ])

  return { items, total, page: query.page, pageSize: query.pageSize }
})
