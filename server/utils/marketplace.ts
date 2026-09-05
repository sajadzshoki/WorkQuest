/**
 * The reward marketplace — everything that moves coins for a reward.
 *
 * Three invariants hold this module together, and each one is enforced by the
 * database rather than by good intentions:
 *
 *  1. **Coins only move through the ledger.** A redemption calls
 *     `applyCoinDelta`, which appends an immutable `CoinTransaction` and moves
 *     the wallet in the same transaction. Nothing here assigns a balance, and a
 *     refund is its own row — never an edit of the debit it undoes.
 *  2. **A purchase is atomic.** The reward row is locked `FOR UPDATE` for the
 *     duration, so stock, the per-employee cap and the price everybody is
 *     charged are read and written by one request at a time. Two people racing
 *     for the last item cannot both get it; one person double-clicking cannot
 *     buy two.
 *  3. **A retried submission is the same submission.** The unique
 *     `(companyId, idempotencyKey)` index is what guarantees it. When it fires,
 *     the whole transaction rolls back and the winner is read back and returned
 *     as a success — the caller never sees a charge they did not make.
 *
 * Coins are charged at *request* time, not at approval. That is the only way a
 * shelf can be trusted: if the coins left at approval, two employees could both
 * "buy" the last item with the same coins and one of them would be told later
 * that they were too slow, after planning a holiday around it. Rejection and
 * cancellation therefore refund, and give the stock back.
 *
 * The rules themselves — what is available, who is eligible, what may happen
 * next — live in `shared/utils/marketplace.ts`, so the API, the catalogue card
 * and the tests all read the same definition.
 */

import type { Prisma } from '#prisma/client'
import type {
  AuthContext,
  RedeemRewardResponse,
  RedemptionDecisionResponse,
  RedemptionListResponse,
  RedemptionSummary,
  RewardAdminItem,
  RewardAdminResponse,
  RewardCatalogueItem,
  RewardCatalogueResponse,
  RewardDetailResponse,
  RewardMutationResponse,
  RewardRulesInfo,
} from '#shared/types/api'
import type { CreateRewardInput, RedeemRewardInput, UpdateRewardInput } from '#shared/schemas'

import {
  canCancelOwnRedemption,
  checkRedemption,
  initialRedemptionStatus,
  LIVE_REDEMPTION_STATUSES,
  REDEMPTION_ACTIONS,
  remainingAllowance,
  resolveRedemptionTransition,
  rewardAvailability,
  rewardStanding,
  type RedeemBlockCode,
  type RedeemCandidate,
  type RedemptionAction,
  type RewardPolicy,
} from '#shared/utils/marketplace'
import { can } from '#shared/utils/permissions'
import { redemptionKey, redemptionRefundKey } from '#shared/utils/rewards'

import { apiError, errors } from './http'
import { resolveLevelProgress } from './levels'
import type { TenantTx } from './tasks'
import type { TenantClient } from './tenant'
import { applyCoinDelta, isUniqueViolation } from './wallet'

// ---------------------------------------------------------------------------
// Projections
// ---------------------------------------------------------------------------

