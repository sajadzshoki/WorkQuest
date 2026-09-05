import { leaderboardProgressQuerySchema } from '#shared/schemas'

import { requirePermission } from '../../utils/auth'
import { readValidatedQuery } from '../../utils/http'
import { buildPersonalProgress } from '../../utils/leaderboard'
import { createTenantClient } from '../../utils/tenant'

/**
 * `GET /api/leaderboard/progress` — the personal progress board.
 *
 * The caller's own week and month against the previous ones: score and XP
 * deltas, rank movement, the distance to the next rank, a series of recent
 * windows, and the lifetime totals that never reset (XP, coins, level,
 * achievements, badges).
 *
 * There is no subject parameter and no list of other people: this endpoint can
 * only ever answer about the authenticated user, so the only thing it needs to
 * check is that they may read leaderboards at all.
 */
export default defineEventHandler(async (event) => {
  const auth = requirePermission(event, 'leaderboard:read')
  const query = readValidatedQuery(event, leaderboardProgressQuerySchema)
  const db = createTenantClient(auth)

  return buildPersonalProgress(db, auth, { weeks: query.weeks, months: query.months })
})
