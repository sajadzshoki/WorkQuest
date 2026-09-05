import type {
  AuthContext,
  LeaderboardEntry,
  LeaderboardMe,
  LeaderboardResponse,
  LeaderboardTeamOption,
  LeaderboardWindowInfo,
  PersonalProgressPeriod,
  PersonalProgressResponse,
  PeriodStats,
} from '#shared/types/api'
import type {
  LeaderboardAchievement,
  LeaderboardPeriod,
  LeaderboardScope,
  ParticipantActivity,
  RankedParticipant,
  SeriesWindow,
  TeamBoardAccess,
} from '#shared/utils/leaderboard'
import type { PeriodWindow } from '#shared/utils/period'
import type { LevelBoundary } from '#shared/utils/xp'

import {
  activitySeries,
  aggregateParticipants,
  canViewTeamLeaderboard,
  clampLeaderboardLimit,
  defaultTeamId,
  deltaDirection,
  MAX_LEADERBOARD_ENTRIES,
  PERIOD_CADENCE,
  pointsToNextRank,
  PROGRESS_MONTH_HISTORY,
  PROGRESS_WEEK_HISTORY,
  rankParticipants,
  scoringExplanation,
  selectBoard,
  viewableTeamIds,
} from '#shared/utils/leaderboard'
import {
  calendarWindow,
  calendarWindowKey,
  daysUntil,
  previousCalendarWindow,
} from '#shared/utils/period'
import { computeLevelProgress } from '#shared/utils/xp'

import { getManagedUserIds } from './auth'
import { errors } from './http'
import type { TenantClient } from './tenant'

/**
 * The leaderboard service — the only place a ranking is computed.
 *
 * Three rules shape it:
 *
 *  1. **A board is a window, not a table.** Rankings are derived from the
 *     immutable XP ledger and the achievement unlocks that fall inside a
 *     calendar week or month in the company timezone. Nothing is written, so
 *     nothing has to be cleared: when the window moves, the board starts empty
 *     and fills up again. XP, coins, levels and achievements are untouched by
 *     design — only the *period* turns over.
 *  2. **Ranking is performance.** The score comes from
 *     `shared/utils/leaderboard.ts`: performance XP plus achievement progress.
 *     Coin balances are never read here, so a rich employee cannot outrank a
 *     productive one and redeeming a reward cannot cost anybody a place.
 *  3. **A board is a handful of rows.** `MAX_LEADERBOARD_ENTRIES` caps every
 *     projection, for every role including OWNER. The caller always receives
 *     their own rank beside it; nobody receives a list of everybody's position.
 */

/** How many achievement chips a row carries. */
const ACHIEVEMENT_CHIPS = 3

/** The profile fields a board row shows — nothing else leaves the server. */
const PROFILE_SELECT = {
  id: true,
  fullName: true,
  avatarUrl: true,
  jobTitle: true,
  role: true,
} as const

interface ProfileRow {
  id: string
  fullName: string
  avatarUrl: string | null
  jobTitle: string | null
  role: string
}

// ---------------------------------------------------------------------------
// Windows
// ---------------------------------------------------------------------------

/** The window a period covers right now, in the company timezone. */
export function leaderboardWindow(
  period: LeaderboardPeriod,
  reference: Date,
  timeZone: string,
): PeriodWindow {
  return calendarWindow(PERIOD_CADENCE[period], reference, timeZone)
}

function windowInfo(
  period: LeaderboardPeriod,
  window: PeriodWindow,
  timeZone: string,
  now: Date,
): LeaderboardWindowInfo {
  return {
    key: calendarWindowKey(PERIOD_CADENCE[period], window, timeZone),
    startsAt: window.startsAt.toISOString(),
    endsAt: window.endsAt.toISOString(),
    endsInDays: daysUntil(window.endsAt, now),
  }
}