/** Every column a purchase decision or a shelf card needs. */
export const REWARD_SELECT = {
  id: true,
  title: true,
  description: true,
  type: true,
  coinCost: true,
  stock: true,
  imageUrl: true,
  status: true,
  autoApprove: true,
  maxPerUser: true,
  minLevel: true,
  requiresNote: true,
  availableFrom: true,
  availableUntil: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.RewardSelect

export type RewardRow = Prisma.RewardGetPayload<{ select: typeof REWARD_SELECT }>

const REDEMPTION_SELECT = {
  id: true,
  status: true,
  coinCost: true,
  note: true,
  decisionNote: true,
  requestedAt: true,
  decidedAt: true,
  fulfilledAt: true,
  userId: true,
  rewardId: true,
  reward: { select: { id: true, title: true, type: true, imageUrl: true } },
} satisfies Prisma.RewardRedemptionSelect

type RedemptionRow = Prisma.RewardRedemptionGetPayload<{ select: typeof REDEMPTION_SELECT }>

const QUEUE_SELECT = {
  ...REDEMPTION_SELECT,
  user: { select: { id: true, fullName: true, jobTitle: true, avatarUrl: true } },
} satisfies Prisma.RewardRedemptionSelect

type QueueRow = Prisma.RewardRedemptionGetPayload<{ select: typeof QUEUE_SELECT }>

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

/**
 * One HTTP error per blocking reason.
 *
 * The `code` is the same string the catalogue already returned in `standing`,
 * so a client that rendered a disabled button can render the refusal with the
 * same copy — and the tests can assert on a stable identifier rather than on
 * Persian prose.
 */
const BLOCK_ERRORS: Record<RedeemBlockCode, { status: number, message: string }> = {
  INACTIVE_ACCOUNT: { status: 403, message: 'حساب کاربری شما فعال نیست' },
  NOT_LISTED: { status: 409, message: 'این پاداش در فهرست فعال نیست' },
  NOT_AVAILABLE_YET: { status: 409, message: 'این پاداش هنوز شروع نشده است' },
  EXPIRED: { status: 409, message: 'مهلت درخواست این پاداش تمام شده است' },
  OUT_OF_STOCK: { status: 409, message: 'موجودی این پاداش تمام شده است' },
  LIMIT_REACHED: { status: 409, message: 'به سقف درخواست شما برای این پاداش رسیده‌اید' },
  LEVEL_REQUIRED: { status: 403, message: 'برای این پاداش به سطح بالاتری نیاز دارید' },
  NOTE_REQUIRED: { status: 400, message: 'برای این پاداش نوشتن توضیح الزامی است' },
  INSUFFICIENT_COINS: { status: 400, message: 'موجودی سکه شما کافی نیست' },
}

function blockError(code: RedeemBlockCode) {
  // Total over the union today; the fallback keeps a future code from becoming
  // a crash rather than a refusal.
  const mapped = BLOCK_ERRORS[code] ?? { status: 409, message: 'امکان ثبت این درخواست وجود ندارد' }
  return apiError(mapped.status, code, mapped.message)
}

// ---------------------------------------------------------------------------
// Mapping
// ---------------------------------------------------------------------------

function iso(value: Date | null): string | null {
  return value ? value.toISOString() : null
}

/** The rule bag as the API serves it — one shape for cards, details and admin. */
export function toRulesInfo(row: RewardRow): RewardRulesInfo {
  return {
    autoApprove: row.autoApprove,
    maxPerUser: row.maxPerUser,
    minLevel: row.minLevel,
    requiresNote: row.requiresNote,
    availableFrom: iso(row.availableFrom),
    availableUntil: iso(row.availableUntil),
  }
}

/** The same row as the pure rules module understands it. */
export function toPolicy(row: RewardRow): RewardPolicy {
  return {
    coinCost: row.coinCost,
    status: row.status,
    stock: row.stock,
    autoApprove: row.autoApprove,
    maxPerUser: row.maxPerUser,
    minLevel: row.minLevel,
    requiresNote: row.requiresNote,
    availableFrom: row.availableFrom,
    availableUntil: row.availableUntil,
  }
}

/**
 * A redemption as its owner sees it.
 *
 * `availableActions` is computed from the status machine rather than guessed in
 * a component, so the UI cannot offer a move the server would refuse: an admin
 * gets every legal transition, an employee gets "cancel" while their own request
 * is still undecided, and anybody else gets nothing.
 */
function toSummary(row: RedemptionRow, auth: AuthContext): RedemptionSummary {
  const isOwner = row.userId === auth.userId
  const mayManage = can(auth.role, 'reward:manage')
  const actions = actionsFor(row.status, isOwner, mayManage)

  return {
    id: row.id,
    status: row.status,
    coinCost: row.coinCost,
    note: row.note,
    decisionNote: row.decisionNote,
    requestedAt: row.requestedAt.toISOString(),
    decidedAt: iso(row.decidedAt),
    fulfilledAt: iso(row.fulfilledAt),
    refunded: row.status === 'REJECTED' || row.status === 'CANCELLED',
    reward: row.reward,
    availableActions: actions,
    cancellable: isOwner && !mayManage && canCancelOwnRedemption(row.status),
  }
}

/** What this caller may do with a request in `status`. */
function actionsFor(status: string, isOwner: boolean, mayManage: boolean): RedemptionAction[] {
  if (mayManage) return REDEMPTION_ACTIONS.filter(action => canTransition(status, action))
  if (isOwner && canCancelOwnRedemption(status)) return ['CANCEL']
  return []
}

function canTransition(status: string, action: RedemptionAction): boolean {
  return resolveRedemptionTransition(status, action).ok
}

/** The admin queue adds who asked, and every legal move. */
function toQueueRow(row: QueueRow): RedemptionSummary {
  return {
    id: row.id,
    status: row.status,
    coinCost: row.coinCost,
    note: row.note,
    decisionNote: row.decisionNote,
    requestedAt: row.requestedAt.toISOString(),
    decidedAt: iso(row.decidedAt),
    fulfilledAt: iso(row.fulfilledAt),
    refunded: row.status === 'REJECTED' || row.status === 'CANCELLED',
    reward: row.reward,
    user: row.user,
    availableActions: REDEMPTION_ACTIONS.filter(action => canTransition(row.status, action)),
    cancellable: false,
  }
}

// ---------------------------------------------------------------------------
// The caller's side of a purchase
// ---------------------------------------------------------------------------

interface CallerState {
  balance: number
  level: number
  accountActive: boolean
  /** Live (PENDING/APPROVED) requests per reward. */
  liveByReward: Map<string, number>
  /** Every request per reward, whatever its status. */
  totalByReward: Map<string, number>
}

/**
 * Balance, level, account status and the caller's own redemption counts.
 *
 * The wallet row is authoritative; `UserProgress.coins` is only the mirror the
 * leaderboard keeps, so it is a fallback for a user whose wallet has not been
 * created yet rather than a second opinion.
 */
async function callerState(
  db: TenantClient | TenantTx,
  auth: AuthContext,
  companyId: string,
): Promise<CallerState> {
  const [wallet, progress, user, live, total] = await Promise.all([
    db.wallet.findUnique({ where: { userId: auth.userId }, select: { balance: true } }),
    db.userProgress.findUnique({ where: { userId: auth.userId }, select: { xp: true, coins: true } }),
    db.user.findUnique({ where: { id: auth.userId }, select: { status: true } }),
    db.rewardRedemption.groupBy({
      by: ['rewardId'],
      where: { userId: auth.userId, status: { in: [...LIVE_REDEMPTION_STATUSES] } },
      _count: { _all: true },
    }),
    db.rewardRedemption.groupBy({
      by: ['rewardId'],
      where: { userId: auth.userId },
      _count: { _all: true },
    }),
  ])

  const level = await resolveLevelProgress(db, companyId, progress?.xp ?? 0)

  return {
    balance: wallet?.balance ?? progress?.coins ?? 0,
    level: level.level,
    accountActive: user?.status === 'ACTIVE',
    liveByReward: new Map(live.map(row => [row.rewardId, row._count._all])),
    totalByReward: new Map(total.map(row => [row.rewardId, row._count._all])),
  }
}

function candidateFor(
  state: CallerState,
  rewardId: string,
  note?: string | null,
): RedeemCandidate {
  return {
    balance: state.balance,
    level: state.level,
    liveRedemptions: state.liveByReward.get(rewardId) ?? 0,
    accountActive: state.accountActive,
    note: note ?? null,
  }
}

function toCatalogueItem(row: RewardRow, state: CallerState): RewardCatalogueItem {
  const candidate = candidateFor(state, row.id)
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type,
    coinCost: row.coinCost,
    stock: row.stock,
    imageUrl: row.imageUrl,
    rules: toRulesInfo(row),
    standing: rewardStanding(toPolicy(row), candidate),
    remainingAllowance: remainingAllowance(row.maxPerUser, candidate.liveRedemptions),
    myLiveRedemptions: candidate.liveRedemptions,
    myTotalRedemptions: state.totalByReward.get(row.id) ?? 0,
  }
}

