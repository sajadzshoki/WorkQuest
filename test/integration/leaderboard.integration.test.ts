import type { ApiErrorBody, LeaderboardResponse, PersonalProgressResponse } from '#shared/types/api'
import type { PeriodWindow } from '#shared/utils/period'

import { randomUUID } from 'node:crypto'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import {
  aggregateParticipants,
  leaderboardScore,
  LEADERBOARD_SCORING,
  MAX_LEADERBOARD_ENTRIES,
  rankParticipants,
} from '#shared/utils/leaderboard'
import { calendarWindow, isInsideWindow, previousCalendarWindow } from '#shared/utils/period'

import { closeDb, query } from './db'
import { ApiClient, assertHarnessReady, requestCode } from './helpers'

/**
 * Leaderboards, end to end.
 *
 * `test/leaderboard.test.ts` proves the maths (windows, scoring, ties, the
 * privacy cap, team access). This file proves the *system*: that the HTTP
 * surface ranks exactly the window the maths says it should, that coins and
 * suspended accounts cannot buy or force a place, that a board never becomes a
 * list of everybody, and that the tenant and permission boundaries hold when a
 * caller asks for somebody else's team by id.
 *
 * The fixture is its own tenant so the assertions can be exact: seeded
 * companies carry data other suites depend on.
 */

const TIMEZONE = 'Asia/Tehran'

const now = new Date()
const thisWeek = calendarWindow('WEEKLY', now, TIMEZONE)
const lastWeek = previousCalendarWindow('WEEKLY', now, TIMEZONE)
const thisMonth = calendarWindow('MONTHLY', now, TIMEZONE)

/** An instant inside every window passed, and never in the future. */
function inside(...windows: PeriodWindow[]): Date {
  const start = Math.max(...windows.map(window => window.startsAt.getTime()))
  const candidate = Math.min(now.getTime(), start + 3_600_000)
  return new Date(Math.max(candidate, start + 1000))
}

/** Well before any board window: proves old activity never resurfaces. */
const ancient = new Date(now.getTime() - 90 * 86_400_000)

const inWeekAndMonth = inside(thisWeek, thisMonth)
const inLastWeek = inside(lastWeek)

// ---------------------------------------------------------------------------
// Fixture
// ---------------------------------------------------------------------------

const ids: Record<string, string> = {}

/** Every account in the fixture, in a stable order. */
const PEOPLE = ['owner', 'mgrA', 'mgrB', 'mgrC', 'a1', 'a2', 'a3', 'b1', 'b2', 'c1', 'ghost'] as const
/** The population a company board ranks: `ghost` is suspended. */
const ACTIVE_PEOPLE = PEOPLE.filter(key => key !== 'ghost')

const phones: Record<string, string> = {
  owner: '+989210000001',
  mgrA: '+989210000002',
  mgrB: '+989210000003',
  mgrC: '+989210000004',
  a1: '+989210000005',
  a2: '+989210000006',
  a3: '+989210000007',
  b1: '+989210000008',
  b2: '+989210000009',
  c1: '+989210000010',
  ghost: '+989210000011',
}

interface XpRow {
  userId: string
  amount: number
  source: string
  createdAt: Date
}
interface UnlockRow {
  userId: string
  unlockedAt: Date
  key: string
}

/** Everything written to the ledgers, kept so expectations can be recomputed. */
const xpRows: XpRow[] = []
const unlockRows: UnlockRow[] = []

const clients: Record<string, ApiClient> = {}

let companyId = ''
let slug = ''

async function login(key: string): Promise<void> {
  const client = new ApiClient()
  const code = await requestCode(client, phones[key]!)
  const result = await client.request('/api/auth/otp/verify', {
    method: 'POST',
    body: { phone: phones[key], code },
  })
  expect(result.status, JSON.stringify(result.body)).toBe(200)
  clients[key] = client
}

function envelope(result: { status: number, body: unknown }): ApiErrorBody {
  return (result.body ?? {}) as ApiErrorBody
}

async function board(
  key: string,
  params: Record<string, string> = {},
): Promise<{ status: number, body: LeaderboardResponse | unknown }> {
  return clients[key]!.request<LeaderboardResponse>('/api/leaderboard', { query: params })
}