/** `count` consecutive windows ending with `current`, oldest first. */
function windowSeries(
  period: LeaderboardPeriod,
  current: PeriodWindow,
  count: number,
  timeZone: string,
): SeriesWindow[] {
  const cadence = PERIOD_CADENCE[period]
  const windows: PeriodWindow[] = [current]

  for (let index = 1; index < count; index += 1) {
    const earliest = windows[0]!
    windows.unshift(previousCalendarWindow(cadence, new Date(earliest.startsAt.getTime() - 1), timeZone))
  }

  return windows.map(window => ({
    key: calendarWindowKey(cadence, window, timeZone),
    startsAt: window.startsAt,
    endsAt: window.endsAt,
  }))
}

// ---------------------------------------------------------------------------
// Ranking a window
// ---------------------------------------------------------------------------

/** One window, ranked — the internal shape every projection is built from. */
export interface RankedWindow {
  window: PeriodWindow
  /** Everyone who scored, ranked. This is the board's population. */
  ranked: RankedParticipant[]
  /** Includes zero scores, so "you have not scored yet" is distinguishable. */
  activities: ParticipantActivity[]
  scores: number[]
}

const EMPTY_WINDOW = (window: PeriodWindow): RankedWindow => ({
  window,
  ranked: [],
  activities: [],
  scores: [],
})

/**
 * Read a window's activity from the ledgers and rank it.
 *
 * Two queries, both tenant-scoped and both bounded by the window, so the cost of
 * a board is proportional to the *period's* activity rather than to the
 * company's history.
 *
 * @param allowedUserIds the population that may be ranked — a team's members,
 *   or the ACTIVE members of the company. Ledger rows belonging to a suspended
 *   or removed account are dropped here rather than surfacing on a board.
 * @param queryUserIds when the population is a small set (a team), it is pushed
 *   into the query so the database does the narrowing.
 */
export async function rankWindow(
  db: TenantClient,
  window: PeriodWindow,
  allowedUserIds: ReadonlySet<string> | null,
  queryUserIds?: readonly string[],
): Promise<RankedWindow> {
  if (queryUserIds && queryUserIds.length === 0) return EMPTY_WINDOW(window)

  const userFilter = queryUserIds ? { userId: { in: [...queryUserIds] } } : {}
  const range = { gte: window.startsAt, lt: window.endsAt }

  const [xpRows, unlockRows] = await Promise.all([
    db.xpTransaction.findMany({
      where: { ...userFilter, createdAt: range },
      select: { userId: true, amount: true, source: true, createdAt: true },
    }),
    db.userAchievement.findMany({
      where: { ...userFilter, unlockedAt: range },
      select: {
        userId: true,
        unlockedAt: true,
        achievement: { select: { key: true, title: true, iconKey: true } },
      },
    }),
  ])

  const activities = aggregateParticipants(
    xpRows.map(row => ({
      userId: row.userId,
      amount: row.amount,
      source: row.source,
      createdAt: row.createdAt,
    })),
    unlockRows.map(row => ({
      userId: row.userId,
      unlockedAt: row.unlockedAt,
      key: row.achievement.key,
      title: row.achievement.title,
      iconKey: row.achievement.iconKey,
    })),
  ).filter(activity => !allowedUserIds || allowedUserIds.has(activity.userId))

  const ranked = rankParticipants(activities)

  return { window, ranked, activities, scores: ranked.map(entry => entry.score) }
}

/** The caller's own activity in a window, or null when they have none. */
function activityFor(window: RankedWindow, userId: string): ParticipantActivity | null {
  return window.activities.find(activity => activity.userId === userId) ?? null
}

/** Rank inside a subset — used for "your place within your team". */
function rankWithin(
  window: RankedWindow,
  userIds: ReadonlySet<string>,
  userId: string,
): number | null {
  const scoped = window.activities.filter(activity => userIds.has(activity.userId))
  return rankParticipants(scoped).find(entry => entry.userId === userId)?.rank ?? null
}

// ---------------------------------------------------------------------------
// Team access
// ---------------------------------------------------------------------------

interface TeamRow {
  id: string
  name: string
  slug: string
  leadId: string | null
  members: Array<{ userId: string }>
}

export interface TeamAccess {
  access: TeamBoardAccess
  /** Every team in the company, for lookups. */
  teams: TeamRow[]
  /** The teams this caller may open a board for, in display order. */
  options: LeaderboardTeamOption[]
  /** Member user ids per team. */
  membersByTeam: Map<string, string[]>
}