// ---------------------------------------------------------------------------
// Catalogue
// ---------------------------------------------------------------------------

/**
 * `GET /api/rewards` — the shop.
 *
 * Only ACTIVE rewards are listed: a draft or a paused reward is not something an
 * employee should discover exists and then be refused. Each item carries the
 * caller's own standing, so a card says «ناموجود» or «سکه کافی ندارید» for the
 * same reason the API would refuse it.
 */
export async function listCatalogue(
  db: TenantClient,
  auth: AuthContext,
  filter: { type?: string } = {},
): Promise<RewardCatalogueResponse> {
  const state = await callerState(db, auth, auth.companyId)

  const [rewards, recent, byStatus] = await Promise.all([
    db.reward.findMany({
      where: { status: 'ACTIVE', ...(filter.type ? { type: filter.type as RewardRow['type'] } : {}) },
      orderBy: { coinCost: 'asc' },
      select: REWARD_SELECT,
    }),
    db.rewardRedemption.findMany({
      where: { userId: auth.userId },
      orderBy: { requestedAt: 'desc' },
      take: 10,
      select: REDEMPTION_SELECT,
    }),
    db.rewardRedemption.groupBy({
      by: ['status'],
      where: { userId: auth.userId },
      _count: { _all: true },
    }),
  ])

  return {
    balance: state.balance,
    level: state.level,
    items: rewards.map(row => toCatalogueItem(row, state)),
    redemptions: recent.map(row => toSummary(row, auth)),
    counts: Object.fromEntries(byStatus.map(row => [row.status, row._count._all])),
  }
}

/** `GET /api/rewards/:id` — one reward in full, plus the caller's history with it. */
export async function rewardDetail(
  db: TenantClient,
  auth: AuthContext,
  rewardId: string,
): Promise<RewardDetailResponse> {
  const [row, state] = await Promise.all([
    db.reward.findUnique({ where: { id: rewardId }, select: REWARD_SELECT }),
    callerState(db, auth, auth.companyId),
  ])
  // Tenant-scoped client: another company's reward is simply not found.
  if (!row) throw errors.notFound('پاداش پیدا نشد')

  const redemptions = await db.rewardRedemption.findMany({
    where: { userId: auth.userId, rewardId },
    orderBy: { requestedAt: 'desc' },
    select: REDEMPTION_SELECT,
  })

  return {
    reward: toCatalogueItem(row, state),
    redemptions: redemptions.map(item => toSummary(item, auth)),
  }
}

