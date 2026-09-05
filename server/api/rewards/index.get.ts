import type { RewardCatalogueResponse } from '#shared/types/api'

import { rewardCatalogueQuerySchema } from '#shared/schemas'

import { requirePermission } from '../../utils/auth'
import { readValidatedQuery } from '../../utils/http'
import { listCatalogue } from '../../utils/marketplace'
import { createTenantClient } from '../../utils/tenant'

/**
 * `GET /api/rewards` — the company's reward marketplace.
 *
 *   ?type=MEAL   optional filter, so the shop can be browsed by kind
 *
 * Returns the ACTIVE shelf with the caller's own standing on each item — can
 * they afford it, is it in stock, have they reached their allowance — plus their
 * balance and their ten most recent requests.
 *
 * Two things this endpoint is careful about:
 *
 *  - it never lists another employee's requests. `redemptions` is the caller's
 *    own history and there is no `userId` parameter to ask for somebody else's;
 *  - it never lists a reward the caller cannot actually see. Drafts, paused and
 *    archived items are admin-only (`/api/rewards/admin`), so an employee cannot
 *    discover a reward that exists and then be refused it.
 */
export default defineEventHandler(async (event): Promise<RewardCatalogueResponse> => {
  const auth = requirePermission(event, 'reward:read')
  const query = readValidatedQuery(event, rewardCatalogueQuerySchema)
  const db = createTenantClient(auth)

  return listCatalogue(db, auth, { type: query.type })
})
