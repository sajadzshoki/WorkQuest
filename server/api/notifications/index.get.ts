import type { NotificationStatus } from '#prisma/client'

import { paginationSchema } from '#shared/schemas'

import { requireAuth } from '../../utils/auth'
import { readValidatedQuery } from '../../utils/http'
import { createTenantClient } from '../../utils/tenant'

/** The caller's notification feed, unread first. */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const query = readValidatedQuery(event, paginationSchema)
  const db = createTenantClient(auth)

  const visibleStatuses: NotificationStatus[] = ['UNREAD', 'READ']
  const where = { userId: auth.userId, status: { in: visibleStatuses } }

  const [items, total, unread] = await Promise.all([
    db.notification.findMany({
      where,
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: { id: true, type: true, title: true, body: true, data: true, status: true, createdAt: true },
    }),
    db.notification.count({ where }),
    db.notification.count({ where: { userId: auth.userId, status: 'UNREAD' } }),
  ])

  return { items, total, unread, page: query.page, pageSize: query.pageSize }
})
