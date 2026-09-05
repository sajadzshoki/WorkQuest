/**
 * The reward economy — one pure module, no I/O, no framework.
 *
 * Everything about how a score becomes XP and coins lives here. It is
 * deliberately dependency-free so the *same* function runs in three places:
 *
 *  - the server, when actually paying out an approved task;
 *  - the manager's review UI, to preview the payout before deciding;
 *  - the unit tests, exhaustively.
 *
 * That shared-ness is the anti-drift mechanism. A preview that disagreed with
 * the real payout would be worse than no preview at all, so there is only one
 * implementation and the UI is forbidden from doing arithmetic of its own.
 *
 * ## Two currencies, one calculation
 *
 * XP and coins are separate systems with different meanings — XP is permanent
 * progression, coins are spendable currency — but they are *earned* by the
 * same performance, so they share one multiplier and differ only in their base
 * amounts. Divergent formulas would make "why did I get 90% of the XP but 60%
 * of the coins?" unanswerable.
 *
 * ## Basis points
 *
 * All rates are integers in basis points (10000 = 1.0x). Money-like values and
 * IEEE-754 floats are a bad pair: `0.1 + 0.2 !== 0.3` would eventually produce
 * a payout that is one coin off and impossible to explain. Integer arithmetic
 * end-to-end means the ledger always reconciles exactly.
 */

import type { TaskPriority } from './task'

/** 10000 basis points = 1.0x. */
export const BP_SCALE = 10_000

/**
 * The tunable economy. Mirrors the `RewardRule` table one-for-one; the server
 * loads a row and passes it straight in.
 */
export interface RewardRules {
  baseXp: number
  baseCoins: number

  lowPriorityBp: number
  mediumPriorityBp: number
  highPriorityBp: number

  excellentBp: number
  goodBp: number
  fairBp: number
  poorBp: number

  onTimeBonusBp: number
  earlyBonusBp: number
  highQualityBonusBp: number

  overduePenaltyBp: number
  revisionPenaltyBp: number
  maxRevisionPenaltyBp: number

  minMultiplierBp: number
  maxMultiplierBp: number

  earlyDays: number
  highQualityThreshold: number
}

/**
 * Defaults used when a company has no rule row yet. These are also the column
 * defaults in the schema, so a fresh tenant and a mid-migration tenant behave
 * identically.
 */
export const DEFAULT_REWARD_RULES: RewardRules = {
  baseXp: 100,
  baseCoins: 50,

  lowPriorityBp: 8_000,
  mediumPriorityBp: 10_000,
  highPriorityBp: 13_000,

  excellentBp: 10_000,
  goodBp: 8_000,
  fairBp: 6_000,
  poorBp: 3_000,

  onTimeBonusBp: 1_000,
  earlyBonusBp: 2_000,
  highQualityBonusBp: 1_500,

  overduePenaltyBp: 2_500,
  revisionPenaltyBp: 1_000,
  maxRevisionPenaltyBp: 5_000,

  minMultiplierBp: 0,
  maxMultiplierBp: 20_000,

  earlyDays: 1,
  highQualityThreshold: 5,
}

/** Score bands, highest first. */
export type ScoreBand = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'

/** The facts about a completed task that the economy is allowed to price. */
export interface RewardInput {
  /** Overall reviewer score, 0-100. */
  score: number
  /** Reviewer's 1-5 quality sub-score, if given. */
  qualityScore?: number | null
  priority: TaskPriority
  /** When the task was due. Null means no deadline, so timing is neutral. */
  dueDate?: Date | string | null
  /** When it was submitted. Falls back to "now" at the call site. */
  submittedAt?: Date | string | null
  /** How many times it bounced back for revision. */
  revisionCount?: number
  /**
   * Per-task overrides. A task may carry its own base reward; when absent the
   * company rules' base applies.
   */
  baseXp?: number | null
  baseCoins?: number | null
}

/** A single named contribution to the final multiplier, in basis points. */
export interface RewardFactor {
  /** Stable machine key, for i18n and tests. */
  key: string
  /** Signed basis points this factor contributed. */
  bp: number
  kind: 'base' | 'band' | 'bonus' | 'penalty'
}

/**
 * A fully explained payout. Stored verbatim on the review so the number can be
 * justified to the employee months later.
 */
export interface RewardBreakdown {
  score: number
  band: ScoreBand
  priority: TaskPriority
  baseXp: number
  baseCoins: number
  /** Multiplier applied to the base, after clamping. */
  multiplierBp: number
  /** Every contribution, in application order. */
  factors: RewardFactor[]
  onTime: boolean
  early: boolean
  overdue: boolean
  revisionCount: number
  xp: number
  coins: number
}

