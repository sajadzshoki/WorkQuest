import { walletAdjustSchema } from '#shared/schemas'

import { requirePermission } from '../../utils/auth'
import { errors, readValidated } from '../../utils/http'
import { createTenantClient } from '../../utils/tenant'
import { applyCoinDelta } from '../../utils/wallet'

/**
 * `POST /api/wallet/adjust` — the only manual lever on a coin balance.
 *
 * This is the deliberate exception to "coins are calculated, not granted", and
 * it is fenced accordingly:
 *
 *  - `wallet:adjust` is OWNER/ADMIN only, so a **manager cannot move their own
 *    reports' balances** — which is the specific abuse the reward engine
 *    exists to prevent;
 *  - a written reason is mandatory;
 *  - the amount is bounded by the schema;
 *  - it is an ordinary ledger transaction, not a balance overwrite, so it
 *    appears in the employee's statement labelled `ADMIN_ADJUSTMENT` and in
 *    the audit log with the actor's id.
 *
 * There is intentionally no endpoint that *sets* a balance.
 */
export default defineEventHandler(async (event) => {
  const auth = requirePermission(event, 'wallet:adjust')
  const input = await readValidated(event, walletAdjustSchema)

  const db = createTenantClient(auth)

  // Tenant-scoped: the client cannot reach a user in another company.
  const target = await db.user.findUnique({
    where: { id: input.userId },
    select: { id: true, fullName: true },
  })
  if (!target) throw errors.notFound('کاربر پیدا نشد')

  const result = await db.$transaction(async (tx) => {
    const ledger = await applyCoinDelta(tx, {
      companyId: auth.companyId,
      userId: target.id,
      amount: input.amount,
      type: 'ADMIN_ADJUSTMENT',
      source: 'MANUAL_ADJUSTMENT',
      reason: input.reason,
      referenceType: 'User',
      referenceId: auth.userId,
      // Adjustments are genuinely repeatable events — an admin may legitimately
      // grant 50 coins twice — so they carry no idempotency key.
    })

    await tx.auditLog.create({
      data: {
        companyId: auth.companyId,
        actorId: auth.userId,
        action: 'wallet.adjust',
        targetType: 'User',
        targetId: target.id,
        data: { amount: input.amount, reason: input.reason, balance: ledger.balance },
      },
    })

    await tx.notification.create({
      data: {
        companyId: auth.companyId,
        userId: target.id,
        type: 'SYSTEM',
        title: input.amount > 0 ? 'سکه به کیف پول شما اضافه شد' : 'از کیف پول شما سکه کسر شد',
        body: input.reason,
      },
    })

    return ledger
  })

  return { balance: result.balance, transactionId: result.transactionId }
})
