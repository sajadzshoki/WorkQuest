import type { NotificationSummaryResponse } from '#shared/types/api'

import { requireAuth } from '../../utils/auth'
import { createTenantClient } from '../../utils/tenant'

/**
 * `GET /api/notifications/summary` — the bell's unread count.
 *
 * A dedicated endpoint because the bell polls: it must stay one cheap count,
 * never a page of rows.
 */
export default defineEventHandler(async (event): Promise<NotificationSummaryResponse> => {
  const auth = requireAuth(event)
  const db = createTenantClient(auth)

  const unread = await db.notification.count({
    where: { userId: auth.userId, readAt: null },
  })

  return { unread }
})
