import type { RedemptionListResponse } from '#shared/types/api'

import { redemptionQueueQuerySchema } from '#shared/schemas'

import { requirePermission } from '../../../utils/auth'
import { readValidatedQuery } from '../../../utils/http'
import { listRedemptionQueue } from '../../../utils/marketplace'
import { createTenantClient } from '../../../utils/tenant'

/**
 * `GET /api/rewards/admin/redemptions` — the redemption queue. OWNER/ADMIN only.
 *
 *   ?status=PENDING&rewardId=&userId=&page=1&pageSize=20
 *
 * Every row carries the employee who asked, what they paid, what they wrote, and
 * `availableActions` — the moves the status machine still allows from here. The
 * UI renders those and only those, so an admin is never offered a decision the
 * server would refuse.
 *
 * Ordered oldest first: a queue is first-come-first-served, and an old request
 * must not be buried under new ones.
 */
export default defineEventHandler(async (event): Promise<RedemptionListResponse> => {
  const auth = requirePermission(event, 'reward:manage')
  const query = readValidatedQuery(event, redemptionQueueQuerySchema)
  const db = createTenantClient(auth)

  return listRedemptionQueue(db, query)
})
