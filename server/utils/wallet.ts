/**
 * The ledger gateway.
 *
 * Every coin and every XP point in the system moves through this module. That
 * is the whole design: if there is exactly one function that can change a
 * balance, then the invariants below are enforced by construction rather than
 * by everyone remembering them.
 *
 * Invariants:
 *
 *  1. **A balance is never assigned, only moved.** `applyCoinDelta` appends an
 *     immutable `CoinTransaction` and increments the wallet in the same
 *     database transaction. There is no code path that writes `balance = x`.
 *  2. **Payouts are at-most-once.** Callers pass an `idempotencyKey`; a unique
 *     index on `(companyId, idempotencyKey)` makes a duplicate a no-op rather
 *     than a second payout. The guarantee is the database's, not the
 *     application's — application-level "did we already do this?" checks lose
 *     to concurrency.
 *  3. **Balances never go negative.** Spends assert sufficient funds inside the
 *     transaction, after locking.
 *  4. **Managers cannot set balances.** There is no "set" operation to call.
 *     The only manual lever is `ADMIN_ADJUSTMENT`, which is itself a
 *     transaction with an actor, a reason and an audit trail.
 */

import type { CoinTransactionType, LedgerSource, Prisma } from '#prisma/client'

import { levelUpDedupeKey } from '#shared/utils/notifications'
import { DEFAULT_REWARD_RULES, type RewardRules } from '#shared/utils/rewards'

import { errors } from './http'
import { notify } from './notifications'
import type { TenantTx } from './tasks'
import type { TenantClient } from './tenant'

/** Ledger write request. `amount` is signed: positive credits, negative debits. */
export interface CoinDelta {
  companyId: string
  userId: string
  amount: number
  type: CoinTransactionType
  source: LedgerSource
  reason?: string | null
  referenceType?: string | null
  referenceId?: string | null
  /**
   * Natural key making this write at-most-once. Omit only for genuinely
   * repeatable events (there are currently none).
   */
  idempotencyKey?: string | null
}

export interface LedgerResult {
  /** False when an identical key was already processed — the caller should
   *  treat this as success, not as an error, and not re-notify the user. */
  applied: boolean
  balance: number
  transactionId: string | null
}

/**
 * Postgres unique-violation. Prisma surfaces this as P2002; we also match the
 * raw code because the driver adapter can pass errors through unwrapped.
 *
 * The `cause` chain is walked as well: when a write fails inside an interactive
 * transaction, Prisma can hand back a rollback error that *carries* the original
 * one instead of being it, and a classifier that only looks at the top object
 * would report "not a duplicate" for exactly the case it exists to recognise.
 *
 * Exported so other idempotent writers (achievement grants) reuse the same
 * definition instead of drifting.
 */
export function isUniqueViolation(error: unknown): boolean {
  let node = error as { code?: string, cause?: unknown } | null | undefined
  for (let depth = 0; node && depth < 5; depth += 1) {
    if (node.code === 'P2002' || node.code === '23505') return true
    node = node.cause as typeof node
  }
  return false
}

/**
 * Ensure a wallet row exists and return it locked for update.
 *
 * The `SELECT … FOR UPDATE` matters: two concurrent spends that both read a
 * balance of 100 would each happily approve an 80-coin purchase. Locking the
 * row serialises them so the second one sees 20 and is rejected.
 */
async function lockWallet(tx: TenantTx, companyId: string, userId: string) {
  await tx.wallet.upsert({
    where: { userId },
    create: { companyId, userId },
    update: {},
  })

  const rows = await tx.$queryRaw<Array<{ id: string, balance: number }>>`
    SELECT "id", "balance" FROM "Wallet" WHERE "userId" = ${userId}::uuid FOR UPDATE
  `
  const wallet = rows[0]
  // The upsert above guarantees the row exists; this is a type narrowing guard,
  // not an expected runtime branch.
  if (!wallet) throw errors.conflict('کیف پول کاربر پیدا نشد')
  return wallet
}

/**
 * Apply a signed coin movement.
 *
 * Must be called inside a transaction (`tx`), because the ledger row, the
 * balance and whatever business event caused them have to commit together.
 */
export async function applyCoinDelta(tx: TenantTx, delta: CoinDelta): Promise<LedgerResult> {
  const amount = Math.round(delta.amount)

  const wallet = await lockWallet(tx, delta.companyId, delta.userId)

  if (amount === 0) {
    return { applied: false, balance: wallet.balance, transactionId: null }
  }

  const nextBalance = wallet.balance + amount
  if (nextBalance < 0) {
    throw errors.badRequest('INSUFFICIENT_COINS', 'موجودی سکه کافی نیست')
  }

  try {
    const transaction = await tx.coinTransaction.create({
      data: {
        companyId: delta.companyId,
        userId: delta.userId,
        walletId: wallet.id,
        amount,
        type: delta.type,
        source: delta.source,
        reason: delta.reason ?? null,
        referenceType: delta.referenceType ?? null,
        referenceId: delta.referenceId ?? null,
        balanceAfter: nextBalance,
        idempotencyKey: delta.idempotencyKey ?? null,
      },
      select: { id: true },
    })

    await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: nextBalance,
        ...(amount > 0
          ? { lifetimeEarned: { increment: amount } }
          : { lifetimeSpent: { increment: -amount } }),
      },
    })

    // `UserProgress.coins` is a denormalised mirror kept for the leaderboard
    // and existing screens. The wallet is authoritative; this follows it.
    await tx.userProgress.upsert({
      where: { userId: delta.userId },
      create: { companyId: delta.companyId, userId: delta.userId, coins: Math.max(0, amount) },
      update: { coins: nextBalance },
    })

    return { applied: true, balance: nextBalance, transactionId: transaction.id }
  }
  catch (error) {
    if (isUniqueViolation(error)) {
      // Already paid. Report the current balance and let the caller carry on.
      return { applied: false, balance: wallet.balance, transactionId: null }
    }
    throw error
  }
}

