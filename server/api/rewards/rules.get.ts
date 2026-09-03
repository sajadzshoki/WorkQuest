import { requireAuth } from '../../utils/auth'
import { createTenantClient } from '../../utils/tenant'
import { loadRewardRules } from '../../utils/wallet'

/**
 * `GET /api/rewards/rules` — the active economy.
 *
 * Readable by any authenticated member on purpose: the rules that decide
 * someone's pay should not be a secret from them. Only editing is privileged.
 */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const db = createTenantClient(auth)

  const rules = await loadRewardRules(db, auth.companyId)
  return { rules }
})