/**
 * Resolve which teams a caller may open a board for.
 *
 * OWNER/ADMIN: every team. MANAGER: the teams they lead, the teams they sit in,
 * and the teams their transitive reports sit in — the "relevant subordinate
 * teams" of the org chart. EMPLOYEE: only their own.
 *
 * The rule itself is pure (`canViewTeamLeaderboard`); this only fetches the
 * graph it needs and is the single place the graph is interpreted.
 */
export async function resolveTeamAccess(db: TenantClient, auth: AuthContext): Promise<TeamAccess> {
  const teams = await db.team.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      leadId: true,
      members: { select: { userId: true } },
    },
  })

  const memberTeamIds = teams
    .filter(team => team.members.some(member => member.userId === auth.userId))
    .map(team => team.id)
  const ledTeamIds = teams.filter(team => team.leadId === auth.userId).map(team => team.id)

  let subordinateTeamIds: string[] = []
  if (auth.role === 'MANAGER') {
    const reports = new Set(await getManagedUserIds(auth.companyId, auth.userId))
    subordinateTeamIds = teams
      .filter(team => !memberTeamIds.includes(team.id)
        && team.members.some(member => reports.has(member.userId)))
      .map(team => team.id)
  }

  const access: TeamBoardAccess = { ledTeamIds, memberTeamIds, subordinateTeamIds }
  const viewable = new Set(
    viewableTeamIds({ userId: auth.userId, role: auth.role }, access, teams.map(team => team.id)),
  )

  return {
    access,
    teams,
    membersByTeam: new Map(teams.map(team => [team.id, team.members.map(member => member.userId)])),
    options: teams
      .filter(team => viewable.has(team.id))
      .map(team => ({
        id: team.id,
        name: team.name,
        slug: team.slug,
        memberCount: team.members.length,
        isMember: memberTeamIds.includes(team.id),
        isLead: team.leadId === auth.userId,
      })),
  }
}

/**
 * The team a board is being opened on.
 *
 * Not requested and no team of one's own → `null` (the UI explains it). Unknown
 * in this tenant → 404; the tenant-scoped client already guarantees it cannot
 * be another company's team. Known but out of reach → 403, never a silent
 * fallback to a board the caller *may* see, which would hide the mistake.
 */
function resolveTeam(
  access: TeamAccess,
  auth: AuthContext,
  requestedTeamId: string | null | undefined,
): TeamRow | null {
  const teamId = requestedTeamId ?? defaultTeamId(access.access)
  if (!teamId) return null

  const team = access.teams.find(candidate => candidate.id === teamId)
  if (!team) throw errors.notFound('تیم پیدا نشد')

  if (!canViewTeamLeaderboard({ userId: auth.userId, role: auth.role }, teamId, access.access)) {
    throw errors.forbidden('دسترسی مشاهدهٔ جدول این تیم را ندارید')
  }

  return team
}

// ---------------------------------------------------------------------------
// Levels
// ---------------------------------------------------------------------------

/** The company ladder, loaded once per request and folded per entry. */
async function loadLadder(db: TenantClient): Promise<LevelBoundary[]> {
  const rows = await db.level.findMany({
    orderBy: { minXp: 'asc' },
    select: { level: true, minXp: true, title: true, iconKey: true },
  })
  return rows.map(row => ({
    level: row.level,
    minXp: row.minXp,
    title: row.title,
    iconKey: row.iconKey,
  }))
}

/**
 * Lifetime level for an XP total.
 *
 * Levels are permanent — a property of the person, not of the period — so the
 * board resolves them from `UserProgress.xp`, never from the window's score.
 */
function levelFor(xp: number, ladder: readonly LevelBoundary[]) {
  const progress = computeLevelProgress(xp, ladder)
  const rung = ladder.find(boundary => boundary.level === progress.level)
  return {
    level: progress.level,
    title: rung?.title ?? progress.title,
    iconKey: rung?.iconKey ?? null,
  }
}

/** Most recent unlocks first, capped — the chips are a highlight reel. */
function chips(achievements: readonly LeaderboardAchievement[]): LeaderboardAchievement[] {
  return [...achievements]
    .sort((a, b) => b.unlockedAt.localeCompare(a.unlockedAt))
    .slice(0, ACHIEVEMENT_CHIPS)
}

