import type { NotificationReadResponse } from '#shared/types/api'

import { requireAuth } from '../../../utils/auth'
import { errors, requireUuidParam } from '../../../utils/http'
import { createTenantClient } from '../../../utils/tenant'

/**
 * `POST /api/notifications/:id/read` — mark one notification read.
 *
 * The tenant-scoped client plus the explicit `userId` filter mean a foreign
 * id (another user's, another company's) simply does not resolve: a 404, not
 * a leak. Marking an already-read notification is a 200 — read state is
 * idempotent by design.
 */
export default defineEventHandler(async (event): Promise<NotificationReadResponse> => {
  const auth = requireAuth(event)
  const id = requireUuidParam(event, 'id', 'اعلان پیدا نشد')
  const db = createTenantClient(auth)

  const readAt = new Date()
  const updated = await db.notification.updateMany({
    where: { id, userId: auth.userId, readAt: null },
    data: { readAt },
  })

  if (updated.count === 0) {
    // Either it never existed / is not ours (404), or it was already read
    // (idempotent 200). Distinguish so the client can trust the states.
    const seen = await db.notification.findUnique({
      where: { id },
      select: { id: true, readAt: true, userId: true },
    })
    if (!seen || seen.userId !== auth.userId) throw errors.notFound('اعلان پیدا نشد')
    return { id, readAt: seen.readAt!.toISOString() }
  }

  return { id, readAt: readAt.toISOString() }
})
