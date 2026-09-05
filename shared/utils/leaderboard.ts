/**
 * Leaderboard maths — pure, deterministic, no I/O.
 *
 * The board is *windowed*: it ranks what people earned inside a calendar period
 * (a week or a month in the company timezone), and the window moving forward is
 * the reset. Nothing is deleted and nothing outside the leaderboard turns over:
 * XP, coins, levels and achievements are permanent (`UserProgress`, the ledgers,
 * `UserAchievement`) and there is deliberately **no all-time board** — an
 * employee who joined last month must be able to win the week they are in.
 *
 * What is ranked
 * --------------
 * Performance, not purchasing power:
 *
 *   score = performance XP earned in the window
 *         + XP paid by achievements unlocked in the window
 *         + a flat bonus per achievement unlocked in the window
 *
 * Coins never enter the formula — they are a currency to be spent, so ranking
 * on them would reward whoever had *not* redeemed a reward. The flat
 * achievement bonus exists because achievement progress is a first-class
 * ranking input in its own right, not just a side effect of the XP it pays.
 *
 * Determinism
 * -----------
 * Equal scores share a rank (competition ranking: 1, 1, 3). Display order
 * inside a tie is fixed by the tie-breakers below, so two requests over the
 * same data can never disagree and nobody's rank flickers between page loads.
 *
 * Privacy
 * -------
 * `selectBoard` is the only projection the API is allowed to serve: the top N
 * (at most `MAX_LEADERBOARD_ENTRIES`) plus the caller's own row. There is no
 * helper here that returns a full ranking, because a screen that listed every
 * employee's position would be demotivating for exactly the people it is meant
 * to encourage.
 */

import type { CalendarCadence } from './period'

// ---------------------------------------------------------------------------
// Periods & scopes
// ---------------------------------------------------------------------------

/** The boards the product offers. There is no `'all'`: no permanent ranking. */
export const LEADERBOARD_PERIODS = ['week', 'month'] as const
export type LeaderboardPeriod = (typeof LEADERBOARD_PERIODS)[number]

/** A board is either the whole company or one team inside it. */
export const LEADERBOARD_SCOPES = ['company', 'team'] as const
export type LeaderboardScope = (typeof LEADERBOARD_SCOPES)[number]

/** How each board period turns over. */
export const PERIOD_CADENCE: Record<LeaderboardPeriod, CalendarCadence> = {
  week: 'WEEKLY',
  month: 'MONTHLY',
}

/**
 * How many rows a board may expose.
 *
 * Three is the podium; five is the fullest board the UI renders. The cap is a
 * product rule, not a pagination default, so it is enforced on the server too.
 */
export const PODIUM_SIZE = 3
export const MAX_LEADERBOARD_ENTRIES = 5
export const LEADERBOARD_LIMITS = [PODIUM_SIZE, MAX_LEADERBOARD_ENTRIES] as const

/** Clamp a requested limit into the allowed range. */
export function clampLeaderboardLimit(limit: number): number {
  if (!Number.isFinite(limit)) return MAX_LEADERBOARD_ENTRIES
  return Math.min(MAX_LEADERBOARD_ENTRIES, Math.max(1, Math.floor(limit)))
}

/**
 * How much history the personal-progress board draws: eight weeks (two months
 * of Mondays) and six months. Long enough to show a trend, short enough that
 * one ledger query covers it.
 */
export const PROGRESS_WEEK_HISTORY = 8
export const PROGRESS_MONTH_HISTORY = 6

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

/**
 * XP ledger sources that count as *performance*.
 *
 * `MANUAL_ADJUSTMENT` and `REFUND` are included so an admin correction moves
 * the board the way it moves the ledger — the board must never disagree with
 * the numbers a person can see in their own history.
 */
export const PERFORMANCE_XP_SOURCES = [
  'TASK_REVIEW',
  'STREAK',
  'RECOGNITION',
  'CHALLENGE',
  'MANUAL_ADJUSTMENT',
  'REFUND',
] as const

/** The source an achievement unlock pays through — reported separately. */
export const ACHIEVEMENT_XP_SOURCE = 'ACHIEVEMENT'

/**
 * Sources that never rank.
 *
 * Redeeming a reward is spending, not performance; letting it move a board
 * would punish people for using the coins they earned.
 */
export const UNRANKED_XP_SOURCES = ['REWARD_REDEMPTION'] as const

export type XpSourceClass = 'performance' | 'achievement' | 'unranked'

/** Which bucket of the score a ledger source feeds. */
export function classifyXpSource(source: string): XpSourceClass {
  if (source === ACHIEVEMENT_XP_SOURCE) return 'achievement'
  if ((UNRANKED_XP_SOURCES as readonly string[]).includes(source)) return 'unranked'
  return 'performance'
}

