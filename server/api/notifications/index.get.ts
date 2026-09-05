import type { NotificationListResponse } from '#shared/types/api'

import { paginationSchema } from '#shared/schemas'

import { requireAuth } from '../../utils/auth'
import { readValidatedQuery } from '../../utils/http'
import { createTenantClient } from '../../utils/tenant'

/**
 * `GET /api/notifications` — the caller's feed.
 *
 * Unread first, newest within each group. The tenant-scoped client makes the
 * rows the caller's own by construction: there is no "other user's
 * notifications" path to have to defend.
 */
export default defineEventHandler(async (event): Promise<NotificationListResponse> => {
  const auth = requireAuth(event)
  const query = readValidatedQuery(event, paginationSchema)
  const db = createTenantClient(auth)

  const where = { userId: auth.userId }

  const [rows, total, unread] = await Promise.all([
    db.notification.findMany({
      where,
      orderBy: [{ readAt: { sort: 'asc', nulls: 'first' } }, { createdAt: 'desc' }],
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: {
        id: true,
        type: true,
        title: true,
        message: true,
        metadata: true,
        readAt: true,
        createdAt: true,
      },
    }),
    db.notification.count({ where }),
    db.notification.count({ where: { userId: auth.userId, readAt: null } }),
  ])

  return {
    items: rows.map(row => ({
      id: row.id,
      type: row.type,
      title: row.title,
      message: row.message,
      metadata: row.metadata as Record<string, unknown>,
      readAt: row.readAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
    })),
    total,
    unread,
    page: query.page,
    pageSize: query.pageSize,
  }
})
