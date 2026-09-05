import type { RedemptionListResponse } from '#shared/types/api'

import { myRedemptionsQuerySchema } from '#shared/schemas'

import { requirePermission } from '../../utils/auth'
import { readValidatedQuery } from '../../utils/http'
import { listMyRedemptions } from '../../utils/marketplace'
import { createTenantClient } from '../../utils/tenant'

/**
 * `GET /api/rewards/redemptions` — the caller's own request history.
 *
 *   ?status=PENDING   optional filter
 *   &page=1&pageSize=20
 *
 * Self-scoped by construction: there is no `userId` parameter, so one employee
 * cannot read another's requests. Newest first, like a statement — the queue an
 * admin works through is a different endpoint with the opposite order.
 */
export default defineEventHandler(async (event): Promise<RedemptionListResponse> => {
  const auth = requirePermission(event, 'reward:read')
  const query = readValidatedQuery(event, myRedemptionsQuerySchema)
  const db = createTenantClient(auth)

  return listMyRedemptions(db, auth, query)
})
