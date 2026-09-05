import type { RewardMutationResponse } from '#shared/types/api'

import { updateRewardSchema } from '#shared/schemas'

import { requirePermission } from '../../utils/auth'
import { readValidated, requireUuidParam } from '../../utils/http'
import { updateReward } from '../../utils/marketplace'
import { createTenantClient } from '../../utils/tenant'

/**
 * `PATCH /api/rewards/:id` — edit, reprice, restock or disable a reward.
 *
 * OWNER/ADMIN only. Disabling is a status change rather than a delete:
 *
 *  - `PAUSED` hides it from the shop but keeps it editable, so a reward that ran
 *    out of budget this month can come back next month;
 *  - `ARCHIVED` retires it for good.
 *
 * Neither removes the row, because every past redemption points at it and has to
 * keep saying what was bought and for how much. A repricing changes only future
 * purchases: each redemption snapshots the price it charged.
 *
 * Only the fields sent are written, so editing a price cannot quietly switch off
 * automatic approval or clear a per-person cap.
 */
export default defineEventHandler(async (event): Promise<RewardMutationResponse> => {
  const auth = requirePermission(event, 'reward:manage')
  const id = requireUuidParam(event, 'id', 'پاداش پیدا نشد')
  const input = await readValidated(event, updateRewardSchema)
  const db = createTenantClient(auth)

  return updateReward(db, auth, id, input)
})
