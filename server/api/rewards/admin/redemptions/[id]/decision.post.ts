import type { RedemptionDecisionResponse } from '#shared/types/api'

import { redemptionDecisionSchema } from '#shared/schemas'

import { requirePermission } from '../../../../../utils/auth'
import { readValidated, requireUuidParam } from '../../../../../utils/http'
import { decideRedemption } from '../../../../../utils/marketplace'
import { createTenantClient } from '../../../../../utils/tenant'

/**
 * `POST /api/rewards/admin/redemptions/:id` — decide a request. OWNER/ADMIN only.
 *
 *   { "action": "APPROVE" | "REJECT" | "FULFIL" | "CANCEL", "note": "…" }
 *
 * The legal moves are the status machine in `shared/utils/marketplace.ts`:
 * `PENDING → APPROVED → FULFILLED`, with `REJECT` and `CANCEL` available until a
 * request is settled. Anything else is a `409`, never a silent no-op.
 *
 * `REJECT` and `CANCEL` give the coins back through the ledger — as their own
 * immutable row with their own idempotency key, so a retried rejection cannot
 * refund twice — and return the unit of stock to the shelf, in the same
 * transaction as the status change.
 *
 * The employee is notified with the admin's note attached. A rejection with no
 * reason is the humiliating kind, so the UI asks for one and the notification
 * carries it.
 */
export default defineEventHandler(async (event): Promise<RedemptionDecisionResponse> => {
  const auth = requirePermission(event, 'reward:manage')
  const id = requireUuidParam(event, 'id', 'درخواست پیدا نشد')
  const input = await readValidated(event, redemptionDecisionSchema)
  const db = createTenantClient(auth)

  return decideRedemption(db, auth, id, { action: input.action, note: input.note ?? null })
})
