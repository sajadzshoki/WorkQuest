import { describe, expect, it } from 'vitest'

import {
  activitySeries,
  aggregateParticipants,
  canViewTeamLeaderboard,
  clampLeaderboardLimit,
  compareParticipants,
  defaultTeamId,
  deltaDirection,
  LEADERBOARD_SCORING,
  leaderboardScore,
  MAX_LEADERBOARD_ENTRIES,
  PERIOD_CADENCE,
  pointsToNextRank,
  rankParticipants,
  selectBoard,
  viewableTeamIds,
  type LeaderboardUnlockEvent,
  type LeaderboardXpEvent,
  type ParticipantActivity,
} from '#shared/utils/leaderboard'
import {
  calendarWindow,
  calendarWindowKey,
  daysUntil,
  isInsideWindow,
  previousCalendarWindow,
} from '#shared/utils/period'

/**
 * Leaderboard rules, without a database.
 *
 * Four things are worth proving in isolation, because each one is a promise the
 * product makes:
 *
 *  1. **Period boundaries** — a week and a month are wall-clock windows in the
 *     company timezone, half-open, DST-safe, and "the previous one" is derived
 *     rather than subtracted;
 *  2. **Ranking** — performance XP plus achievement progress, never coins;
 *  3. **Ties** — equal scores share a rank, and the ordering inside a tie is
 *     total, so a rank can never flicker between two requests;
 *  4. **Privacy** — the projection helpers cannot produce a full ranking.
 *
 * Company isolation and permissions over HTTP are covered by
 * `test/integration/leaderboard.integration.test.ts`.
 */

const TEHRAN = 'Asia/Tehran'
const NEW_YORK = 'America/New_York'

const xp = (
  userId: string,
  amount: number,
  source: string,
  createdAt: string,
): LeaderboardXpEvent => ({ userId, amount, source, createdAt })

const unlock = (
  userId: string,
  unlockedAt: string,
  key = 'first_approved_task',
): LeaderboardUnlockEvent => ({ userId, unlockedAt, key, title: key, iconKey: 'i-heroicons-star' })

const activity = (userId: string, overrides: Partial<ParticipantActivity> = {}): ParticipantActivity => ({
  userId,
  performanceXp: 0,
  achievementXp: 0,
  achievementsUnlocked: 0,
  periodXp: 0,
  score: 0,
  achievements: [],
  reachedScoreAt: null,
  firstActivityAt: null,
  ...overrides,
})

// ---------------------------------------------------------------------------
// 1. Period boundaries
// ---------------------------------------------------------------------------

describe('period boundaries — weekly', () => {
  it('runs Monday 00:00 to the next Monday in the company timezone', () => {
    // 2026-09-02 is a Wednesday; its Monday is 2026-08-31, whose midnight in
    // Tehran (UTC+3:30) is 2026-08-30T20:30Z.
    const window = calendarWindow('WEEKLY', new Date('2026-09-02T12:00:00.000Z'), TEHRAN)
    expect(window.startsAt.toISOString()).toBe('2026-08-30T20:30:00.000Z')
    expect(window.endsAt.toISOString()).toBe('2026-09-06T20:30:00.000Z')
  })

  it('puts a Monday reference in the week that just started', () => {
    const window = calendarWindow('WEEKLY', new Date('2026-09-07T00:00:00.000Z'), TEHRAN)
    // 2026-09-07T00:00Z is 03:30 Monday in Tehran.
    expect(window.startsAt.toISOString()).toBe('2026-09-06T20:30:00.000Z')
    expect(window.endsAt.toISOString()).toBe('2026-09-13T20:30:00.000Z')
  })

  it('is half-open: the boundary instant belongs to the next period', () => {
    const current = calendarWindow('WEEKLY', new Date('2026-09-02T12:00:00.000Z'), TEHRAN)
    const next = calendarWindow('WEEKLY', current.endsAt, TEHRAN)

    expect(isInsideWindow(current.endsAt, current)).toBe(false)
    expect(isInsideWindow(current.endsAt, next)).toBe(true)
    expect(isInsideWindow(current.startsAt, current)).toBe(true)
    // The two windows touch and never overlap.
    expect(next.startsAt.getTime()).toBe(current.endsAt.getTime())
  })

  it('agrees with the leaderboard period names', () => {
    expect(PERIOD_CADENCE.week).toBe('WEEKLY')
    expect(PERIOD_CADENCE.month).toBe('MONTHLY')
  })

  it('steps back exactly one week', () => {
    const reference = new Date('2026-09-02T12:00:00.000Z')
    const current = calendarWindow('WEEKLY', reference, TEHRAN)
    const previous = previousCalendarWindow('WEEKLY', reference, TEHRAN)

    expect(previous.endsAt.getTime()).toBe(current.startsAt.getTime())
    expect(previous.endsAt.getTime() - previous.startsAt.getTime()).toBe(7 * 86_400_000)
  })
})

