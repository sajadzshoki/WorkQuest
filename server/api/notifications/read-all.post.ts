import type { NotificationReadAllResponse } from '#shared/types/api'

import { requireAuth } from '../../utils/auth'
import { createTenantClient } from '../../utils/tenant'

/**
 * `POST /api/notifications/read-all` — clear the badge.
 *
 * Updates only the caller's unread rows and returns how many flipped, so the
 * bell can land on zero honestly even if another notification arrived between
 * the click and the write.
 */
export default defineEventHandler(async (event): Promise<NotificationReadAllResponse> => {
  const auth = requireAuth(event)
  const db = createTenantClient(auth)

  const updated = await db.notification.updateMany({
    where: { userId: auth.userId, readAt: null },
    data: { readAt: new Date() },
  })

  return { updated: updated.count }
})