/**
 * The scoring weights, in whole points.
 *
 * Kept as data (not scattered through the aggregation) so the formula can be
 * read, tested and — later — tuned per company from one place.
 */
export const LEADERBOARD_SCORING = {
  /** Score points per XP earned from work, streaks, recognition and challenges. */
  performanceXpWeight: 1,
  /** Score points per XP paid by an achievement unlock. */
  achievementXpWeight: 1,
  /** Flat score points per achievement unlocked inside the window. */
  achievementUnlockBonus: 50,
} as const

export interface ScoreInput {
  performanceXp: number
  achievementXp: number
  achievementsUnlocked: number
}

/**
 * The ranking score.
 *
 * Integer, non-negative and monotonic in all three inputs. Clamped at zero so a
 * corrective negative ledger row can never push somebody into "negative rank"
 * territory — a board that humiliates is worse than no board.
 */
export function leaderboardScore(input: ScoreInput): number {
  const raw = input.performanceXp * LEADERBOARD_SCORING.performanceXpWeight
    + input.achievementXp * LEADERBOARD_SCORING.achievementXpWeight
    + input.achievementsUnlocked * LEADERBOARD_SCORING.achievementUnlockBonus
  return Math.max(0, Math.round(raw))
}

/** What a score is made of, as the UI explains it. */
export function scoringExplanation(): {
  performanceXpWeight: number
  achievementXpWeight: number
  achievementUnlockBonus: number
  rankedSources: string[]
  unrankedSources: string[]
} {
  return {
    ...LEADERBOARD_SCORING,
    rankedSources: [...PERFORMANCE_XP_SOURCES, ACHIEVEMENT_XP_SOURCE],
    unrankedSources: [...UNRANKED_XP_SOURCES],
  }
}

// ---------------------------------------------------------------------------
// Aggregation
// ---------------------------------------------------------------------------

/** One XP ledger row inside the window. `source` is a `LedgerSource` value. */
export interface LeaderboardXpEvent {
  userId: string
  amount: number
  source: string
  createdAt: Date | string | number
}

/** One achievement unlocked inside the window. */
export interface LeaderboardUnlockEvent {
  userId: string
  unlockedAt: Date | string | number
  key?: string | null
  title?: string | null
  iconKey?: string | null
}

/** An achievement indicator as the board renders it. */
export interface LeaderboardAchievement {
  key: string | null
  title: string | null
  iconKey: string | null
  unlockedAt: string
}

export interface ParticipantActivity extends ScoreInput {
  userId: string
  score: number
  /** XP earned in the window from every ranked source (performance + achievements). */
  periodXp: number
  achievements: LeaderboardAchievement[]
  /**
   * The instant this participant's running score first reached its final value,
   * in epoch milliseconds — the tie-breaker that rewards getting there first.
   * `null` when the score is zero.
   */
  reachedScoreAt: number | null
  firstActivityAt: number | null
}

function toTime(value: Date | string | number): number {
  return value instanceof Date ? value.getTime() : new Date(value).getTime()
}

interface Timeline {
  performanceXp: number
  achievementXp: number
  achievements: LeaderboardAchievement[]
  steps: Array<{ at: number, delta: number }>
}

/**
 * Fold a window's ledger rows and unlocks into one activity record per person.
 *
 * Rows whose source is unranked are dropped here rather than later, so the
 * totals this returns are already the totals the score is built from.
 */
export function aggregateParticipants(
  xpEvents: readonly LeaderboardXpEvent[],
  unlockEvents: readonly LeaderboardUnlockEvent[] = [],
): ParticipantActivity[] {
  const byUser = new Map<string, Timeline>()

  const timeline = (userId: string): Timeline => {
    const existing = byUser.get(userId)
    if (existing) return existing
    const created: Timeline = { performanceXp: 0, achievementXp: 0, achievements: [], steps: [] }
    byUser.set(userId, created)
    return created
  }

  for (const event of xpEvents) {
    const bucket = classifyXpSource(event.source)
    if (bucket === 'unranked') continue

    const amount = Number.isFinite(event.amount) ? event.amount : 0
    const at = toTime(event.createdAt)
    const row = timeline(event.userId)

    if (bucket === 'achievement') {
      row.achievementXp += amount
      row.steps.push({ at, delta: amount * LEADERBOARD_SCORING.achievementXpWeight })
    }
    else {
      row.performanceXp += amount
      row.steps.push({ at, delta: amount * LEADERBOARD_SCORING.performanceXpWeight })
    }
  }

  for (const unlock of unlockEvents) {
    const at = toTime(unlock.unlockedAt)
    const row = timeline(unlock.userId)
    row.achievements.push({
      key: unlock.key ?? null,
      title: unlock.title ?? null,
      iconKey: unlock.iconKey ?? null,
      unlockedAt: new Date(at).toISOString(),
    })
    row.steps.push({ at, delta: LEADERBOARD_SCORING.achievementUnlockBonus })
  }

  return [...byUser.entries()].map(([userId, row]) => {
    const achievementsUnlocked = row.achievements.length
    const score = leaderboardScore({
      performanceXp: row.performanceXp,
      achievementXp: row.achievementXp,
      achievementsUnlocked,
    })

    // Chronological, so the running total below is the order the person
    // actually earned it in. Ties on the instant are resolved by delta so the
    // walk is reproducible regardless of the order rows came back in.
    const steps = [...row.steps].sort((a, b) => a.at - b.at || a.delta - b.delta)

    let running = 0
    let reachedScoreAt: number | null = null
    for (const step of steps) {
      running += step.delta
      if (score > 0 && reachedScoreAt === null && running >= score) reachedScoreAt = step.at
    }

    const achievements = [...row.achievements].sort((a, b) =>
      a.unlockedAt.localeCompare(b.unlockedAt) || String(a.key ?? '').localeCompare(String(b.key ?? '')))

    return {
      userId,
      performanceXp: row.performanceXp,
      achievementXp: row.achievementXp,
      achievementsUnlocked,
      periodXp: row.performanceXp + row.achievementXp,
      score,
      achievements,
      reachedScoreAt,
      firstActivityAt: steps.length > 0 ? steps[0]!.at : null,
    }
  })
}