describe('period boundaries — monthly', () => {
  it('runs from the 1st to the 1st of the next month', () => {
    const window = calendarWindow('MONTHLY', new Date('2026-09-15T12:00:00.000Z'), TEHRAN)
    expect(window.startsAt.toISOString()).toBe('2026-08-31T20:30:00.000Z')
    expect(window.endsAt.toISOString()).toBe('2026-09-30T20:30:00.000Z')
  })

  it('steps back over months of different lengths', () => {
    const march = calendarWindow('MONTHLY', new Date('2026-03-15T12:00:00.000Z'), TEHRAN)
    const february = previousCalendarWindow('MONTHLY', new Date('2026-03-15T12:00:00.000Z'), TEHRAN)

    expect(february.endsAt.getTime()).toBe(march.startsAt.getTime())
    // 2026 is not a leap year: February has 28 days, in Tehran wall-clock.
    expect(calendarWindowKey('MONTHLY', february, TEHRAN)).toBe('month:2026-02')
    expect(february.endsAt.getTime() - february.startsAt.getTime()).toBe(28 * 86_400_000)
  })

  it('handles a year boundary', () => {
    const window = calendarWindow('MONTHLY', new Date('2026-01-05T12:00:00.000Z'), TEHRAN)
    const previous = previousCalendarWindow('MONTHLY', new Date('2026-01-05T12:00:00.000Z'), TEHRAN)

    expect(calendarWindowKey('MONTHLY', window, TEHRAN)).toBe('month:2026-01')
    expect(calendarWindowKey('MONTHLY', previous, TEHRAN)).toBe('month:2025-12')
    expect(previous.endsAt.getTime()).toBe(window.startsAt.getTime())
  })
})