// ---------------------------------------------------------------------------
// Redemption
// ---------------------------------------------------------------------------

/** The reward row, locked. Everything a purchase decision needs, in one read. */
interface LockedReward {
  id: string
  title: string
  coinCost: number
  stock: number | null
  status: string
  autoApprove: boolean
  maxPerUser: number | null
  minLevel: number | null
  requiresNote: boolean
  availableFrom: Date | null
  availableUntil: Date | null
}

/**
 * Take a row-level lock on the reward.
 *
 * This is what serialises concurrent purchases of the *same* reward: stock, the
 * per-employee cap and the price are read and written by one request at a time.
 * Different rewards do not contend, so a busy catalogue does not become a queue.
 *
 * Lock order is always reward → wallet (the wallet lock lives inside
 * `applyCoinDelta`). Keeping one order everywhere is what makes a deadlock
 * impossible rather than unlikely.
 *
 * The column list is written out in the SQL: Prisma parameterises interpolated
 * values, so a `${COLUMNS}` template would arrive as a bound string rather than
 * as a projection.
 */
async function lockReward(tx: TenantTx, companyId: string, rewardId: string): Promise<LockedReward> {
  const rows = await tx.$queryRaw<LockedReward[]>`
    SELECT "id", "title", "coinCost", "stock", "status", "autoApprove",
           "maxPerUser", "minLevel", "requiresNote", "availableFrom", "availableUntil"
      FROM "Reward"
     WHERE "id" = ${rewardId}::uuid
       AND "companyId" = ${companyId}::uuid
     FOR UPDATE
  `
  const reward = rows[0]
  if (!reward) throw errors.notFound('پاداش پیدا نشد')
  return reward
}

/**
 * Take one unit of stock, atomically.
 *
 * The `WHERE` carries the guard rather than trusting the number read a moment
 * ago: `stock IS NULL` means the company set no limit, so unlimited stock is
 * never decremented into a negative number. Returns false when the shelf turned
 * out to be empty — which, under the row lock, means somebody changed the stock
 * by hand rather than a race.
 */
async function takeStock(tx: TenantTx, rewardId: string): Promise<boolean> {
  const updated = await tx.$executeRaw`
    UPDATE "Reward"
       SET "stock" = "stock" - 1,
           "updatedAt" = CURRENT_TIMESTAMP
     WHERE "id" = ${rewardId}::uuid
       AND "stock" IS NOT NULL
       AND "stock" > 0
  `
  return updated > 0
}

/** Give one unit back after a rejection or a cancellation. */
async function restoreStock(tx: TenantTx, rewardId: string): Promise<void> {
  await tx.$executeRaw`
    UPDATE "Reward"
       SET "stock" = "stock" + 1,
           "updatedAt" = CURRENT_TIMESTAMP
     WHERE "id" = ${rewardId}::uuid
       AND "stock" IS NOT NULL
  `
}

/**
 * `POST /api/rewards/:id/redeem` — spend coins on a reward.
 *
 * The price is read from the reward row inside the transaction; a client cannot
 * send one. On success the coins are gone, the stock is one lower, the request
 * exists, and the ledger has exactly one new row.
 */