// ---------------------------------------------------------------------------
// Ranking
// ---------------------------------------------------------------------------

export interface RankedParticipant {
  userId: string
  /** Competition rank: equal scores share a rank, the next one skips (1, 1, 3). */
  rank: number
  /** Somebody else shares this rank. */
  tied: boolean
  score: number
  performanceXp: number
  achievementXp: number
  periodXp: number
  achievementsUnlocked: number
  achievements: LeaderboardAchievement[]
  reachedScoreAt: number | null
}

const FAR_FUTURE = Number.POSITIVE_INFINITY

/**
 * Deterministic ordering.
 *
 * 1. score, highest first — the only thing that decides *rank*;
 * 2. more achievements first — the tie-break that favours mastery over volume;
 * 3. whoever reached the score first — the tie-break that favours consistency;
 * 4. user id — so the order is total and can never shuffle between requests.
 */
export function compareParticipants(a: ParticipantActivity, b: ParticipantActivity): number {
  return b.score - a.score
    || b.achievementsUnlocked - a.achievementsUnlocked
    || (a.reachedScoreAt ?? FAR_FUTURE) - (b.reachedScoreAt ?? FAR_FUTURE)
    || (a.userId < b.userId ? -1 : a.userId > b.userId ? 1 : 0)
}

/**
 * Rank a window's participants.
 *
 * People with a score of zero are left out by default: a board that lists
 * everybody who did nothing this week, in last place, is the humiliating
 * variant this product avoids. They are still counted nowhere and ranked
 * nowhere — and the caller learns their own state from `me`, not from a row.
 */
export function rankParticipants(
  participants: readonly ParticipantActivity[],
  options: { includeZeroScores?: boolean } = {},
): RankedParticipant[] {
  const eligible = options.includeZeroScores
    ? [...participants]
    : participants.filter(participant => participant.score > 0)

  const sorted = eligible.sort(compareParticipants)

  return sorted.map((participant, index) => {
    // Competition ranking: walk back over everyone with the same score.
    let rank = 1
    for (let cursor = 0; cursor < index; cursor += 1) {
      const other = sorted[cursor]!
      if (other.score !== participant.score) rank += 1
    }
    const tied = sorted.some((other, otherIndex) =>
      otherIndex !== index && other.score === participant.score)

    return {
      userId: participant.userId,
      rank,
      tied,
      score: participant.score,
      performanceXp: participant.performanceXp,
      achievementXp: participant.achievementXp,
      periodXp: participant.periodXp,
      achievementsUnlocked: participant.achievementsUnlocked,
      achievements: participant.achievements,
      reachedScoreAt: participant.reachedScoreAt,
    }
  })
}

/**
 * The rank a given score holds among ranked scores: one more than the number of
 * people strictly above it, which is exactly how `rankParticipants` numbers a
 * tie. Used for "your position" without exposing anybody else's row.
 */
export function rankForScore(score: number, scores: readonly number[]): number {
  return scores.filter(other => other > score).length + 1
}

/**
 * Points the caller is short of the rank above them.
 *
 * A single number with no identity attached, so it can be shown to everybody:
 * "۱۲۰ امتیاز تا رتبهٔ بالاتر" is motivating, a neighbour's row is not. When
 * the caller has not scored yet this is the distance onto the board at all.
 * `null` when they are already on top (or nobody has scored).
 */
export function pointsToNextRank(myScore: number, scores: readonly number[]): number | null {
  const higher = scores.filter(score => score > myScore)
  if (higher.length === 0) return null
  return Math.min(...higher) - myScore
}