/**
 * Append XP.
 *
 * XP is permanent and can only increase — there is no spend path and no
 * negative amount, which is precisely what distinguishes it from coins.
 */
export async function applyXpDelta(
  tx: TenantTx,
  delta: Omit<CoinDelta, 'type'>,
): Promise<{ applied: boolean, xp: number }> {
  const amount = Math.max(0, Math.round(delta.amount))

  if (amount === 0) {
    const existing = await tx.userProgress.findUnique({
      where: { userId: delta.userId },
      select: { xp: true },
    })
    return { applied: false, xp: existing?.xp ?? 0 }
  }

  try {
    await tx.xpTransaction.create({
      data: {
        companyId: delta.companyId,
        userId: delta.userId,
        amount,
        source: delta.source,
        reason: delta.reason ?? null,
        referenceType: delta.referenceType ?? null,
        referenceId: delta.referenceId ?? null,
        idempotencyKey: delta.idempotencyKey ?? null,
      },
    })
  }
  catch (error) {
    if (isUniqueViolation(error)) {
      const existing = await tx.userProgress.findUnique({
        where: { userId: delta.userId },
        select: { xp: true },
      })
      return { applied: false, xp: existing?.xp ?? 0 }
    }
    throw error
  }

  const progress = await tx.userProgress.upsert({
    where: { userId: delta.userId },
    create: { companyId: delta.companyId, userId: delta.userId, xp: amount },
    update: { xp: { increment: amount } },
    select: { xp: true },
  })

  return { applied: true, xp: progress.xp }
}

/**
 * Re-point `UserProgress.levelId` at whichever level the user's XP now reaches.
 *
 * Called after an XP award. Levels are company-defined rows, so this is a
 * lookup rather than arithmetic.
 *
 * A level-up is announced from here — the one place every payout path
 * (task review, challenge, recognition, achievement) funnels through — so no
 * caller can forget it. The dedupe key means a level is announced at most
 * once no matter how many flows sync it.
 */
export async function syncLevel(
  tx: TenantTx,
  companyId: string,
  userId: string,
  xp: number,
): Promise<{ level: number, levelUp: boolean }> {
  const [boundaries, progress] = await Promise.all([
    tx.level.findMany({
      where: { companyId },
      orderBy: { minXp: 'asc' },
      select: { id: true, level: true, minXp: true },
    }),
    tx.userProgress.findUnique({ where: { userId }, select: { levelId: true } }),
  ])

  if (boundaries.length === 0) return { level: 1, levelUp: false }

  let reached = boundaries[0]
  for (const boundary of boundaries) {
    if (xp >= boundary.minXp) reached = boundary
    else break
  }
  if (!reached) return { level: 1, levelUp: false }

  const levelUp = progress?.levelId !== reached.id
  if (levelUp) {
    await tx.userProgress.update({ where: { userId }, data: { levelId: reached.id } })

    if (reached.level > 1) {
      await notify(tx, {
        companyId,
        userId,
        type: 'LEVEL_UP',
        title: `به سطح ${reached.level} رسیدید`,
        message: 'کارهای تأییدشده شما شما را به سطح تازه‌ای رساند',
        metadata: { level: reached.level, minXp: reached.minXp },
        dedupeKey: levelUpDedupeKey(userId, reached.level),
      })
    }
  }

  return { level: reached.level, levelUp }
}

/**
 * The company's active reward rules, falling back to the shared defaults.
 *
 * Kept as a function rather than a cached constant because an admin may
 * publish a new version at any time and the next payout must use it.
 */
export async function loadRewardRules(
  db: Pick<TenantClient, 'rewardRule'>,
  companyId: string,
): Promise<RewardRules & { version: number }> {
  const row = await db.rewardRule.findFirst({
    where: { companyId, isActive: true },
    orderBy: { version: 'desc' },
  })

  if (!row) return { ...DEFAULT_REWARD_RULES, version: 0 }
  return row
}

/** Shape of a ledger row as returned to the client. */
export const COIN_TRANSACTION_SELECT = {
  id: true,
  amount: true,
  type: true,
  source: true,
  reason: true,
  referenceType: true,
  referenceId: true,
  balanceAfter: true,
  createdAt: true,
} satisfies Prisma.CoinTransactionSelect
