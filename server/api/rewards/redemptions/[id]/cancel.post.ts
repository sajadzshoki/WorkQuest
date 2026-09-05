import type { RedemptionDecisionResponse } from '#shared/types/api'

import { requirePermission } from '../../../../utils/auth'
import { requireUuidParam } from '../../../../utils/http'
import { cancelOwnRedemption } from '../../../../utils/marketplace'
import { createTenantClient } from '../../../../utils/tenant'

/**
 * `POST /api/rewards/redemptions/:id/cancel` — take back your own request.
 *
 * Allowed while the request is still `PENDING`, and only for the person who made
 * it. The coins come back through the ledger as their own row and the unit of
 * stock returns to the shelf, in the same transaction as the status change.
 *
 * Once an admin has approved it, the way out is an admin's `CANCEL` instead: the
 * company has already committed to handing the reward over.
 */
export default defineEventHandler(async (event): Promise<RedemptionDecisionResponse> => {
  const auth = requirePermission(event, 'reward:redeem')
  const id = requireUuidParam(event, 'id', 'درخواست پیدا نشد')
  const db = createTenantClient(auth)

  return cancelOwnRedemption(db, auth, id)
})
