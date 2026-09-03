import { requirePermission } from '../../utils/auth'
import { finalizeDueCycles } from '../../utils/recognition'
import { createTenantClient } from '../../utils/tenant'

/**
 * `POST /api/recognition/finalize` — tally and seal every cycle whose window
 * has closed. Idempotent: a finalized cycle is terminal, so re-running pays
 * nothing twice.
 */
export default defineEventHandler(async (event) => {
  const auth = requirePermission(event, 'recognition:manage')
  const db = createTenantClient(auth)

  const outcomes = await finalizeDueCycles(db, auth.companyId, new Date())

  return {
    finalized: outcomes.length,
    cycles: outcomes.map(outcome => ({
      cycleId: outcome.cycleId,
      results: outcome.results.length,
    })),
  }
})
