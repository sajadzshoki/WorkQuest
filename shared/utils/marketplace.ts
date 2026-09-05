/**
 * The reward marketplace — pure rules, no I/O, no framework.
 *
 * A marketplace has three questions that must never be answered differently in
 * two places:
 *
 *  1. **Is this reward on offer right now?** (status, availability window, stock)
 *  2. **May *this* employee have one?** (per-person cap, level, note, balance)
 *  3. **What may happen to a request next?** (the status machine)
 *
 * All three live here. The server calls them inside the purchase transaction,
 * the catalogue calls them to decide what a button says, and the tests call them
 * directly — so a card that looks redeemable can never be refused by the API,
 * and a refusal always carries the same machine-readable code the UI already has
 * copy for.
 *
 * ## Why the order of the checks matters
 *
 * `checkRedemption` returns the *first* blocking reason, and the order is a
 * product decision: facts about the **reward** come before facts about the
 * **person**, and the person's **balance** comes last. Somebody who cannot
 * afford a reward that is also sold out should be told it is sold out — "earn
 * more coins" is the wrong advice for an empty shelf, and the right one only
 * once everything else is in order.
 *
 * ## Money
 *
 * This module never touches a balance. It is handed one and reports whether it
 * is enough; charging is `applyCoinDelta` in `server/utils/wallet.ts`, which is
 * the only code in the product that moves coins. Coins do not reset monthly, and
 * a redemption's price is snapshotted onto the request, so repricing a reward
 * later cannot rewrite what somebody paid.
 */

// ---------------------------------------------------------------------------
// Vocabulary
// ---------------------------------------------------------------------------

/** What a company can put on the shelf. */
export const REWARD_TYPES = [
  'PHYSICAL',
  'VOUCHER',
  'TIME_OFF',
  'DONATION',
  'MEAL',
  'TICKET',
  'BONUS',
  'CUSTOM',
] as const
export type RewardType = (typeof REWARD_TYPES)[number]

/** Shelf states. Only `ACTIVE` can be redeemed. */
export const CATALOG_STATUSES = ['DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED'] as const
export type CatalogStatus = (typeof CATALOG_STATUSES)[number]

/** The life of one request. */
export const REDEMPTION_STATUSES = [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'FULFILLED',
  'CANCELLED',
] as const
export type RedemptionStatus = (typeof REDEMPTION_STATUSES)[number]

/** What an admin — or the employee, cancelling their own request — can do. */
export const REDEMPTION_ACTIONS = ['APPROVE', 'REJECT', 'FULFIL', 'CANCEL'] as const
export type RedemptionAction = (typeof REDEMPTION_ACTIONS)[number]

// ---------------------------------------------------------------------------
// The status machine
// ---------------------------------------------------------------------------

/**
 * Every legal move, as data.
 *
 * Coins are charged at request time, so both `REJECT` and `CANCEL` refund and
 * put the stock back; `APPROVE` moves nothing (the coins are already held) and
 * `FULFIL` records that the reward was handed over. `FULFILLED`, `REJECTED` and
 * `CANCELLED` accept no further moves — a settled request cannot be unsettled,
 * which is what makes the ledger reconcilable.
 */
export const REDEMPTION_TRANSITIONS: Record<
  RedemptionAction,
  { from: readonly RedemptionStatus[], to: RedemptionStatus, refunds: boolean }
> = {
  APPROVE: { from: ['PENDING'], to: 'APPROVED', refunds: false },
  REJECT: { from: ['PENDING', 'APPROVED'], to: 'REJECTED', refunds: true },
  FULFIL: { from: ['APPROVED'], to: 'FULFILLED', refunds: false },
  CANCEL: { from: ['PENDING', 'APPROVED'], to: 'CANCELLED', refunds: true },
}

/** Statuses that are settled: no further move, coins either spent or returned. */
export const TERMINAL_REDEMPTION_STATUSES = ['FULFILLED', 'REJECTED', 'CANCELLED'] as const

/**
 * Statuses that hold coins and a unit of stock — the ones that count towards a
 * per-employee cap. A rejected or cancelled request is not "one of theirs": it
 * gave the coins and the item back, so counting it would punish somebody for a
 * request an admin turned down.
 */
export const LIVE_REDEMPTION_STATUSES = ['PENDING', 'APPROVED'] as const

export function isTerminalRedemption(status: RedemptionStatus | string): boolean {
  return (TERMINAL_REDEMPTION_STATUSES as readonly string[]).includes(status)
}

export function isLiveRedemption(status: RedemptionStatus | string): boolean {
  return (LIVE_REDEMPTION_STATUSES as readonly string[]).includes(status)
}

