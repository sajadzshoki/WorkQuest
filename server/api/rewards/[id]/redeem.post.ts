import type { RedeemRewardResponse } from '#shared/types/api'

import { redeemRewardSchema } from '#shared/schemas'

import { requirePermission } from '../../../utils/auth'
import { readValidated, requireUuidParam } from '../../../utils/http'
import { redeemReward } from '../../../utils/marketplace'
import { createTenantClient } from '../../../utils/tenant'

/**
 * `POST /api/rewards/:id/redeem` — spend coins on a reward.
 *
 * The whole purchase happens in one transaction: the reward row is locked, the
 * rules are re-checked against the numbers as they are *now*, the request is
 * written, the coins leave through the ledger, and one unit of stock goes. If any
 * step fails, none of them happened.
 *
 * The price is not a parameter — it is read from the reward row inside the
 * transaction, so a client cannot name its own.
 *
 * `idempotencyKey` is optional. When a double-clicked button sends the same key
 * twice, the second request returns the first one's redemption with
 * `charged: false` instead of taking coins twice.
 */
export default defineEventHandler(async (event): Promise<RedeemRewardResponse> => {
  const auth = requirePermission(event, 'reward:redeem')
  const id = requireUuidParam(event, 'id', 'پاداش پیدا نشد')
  const input = await readValidated(event, redeemRewardSchema)
  const db = createTenantClient(auth)

  return redeemReward(db, auth, id, input)
})