export async function redeemReward(
  db: TenantClient,
  auth: AuthContext,
  rewardId: string,
  input: RedeemRewardInput,
): Promise<RedeemRewardResponse> {
  const note = input.note?.trim() || null
  const idempotencyKey = input.idempotencyKey ?? null

  // A retry of a submission that already landed returns the original rather than
  // charging again. The cheap read first keeps the common case out of a
  // transaction; the unique index below is what covers the genuine race.
  const replay = idempotencyKey ? await findByKey(db, auth.companyId, idempotencyKey) : null
  if (replay) return replayResponse(db, auth, replay)

  try {
    return await db.$transaction(async (tx) => {
      const reward = await lockReward(tx, auth.companyId, rewardId)
      const state = await callerState(tx, auth, auth.companyId)

      const policy: RewardPolicy = {
        coinCost: reward.coinCost,
        status: reward.status,
        stock: reward.stock,
        autoApprove: reward.autoApprove,
        maxPerUser: reward.maxPerUser,
        minLevel: reward.minLevel,
        requiresNote: reward.requiresNote,
        availableFrom: reward.availableFrom,
        availableUntil: reward.availableUntil,
      }

      // The same check the catalogue card used to decide whether to enable the
      // button — now re-run under the lock, where the numbers are true.
      const decision = checkRedemption(policy, candidateFor(state, reward.id, note))
      if (!decision.ok) throw blockError(decision.code)

      const status = initialRedemptionStatus(reward)
      const requestedAt = new Date()

      const redemption = await tx.rewardRedemption.create({
        data: {
          companyId: auth.companyId,
          rewardId: reward.id,
          userId: auth.userId,
          status,
          // A snapshot: repricing this reward tomorrow must not rewrite what
          // this employee paid.
          coinCost: reward.coinCost,
          note,
          idempotencyKey,
          requestedAt,
          // An automatic approval is still a decision, made by the company's own
          // rule; `decidedBy` stays null to say no human made it.
          decidedAt: status === 'APPROVED' ? requestedAt : null,
        },
        select: REDEMPTION_SELECT,
      })

      const ledger = await applyCoinDelta(tx, {
        companyId: auth.companyId,
        userId: auth.userId,
        amount: -reward.coinCost,
        type: 'REWARD_REDEMPTION',
        source: 'REWARD_REDEMPTION',
        reason: reward.title,
        referenceType: 'RewardRedemption',
        referenceId: redemption.id,
        idempotencyKey: redemptionKey(redemption.id),
      })

      if (reward.stock !== null && !(await takeStock(tx, reward.id))) {
        // Under the row lock this cannot be a race; it means the shelf was
        // emptied by hand between the read and the write. Roll back either way.
        throw blockError('OUT_OF_STOCK')
      }

      if (status === 'APPROVED') {
        await tx.notification.create({
          data: {
            companyId: auth.companyId,
            userId: auth.userId,
            type: 'REDEMPTION_UPDATE',
            title: 'درخواست پاداش شما تأیید شد',
            body: `«${reward.title}» به‌طور خودکار تأیید شد.`,
            data: { redemptionId: redemption.id, rewardId: reward.id, status },
          },
        })
      }

      await tx.auditLog.create({
        data: {
          companyId: auth.companyId,
          actorId: auth.userId,
          action: 'reward.redeem',
          targetType: 'RewardRedemption',
          targetId: redemption.id,
          data: { rewardId: reward.id, coinCost: reward.coinCost, status, balance: ledger.balance },
        },
      })

      return {
        redemption: toSummary(redemption, auth),
        balance: ledger.balance,
        charged: true,
        transactionId: ledger.transactionId,
      }
    })
  }
  catch (error) {
    // Two submissions with the same key arrived together: one committed, this
    // one rolled back on the unique index. Nothing was charged here, so report
    // the winner instead of an error — a retry must look like a retry.
    // Two submissions with the same key arrived together: one committed, this
    // one rolled back on the unique index. Nothing was charged here, so report
    // the winner instead of an error — a retry must look like a retry.
    if (idempotencyKey && isUniqueViolation(error)) {
      const winner = await findCommittedByKey(db, auth.companyId, idempotencyKey)
      if (winner) return replayResponse(db, auth, winner)

      // The key is taken but its row is still not readable, which means the
      // other request is mid-commit. That is a duplicate, not a server fault,
      // and the client's next retry will replay it — so say that, not `500`.
      throw errors.conflict('این درخواست هم‌اکنون در حال پردازش است؛ لحظه‌ای دیگر دوباره تلاش کنید')
    }
    throw error
  }
}

async function findByKey(
  db: TenantClient,
  companyId: string,
  idempotencyKey: string,
): Promise<RedemptionRow | null> {
  return db.rewardRedemption.findUnique({
    where: { companyId_idempotencyKey: { companyId, idempotencyKey } },
    select: REDEMPTION_SELECT,
  })
}

/**
 * The winning request's row, looked up with a short retry.
 *
 * The loser of a concurrent duplicate collides on the unique index at the
 * instant the winner commits — and "commits" is not the same instant as
 * "is readable": the loser's own connection is still unwinding its rollback, so
 * the very first read can miss a row that demonstrably exists (the index just
 * refused to duplicate it). A few short retries close that gap.
 *
 * Without them a double-clicked button answers `500` roughly half the time,
 * which is the one response an idempotency key must never produce.
 */
async function findCommittedByKey(
  db: TenantClient,
  companyId: string,
  idempotencyKey: string,
  attempts = 5,
): Promise<RedemptionRow | null> {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const row = await findByKey(db, companyId, idempotencyKey)
      if (row) return row
    }
    catch {
      // A connection still inside its aborted transaction can refuse the read
      // outright; the next attempt gets a fresh one.
    }
    await new Promise(resolve => setTimeout(resolve, 15 * (attempt + 1)))
  }
  return null
}

async function replayResponse(
  db: TenantClient,
  auth: AuthContext,
  row: RedemptionRow,
): Promise<RedeemRewardResponse> {
  const wallet = await db.wallet.findUnique({ where: { userId: auth.userId }, select: { balance: true } })
  return {
    redemption: toSummary(row, auth),
    balance: wallet?.balance ?? 0,
    charged: false,
    transactionId: null,
  }
}

// ---------------------------------------------------------------------------
// Decisions: approve, reject, fulfil, cancel
// ---------------------------------------------------------------------------