/** The rows a board may expose: the top N, and nothing else. */
export function selectBoard<T>(ranked: readonly T[], limit: number): T[] {
  return ranked.slice(0, clampLeaderboardLimit(limit))
}

// ---------------------------------------------------------------------------
// Series (personal progress)
// ---------------------------------------------------------------------------

export interface SeriesWindow {
  key: string
  startsAt: Date
  endsAt: Date
}

export interface SeriesBucket {
  key: string
  startsAt: string
  endsAt: string
  score: number
  xp: number
  performanceXp: number
  achievementXp: number
  achievementsUnlocked: number
}

/**
 * Bucket one person's activity into a run of consecutive windows — the sparkline
 * behind "personal progress".
 *
 * Windows are half-open, so every event lands in exactly one bucket, and a
 * bucket with no activity still appears with zeros: a gap in the chart is
 * information, not a hole.
 */
export function activitySeries(
  windows: readonly SeriesWindow[],
  xpEvents: readonly LeaderboardXpEvent[],
  unlockEvents: readonly LeaderboardUnlockEvent[] = [],
): SeriesBucket[] {
  return windows.map((window) => {
    const from = window.startsAt.getTime()
    const to = window.endsAt.getTime()
    const inside = (value: Date | string | number) => {
      const at = toTime(value)
      return at >= from && at < to
    }

    const scopedXp = xpEvents.filter(event => inside(event.createdAt))
    const scopedUnlocks = unlockEvents.filter(unlock => inside(unlock.unlockedAt))
    const [participant] = aggregateParticipants(scopedXp, scopedUnlocks)

    return {
      key: window.key,
      startsAt: window.startsAt.toISOString(),
      endsAt: window.endsAt.toISOString(),
      score: participant?.score ?? 0,
      xp: participant?.periodXp ?? 0,
      performanceXp: participant?.performanceXp ?? 0,
      achievementXp: participant?.achievementXp ?? 0,
      achievementsUnlocked: participant?.achievementsUnlocked ?? 0,
    }
  })
}

/** `up` / `down` / `flat` — the direction of a period-over-period change. */
export function deltaDirection(current: number, previous: number): 'up' | 'down' | 'flat' {
  if (current > previous) return 'up'
  if (current < previous) return 'down'
  return 'flat'
}

// ---------------------------------------------------------------------------
// Team board access
// ---------------------------------------------------------------------------

/** The role the caller holds. Kept structural so this module stays Prisma-free. */
export interface LeaderboardSubject {
  userId: string
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
}

/** The team graph the access rule needs, resolved by the server. */
export interface TeamBoardAccess {
  /** Teams whose `leadId` is the caller. */
  ledTeamIds: readonly string[]
  /** Teams the caller is a member of. */
  memberTeamIds: readonly string[]
  /**
   * Teams that hold at least one of the caller's transitive reports — the
   * "subordinate teams" a manager may look into without being in them.
   */
  subordinateTeamIds: readonly string[]
}

/**
 * May the caller open this team's board?
 *
 * OWNER/ADMIN are company-wide. A MANAGER reaches the teams they lead, the teams
 * they sit in, and the teams their reports sit in. An EMPLOYEE reaches only the
 * teams they belong to — a peer board, never a company-wide tool for comparing
 * people they do not work with.
 *
 * Pure on purpose: the same rule is unit-tested here and enforced in
 * `server/utils/leaderboard.ts`, so the API cannot drift from the tests.
 */
export function canViewTeamLeaderboard(
  subject: LeaderboardSubject,
  teamId: string,
  access: TeamBoardAccess,
): boolean {
  if (subject.role === 'OWNER' || subject.role === 'ADMIN') return true
  if (access.memberTeamIds.includes(teamId)) return true
  if (subject.role !== 'MANAGER') return false
  return access.ledTeamIds.includes(teamId) || access.subordinateTeamIds.includes(teamId)
}

/** The teams a caller may pick from, in the order the picker shows them. */
export function viewableTeamIds(
  subject: LeaderboardSubject,
  access: TeamBoardAccess,
  allTeamIds: readonly string[],
): string[] {
  if (subject.role === 'OWNER' || subject.role === 'ADMIN') return [...allTeamIds]

  const allowed = new Set([
    ...access.memberTeamIds,
    ...(subject.role === 'MANAGER' ? [...access.ledTeamIds, ...access.subordinateTeamIds] : []),
  ])
  return allTeamIds.filter(teamId => allowed.has(teamId))
}

/**
 * The team a board opens on when the caller did not pick one: their own.
 * `null` when they are in no team, which the UI turns into an explanation
 * rather than an empty list.
 */
export function defaultTeamId(access: TeamBoardAccess): string | null {
  return access.memberTeamIds[0] ?? access.ledTeamIds[0] ?? null
}
