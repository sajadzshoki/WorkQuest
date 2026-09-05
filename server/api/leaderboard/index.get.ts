import { leaderboardQuerySchema } from '#shared/schemas'

import { requirePermission } from '../../utils/auth'
import { readValidatedQuery } from '../../utils/http'
import { buildLeaderboard } from '../../utils/leaderboard'
import { createTenantClient } from '../../utils/tenant'

/**
 * `GET /api/leaderboard` — the windowed board.
 *
 *   ?period=week|month     which calendar window is being ranked
 *   &scope=company|team    the whole tenant, or one team the caller may see
 *   &teamId=<uuid>         for `scope=team`; defaults to the caller's own team
 *   &limit=3|5             how many rows to expose — capped server-side
 *
 * Two things this endpoint deliberately does not do:
 *
 *  - there is no all-time period, so a permanent ranking cannot be requested;
 *  - there is no pagination, so a full list of everybody's position cannot be
 *    assembled by walking pages. The response is the top few rows plus the
 *    caller's own rank, for every role including OWNER.
 *
 * Ranking is computed in `server/utils/leaderboard.ts` from the XP ledger and
 * the achievements unlocked inside the window — never from coin balances.
 */
export default defineEventHandler(async (event) => {
  const auth = requirePermission(event, 'leaderboard:read')
  const query = readValidatedQuery(event, leaderboardQuerySchema)
  const db = createTenantClient(auth)

  return buildLeaderboard(db, auth, {
    period: query.period,
    scope: query.scope,
    teamId: query.teamId ?? null,
    limit: query.limit,
  })
})