interface DecisionInput {
  action: RedemptionAction
  note?: string | null
  /** Set when the caller is the employee taking back their own request. */
  asOwner?: boolean
}

/**
 * Move a redemption to its next status — the only way a status changes.
 *
 * Admins may make any legal move; an employee may only cancel their own request
 * while it is still pending. A rejection or a cancellation refunds the coins
 * through the same ledger gateway and puts the stock back, in the same
 * transaction as the status change, so a request can never be settled without
 * its money being settled too.
 */
export async function decideRedemption(
  db: TenantClient,
  auth: AuthContext,
  redemptionId: string,
  input: DecisionInput,
): Promise<RedemptionDecisionResponse> {
  const note = input.note?.trim() || null

  const result = await db.$transaction(async (tx) => {
    const rows = await tx.$queryRaw<Array<{
      id: string
      status: string
      coinCost: number
      rewardId: string
      userId: string
    }>>`
      SELECT "id", "status", "coinCost", "rewardId", "userId"
        FROM "RewardRedemption"
       WHERE "id" = ${redemptionId}::uuid
         AND "companyId" = ${auth.companyId}::uuid
       FOR UPDATE
    `
    const row = rows[0]
    // Tenant-scoped by the WHERE above: another company's request does not exist.
    if (!row) throw errors.notFound('درخواست پیدا نشد')

    const isOwner = row.userId === auth.userId
    const mayManage = can(auth.role, 'reward:manage')

    if (input.asOwner || !mayManage) {
      if (!isOwner) throw errors.forbidden('این درخواست مال شما نیست')
      if (input.action !== 'CANCEL') throw errors.forbidden('تصمیم‌گیری دربارهٔ درخواست دیگران فقط برای مدیر است')
      if (!canCancelOwnRedemption(row.status)) {
        throw errors.conflict('این درخواست قابل لغو نیست')
      }
    }

    const transition = resolveRedemptionTransition(row.status, input.action)
    if (!transition.ok) {
      throw errors.conflict(
        transition.code === 'UNKNOWN_ACTION'
          ? 'عملیات نامعتبر است'
          : 'این درخواست در وضعیت فعلی قابل تغییر نیست',
      )
    }

    const now = new Date()
    const fulfilled = transition.to === 'FULFILLED'

    await tx.rewardRedemption.update({
      where: { id: row.id },
      data: {
        status: transition.to,
        decisionNote: note,
        decidedBy: auth.userId,
        decidedAt: fulfilled ? undefined : now,
        ...(fulfilled ? { fulfilledBy: auth.userId, fulfilledAt: now } : {}),
      },
    })

    let refunded = 0
    let balance: number | null = null

    if (transition.refunds) {
      // Stock goes back before coins: if the wallet write fails, the whole
      // transaction rolls back and neither happens.
      await restoreStock(tx, row.rewardId)

      const ledger = await applyCoinDelta(tx, {
        companyId: auth.companyId,
        userId: row.userId,
        amount: row.coinCost,
        type: 'REWARD_REDEMPTION',
        // A refund is its own immutable row with its own key: the statement shows
        // the spend and the return as two events, and a retried rejection cannot
        // pay twice.
        source: 'REFUND',
        reason: 'بازگشت سکه بابت لغو یا رد درخواست پاداش',
        referenceType: 'RewardRedemption',
        referenceId: row.id,
        idempotencyKey: redemptionRefundKey(row.id),
      })

      refunded = ledger.applied ? row.coinCost : 0
      balance = ledger.balance
    }

    // Nobody needs a bell for a button they just pressed themselves.
    if (row.userId !== auth.userId) {
      const reward = await tx.reward.findUnique({
        where: { id: row.rewardId },
        select: { title: true },
      })
      await tx.notification.create({
        data: {
          companyId: auth.companyId,
          userId: row.userId,
          type: 'REDEMPTION_UPDATE',
          title: DECISION_TITLES[input.action],
          body: [reward?.title ? `«${reward.title}»` : null, note].filter(Boolean).join(' — ') || null,
          data: { redemptionId: row.id, rewardId: row.rewardId, status: transition.to, refunded },
        },
      })
    }

    await tx.auditLog.create({
      data: {
        companyId: auth.companyId,
        actorId: auth.userId,
        action: `reward.redemption.${input.action.toLowerCase()}`,
        targetType: 'RewardRedemption',
        targetId: row.id,
        data: { from: row.status, to: transition.to, refunded, note },
      },
    })

    const updated = await tx.rewardRedemption.findUnique({
      where: { id: row.id },
      select: REDEMPTION_SELECT,
    })

    return { refunded, balance, updated }
  })

  if (!result.updated) throw errors.notFound('درخواست پیدا نشد')

  const balance = result.balance
    ?? (await db.wallet.findUnique({ where: { userId: result.updated.userId }, select: { balance: true } }))?.balance
    ?? null

  return {
    redemption: toSummary(result.updated, auth),
    balance,
    refunded: result.refunded,
  }
}