/** Whether `action` may be applied to a request in `status`. */
export function canTransitionRedemption(
  status: RedemptionStatus | string,
  action: RedemptionAction | string,
): boolean {
  const transition = REDEMPTION_TRANSITIONS[action as RedemptionAction]
  if (!transition) return false
  return (transition.from as readonly string[]).includes(status)
}

/**
 * Whether the employee who made a request may still take it back.
 *
 * Only while it is PENDING. Once an admin has approved it the company has
 * committed — stock is set aside, a manager may already be arranging it — so
 * undoing that is an admin's decision (`CANCEL`), not a button on the
 * employee's screen.
 */
export function canCancelOwnRedemption(status: RedemptionStatus | string): boolean {
  return status === 'PENDING'
}

/** Whether settling a request this way gives the coins back. */
export function refundsCoins(action: RedemptionAction | string): boolean {
  return REDEMPTION_ACTIONS.includes(action as RedemptionAction)
    && REDEMPTION_TRANSITIONS[action as RedemptionAction].refunds
}

/**
 * Where an action takes a request, or why it cannot.
 *
 * One function so the API's `409` and the UI's hidden button are the same fact.
 */
export function resolveRedemptionTransition(
  status: RedemptionStatus | string,
  action: RedemptionAction | string,
): { ok: true, to: RedemptionStatus, refunds: boolean } | { ok: false, code: 'UNKNOWN_ACTION' | 'ILLEGAL_TRANSITION' } {
  if (!REDEMPTION_ACTIONS.includes(action as RedemptionAction)) {
    return { ok: false, code: 'UNKNOWN_ACTION' }
  }
  const transition = REDEMPTION_TRANSITIONS[action as RedemptionAction]
  if (!(transition.from as readonly string[]).includes(status)) {
    return { ok: false, code: 'ILLEGAL_TRANSITION' }
  }
  return { ok: true, to: transition.to, refunds: transition.refunds }
}

/**
 * The status a brand-new request starts in.
 *
 * A reward the company flagged `autoApprove` — a digital code, a coffee at the
 * office machine — skips the queue and lands on APPROVED, so nobody has to
 * approve what the company already decided to give. Everything else waits for a
 * human.
 */
export function initialRedemptionStatus(reward: { autoApprove: boolean }): RedemptionStatus {
  return reward.autoApprove ? 'APPROVED' : 'PENDING'
}

// ---------------------------------------------------------------------------
// Availability & eligibility
// ---------------------------------------------------------------------------

/**
 * Why a redemption cannot go through.
 *
 * Stable strings: they cross the API boundary, drive the UI copy and are what
 * the tests assert on, so renaming one is a breaking change.
 */
export const REDEEM_BLOCK_CODES = [
  /** The employee's account is not active. */
  'INACTIVE_ACCOUNT',
  /** The reward is a draft, paused or archived. */
  'NOT_LISTED',
  /** Its availability window has not opened. */
  'NOT_AVAILABLE_YET',
  /** Its availability window has closed. */
  'EXPIRED',
  /** The shelf is empty. */
  'OUT_OF_STOCK',
  /** This employee already holds their allowance of it. */
  'LIMIT_REACHED',
  /** They have not reached the level the reward asks for. */
  'LEVEL_REQUIRED',
  /** The reward asks for a note and none was given. */
  'NOTE_REQUIRED',
  /** Not enough coins. */
  'INSUFFICIENT_COINS',
] as const
export type RedeemBlockCode = (typeof REDEEM_BLOCK_CODES)[number]

/** The reward side of a purchase decision. */
export interface RewardPolicy {
  coinCost: number
  status: CatalogStatus | string
  stock: number | null
  autoApprove: boolean
  maxPerUser: number | null
  minLevel: number | null
  requiresNote: boolean
  availableFrom?: Date | string | number | null
  availableUntil?: Date | string | number | null
}

/** The employee side of a purchase decision. */
export interface RedeemCandidate {
  /** Wallet balance — authoritative, never the denormalised mirror. */
  balance: number
  /** Level reached, for `minLevel` rewards. */
  level: number
  /** Live (PENDING/APPROVED) requests this employee already holds for it. */
  liveRedemptions: number
  /** Suspended and deactivated accounts cannot spend. */
  accountActive: boolean
  /** What they wrote, when the reward asks for something. */
  note?: string | null
  now?: Date | string | number
}

function toTime(value: Date | string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null
  const at = value instanceof Date ? value.getTime() : new Date(value).getTime()
  return Number.isNaN(at) ? null : at
}

/**
 * Is the reward on the shelf right now?
 *
 * Item-level only: nothing here knows who is asking. This is what a catalogue
 * card uses to say «ناموجود» or «به‌زودی», and what the purchase transaction
 * re-checks under a row lock.
 */