describe('period boundaries — timezones and DST', () => {
  it('can place the same instant in different weeks', () => {
    // Late Sunday in UTC is already Monday morning in Tehran.
    const instant = new Date('2026-09-06T22:00:00.000Z')

    expect(calendarWindow('WEEKLY', instant, TEHRAN).startsAt.toISOString()).toBe('2026-09-06T20:30:00.000Z')
    expect(calendarWindow('WEEKLY', instant, 'UTC').startsAt.toISOString()).toBe('2026-08-31T00:00:00.000Z')
  })

  it('stretches a weekly window across a DST fall-back', () => {
    // US daylight saving ends on 2026-11-01 at 02:00 local.
    const window = calendarWindow('WEEKLY', new Date('2026-10-30T12:00:00.000Z'), NEW_YORK)

    // Monday 2026-10-26 00:00 EDT = 04:00Z; Monday 2026-11-02 00:00 EST = 05:00Z.
    expect(window.startsAt.toISOString()).toBe('2026-10-26T04:00:00.000Z')
    expect(window.endsAt.toISOString()).toBe('2026-11-02T05:00:00.000Z')
    // Seven wall-clock days is 169 real hours across the transition.
    expect(window.endsAt.getTime() - window.startsAt.getTime()).toBe(7 * 86_400_000 + 3_600_000)
  })

  it('keys a window by its wall-clock start in the company timezone', () => {
    const week = calendarWindow('WEEKLY', new Date('2026-09-02T12:00:00.000Z'), TEHRAN)
    const month = calendarWindow('MONTHLY', new Date('2026-09-02T12:00:00.000Z'), TEHRAN)

    expect(calendarWindowKey('WEEKLY', week, TEHRAN)).toBe('week:2026-08-31')
    expect(calendarWindowKey('MONTHLY', month, TEHRAN)).toBe('month:2026-09')
    // The same instant, one timezone west, is still Sunday: a different week key.
    expect(calendarWindowKey('WEEKLY', calendarWindow('WEEKLY', new Date('2026-09-06T22:00:00.000Z'), 'UTC'), 'UTC'))
      .toBe('week:2026-08-31')
  })

  it('counts the days left in a window', () => {
    const window = calendarWindow('WEEKLY', new Date('2026-09-02T12:00:00.000Z'), TEHRAN)
    // Wednesday noon in Tehran to Sunday 20:30Z is four and a bit days, rounded up.
    expect(daysUntil(window.endsAt, new Date('2026-09-02T12:00:00.000Z'))).toBe(5)
    expect(daysUntil(window.endsAt, window.endsAt)).toBe(0)
    expect(daysUntil(window.endsAt, new Date(window.endsAt.getTime() + 86_400_000))).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// 2. Ranking calculation
// ---------------------------------------------------------------------------

describe('the score', () => {
  it('is performance XP plus achievement XP plus a bonus per unlock', () => {
    expect(leaderboardScore({ performanceXp: 300, achievementXp: 100, achievementsUnlocked: 2 }))
      .toBe(300 + 100 + 2 * LEADERBOARD_SCORING.achievementUnlockBonus)
  })

  it('takes no coin input at all', () => {
    // The formula has three terms and none of them is a balance: a person who
    // earned 1,000 coins and spent them ranks exactly as they earned.
    const spender = leaderboardScore({ performanceXp: 500, achievementXp: 0, achievementsUnlocked: 0 })
    const saver = leaderboardScore({ performanceXp: 500, achievementXp: 0, achievementsUnlocked: 0 })
    expect(spender).toBe(saver)
  })

  it('never goes negative, so a correction cannot shame anybody', () => {
    expect(leaderboardScore({ performanceXp: -400, achievementXp: 0, achievementsUnlocked: 0 })).toBe(0)
  })

  it('ranks achievement progress above the XP it happens to pay', () => {
    // Same XP, one unlock: the unlock is worth its bonus on top.
    const without = leaderboardScore({ performanceXp: 200, achievementXp: 0, achievementsUnlocked: 0 })
    const withUnlock = leaderboardScore({ performanceXp: 200, achievementXp: 0, achievementsUnlocked: 1 })
    expect(withUnlock - without).toBe(LEADERBOARD_SCORING.achievementUnlockBonus)
  })
})

describe('aggregateParticipants', () => {
  it('sums the window per person and keeps the two XP buckets apart', () => {
    const [row] = aggregateParticipants([
      xp('a', 120, 'TASK_REVIEW', '2026-09-01T08:00:00.000Z'),
      xp('a', 30, 'STREAK', '2026-09-02T08:00:00.000Z'),
      xp('a', 50, 'ACHIEVEMENT', '2026-09-02T09:00:00.000Z'),
      xp('b', 10, 'RECOGNITION', '2026-09-02T09:00:00.000Z'),
    ], [unlock('a', '2026-09-02T09:00:00.000Z')])

    expect(row?.performanceXp).toBe(150)
    expect(row?.achievementXp).toBe(50)
    expect(row?.periodXp).toBe(200)
    expect(row?.achievementsUnlocked).toBe(1)
    expect(row?.score).toBe(200 + LEADERBOARD_SCORING.achievementUnlockBonus)
  })

  it('drops reward redemptions: spending is not performance', () => {
    const rows = aggregateParticipants([
      xp('a', 500, 'REWARD_REDEMPTION', '2026-09-01T08:00:00.000Z'),
    ])
    expect(rows).toHaveLength(0)

    const mixed = aggregateParticipants([
      xp('b', 500, 'REWARD_REDEMPTION', '2026-09-01T08:00:00.000Z'),
      xp('b', 100, 'TASK_REVIEW', '2026-09-01T09:00:00.000Z'),
    ])
    expect(mixed[0]?.periodXp).toBe(100)
    expect(mixed[0]?.score).toBe(100)
  })

  it('records when the final score was reached — the tie-breaker', () => {
    const [row] = aggregateParticipants([
      xp('a', 100, 'TASK_REVIEW', '2026-09-01T08:00:00.000Z'),
      xp('a', 50, 'TASK_REVIEW', '2026-09-03T08:00:00.000Z'),
    ], [unlock('a', '2026-09-02T08:00:00.000Z')])

    // 100 (Mon) + 50 bonus (Tue) + 50 (Thu) = 200, completed on Thursday.
    expect(row?.score).toBe(200)
    expect(row?.reachedScoreAt).toBe(new Date('2026-09-03T08:00:00.000Z').getTime())
    expect(row?.firstActivityAt).toBe(new Date('2026-09-01T08:00:00.000Z').getTime())
  })

  it('leaves reachedScoreAt null when nothing was scored', () => {
    const [row] = aggregateParticipants([xp('a', 0, 'TASK_REVIEW', '2026-09-01T08:00:00.000Z')])
    expect(row?.score).toBe(0)
    expect(row?.reachedScoreAt).toBeNull()
  })

  it('keeps achievement indicators chronologically', () => {
    const [row] = aggregateParticipants([], [
      unlock('a', '2026-09-03T08:00:00.000Z', 'second'),
      unlock('a', '2026-09-01T08:00:00.000Z', 'first'),
    ])
    expect(row?.achievements.map(entry => entry.key)).toEqual(['first', 'second'])
  })
})

describe('rankParticipants', () => {
  it('orders by score, highest first', () => {
    const ranked = rankParticipants([
      activity('a', { score: 100 }),
      activity('b', { score: 900 }),
      activity('c', { score: 400 }),
    ])
    expect(ranked.map(entry => [entry.userId, entry.rank])).toEqual([['b', 1], ['c', 2], ['a', 3]])
  })

  it('leaves zero scores off the board by default', () => {
    const ranked = rankParticipants([
      activity('a', { score: 100 }),
      activity('b', { score: 0 }),
    ])
    expect(ranked.map(entry => entry.userId)).toEqual(['a'])

    const inclusive = rankParticipants(
      [activity('a', { score: 100 }), activity('b', { score: 0 })],
      { includeZeroScores: true },
    )
    expect(inclusive.map(entry => entry.userId)).toEqual(['a', 'b'])
  })

  it('ranks the whole population, not only the visible rows', () => {
    const participants = Array.from({ length: 12 }, (_, index) => activity(`u${index}`, { score: (index + 1) * 10 }))
    const ranked = rankParticipants(participants)

    expect(ranked).toHaveLength(12)
    expect(ranked[0]?.rank).toBe(1)
    expect(ranked[11]?.rank).toBe(12)
    // The privacy cap is applied to the projection, never to the ranking.
    expect(selectBoard(ranked, MAX_LEADERBOARD_ENTRIES)).toHaveLength(MAX_LEADERBOARD_ENTRIES)
  })
})

// ---------------------------------------------------------------------------
// 3. Ties
// ---------------------------------------------------------------------------

describe('ties', () => {
  it('gives equal scores the same rank and skips the next one', () => {
    const ranked = rankParticipants([
      activity('a', { score: 500 }),
      activity('b', { score: 500 }),
      activity('c', { score: 300 }),
    ])

    expect(ranked.map(entry => entry.rank)).toEqual([1, 1, 3])
    expect(ranked[0]?.tied).toBe(true)
    expect(ranked[1]?.tied).toBe(true)
    expect(ranked[2]?.tied).toBe(false)
  })

  it('breaks a display tie by achievement progress first', () => {
    const ranked = rankParticipants([
      activity('volume', { score: 500, achievementsUnlocked: 0 }),
      activity('mastery', { score: 500, achievementsUnlocked: 2 }),
    ])

    expect(ranked[0]?.userId).toBe('mastery')
    // Same rank — the tie-break decides order, not standing.
    expect(ranked.map(entry => entry.rank)).toEqual([1, 1])
  })

  it('then by whoever reached the score first', () => {
    const ranked = rankParticipants([
      activity('late', { score: 500, achievementsUnlocked: 1, reachedScoreAt: 2_000 }),
      activity('early', { score: 500, achievementsUnlocked: 1, reachedScoreAt: 1_000 }),
    ])
    expect(ranked.map(entry => entry.userId)).toEqual(['early', 'late'])
  })

  it('falls back to the user id so the order is total', () => {
    const ranked = rankParticipants([
      activity('bbb', { score: 500 }),
      activity('aaa', { score: 500 }),
    ])
    expect(ranked.map(entry => entry.userId)).toEqual(['aaa', 'bbb'])
  })

  it('is stable: the same input always produces the same board', () => {
    const participants = [
      activity('c', { score: 200, achievementsUnlocked: 1, reachedScoreAt: 5 }),
      activity('a', { score: 200, achievementsUnlocked: 1, reachedScoreAt: 5 }),
      activity('b', { score: 900 }),
    ]

    const first = rankParticipants(participants).map(entry => `${entry.rank}:${entry.userId}`)
    const second = rankParticipants([...participants].reverse()).map(entry => `${entry.rank}:${entry.userId}`)
    const third = rankParticipants(participants).map(entry => `${entry.rank}:${entry.userId}`)

    expect(first).toEqual(second)
    expect(second).toEqual(third)
    expect(compareParticipants(participants[0]!, participants[0]!)).toBe(0)
  })

  it('reports the same rank for a score queried on its own', () => {
    const scores = [900, 500, 500, 100]
    expect(pointsToNextRank(500, scores)).toBe(400)
    expect(pointsToNextRank(900, scores)).toBeNull()
    // Somebody who has not scored yet sees the distance onto the board.
    expect(pointsToNextRank(0, scores)).toBe(100)
    expect(pointsToNextRank(100, [])).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// 4. Privacy
// ---------------------------------------------------------------------------

describe('the privacy cap', () => {
  const ranked = rankParticipants(
    Array.from({ length: 40 }, (_, index) => activity(`u${index}`, { score: (index + 1) * 10 })),
  )

  it('never returns more than the ceiling', () => {
    expect(selectBoard(ranked, 5)).toHaveLength(MAX_LEADERBOARD_ENTRIES)
    expect(selectBoard(ranked, 50)).toHaveLength(MAX_LEADERBOARD_ENTRIES)
    expect(selectBoard(ranked, 3)).toHaveLength(3)
  })

  it('clamps nonsense limits into the allowed range', () => {
    expect(clampLeaderboardLimit(0)).toBe(1)
    expect(clampLeaderboardLimit(3)).toBe(3)
    expect(clampLeaderboardLimit(99)).toBe(MAX_LEADERBOARD_ENTRIES)
    expect(clampLeaderboardLimit(Number.NaN)).toBe(MAX_LEADERBOARD_ENTRIES)
  })

  it('shows the top of the board, not the bottom', () => {
    expect(selectBoard(ranked, 3).map(entry => entry.rank)).toEqual([1, 2, 3])
  })
})

// ---------------------------------------------------------------------------
// 5. Personal progress series
// ---------------------------------------------------------------------------

describe('activitySeries', () => {
  const windows = [0, 1, 2].map((offset) => {
    const startsAt = new Date(Date.UTC(2026, 7, 31 + offset * 7))
    const endsAt = new Date(startsAt.getTime() + 7 * 86_400_000)
    return { key: `week:${offset}`, startsAt, endsAt }
  })

  it('buckets activity into consecutive windows and keeps empty ones visible', () => {
    const series = activitySeries(windows, [
      xp('a', 100, 'TASK_REVIEW', '2026-09-01T08:00:00.000Z'),
      xp('a', 250, 'TASK_REVIEW', '2026-09-14T08:00:00.000Z'),
    ], [unlock('a', '2026-09-15T08:00:00.000Z')])

    expect(series.map(bucket => bucket.score)).toEqual([
      100,
      0,
      250 + LEADERBOARD_SCORING.achievementUnlockBonus,
    ])
    expect(series[1]?.achievementsUnlocked).toBe(0)
    expect(series.map(bucket => bucket.key)).toEqual(['week:0', 'week:1', 'week:2'])
  })

  it('counts an event exactly on a boundary in the later window', () => {
    const series = activitySeries(windows, [xp('a', 100, 'TASK_REVIEW', windows[1]!.startsAt.toISOString())])
    expect(series.map(bucket => bucket.score)).toEqual([0, 100, 0])
  })

  it('ignores activity outside the drawn range', () => {
    const series = activitySeries(windows, [xp('a', 900, 'TASK_REVIEW', '2026-01-01T08:00:00.000Z')])
    expect(series.every(bucket => bucket.score === 0)).toBe(true)
  })

  it('names a direction for a period-over-period change', () => {
    expect(deltaDirection(300, 100)).toBe('up')
    expect(deltaDirection(100, 300)).toBe('down')
    expect(deltaDirection(100, 100)).toBe('flat')
  })
})

// ---------------------------------------------------------------------------
// 6. Team board permissions
// ---------------------------------------------------------------------------

describe('team board access', () => {
  const allTeams = ['t-product', 't-engineering', 't-sales', 't-support']
  const managerAccess = {
    ledTeamIds: ['t-engineering'],
    memberTeamIds: ['t-engineering'],
    subordinateTeamIds: ['t-support'],
  }
  const employeeAccess = {
    ledTeamIds: [],
    memberTeamIds: ['t-product'],
    subordinateTeamIds: [],
  }

  it('lets an OWNER or ADMIN open any team board', () => {
    for (const role of ['OWNER', 'ADMIN'] as const) {
      const subject = { userId: 'u-owner', role }
      for (const teamId of allTeams) {
        expect(canViewTeamLeaderboard(subject, teamId, { ledTeamIds: [], memberTeamIds: [], subordinateTeamIds: [] })).toBe(true)
      }
      expect(viewableTeamIds(subject, { ledTeamIds: [], memberTeamIds: [], subordinateTeamIds: [] }, allTeams)).toEqual(allTeams)
    }
  })

  it('lets a MANAGER open the teams they lead, sit in, or have reports in', () => {
    const subject = { userId: 'u-manager', role: 'MANAGER' as const }

    expect(canViewTeamLeaderboard(subject, 't-engineering', managerAccess)).toBe(true)
    expect(canViewTeamLeaderboard(subject, 't-support', managerAccess)).toBe(true)
    expect(canViewTeamLeaderboard(subject, 't-sales', managerAccess)).toBe(false)
    // t-product and t-sales hold none of their reports: out of reach.
    expect(viewableTeamIds(subject, managerAccess, allTeams)).toEqual(['t-engineering', 't-support'])
  })

  it('limits an EMPLOYEE to their own team', () => {
    const subject = { userId: 'u-employee', role: 'EMPLOYEE' as const }

    expect(canViewTeamLeaderboard(subject, 't-product', employeeAccess)).toBe(true)
    expect(canViewTeamLeaderboard(subject, 't-sales', employeeAccess)).toBe(false)
    // A subordinate-team edge never exists for an employee, and is refused even
    // if one were passed in by a caller who built the set themselves.
    expect(canViewTeamLeaderboard(subject, 't-support', { ...employeeAccess, subordinateTeamIds: ['t-support'] })).toBe(false)
    expect(viewableTeamIds(subject, employeeAccess, allTeams)).toEqual(['t-product'])
  })

  it('opens on the caller\'s own team when none was requested', () => {
    expect(defaultTeamId(employeeAccess)).toBe('t-product')
    expect(defaultTeamId({ ledTeamIds: ['t-sales'], memberTeamIds: [], subordinateTeamIds: [] })).toBe('t-sales')
    expect(defaultTeamId({ ledTeamIds: [], memberTeamIds: [], subordinateTeamIds: [] })).toBeNull()
  })

  it('keeps the viewable list in the company\'s own order', () => {
    const subject = { userId: 'u-manager', role: 'MANAGER' as const }
    expect(viewableTeamIds(subject, managerAccess, ['t-support', 't-sales', 't-engineering']))
      .toEqual(['t-support', 't-engineering'])
  })
})
