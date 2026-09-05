/**
 * Challenge rules — pure, dependency-free.
 *
 * The same functions decide what the server accepts, what the engine counts
 * and what the UI offers, and they are unit-tested without a database or an
 * HTTP server.
 *
 * A challenge is a *goal* (`goalKey` + `goalValue`) over a *window*
 * (`startsAt` → `endsAt`) for a *scope* (`type` + optional `teamId`):
 *
 *   INDIVIDUAL — every enrolled member races their own progress bar. The
 *                challenge closes early when everybody has finished, or at the
 *                deadline with COMPLETED status as soon as one person has.
 *   TEAM       — one shared bar filled by the team's collective work. Reaching
 *                the goal completes the challenge and rewards the whole team.
 *
 * Progress is never an input. It is computed by the engine
 * (`server/utils/challenges.ts`) from real application data — approved tasks,
 * on-time tasks, team completion — so no client and no admin can fake it.
 *
 * Goal vocabulary:
 *
 *   `tasks_completed`      — tasks that reached APPROVED (the same moment XP,
 *                            streaks and achievements fire, so "done" means
 *                            the same thing everywhere). Count goal: finishes
 *                            the moment the count reaches the target.
 *   `on_time_rate`         — of the participant's tasks completed inside the
 *                            window that carry a due date, the percentage
 *                            completed by that due date. Rate goal: judged at
 *                            the deadline, because "maintain" means the rate
 *                            must still hold when time is up — an early 100 %
 *                            on three tasks is not a maintained rate.
 *   `team_completion_rate` — of the team's tasks on the period's board (due
 *                            within the window, or undated work that arrived
 *                            during it), the percentage that is APPROVED.
 *                            Rate goal, TEAM only: a project milestone is
 *                            "100 % of the board cleared by the deadline".
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export const CHALLENGE_TYPES = ['INDIVIDUAL', 'TEAM'] as const
export type ChallengeType = (typeof CHALLENGE_TYPES)[number]

export const CHALLENGE_STATUSES = ['DRAFT', 'ACTIVE', 'COMPLETED', 'ENDED', 'CANCELLED'] as const
export type ChallengeStatus = (typeof CHALLENGE_STATUSES)[number]

/** Statuses no further change is possible from. */
export const TERMINAL_CHALLENGE_STATUSES: readonly ChallengeStatus[] = [
  'COMPLETED',
  'ENDED',
  'CANCELLED',
]

/** The participant lifecycle, mirrored from the database enum. */
export const PARTICIPANT_STATUSES = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CLAIMED'] as const
export type ParticipantStatus = (typeof PARTICIPANT_STATUSES)[number]

export const CHALLENGE_GOAL_KEYS = [
  'tasks_completed',
  'on_time_rate',
  'team_completion_rate',
] as const
export type ChallengeGoalKey = (typeof CHALLENGE_GOAL_KEYS)[number]

/** How a goal's value is measured — drives labels, clamps and comparisons. */
export type GoalUnit = 'tasks' | 'percent'

export interface GoalMeta {
  /** Which challenge types may track this goal. */
  types: readonly ChallengeType[]
  unit: GoalUnit
  /**
   * Rate goals are judged at the deadline rather than the moment the live
   * value first crosses the target: a rate is a promise about the whole
   * window, and it can still drop before time is up.
   */
  resolvesAtDeadline: boolean
}

export const CHALLENGE_GOALS: Record<ChallengeGoalKey, GoalMeta> = {
  tasks_completed: { types: ['INDIVIDUAL', 'TEAM'], unit: 'tasks', resolvesAtDeadline: false },
  on_time_rate: { types: ['INDIVIDUAL'], unit: 'percent', resolvesAtDeadline: true },
  team_completion_rate: { types: ['TEAM'], unit: 'percent', resolvesAtDeadline: true },
}

export function isChallengeType(value: unknown): value is ChallengeType {
  return typeof value === 'string' && (CHALLENGE_TYPES as readonly string[]).includes(value)
}

export function isChallengeGoalKey(value: unknown): value is ChallengeGoalKey {
  return typeof value === 'string' && (CHALLENGE_GOAL_KEYS as readonly string[]).includes(value)
}

/** May a challenge of `type` track `goalKey`? */
export function goalAllowedFor(type: ChallengeType, goalKey: ChallengeGoalKey): boolean {
  return CHALLENGE_GOALS[goalKey].types.includes(type)
}

/** True when the goal measures a percentage rather than a count. */
export function isRateGoal(goalKey: ChallengeGoalKey): boolean {
  return CHALLENGE_GOALS[goalKey].unit === 'percent'
}

// ---------------------------------------------------------------------------
// Goal values
// ---------------------------------------------------------------------------

/** Bounds a goal value may take, per unit. */
export const GOAL_BOUNDS: Record<GoalUnit, { min: number, max: number }> = {
  tasks: { min: 1, max: 100_000 },
  percent: { min: 1, max: 100 },
}

/** Floor for clamping a computed rate — a half-done task is not half on-time. */
export function goalValueFloor(goalKey: ChallengeGoalKey, value: number): number {
  if (!isRateGoal(goalKey)) return Math.max(0, Math.round(value))
  return Math.min(100, Math.max(0, Math.floor(value)))
}