export function rewardAvailability(
  reward: Pick<RewardPolicy, 'status' | 'stock' | 'availableFrom' | 'availableUntil'>,
  now: Date | string | number = new Date(),
): { available: boolean, code: 'NOT_LISTED' | 'NOT_AVAILABLE_YET' | 'EXPIRED' | 'OUT_OF_STOCK' | null } {
  if (reward.status !== 'ACTIVE') return { available: false, code: 'NOT_LISTED' }

  const at = toTime(now) ?? Date.now()
  const from = toTime(reward.availableFrom)
  if (from !== null && at < from) return { available: false, code: 'NOT_AVAILABLE_YET' }

  // Half-open like the leaderboard windows: the reward is redeemable *up to*
  // `availableUntil`, not through it.
  const until = toTime(reward.availableUntil)
  if (until !== null && at >= until) return { available: false, code: 'EXPIRED' }

  if (reward.stock !== null && reward.stock <= 0) return { available: false, code: 'OUT_OF_STOCK' }

  return { available: true, code: null }
}

/**
 * The whole decision, in one place: `ok`, or the first reason it is not.
 *
 * Order: the account, then the reward, then the person, then their coins — see
 * the header comment for why.
 */
export function checkRedemption(
  reward: RewardPolicy,
  candidate: RedeemCandidate,
): { ok: true } | { ok: false, code: RedeemBlockCode } {
  if (!candidate.accountActive) return { ok: false, code: 'INACTIVE_ACCOUNT' }

  const availability = rewardAvailability(reward, candidate.now ?? new Date())
  if (!availability.available && availability.code) {
    return { ok: false, code: availability.code }
  }

  if (reward.maxPerUser !== null && candidate.liveRedemptions >= reward.maxPerUser) {
    return { ok: false, code: 'LIMIT_REACHED' }
  }

  if (reward.minLevel !== null && candidate.level < reward.minLevel) {
    return { ok: false, code: 'LEVEL_REQUIRED' }
  }

  if (reward.requiresNote && !(candidate.note ?? '').trim()) {
    return { ok: false, code: 'NOTE_REQUIRED' }
  }

  if (candidate.balance < reward.coinCost) return { ok: false, code: 'INSUFFICIENT_COINS' }

  return { ok: true }
}

/**
 * What a catalogue card needs to render honestly.
 *
 * `code` is the single blocking reason in `checkRedemption`'s order, so a card
 * can say *why* it is disabled instead of just greying out — and the reason it
 * shows is the reason the API would give.
 */
export interface RewardStanding {
  available: boolean
  affordable: boolean
  eligible: boolean
  /** `null` when nothing stands in the way. */
  code: RedeemBlockCode | null
  redeemable: boolean
}

/**
 * The blocking reasons that are about the *person* rather than the item or their
 * wallet. Availability and affordability are reported as their own fields, so a
 * card can phrase «ناموجود» and «سکه کافی ندارید» differently from «یک‌بار برای
 * هر نفر».
 */
const PERSON_LEVEL_CODES: ReadonlySet<string> = new Set([
  'INACTIVE_ACCOUNT',
  'LIMIT_REACHED',
  'LEVEL_REQUIRED',
  'NOTE_REQUIRED',
])

export function rewardStanding(
  reward: RewardPolicy,
  candidate: RedeemCandidate,
): RewardStanding {
  const decision = checkRedemption(reward, candidate)
  const availability = rewardAvailability(reward, candidate.now ?? new Date())
  const blocking = decision.ok ? null : decision.code

  return {
    available: availability.available,
    affordable: candidate.balance >= reward.coinCost,
    eligible: blocking === null || !PERSON_LEVEL_CODES.has(blocking),
    code: blocking,
    redeemable: decision.ok,
  }
}

// ---------------------------------------------------------------------------
// Stock and allowances
// ---------------------------------------------------------------------------

/** `null` stock means unlimited — the two are never the same thing as `0`. */
export function hasStock(stock: number | null): boolean {
  return stock === null || stock > 0
}

/** What the shelf holds after `quantity` leaves it; `null` stays unlimited. */
export function nextStock(stock: number | null, quantity: number): number | null {
  if (stock === null) return null
  return Math.max(0, stock - quantity)
}

/**
 * How many more of this reward an employee may hold, or `null` when the company
 * set no cap. Never negative: somebody whose cap was lowered after they redeemed
 * sees `0`, not a nonsense number.
 */
export function remainingAllowance(
  maxPerUser: number | null,
  liveRedemptions: number,
): number | null {
  if (maxPerUser === null) return null
  return Math.max(0, maxPerUser - liveRedemptions)
}

/** Coins left after a purchase — floored at zero, never negative. */
export function balanceAfterRedemption(balance: number, coinCost: number): number {
  return Math.max(0, balance - coinCost)
}