/** The board, asserted 200 and typed. */
async function boardOf(key: string, params: Record<string, string> = {}): Promise<LeaderboardResponse> {
  const result = await board(key, params)
  expect(result.status, JSON.stringify(result.body)).toBe(200)
  return result.body as LeaderboardResponse
}

/**
 * What the shared maths says a window's board should be, for a population.
 *
 * The server and this expectation run the *same* pure functions over the same
 * fixture, so a mismatch means the wiring is wrong — the window, the population
 * or the source classification — not that the ranking formula drifted.
 */
/** The ACTIVE user ids of the fixture tenant. */
function activeUserIds(): string[] {
  return ACTIVE_PEOPLE.map(key => ids[key]!)
}

function expectedRanking(window: PeriodWindow, population: Iterable<string>) {
  const allowed = new Set(population)
  const activities = aggregateParticipants(
    xpRows.filter(row => isInsideWindow(row.createdAt, window)),
    unlockRows.filter(row => isInsideWindow(row.unlockedAt, window)),
  ).filter(activity => allowed.has(activity.userId))

  return rankParticipants(activities)
}

beforeAll(() => {
  assertHarnessReady()
})

beforeAll(async () => {
  slug = `board-test-${Date.now().toString(36)}`
  companyId = randomUUID()

  await query(
    `INSERT INTO "Company" (id, name, slug, locale, timezone, "isActive", "createdAt", "updatedAt")
     VALUES ($1, 'کارگاه آزمون جدول', $2, 'fa', $3, true, now(), now())`,
    [companyId, slug, TIMEZONE],
  )

  // The default ladder, so levels resolve the way they do in a real tenant.
  const ladder = [0, 500, 1200, 2100, 3200, 4500]
  for (const [index, minXp] of ladder.entries()) {
    await query(
      `INSERT INTO "Level" (id, "companyId", level, "minXp", title)
       VALUES ($1, $2, $3, $4, $5)`,
      [randomUUID(), companyId, index + 1, minXp, `سطح ${index + 1}`],
    )
  }

  const people: Array<[key: string, name: string, role: string, status: string, coins: number]> = [
    ['owner', 'صاحب کارگاه', 'OWNER', 'ACTIVE', 0],
    ['mgrA', 'مدیر آلفا', 'MANAGER', 'ACTIVE', 0],
    ['mgrB', 'مدیر بتا', 'MANAGER', 'ACTIVE', 0],
    ['mgrC', 'مدیر گاما', 'MANAGER', 'ACTIVE', 0],
    ['a1', 'کارمند اول آلفا', 'EMPLOYEE', 'ACTIVE', 99_999],
    ['a2', 'کارمند دوم آلفا', 'EMPLOYEE', 'ACTIVE', 10],
    ['a3', 'کارمند سوم آلفا', 'EMPLOYEE', 'ACTIVE', 0],
    ['b1', 'کارمند اول بتا', 'EMPLOYEE', 'ACTIVE', 0],
    ['b2', 'کارمند دوم بتا', 'EMPLOYEE', 'ACTIVE', 0],
    ['c1', 'کارمند گاما', 'EMPLOYEE', 'ACTIVE', 0],
    ['ghost', 'کارمند معلق', 'EMPLOYEE', 'SUSPENDED', 0],
  ]

  for (const [key, name, role, status, coins] of people) {
    ids[key] = randomUUID()
    await query(
      `INSERT INTO "User" (id, "companyId", phone, "fullName", role, status, locale, "jobTitle", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5::"UserRole", $6::"UserStatus", 'fa', $7, now(), now())`,
      [ids[key], companyId, phones[key], name, role, status, key],
    )
    await query(
      `INSERT INTO "UserProgress" (id, "companyId", "userId", xp, coins, "currentStreak", "longestStreak", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, 0, 0, now())`,
      [randomUUID(), companyId, ids[key], 0, coins],
    )
  }

  const teams: Array<[key: string, name: string, lead: string]> = [
    ['alpha', 'تیم آلفا', 'mgrA'],
    ['beta', 'تیم بتا', 'mgrB'],
    ['gamma', 'تیم گاما', 'mgrC'],
  ]
  for (const [key, name, lead] of teams) {
    ids[key] = randomUUID()
    await query(
      `INSERT INTO "Team" (id, "companyId", name, slug, "leadId", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, now(), now())`,
      [ids[key], companyId, name, key, ids[lead]],
    )
  }

  // Membership, and the manager edge that gives mgrA a *subordinate* team:
  // mgrB leads بتا and reports to mgrA, so بتا is inside mgrA's span of control
  // while گاما (led by an unrelated manager) is not.
  const memberships: Array<[user: string, team: string, role: string, manager: string | null]> = [
    ['mgrA', 'alpha', 'LEAD', ids.owner],
    ['mgrB', 'beta', 'LEAD', ids.mgrA],
    ['mgrC', 'gamma', 'LEAD', ids.owner],
    ['a1', 'alpha', 'MEMBER', ids.mgrA],
    ['a2', 'alpha', 'MEMBER', ids.mgrA],
    ['a3', 'alpha', 'MEMBER', ids.mgrA],
    ['ghost', 'alpha', 'MEMBER', ids.mgrA],
    ['b1', 'beta', 'MEMBER', ids.mgrB],
    ['b2', 'beta', 'MEMBER', ids.mgrB],
    ['c1', 'gamma', 'MEMBER', ids.mgrC],
  ]
  for (const [user, team, role, manager] of memberships) {
    await query(
      `INSERT INTO "TeamMember" (id, "companyId", "teamId", "userId", "managerId", role, "joinedAt")
       VALUES ($1, $2, $3, $4, $5, $6::"TeamRole", now())`,
      [randomUUID(), companyId, ids[team], ids[user], manager, role],
    )
  }

  const achievements: Array<[key: string, title: string, xp: number]> = [
    ['first_approved_task', 'اولین تسک تأییدشده', 100],
    ['streak_7', 'هفت روز پیاپی', 150],
  ]
  for (const [key, title, xp] of achievements) {
    ids[`achievement:${key}`] = randomUUID()
    await query(
      `INSERT INTO "Achievement" (id, "companyId", key, title, type, criteria, "xpReward", status, "updatedAt")
       VALUES ($1, $2, $3, $4, 'MILESTONE', '{}'::jsonb, $5, 'ACTIVE', now())`,
      [ids[`achievement:${key}`], companyId, key, title, xp],
    )
  }

  /** Write an XP ledger row and remember it for the expectations. */
  async function award(userKey: string, amount: number, source: string, createdAt: Date, reason = 'پاداش تسک'): Promise<void> {
    xpRows.push({ userId: ids[userKey]!, amount, source, createdAt })
    await query(
      `INSERT INTO "XpTransaction" (id, "companyId", "userId", amount, source, reason, "createdAt")
       VALUES ($1, $2, $3, $4, $5::"LedgerSource", $6, $7)`,
      [randomUUID(), companyId, ids[userKey], amount, source, reason, createdAt],
    )
  }

  async function unlock(userKey: string, achievementKey: string, unlockedAt: Date): Promise<void> {
    unlockRows.push({ userId: ids[userKey]!, unlockedAt, key: achievementKey })
    await query(
      `INSERT INTO "UserAchievement" (id, "companyId", "userId", "achievementId", "unlockedAt")
       VALUES ($1, $2, $3, $4, $5)`,
      [randomUUID(), companyId, ids[userKey], ids[`achievement:${achievementKey}`], unlockedAt],
    )
  }

  // --- the windowed activity -------------------------------------------------
  // a1 and a2 are deliberately identical inside the window: same XP, same
  // achievement XP, same unlock. They must share a rank.
  await award('a1', 300, 'TASK_REVIEW', inWeekAndMonth)
  await award('a1', 100, 'ACHIEVEMENT', inWeekAndMonth)
  await unlock('a1', 'first_approved_task', inWeekAndMonth)
  await award('a2', 300, 'TASK_REVIEW', inWeekAndMonth)
  await award('a2', 100, 'ACHIEVEMENT', inWeekAndMonth)
  await unlock('a2', 'first_approved_task', inWeekAndMonth)

  // b1 out-scores the tie without unlocking anything: output beats a coin-rich
  // colleague, and a1's 99,999 coins are worth exactly zero here.
  await award('b1', 500, 'TASK_REVIEW', inWeekAndMonth)
  await award('a3', 120, 'TASK_REVIEW', inWeekAndMonth)
  await award('c1', 80, 'TASK_REVIEW', inWeekAndMonth)
  await award('mgrC', 70, 'TASK_REVIEW', inWeekAndMonth)

  // Outside this week, inside last week: the weekly board must not see these,
  // the monthly one may (depending on where the month starts).
  await award('a1', 250, 'TASK_REVIEW', inLastWeek)
  await award('b1', 250, 'TASK_REVIEW', inLastWeek)
  await award('b2', 60, 'TASK_REVIEW', inLastWeek)

  // Ancient history: counts towards lifetime XP and the level, never a board.
  await award('a1', 900, 'TASK_REVIEW', ancient)
  await unlock('a1', 'streak_7', ancient)

  // Reward redemptions are spending, not performance.
  await award('a3', 5_000, 'REWARD_REDEMPTION', inWeekAndMonth, 'خرید پاداش')

  // A suspended account with a huge week: never on a board, never in a count.
  await award('ghost', 4_000, 'TASK_REVIEW', inWeekAndMonth)

  // Coin ledger rows: the ranking must be indifferent to them.
  for (const key of ['a1', 'a2', 'b1']) {
    await query(
      `INSERT INTO "CoinTransaction" (id, "companyId", "userId", amount, type, source, reason, "createdAt")
       VALUES ($1, $2, $3, $4, 'TASK_REWARD', 'TASK_REVIEW', 'سکهٔ تسک', $5)`,
      [randomUUID(), companyId, ids[key], key === 'a1' ? 99_999 : 50, inWeekAndMonth],
    )
  }

  // Lifetime counters: the sum of every ledger row, as the wallet requires.
  for (const key of Object.keys(phones)) {
    const rows = await query<{ total: number }>(
      `SELECT COALESCE(SUM(amount), 0)::int AS total FROM "XpTransaction" WHERE "userId" = $1`,
      [ids[key]],
    )
    await query(`UPDATE "UserProgress" SET xp = $1 WHERE "userId" = $2`, [rows[0]!.total, ids[key]])
  }

  for (const key of ['owner', 'mgrA', 'mgrB', 'mgrC', 'a1', 'a2', 'a3', 'b1', 'b2', 'c1']) {
    await login(key)
  }
})