/** ACTIVE members of the tenant — the default population of a company board. */
async function activeMemberIds(db: TenantClient): Promise<Set<string>> {
  const rows = await db.user.findMany({ where: { status: 'ACTIVE' }, select: { id: true } })
  return new Set(rows.map(row => row.id))
}

// ---------------------------------------------------------------------------
// The board
// ---------------------------------------------------------------------------

export interface BuildLeaderboardInput {
  period: LeaderboardPeriod
  scope: LeaderboardScope
  teamId?: string | null
  limit?: number
  /** Injectable for tests; defaults to the current instant. */
  now?: Date
}

/**
 * Build a board: the top few rows of one window, plus the caller's own place.
 *
 * `scope=company` ranks every ACTIVE member of the tenant; `scope=team` ranks
 * the ACTIVE members of one team the caller may see. Both go through the same
 * window, the same score and the same cap, so a team board and a company board
 * can never disagree about what a score means.
 */
export async function buildLeaderboard(
  db: TenantClient,
  auth: AuthContext,
  input: BuildLeaderboardInput,
): Promise<LeaderboardResponse> {
  const now = input.now ?? new Date()
  const timeZone = auth.company.timezone
  const limit = clampLeaderboardLimit(input.limit ?? MAX_LEADERBOARD_ENTRIES)

  const window = leaderboardWindow(input.period, now, timeZone)
  const access = await resolveTeamAccess(db, auth)
  const team = input.scope === 'team' ? resolveTeam(access, auth, input.teamId) : null

  const [activeIds, ladder] = await Promise.all([activeMemberIds(db), loadLadder(db)])

  // The board's population: ACTIVE members of the company, or of one team. A
  // team scope with no team (the caller belongs to none) is an empty board
  // rather than a company-wide one wearing a team label.
  const population = input.scope === 'team'
    ? new Set((access.membersByTeam.get(team?.id ?? '') ?? []).filter(userId => activeIds.has(userId)))
    : activeIds

  const rankedWindow = await rankWindow(
    db,
    window,
    population,
    // A team is small enough to narrow in SQL; the company is the whole table.
    input.scope === 'team' ? [...population] : undefined,
  )
  const board = selectBoard(rankedWindow.ranked, limit)

  const myActivity = activityFor(rankedWindow, auth.userId)
  const inScope = population.has(auth.userId)
  const myScore = inScope ? (myActivity?.score ?? 0) : 0

  const me: LeaderboardMe = {
    userId: auth.userId,
    inScope,
    rank: inScope && myScore > 0
      ? rankedWindow.ranked.find(entry => entry.userId === auth.userId)?.rank ?? null
      : null,
    score: myScore,
    periodXp: inScope ? (myActivity?.periodXp ?? 0) : 0,
    achievementsUnlocked: inScope ? (myActivity?.achievementsUnlocked ?? 0) : 0,
    pointsToNextRank: inScope ? pointsToNextRank(myScore, rankedWindow.scores) : null,
    inEntries: board.some(entry => entry.userId === auth.userId),
  }

  // One profile query for the rows we may show, plus the caller's own.
  const profileIds = [...new Set([...board.map(entry => entry.userId), auth.userId])]
  const [profiles, progressRows] = await Promise.all([
    db.user.findMany({ where: { id: { in: profileIds } }, select: PROFILE_SELECT }),
    db.userProgress.findMany({
      where: { userId: { in: profileIds } },
      select: { userId: true, xp: true, currentStreak: true },
    }),
  ])

  const profileById = new Map<string, ProfileRow>(profiles.map(profile => [profile.id, profile]))
  const progressById = new Map(progressRows.map(row => [row.userId, row]))

  const entries: LeaderboardEntry[] = board.flatMap((row): LeaderboardEntry[] => {
    const profile = profileById.get(row.userId)
    // No profile means the account is gone; the row is dropped rather than
    // rendered as a nameless competitor.
    if (!profile) return []

    const progress = progressById.get(row.userId)
    const totalXp = progress?.xp ?? 0
    const level = levelFor(totalXp, ladder)

    return [{
      rank: row.rank,
      tied: row.tied,
      isMe: row.userId === auth.userId,
      user: {
        id: profile.id,
        fullName: profile.fullName,
        avatarUrl: profile.avatarUrl,
        jobTitle: profile.jobTitle,
        role: profile.role as LeaderboardEntry['user']['role'],
      },
      level: level.level,
      levelTitle: level.title,
      levelIconKey: level.iconKey,
      totalXp,
      score: row.score,
      periodXp: row.periodXp,
      performanceXp: row.performanceXp,
      achievementXp: row.achievementXp,
      achievementsUnlocked: row.achievementsUnlocked,
      achievements: chips(row.achievements),
      currentStreak: progress?.currentStreak ?? 0,
    }]
  })

  return {
    period: input.period,
    scope: input.scope,
    window: windowInfo(input.period, window, timeZone, now),
    team: team ? { id: team.id, name: team.name, slug: team.slug } : null,
    availableTeams: access.options,
    entries,
    me,
    participants: rankedWindow.ranked.length,
    maxEntries: MAX_LEADERBOARD_ENTRIES,
    scoring: scoringExplanation(),
  }
}