function toDate(value: Date | string | null | undefined): Date | null {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/** Which band a 0-100 score falls into. */
export function scoreBand(score: number): ScoreBand {
  if (score >= 90) return 'EXCELLENT'
  if (score >= 80) return 'GOOD'
  if (score >= 70) return 'FAIR'
  return 'POOR'
}

function bandBp(band: ScoreBand, rules: RewardRules): number {
  switch (band) {
    case 'EXCELLENT': return rules.excellentBp
    case 'GOOD': return rules.goodBp
    case 'FAIR': return rules.fairBp
    case 'POOR': return rules.poorBp
  }
}

function priorityBp(priority: TaskPriority, rules: RewardRules): number {
  switch (priority) {
    case 'LOW': return rules.lowPriorityBp
    case 'HIGH': return rules.highPriorityBp
    case 'MEDIUM':
    default: return rules.mediumPriorityBp
  }
}

const DAY_MS = 86_400_000

/**
 * Price a completed task.
 *
 * Order of operations, which is what makes results explainable:
 *
 *   1. start from the score band multiplier;
 *   2. add bonuses and subtract penalties (all *additive* in bp, not
 *      compounding — compounding multipliers get surprising fast, and this has
 *      to be defensible to an employee who feels short-changed);
 *   3. clamp to [minMultiplierBp, maxMultiplierBp];
 *   4. apply priority weighting to the base;
 *   5. round once, at the end.
 *
 * An invalid score is clamped rather than thrown on: this runs in a UI preview
 * where a half-typed value must not explode. The *server* rejects out-of-range
 * scores at the Zod boundary, so clamping here is a safety net, not the
 * validation.
 */
export function calculateReward(
  input: RewardInput,
  rules: RewardRules = DEFAULT_REWARD_RULES,
): RewardBreakdown {
  const score = Math.max(0, Math.min(100, Math.round(Number(input.score) || 0)))
  const band = scoreBand(score)
  const revisionCount = Math.max(0, Math.round(input.revisionCount ?? 0))

  const due = toDate(input.dueDate)
  const submitted = toDate(input.submittedAt)

  // Timing is derived from timestamps, never from the reviewer's opinion — a
  // manager cannot mark a late task "on time" to inflate someone's payout.
  let onTime = false
  let early = false
  let overdue = false
  if (due && submitted) {
    const delta = due.getTime() - submitted.getTime()
    overdue = delta < 0
    onTime = delta >= 0
    early = delta >= rules.earlyDays * DAY_MS
  }

  const factors: RewardFactor[] = []

  const base = bandBp(band, rules)
  factors.push({ key: `band.${band}`, bp: base, kind: 'band' })

  let multiplier = base

  // --- bonuses -------------------------------------------------------------
  // `early` implies `onTime`; award the larger of the two rather than stacking,
  // so finishing early is never worth less than finishing merely on time.
  if (early && rules.earlyBonusBp !== 0) {
    const bp = Math.max(rules.earlyBonusBp, rules.onTimeBonusBp)
    multiplier += bp
    factors.push({ key: 'bonus.early', bp, kind: 'bonus' })
  }
  else if (onTime && rules.onTimeBonusBp !== 0) {
    multiplier += rules.onTimeBonusBp
    factors.push({ key: 'bonus.onTime', bp: rules.onTimeBonusBp, kind: 'bonus' })
  }

  const quality = input.qualityScore ?? null
  if (quality !== null && quality >= rules.highQualityThreshold && rules.highQualityBonusBp !== 0) {
    multiplier += rules.highQualityBonusBp
    factors.push({ key: 'bonus.highQuality', bp: rules.highQualityBonusBp, kind: 'bonus' })
  }

  // --- penalties -----------------------------------------------------------
  if (overdue && rules.overduePenaltyBp !== 0) {
    multiplier -= rules.overduePenaltyBp
    factors.push({ key: 'penalty.overdue', bp: -rules.overduePenaltyBp, kind: 'penalty' })
  }

  if (revisionCount > 0 && rules.revisionPenaltyBp !== 0) {
    const raw = rules.revisionPenaltyBp * revisionCount
    const capped = Math.min(raw, rules.maxRevisionPenaltyBp)
    multiplier -= capped
    factors.push({ key: 'penalty.revision', bp: -capped, kind: 'penalty' })
  }

  // --- clamp ---------------------------------------------------------------
  const lower = Math.min(rules.minMultiplierBp, rules.maxMultiplierBp)
  const upper = Math.max(rules.minMultiplierBp, rules.maxMultiplierBp)
  const clamped = Math.max(lower, Math.min(upper, multiplier))
  if (clamped !== multiplier) {
    factors.push({ key: 'clamp', bp: clamped - multiplier, kind: 'penalty' })
  }

  // --- apply ---------------------------------------------------------------
  const weight = priorityBp(input.priority, rules)
  const baseXp = Math.max(0, Math.round(input.baseXp ?? rules.baseXp))
  const baseCoins = Math.max(0, Math.round(input.baseCoins ?? rules.baseCoins))
  factors.unshift({ key: `priority.${input.priority}`, bp: weight, kind: 'base' })

  const xp = Math.max(0, Math.round((baseXp * weight * clamped) / (BP_SCALE * BP_SCALE)))
  const coins = Math.max(0, Math.round((baseCoins * weight * clamped) / (BP_SCALE * BP_SCALE)))

  return {
    score,
    band,
    priority: input.priority,
    baseXp,
    baseCoins,
    multiplierBp: clamped,
    factors,
    onTime,
    early,
    overdue,
    revisionCount,
    xp,
    coins,
  }
}

/**
 * Deterministic idempotency key for a task payout.
 *
 * One task pays out at most once, ever. The key is derived from the task id
 * alone — deliberately *not* from the review id — so a second approval, a
 * double-clicked button or a retried request all collide on the same key and
 * the unique index rejects the duplicate.
 */
export function taskRewardKey(taskId: string): string {
  return `task:${taskId}:reward`
}

/** Idempotency key for a redemption debit. */
export function redemptionKey(redemptionId: string): string {
  return `redemption:${redemptionId}:debit`
}

/**
 * Idempotency key for the refund that follows a rejection or a cancellation.
 *
 * A distinct key, not a reversed reuse of `redemptionKey`: the debit and the
 * refund are two immutable rows in the same ledger, and a statement has to show
 * both. One key per movement also means a retried "reject" cannot refund twice.
 */
export function redemptionRefundKey(redemptionId: string): string {
  return `redemption:${redemptionId}:refund`
}

/** Idempotency key for a recognition award. */
export function recognitionKey(recognitionId: string): string {
  return `recognition:${recognitionId}:reward`
}