const DECISION_TITLES: Record<RedemptionAction, string> = {
  APPROVE: 'درخواست پاداش شما تأیید شد',
  REJECT: 'درخواست پاداش شما رد شد',
  FULFIL: 'پاداش شما تحویل شد',
  CANCEL: 'درخواست پاداش لغو شد',
}

/** `POST /api/rewards/redemptions/:id/cancel` — the employee's own way out. */
export function cancelOwnRedemption(
  db: TenantClient,
  auth: AuthContext,
  redemptionId: string,
): Promise<RedemptionDecisionResponse> {
  return decideRedemption(db, auth, redemptionId, { action: 'CANCEL', asOwner: true })
}

// ---------------------------------------------------------------------------
// Histories
// ---------------------------------------------------------------------------

/** `GET /api/rewards/redemptions` — the caller's own history, newest first. */
export async function listMyRedemptions(
  db: TenantClient,
  auth: AuthContext,
  query: { status?: string, page: number, pageSize: number },
): Promise<RedemptionListResponse> {
  const where: Prisma.RewardRedemptionWhereInput = {
    userId: auth.userId,
    ...(query.status ? { status: query.status as RedemptionRow['status'] } : {}),
  }

  const [items, total] = await Promise.all([
    db.rewardRedemption.findMany({
      where,
      // A history reads newest-first, like a bank statement.
      orderBy: { requestedAt: 'desc' },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: REDEMPTION_SELECT,
    }),
    db.rewardRedemption.count({ where }),
  ])

  return {
    items: items.map(row => toSummary(row, auth)),
    total,
    page: query.page,
    pageSize: query.pageSize,
  }
}

/**
 * `GET /api/rewards/admin/redemptions` — the queue, oldest first.
 *
 * A queue is first-come-first-served: whoever asked first is answered first, and
 * a manager cannot lose an old request under a pile of new ones. That is the one
 * place in this module where ordering is ascending, and it is deliberate.
 */
export async function listRedemptionQueue(
  db: TenantClient,
  query: { status?: string, rewardId?: string, userId?: string, page: number, pageSize: number },
): Promise<RedemptionListResponse> {
  const where: Prisma.RewardRedemptionWhereInput = {
    ...(query.status ? { status: query.status as QueueRow['status'] } : {}),
    ...(query.rewardId ? { rewardId: query.rewardId } : {}),
    ...(query.userId ? { userId: query.userId } : {}),
  }

  const [items, total] = await Promise.all([
    db.rewardRedemption.findMany({
      where,
      orderBy: { requestedAt: 'asc' },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: QUEUE_SELECT,
    }),
    db.rewardRedemption.count({ where }),
  ])

  return {
    items: items.map(row => toQueueRow(row)),
    total,
    page: query.page,
    pageSize: query.pageSize,
  }
}

// ---------------------------------------------------------------------------
// Admin catalogue
// ---------------------------------------------------------------------------

/** `GET /api/rewards/admin` — the whole shelf, including what is not listed. */
export async function listAdminCatalogue(
  db: TenantClient,
  filter: { type?: string, status?: string } = {},
): Promise<RewardAdminResponse> {
  const [rewards, grouped, queueCounts] = await Promise.all([
    db.reward.findMany({
      where: {
        ...(filter.status ? { status: filter.status as RewardRow['status'] } : {}),
        ...(filter.type ? { type: filter.type as RewardRow['type'] } : {}),
      },
      // Cheapest first, then newest: the shelf reads in the order employees
      // will read it, and a reward added today is not buried under last year's.
      orderBy: [{ coinCost: 'asc' }, { createdAt: 'desc' }],
      select: REWARD_SELECT,
    }),
    db.rewardRedemption.groupBy({
      by: ['rewardId', 'status'],
      _count: { _all: true },
      _sum: { coinCost: true },
    }),
    db.rewardRedemption.groupBy({
      by: ['status'],
      where: { status: { in: ['PENDING', 'APPROVED'] } },
      _count: { _all: true },
    }),
  ])

  const perReward = new Map<string, Record<string, { count: number, coins: number }>>()
  for (const row of grouped) {
    const bucket = perReward.get(row.rewardId) ?? {}
    bucket[row.status] = { count: row._count._all, coins: row._sum.coinCost ?? 0 }
    perReward.set(row.rewardId, bucket)
  }

  const items: RewardAdminItem[] = rewards.map((row) => {
    const buckets = perReward.get(row.id) ?? {}
    const count = (status: string) => buckets[status]?.count ?? 0
    const coins = (status: string) => buckets[status]?.coins ?? 0
    // Refunded requests put their coins back, so only the settled-and-live ones
    // count as collected.
    const collected = coins('PENDING') + coins('APPROVED') + coins('FULFILLED')

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      type: row.type,
      coinCost: row.coinCost,
      stock: row.stock,
      imageUrl: row.imageUrl,
      status: row.status,
      rules: toRulesInfo(row),
      availability: rewardAvailability(toPolicy(row)),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      redemptions: {
        total: count('PENDING') + count('APPROVED') + count('FULFILLED') + count('REJECTED') + count('CANCELLED'),
        pending: count('PENDING'),
        approved: count('APPROVED'),
        fulfilled: count('FULFILLED'),
        rejected: count('REJECTED'),
        cancelled: count('CANCELLED'),
      },
      coinsCollected: collected,
    }
  })

  return {
    items,
    counts: Object.fromEntries(items.reduce((acc, item) => {
      acc.set(item.status, (acc.get(item.status) ?? 0) + 1)
      return acc
    }, new Map<string, number>())),
    queue: {
      pending: queueCounts.find(row => row.status === 'PENDING')?._count._all ?? 0,
      approved: queueCounts.find(row => row.status === 'APPROVED')?._count._all ?? 0,
    },
  }
}