// ---------------------------------------------------------------------------
// Personal progress
// ---------------------------------------------------------------------------

export interface BuildProgressInput {
  weeks?: number
  months?: number
  now?: Date
}

function statsFor(window: RankedWindow, userId: string): PeriodStats {
  const activity = activityFor(window, userId)
  return {
    score: activity?.score ?? 0,
    xp: activity?.periodXp ?? 0,
    performanceXp: activity?.performanceXp ?? 0,
    achievementXp: activity?.achievementXp ?? 0,
    achievementsUnlocked: activity?.achievementsUnlocked ?? 0,
    achievements: chips(activity?.achievements ?? []),
  }
}

/**
 * The caller's own trajectory — the fourth board.
 *
 * It ranks nobody else: it compares the current week and month with the
 * previous ones, draws the recent series, and states where the caller sits
 * without listing the people around them. Lifetime totals ride along so the
 * screen can make the point that matters most about resets — the period turns
 * over, the XP, coins, level and achievements do not.
 */
export async function buildPersonalProgress(
  db: TenantClient,
  auth: AuthContext,
  input: BuildProgressInput = {},
): Promise<PersonalProgressResponse> {
  const now = input.now ?? new Date()
  const timeZone = auth.company.timezone
  const weeks = Math.min(Math.max(2, input.weeks ?? PROGRESS_WEEK_HISTORY), PROGRESS_WEEK_HISTORY)
  const months = Math.min(Math.max(2, input.months ?? PROGRESS_MONTH_HISTORY), PROGRESS_MONTH_HISTORY)

  const access = await resolveTeamAccess(db, auth)
  const teamId = defaultTeamId(access.access)
  const team = teamId ? access.teams.find(candidate => candidate.id === teamId) ?? null : null
  const teamMembers = new Set(team ? (access.membersByTeam.get(team.id) ?? []) : [])

  const [progress, ladder, unlockedCount, catalogueCount, badgeCount, activeIds] = await Promise.all([
    db.userProgress.findUnique({
      where: { userId: auth.userId },
      select: { xp: true, coins: true, currentStreak: true, longestStreak: true },
    }),
    loadLadder(db),
    db.userAchievement.count({ where: { userId: auth.userId } }),
    db.achievement.count({ where: { status: 'ACTIVE' } }),
    db.userBadge.count({ where: { userId: auth.userId } }),
    activeMemberIds(db),
  ])

  const xp = progress?.xp ?? 0
  const levelProgress = computeLevelProgress(xp, ladder)
  const rung = ladder.find(boundary => boundary.level === levelProgress.level)
  const nextRung = ladder.find(boundary => boundary.level === levelProgress.level + 1)

  const [week, month] = await Promise.all([
    buildPeriodProgress(db, auth, 'week', weeks, now, timeZone, teamMembers, activeIds),
    buildPeriodProgress(db, auth, 'month', months, now, timeZone, teamMembers, activeIds),
  ])

  return {
    lifetime: {
      xp,
      coins: progress?.coins ?? 0,
      level: levelProgress.level,
      levelTitle: rung?.title ?? levelProgress.title,
      levelIconKey: rung?.iconKey ?? null,
      levelPercent: levelProgress.percent,
      levelCurrentXp: levelProgress.currentXp,
      levelNeededXp: levelProgress.neededXp,
      nextLevel: nextRung
        ? { level: nextRung.level, minXp: nextRung.minXp, title: nextRung.title ?? null }
        : null,
      currentStreak: progress?.currentStreak ?? 0,
      longestStreak: progress?.longestStreak ?? 0,
      achievementsUnlocked: unlockedCount,
      achievementsTotal: catalogueCount,
      badges: badgeCount,
    },
    week,
    month,
    team: team ? { id: team.id, name: team.name, slug: team.slug } : null,
  }
}

