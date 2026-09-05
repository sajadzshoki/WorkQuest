import type { RewardMutationResponse } from '#shared/types/api'

import { createRewardSchema } from '#shared/schemas'

import { requirePermission } from '../../utils/auth'
import { readValidated } from '../../utils/http'
import { createReward } from '../../utils/marketplace'
import { createTenantClient } from '../../utils/tenant'

/**
 * `POST /api/rewards` — put a reward on the shelf. OWNER/ADMIN only.
 *
 * The company decides everything about it: the title, the price in coins, how
 * much stock there is, and the rules (automatic approval, a per-person cap, a
 * minimum level, whether a note is required, an availability window). Nothing is
 * priced by the product — "500 coins for a day of leave" is a row this endpoint
 * writes, not a constant anywhere in the code.
 *
 * A reward may be created as `DRAFT`, which keeps it out of the shop until an
 * admin lists it.
 */
export default defineEventHandler(async (event): Promise<RewardMutationResponse> => {
  const auth = requirePermission(event, 'reward:manage')
  const input = await readValidated(event, createRewardSchema)
  const db = createTenantClient(auth)

  return createReward(db, auth, input)
})
