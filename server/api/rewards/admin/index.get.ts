import type { RewardAdminResponse } from '#shared/types/api'

import { rewardCatalogueQuerySchema } from '#shared/schemas'

import { requirePermission } from '../../../utils/auth'
import { readValidatedQuery } from '../../../utils/http'
import { listAdminCatalogue } from '../../../utils/marketplace'
import { createTenantClient } from '../../../utils/tenant'

/**
 * `GET /api/rewards/admin` — the whole shelf, as the company manages it.
 *
 *   ?status=PAUSED&type=MEAL   optional filters
 *
 * OWNER/ADMIN only. Unlike the employee catalogue this includes drafts, paused
 * and archived rewards, and adds what an admin actually needs to run a shop:
 * how many requests each reward has in each status, how many coins it has taken
 * out of circulation, and whether it is currently available at all.
 */
export default defineEventHandler(async (event): Promise<RewardAdminResponse> => {
  const auth = requirePermission(event, 'reward:manage')
  const query = readValidatedQuery(event, rewardCatalogueQuerySchema)
  const db = createTenantClient(auth)

  return listAdminCatalogue(db, query)
})