async function buildPeriodProgress(
  db: TenantClient,
  auth: AuthContext,
  period: LeaderboardPeriod,
  historyLength: number,
  now: Date,
  timeZone: string,
  teamMembers: ReadonlySet<string>,
  activeIds: ReadonlySet<string>,
): Promise<PersonalProgressPeriod> {
  const cadence = PERIOD_CADENCE[period]
  const current = calendarWindow(cadence, now, timeZone)
  const previous = previousCalendarWindow(cadence, now, timeZone)

  const [currentWindow, previousWindow] = await Promise.all([
    rankWindow(db, current, activeIds),
    rankWindow(db, previous, activeIds),
  ])

  // The sparkline covers the whole history in one pair of queries, then buckets.
  const seriesWindows = windowSeries(period, current, historyLength, timeZone)
  const spanStart = seriesWindows[0]!.startsAt
  const [xpRows, unlockRows] = await Promise.all([
    db.xpTransaction.findMany({
      where: { userId: auth.userId, createdAt: { gte: spanStart, lt: now } },
      select: { userId: true, amount: true, source: true, createdAt: true },
    }),
    db.userAchievement.findMany({
      where: { userId: auth.userId, unlockedAt: { gte: spanStart, lt: now } },
      select: {
        userId: true,
        unlockedAt: true,
        achievement: { select: { key: true, title: true, iconKey: true } },
      },
    }),
  ])

  const series = activitySeries(
    seriesWindows,
    xpRows.map(row => ({
      userId: row.userId,
      amount: row.amount,
      source: row.source,
      createdAt: row.createdAt,
    })),
    unlockRows.map(row => ({
      userId: row.userId,
      unlockedAt: row.unlockedAt,
      key: row.achievement.key,
      title: row.achievement.title,
      iconKey: row.achievement.iconKey,
    })),
  )

  const currentStats = statsFor(currentWindow, auth.userId)
  const previousStats = statsFor(previousWindow, auth.userId)

  const companyRank = currentWindow.ranked.find(entry => entry.userId === auth.userId)?.rank ?? null
  const previousCompanyRank = previousWindow.ranked.find(entry => entry.userId === auth.userId)?.rank ?? null
  const teamRank = teamMembers.size > 0 ? rankWithin(currentWindow, teamMembers, auth.userId) : null
  const previousTeamRank = teamMembers.size > 0 ? rankWithin(previousWindow, teamMembers, auth.userId) : null

  return {
    window: windowInfo(period, current, timeZone, now),
    previousWindow: windowInfo(period, previous, timeZone, now),
    current: currentStats,
    previous: previousStats,
    delta: {
      score: currentStats.score - previousStats.score,
      xp: currentStats.xp - previousStats.xp,
      direction: deltaDirection(currentStats.score, previousStats.score),
    },
    rank: {
      company: companyRank,
      team: teamRank,
      participants: currentWindow.ranked.length,
    },
    previousRank: { company: previousCompanyRank, team: previousTeamRank },
    // Places climbed, where a positive number is progress. Only meaningful when
    // both windows ranked the caller, so an unranked previous week stays `null`
    // instead of becoming a fabricated jump.
    movement: companyRank !== null && previousCompanyRank !== null
      ? previousCompanyRank - companyRank
      : null,
    pointsToNextRank: pointsToNextRank(currentStats.score, currentWindow.scores),
    series,
  }
}