// ---------------------------------------------------------------------------
// Catalogue administration
// ---------------------------------------------------------------------------

/** `POST /api/rewards` — put something on the shelf. */
export async function createReward(
  db: TenantClient,
  auth: AuthContext,
  input: CreateRewardInput,
): Promise<RewardMutationResponse> {
  const rules = input.rules ?? {}

  const reward = await db.reward.create({
    data: {
      companyId: auth.companyId,
      title: input.title,
      description: input.description || null,
      type: input.type,
      coinCost: input.coinCost,
      // `null` is "unlimited"; only an explicit number becomes a shelf count.
      stock: input.stock ?? null,
      imageUrl: input.imageUrl || null,
      status: input.status,
      autoApprove: rules.autoApprove ?? false,
      maxPerUser: rules.maxPerUser ?? null,
      minLevel: rules.minLevel ?? null,
      requiresNote: rules.requiresNote ?? false,
      availableFrom: toDate(rules.availableFrom),
      availableUntil: toDate(rules.availableUntil),
    },
    select: { id: true },
  })

  await db.auditLog.create({
    data: {
      companyId: auth.companyId,
      actorId: auth.userId,
      action: 'reward.create',
      targetType: 'Reward',
      targetId: reward.id,
      data: { title: input.title, coinCost: input.coinCost, stock: input.stock ?? null, status: input.status },
    },
  })

  return { reward }
}

/**
 * `PATCH /api/rewards/:id` — edit, reprice, restock or disable.
 *
 * Only the keys the admin actually sent are written. That matters most for the
 * rules: `undefined` means "leave it alone" while `null` means "no limit", and
 * conflating the two would silently switch a cap off every time somebody edited
 * a price.
 */
export async function updateReward(
  db: TenantClient,
  auth: AuthContext,
  rewardId: string,
  input: UpdateRewardInput,
): Promise<RewardMutationResponse> {
  const existing = await db.reward.findUnique({ where: { id: rewardId }, select: { id: true } })
  if (!existing) throw errors.notFound('پاداش پیدا نشد')

  const rules = input.rules
  const data: Prisma.RewardUpdateInput = {
    ...(input.title !== undefined && { title: input.title }),
    ...(input.description !== undefined && { description: input.description || null }),
    ...(input.type !== undefined && { type: input.type }),
    ...(input.coinCost !== undefined && { coinCost: input.coinCost }),
    ...(input.stock !== undefined && { stock: input.stock }),
    ...(input.imageUrl !== undefined && { imageUrl: input.imageUrl || null }),
    ...(input.status !== undefined && { status: input.status }),
    ...(rules?.autoApprove !== undefined && { autoApprove: rules.autoApprove }),
    ...(rules?.requiresNote !== undefined && { requiresNote: rules.requiresNote }),
    ...(rules && 'maxPerUser' in rules && { maxPerUser: rules.maxPerUser ?? null }),
    ...(rules && 'minLevel' in rules && { minLevel: rules.minLevel ?? null }),
    ...(rules && 'availableFrom' in rules && { availableFrom: toDate(rules.availableFrom) }),
    ...(rules && 'availableUntil' in rules && { availableUntil: toDate(rules.availableUntil) }),
  }

  await db.reward.update({ where: { id: rewardId }, data })

  await db.auditLog.create({
    data: {
      companyId: auth.companyId,
      actorId: auth.userId,
      action: 'reward.update',
      targetType: 'Reward',
      targetId: rewardId,
      // The changed keys, not the values: enough to see what an admin touched,
      // without copying a whole catalogue row into the audit log.
      data: { fields: Object.keys(data) },
    },
  })

  return { reward: { id: rewardId } }
}

function toDate(value: Date | string | null | undefined): Date | null {
  if (value === null || value === undefined) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}