afterAll(async () => {
  // Everything hangs off the company with ON DELETE CASCADE.
  if (companyId) await query(`DELETE FROM "Company" WHERE id = $1`, [companyId])
  await closeDb()
})

// ---------------------------------------------------------------------------
// Period boundaries
// ---------------------------------------------------------------------------

describe('period boundaries', () => {
  it('reports the window it ranked, in the company timezone', async () => {
    const week = await boardOf('a1', { period: 'week' })
    expect(week.period).toBe('week')
    expect(week.window.startsAt).toBe(thisWeek.startsAt.toISOString())
    expect(week.window.endsAt).toBe(thisWeek.endsAt.toISOString())
    expect(week.window.key).toMatch(/^week:\d{4}-\d{2}-\d{2}$/)
    expect(week.window.endsInDays).toBeGreaterThanOrEqual(0)

    const month = await boardOf('a1', { period: 'month' })
    expect(month.window.startsAt).toBe(thisMonth.startsAt.toISOString())
    expect(month.window.key).toMatch(/^month:\d{4}-\d{2}$/)
  })

  it('defaults to the weekly board', async () => {
    const body = await boardOf('a1')
    expect(body.period).toBe('week')
    expect(body.scope).toBe('company')
  })

  it('has no all-time period to ask for', async () => {
    const result = await board('a1', { period: 'all' })
    expect(result.status).toBe(422)
    expect(envelope(result).code).toBe('VALIDATION_FAILED')
  })

  it('ranks a different population per window', async () => {
    const week = await boardOf('a1', { period: 'week' })
    const month = await boardOf('a1', { period: 'month' })

    // b2 only scored last week: absent from the weekly board, present in the
    // monthly one whenever last week falls inside this month.
    expect(week.entries.map(entry => entry.user.id)).not.toContain(ids.b2)
    expect(week.participants).toBe(expectedRanking(thisWeek, activeUserIds()).length)
    expect(month.participants).toBe(expectedRanking(thisMonth, activeUserIds()).length)

    if (isInsideWindow(inLastWeek, thisMonth)) {
      expect(month.entries.map(entry => entry.user.id)).toContain(ids.b2)
      expect(month.participants).toBeGreaterThan(week.participants)
    }
    else {
      // The week straddles a month boundary: last week belongs to last month.
      expect(month.participants).toBe(week.participants)
    }
  })

  it('never counts activity from outside the window', async () => {
    const week = await boardOf('a1', { period: 'week' })
    const a1 = week.entries.find(entry => entry.user.id === ids.a1) ?? null

    // The 90-day-old 900 XP is part of a1's lifetime total, not of the week.
    expect(a1?.periodXp).toBe(400)
    expect(a1?.totalXp).toBe(1550)
    expect(week.entries.every(entry => entry.periodXp <= entry.totalXp)).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Ranking calculation
// ---------------------------------------------------------------------------

describe('ranking', () => {
  it('scores performance XP plus achievement progress, exactly as the shared maths does', async () => {
    const body = await boardOf('owner')
    const expected = expectedRanking(thisWeek, activeUserIds())

    expect(body.entries.map(entry => [entry.user.id, entry.rank, entry.score]))
      .toEqual(expected.slice(0, body.entries.length).map(entry => [entry.userId, entry.rank, entry.score]))
  })

  it('is not a coin ranking', async () => {
    const body = await boardOf('owner')
    const a1 = body.entries.find(entry => entry.user.id === ids.a1)!
    const b1 = body.entries.find(entry => entry.user.id === ids.b1)!

    // a1 holds 99,999 coins against b1's 0 — and still ranks below them.
    expect(b1.score).toBeGreaterThan(a1.score)
    expect(b1.rank).toBeLessThan(a1.rank)
    expect(a1.score).toBe(
      leaderboardScore({ performanceXp: 300, achievementXp: 100, achievementsUnlocked: 1 }),
    )
  })

  it('counts achievement progress on top of the XP it pays', async () => {
    const body = await boardOf('owner')
    const a1 = body.entries.find(entry => entry.user.id === ids.a1)!

    expect(a1.performanceXp).toBe(300)
    expect(a1.achievementXp).toBe(100)
    expect(a1.achievementsUnlocked).toBe(1)
    expect(a1.score).toBe(400 + LEADERBOARD_SCORING.achievementUnlockBonus)
    expect(a1.achievements.length).toBeGreaterThan(0)
    expect(a1.achievements[0]?.key).toBe('first_approved_task')
  })

  it('ignores reward redemptions: spending is not performance', async () => {
    const body = await boardOf('owner')
    const a3 = body.entries.find(entry => entry.user.id === ids.a3)!

    expect(a3.score).toBe(120)
    expect(a3.periodXp).toBe(120)
  })

  it('keeps the level and lifetime XP permanent while the board turns over', async () => {
    const body = await boardOf('owner')
    const a1 = body.entries.find(entry => entry.user.id === ids.a1)!

    // 1,550 lifetime XP sits on the third rung of the seeded ladder (1,200+).
    expect(a1.level).toBe(3)
    expect(a1.totalXp).toBe(1550)
    expect(a1.periodXp).toBe(400)
  })

  it('leaves suspended accounts off the board entirely', async () => {
    const body = await boardOf('owner')

    expect(body.entries.map(entry => entry.user.id)).not.toContain(ids.ghost)
    expect(body.participants).not.toBe(0)
    expect(JSON.stringify(body)).not.toContain(ids.ghost!)
  })

  it('serves the same ranking through the dashboard strip', async () => {
    const result = await clients.owner!.request<{
      leaderboard: { entries: Array<{ rank: number, score: number, user: { id: string } }> }
      gamification: { rank: number | null }
    }>('/api/dashboard/summary')

    expect(result.status).toBe(200)
    expect(result.body.leaderboard.entries.length).toBeLessThanOrEqual(3)
    const week = await boardOf('owner', { limit: '3' })
    expect(result.body.leaderboard.entries.map(entry => entry.user.id))
      .toEqual(week.entries.map(entry => entry.user.id))
  })
})

// ---------------------------------------------------------------------------
// Ties
// ---------------------------------------------------------------------------

describe('ties', () => {
  it('gives equal scores one shared rank and skips the next', async () => {
    const body = await boardOf('owner')
    const ranks = body.entries.map(entry => [entry.user.id, entry.rank, entry.tied] as const)

    const a1 = ranks.find(row => row[0] === ids.a1)!
    const a2 = ranks.find(row => row[0] === ids.a2)!
    const a3 = ranks.find(row => row[0] === ids.a3)!

    expect(a1[1]).toBe(a2[1])
    expect(a1[2]).toBe(true)
    expect(a2[2]).toBe(true)
    // b1 is alone on top, so the tie sits at rank 2 and the next score is 4.
    expect(a1[1]).toBe(2)
    expect(a3[1]).toBe(4)
  })

  it('orders a tie the same way on every request', async () => {
    const first = await boardOf('owner')
    const second = await boardOf('mgrA')
    const third = await boardOf('owner')

    const order = (body: LeaderboardResponse) => body.entries.map(entry => entry.user.id).join(',')
    expect(order(second)).toBe(order(first))
    expect(order(third)).toBe(order(first))
  })
})

// ---------------------------------------------------------------------------
// Privacy
// ---------------------------------------------------------------------------

describe('privacy', () => {
  it('shows the top few and never a full list', async () => {
    const body = await boardOf('owner')

    expect(body.maxEntries).toBe(MAX_LEADERBOARD_ENTRIES)
    expect(body.entries).toHaveLength(MAX_LEADERBOARD_ENTRIES)
    // Six people scored; the sixth is not exposed.
    expect(body.participants).toBe(6)
    expect(body.entries.map(entry => entry.user.id)).not.toContain(ids.mgrC)
    expect(JSON.stringify(body)).not.toContain(ids.mgrC!)
  })

  it('honours a smaller limit and refuses a bigger one', async () => {
    const podium = await boardOf('owner', { limit: '3' })
    expect(podium.entries).toHaveLength(3)
    expect(podium.entries.map(entry => entry.rank)).toEqual([1, 2, 2])

    expect((await board('owner', { limit: '50' })).status).toBe(422)
    expect((await board('owner', { limit: '2' })).status).toBe(422)
  })

  it('always tells the caller their own rank, even from outside the top five', async () => {
    const body = await boardOf('mgrC')

    expect(body.me.userId).toBe(ids.mgrC)
    expect(body.me.rank).toBe(6)
    expect(body.me.inEntries).toBe(false)
    expect(body.me.score).toBe(70)
    // The gap to the rank above carries no identity.
    expect(body.me.pointsToNextRank).toBe(10)
    expect(body.entries.map(entry => entry.user.id)).not.toContain(ids.mgrC)
  })

  it('invites rather than humiliates somebody who has not scored', async () => {
    const body = await boardOf('mgrA')

    expect(body.me.rank).toBeNull()
    expect(body.me.score).toBe(0)
    expect(body.me.inEntries).toBe(false)
    // The lowest scorer holds 70 points, so that is the distance onto the
    // board: a number with no name attached, never the list itself.
    expect(body.me.pointsToNextRank).toBe(70)
  })

  it('exposes no contact details on a board row', async () => {
    const body = await boardOf('owner')
    const serialised = JSON.stringify(body)

    expect(serialised).not.toContain(phones.a1!)
    expect(body.entries[0]?.user).not.toHaveProperty('phone')
    expect(body.entries[0]?.user).not.toHaveProperty('email')
  })
})

// ---------------------------------------------------------------------------
// Team boards
// ---------------------------------------------------------------------------

describe('team leaderboards', () => {
  it('opens on the caller\'s own team by default', async () => {
    const body = await boardOf('a1', { scope: 'team' })

    expect(body.scope).toBe('team')
    expect(body.team?.id).toBe(ids.alpha)
    expect(body.entries.map(entry => entry.user.id).sort())
      .toEqual([ids.a1, ids.a2, ids.a3].sort())
    // Inside تیم آلفا the tie is for first place.
    expect(body.entries.find(entry => entry.user.id === ids.a1)?.rank).toBe(1)
    expect(body.me.rank).toBe(1)
  })

  it('lets a manager see a subordinate team they are not in', async () => {
    const body = await boardOf('mgrA', { scope: 'team', teamId: ids.beta })

    expect(body.team?.id).toBe(ids.beta)
    expect(body.entries.map(entry => entry.user.id)).toEqual([ids.b1])
    expect(body.availableTeams.map(team => team.id).sort()).toEqual([ids.alpha, ids.beta].sort())
  })

  it('is empty rather than company-wide for somebody with no team', async () => {
    const body = await boardOf('owner', { scope: 'team' })

    expect(body.team).toBeNull()
    expect(body.entries).toHaveLength(0)
    expect(body.participants).toBe(0)
    expect(body.me.inScope).toBe(false)
    expect(body.me.rank).toBeNull()
  })

  it('lists every team for an owner, and only their own for an employee', async () => {
    const owner = await boardOf('owner', { scope: 'team' })
    expect(owner.availableTeams.map(team => team.id).sort())
      .toEqual([ids.alpha, ids.beta, ids.gamma].sort())

    const employee = await boardOf('a1', { scope: 'team' })
    expect(employee.availableTeams.map(team => team.id)).toEqual([ids.alpha])
    expect(employee.availableTeams[0]?.isMember).toBe(true)
  })

  it('refuses a team outside the caller\'s span of control', async () => {
    const manager = await board('mgrA', { scope: 'team', teamId: ids.gamma })
    expect(manager.status).toBe(403)
    expect(envelope(manager).code).toBe('FORBIDDEN')

    const employee = await board('a1', { scope: 'team', teamId: ids.beta })
    expect(employee.status).toBe(403)
  })

  it('lets an owner open any team board', async () => {
    const body = await boardOf('owner', { scope: 'team', teamId: ids.gamma })

    // گاما is c1 (80) and its lead mgrC (70) — a lead is a member and ranks too.
    expect(body.entries.map(entry => entry.user.id)).toEqual([ids.c1, ids.mgrC])
    expect(body.entries.map(entry => entry.rank)).toEqual([1, 2])
    // The owner is not a member of گاما, so the board says they are watching
    // rather than reporting a rank of their own.
    expect(body.me.inScope).toBe(false)
    expect(body.me.rank).toBeNull()
    expect(body.me.score).toBe(0)
  })

  it('treats another company\'s team as missing, not as forbidden', async () => {
    const foreign = await query<{ id: string }>(
      `SELECT id FROM "Team" WHERE "companyId" <> $1 LIMIT 1`,
      [companyId],
    )
    expect(foreign.length).toBeGreaterThan(0)

    const result = await board('owner', { scope: 'team', teamId: foreign[0]!.id })
    expect(result.status).toBe(404)
    expect(envelope(result).code).toBe('NOT_FOUND')
  })
})

// ---------------------------------------------------------------------------
// Company isolation
// ---------------------------------------------------------------------------

describe('company isolation', () => {
  it('keeps a seeded tenant out of this board', async () => {
    const body = await boardOf('owner')
    const foreignUsers = await query<{ id: string, fullName: string }>(
      `SELECT id, "fullName" FROM "User" WHERE "companyId" <> $1 AND status = 'ACTIVE'`,
      [companyId],
    )
    expect(foreignUsers.length).toBeGreaterThan(0)

    const serialised = JSON.stringify(body)
    for (const user of foreignUsers) {
      expect(serialised).not.toContain(user.id)
      expect(serialised).not.toContain(user.fullName)
    }
  })

  it('keeps this board out of a seeded tenant', async () => {
    const seededOwner = new ApiClient()
    const code = await requestCode(seededOwner, '+989120000001')
    const signIn = await seededOwner.request('/api/auth/otp/verify', {
      method: 'POST',
      body: { phone: '+989120000001', code },
    })
    expect(signIn.status).toBe(200)

    const result = await seededOwner.request<LeaderboardResponse>('/api/leaderboard')
    expect(result.status).toBe(200)

    const serialised = JSON.stringify(result.body)
    expect(serialised).not.toContain(companyId)
    for (const key of Object.keys(phones)) {
      expect(serialised).not.toContain(ids[key]!)
      expect(serialised).not.toContain(phones[key]!)
    }
    // The seeded tenant's own board still works, and is capped the same way.
    expect(result.body.entries.length).toBeLessThanOrEqual(MAX_LEADERBOARD_ENTRIES)
  })
})

// ---------------------------------------------------------------------------
// Permissions
// ---------------------------------------------------------------------------

describe('permissions', () => {
  it('requires a session', async () => {
    const anonymous = new ApiClient()
    expect((await anonymous.request('/api/leaderboard')).status).toBe(401)
    expect((await anonymous.request('/api/leaderboard/progress')).status).toBe(401)
  })

  it('lets every role read a board', async () => {
    for (const key of ['owner', 'mgrA', 'mgrB', 'a1', 'a3', 'c1']) {
      const result = await board(key)
      expect(result.status, `${key} should read the board`).toBe(200)
    }
  })

  it('rejects a malformed team id', async () => {
    const result = await board('owner', { scope: 'team', teamId: 'not-a-uuid' })
    expect(result.status).toBe(422)
    expect(envelope(result).code).toBe('VALIDATION_FAILED')
  })
})

// ---------------------------------------------------------------------------
// Personal progress
// ---------------------------------------------------------------------------

describe('personal progress', () => {
  async function progressOf(key: string): Promise<PersonalProgressResponse> {
    const result = await clients[key]!.request<PersonalProgressResponse>('/api/leaderboard/progress')
    expect(result.status, JSON.stringify(result.body)).toBe(200)
    return result.body
  }

  it('keeps lifetime XP, coins, level and achievements out of the reset', async () => {
    const body = await progressOf('a1')

    expect(body.lifetime.xp).toBe(1550)
    expect(body.lifetime.coins).toBe(99_999)
    expect(body.lifetime.level).toBe(3)
    expect(body.lifetime.achievementsUnlocked).toBe(2)
    expect(body.lifetime.achievementsTotal).toBe(2)
  })

  it('compares this week with last week', async () => {
    const body = await progressOf('a1')

    const weekBoard = await boardOf('a1', { period: 'week' })
    expect(body.week.window.key).toBe(weekBoard.window.key)
    expect(body.week.current.score).toBe(
      leaderboardScore({ performanceXp: 300, achievementXp: 100, achievementsUnlocked: 1 }),
    )
    expect(body.week.previous.score).toBe(250)
    expect(body.week.delta.score).toBe(body.week.current.score - 250)
    expect(body.week.delta.direction).toBe('up')
    expect(body.week.previousWindow.endsAt).toBe(body.week.window.startsAt)
  })

  it('reports the caller\'s rank in the company and in their team', async () => {
    const body = await progressOf('a1')

    expect(body.week.rank.company).toBe(2)
    expect(body.week.rank.team).toBe(1)
    expect(body.week.rank.participants).toBe(6)
    expect(body.team?.id).toBe(ids.alpha)
  })

  it('draws a series of past windows, ending with the current one', async () => {
    const body = await progressOf('a1')

    expect(body.week.series.length).toBe(8)
    expect(body.month.series.length).toBe(6)
    expect(body.week.series.at(-1)?.key).toBe(body.week.window.key)
    expect(body.week.series.at(-1)?.score).toBe(body.week.current.score)
    expect(body.week.series[0]?.score).toBe(0)
  })

  it('answers only about the caller', async () => {
    const body = await progressOf('a1')
    const serialised = JSON.stringify(body)

    for (const key of ['owner', 'mgrA', 'mgrB', 'mgrC', 'a2', 'a3', 'b1', 'b2', 'c1', 'ghost']) {
      expect(serialised, `${key} must not appear in a1's progress`).not.toContain(ids[key]!)
    }
    expect(serialised).not.toContain('کارمند دوم آلفا')
  })

  it('is honest for somebody with no activity at all', async () => {
    const body = await progressOf('owner')

    expect(body.lifetime.xp).toBe(0)
    expect(body.week.current.score).toBe(0)
    expect(body.week.rank.company).toBeNull()
    expect(body.week.rank.team).toBeNull()
    expect(body.week.movement).toBeNull()
    expect(body.week.series.every(bucket => bucket.score === 0)).toBe(true)
  })

  it('caps the requested history', async () => {
    const result = await clients.a1!.request<PersonalProgressResponse>('/api/leaderboard/progress', {
      query: { weeks: '2', months: '3' },
    })
    expect(result.status).toBe(200)
    expect(result.body.week.series).toHaveLength(2)
    expect(result.body.month.series).toHaveLength(3)

    // A longer history is refused by the schema rather than quietly served.
    expect((await clients.a1!.request('/api/leaderboard/progress', { query: { months: '500' } })).status).toBe(422)
  })
})
