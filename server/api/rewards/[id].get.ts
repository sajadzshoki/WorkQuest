import type { RewardDetailResponse } from '#shared/types/api'

import { requirePermission } from '../../utils/auth'
import { requireUuidParam } from '../../utils/http'
import { rewardDetail } from '../../utils/marketplace'
import { createTenantClient } from '../../utils/tenant'

/**
 * `GET /api/rewards/:id` — one reward in full.
 *
 * The detail view is what the redeem button lives on, so it carries the same
 * standing the catalogue did: the reason a reward cannot be requested is stated
 * here in the same code, rather than discovered by pressing the button.
 *
 * Also returns the caller's own history with this reward, which is how the UI can
 * say «یک‌بار درخواست داده‌اید» next to a one-per-person item.
 */
export default defineEventHandler(async (event): Promise<RewardDetailResponse> => {
  const auth = requirePermission(event, 'reward:read')
  const id = requireUuidParam(event, 'id', 'پاداش پیدا نشد')
  const db = createTenantClient(auth)

  return rewardDetail(db, auth, id)
})