/**
 * The percentage a progress bar should show, clamped to 0–100.
 *
 * Unclamped division would let a `7 / 5` task count render a 140 % bar, which
 * is noise on every surface; the raw numbers stay visible beside it.
 */
export function challengePercent(progress: number, goalValue: number): number {
  if (goalValue <= 0) return 0
  return Math.min(100, Math.max(0, Math.round((progress / goalValue) * 100)))
}

/** A goal is reached at `>=` — counts may overshoot, rates may equal. */
export function goalReached(progress: number, goalValue: number): boolean {
  return goalValue > 0 && progress >= goalValue
}

/**
 * The participant status a live progress value maps onto.
 *
 * `CLAIMED` is deliberately absent: it is not a progress state but the record
 * that the reward has been paid, and only the engine writes it.
 */
export function participantPhase(progress: number, goalValue: number): 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' {
  if (goalReached(progress, goalValue)) return 'COMPLETED'
  return progress > 0 ? 'IN_PROGRESS' : 'NOT_STARTED'
}

// ---------------------------------------------------------------------------
// The window
// ---------------------------------------------------------------------------

export interface ChallengeWindow {
  startsAt: Date
  endsAt: Date
}

/** Where `now` sits relative to the window. `endsAt` itself is still running:
 *  work completed at exactly the deadline counts, so the boundary is
 *  inclusive on both ends. */
export function windowState(window: ChallengeWindow, now: Date): 'scheduled' | 'running' | 'over' {
  if (now.getTime() < window.startsAt.getTime()) return 'scheduled'
  if (now.getTime() <= window.endsAt.getTime()) return 'running'
  return 'over'
}

/** Whole days left before the deadline; negative once it has passed. */
export function daysRemaining(endsAt: Date, now: Date): number {
  return Math.ceil((endsAt.getTime() - now.getTime()) / 86_400_000)
}

/** Longest window an admin may schedule — a year is a campaign, not a challenge. */
export const MAX_CHALLENGE_DAYS = 366

export type WindowIssue = 'ORDER' | 'PAST' | 'TOO_LONG' | undefined

/**
 * Validate a window for creation.
 *
 * `startsAt` may lie in the past — a challenge that starts now is a legitimate
 * "starting today" — but `endsAt` may not: a challenge whose deadline is
 * already gone can never be completed, so it is refused rather than born dead.
 */
export function validateWindow(window: ChallengeWindow, now: Date): WindowIssue {
  if (window.startsAt.getTime() >= window.endsAt.getTime()) return 'ORDER'
  if (window.endsAt.getTime() <= now.getTime()) return 'PAST'
  if (daysRemaining(window.endsAt, window.startsAt) > MAX_CHALLENGE_DAYS) return 'TOO_LONG'
  return undefined
}

// ---------------------------------------------------------------------------
// Lifecycle gates
// ---------------------------------------------------------------------------

export interface ChallengeLifecycle {
  status: ChallengeStatus
  startsAt: Date
}

/**
 * May the challenge still be edited?
 *
 * Only before it has started: once the window is open people are working
 * towards the published goal, and moving it would change the race mid-run.
 * Cancellation — with a notification to everybody enrolled — is the honest
 * way out after that.
 */
export function isEditableChallenge(challenge: ChallengeLifecycle, now: Date): boolean {
  if (TERMINAL_CHALLENGE_STATUSES.includes(challenge.status)) return false
  return challenge.status === 'DRAFT' || now.getTime() < challenge.startsAt.getTime()
}

/** May the challenge still be cancelled? Terminal statuses cannot. */
export function isCancellableChallenge(challenge: { status: ChallengeStatus }): boolean {
  return challenge.status === 'DRAFT' || challenge.status === 'ACTIVE'
}

// ---------------------------------------------------------------------------
// Creation presets
// ---------------------------------------------------------------------------

/**
 * The templates the create form offers — the six shapes the product promises:
 * three individual races and three team pushes. A preset only pre-fills the
 * form; every field stays editable, because the numbers above are the
 * company's to set, not the product's.
 */
export interface ChallengePreset {
  key: string
  type: ChallengeType
  goalKey: ChallengeGoalKey
  goalValue: number
}

export const CHALLENGE_PRESETS: readonly ChallengePreset[] = [
  { key: 'sprint10', type: 'INDIVIDUAL', goalKey: 'tasks_completed', goalValue: 10 },
  { key: 'sprint20', type: 'INDIVIDUAL', goalKey: 'tasks_completed', goalValue: 20 },
  { key: 'onTime90', type: 'INDIVIDUAL', goalKey: 'on_time_rate', goalValue: 90 },
  { key: 'team100', type: 'TEAM', goalKey: 'tasks_completed', goalValue: 100 },
  { key: 'teamCompletion90', type: 'TEAM', goalKey: 'team_completion_rate', goalValue: 90 },
  { key: 'milestone', type: 'TEAM', goalKey: 'team_completion_rate', goalValue: 100 },
]
