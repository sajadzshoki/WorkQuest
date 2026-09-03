import { describe, expect, it } from 'vitest'

import { ACHIEVEMENT_METRICS, evaluateAchievement } from '#shared/utils/achievements'
import {
  STREAK_MILESTONES,
  advanceStreak,
  dayKey,
  nextStreakMilestone,
  streakMilestones,
  type StreakState,
} from '#shared/utils/streak'

/**
 * The streak and achievement rules are pure and the easiest part of the
 * gamification layer to prove exhaustively, so they are covered here rather
 * than behind a database. The level maths already live in `test/xp.test.ts`.
 */

const DAY = 86_400_000
/** 2026-09-01 12:00 UTC — a fixed, DST-free reference. */
const T0 = new Date('2026-09-01T12:00:00.000Z')
const TEHRAN = 'Asia/Tehran'

function at(daysAgo: number, hour = 12): Date {
  return new Date(T0.getTime() - daysAgo * DAY + (hour - 12) * 3_600_000)
}

function fresh(overrides: Partial<StreakState> = {}): StreakState {
  return { current: 0, longest: 0, lastActiveDate: null, ...overrides }
}

describe('streak — advanceStreak', () => {
  it('starts a streak at 1 on the first activity', () => {
    const result = advanceStreak(fresh(), T0, TEHRAN)
    expect(result).toMatchObject({ current: 1, longest: 1, changed: true, broken: false })
    expect(result.lastActiveDate).toBe(dayKey(T0, TEHRAN))
  })

  it('extends by one when the activity is the next consecutive day', () => {
    const yesterday = dayKey(at(1), TEHRAN)
    const state = fresh({ current: 4, longest: 6, lastActiveDate: yesterday })

    const result = advanceStreak(state, T0, TEHRAN)
    expect(result).toMatchObject({ current: 5, longest: 6, changed: true, broken: false })
  })

  it('does not count the same calendar day twice (idempotent)', () => {
    const today = dayKey(T0, TEHRAN)
    const state = fresh({ current: 3, longest: 3, lastActiveDate: today })

    const result = advanceStreak(state, new Date(T0.getTime() + 6 * 3_600_000), TEHRAN)
    expect(result).toMatchObject({ current: 3, longest: 3, changed: false, broken: false })
  })

  it('resets to 1 after a gap and flags the break', () => {
    const threeDaysAgo = dayKey(at(3), TEHRAN)
    const state = fresh({ current: 9, longest: 9, lastActiveDate: threeDaysAgo })

    const result = advanceStreak(state, T0, TEHRAN)
    expect(result).toMatchObject({ current: 1, longest: 9, changed: true, broken: true })
  })

  it('never lowers the longest (high-water mark)', () => {
    const yesterday = dayKey(at(1), TEHRAN)
    const result = advanceStreak(fresh({ current: 2, longest: 5, lastActiveDate: yesterday }), T0, TEHRAN)
    expect(result.longest).toBe(5)

    const tied = advanceStreak(fresh({ current: 5, longest: 5, lastActiveDate: yesterday }), T0, TEHRAN)
    expect(tied.longest).toBe(6)
  })
})

describe('streak — dayKey is timezone-aware', () => {
  it('formats as YYYY-MM-DD', () => {
    expect(dayKey(T0, 'UTC')).toBe('2026-09-01')
  })

  it('places the same instant on different calendar days in different zones', () => {
    // 2026-09-01 20:30 UTC is already 2026-09-02 in Tehran (+03:30).
    const late = new Date('2026-09-01T20:30:00.000Z')
    expect(dayKey(late, 'UTC')).toBe('2026-09-01')
    expect(dayKey(late, 'Asia/Tehran')).toBe('2026-09-02')
  })
})

describe('streak — milestones', () => {
  it('exposes 7/14/30 as the celebrated milestones', () => {
    expect([...STREAK_MILESTONES]).toEqual([7, 14, 30])
  })

  it('finds the next milestone strictly above the current run', () => {
    expect(nextStreakMilestone(0)).toBe(7)
    expect(nextStreakMilestone(7)).toBe(14)
    expect(nextStreakMilestone(13)).toBe(14)
    expect(nextStreakMilestone(30)).toBeNull()
    expect(nextStreakMilestone(99)).toBeNull()
  })

  it('flags each marker against the current run', () => {
    expect(streakMilestones(0)).toEqual([
      { days: 7, reached: false },
      { days: 14, reached: false },
      { days: 30, reached: false },
    ])
    expect(streakMilestones(7)).toEqual([
      { days: 7, reached: true },
      { days: 14, reached: false },
      { days: 30, reached: false },
    ])
    expect(streakMilestones(30)).toEqual([
      { days: 7, reached: true },
      { days: 14, reached: true },
      { days: 30, reached: true },
    ])
  })
})

describe('achievements — evaluateAchievement', () => {
  const metrics = {
    tasks_approved: 3,
    revisions_overcome: 1,
    recognitions_received: 0,
    streak_days: 2,
    level: 4,
    total_xp: 1_700,
  }

  it('unlocks when the metric reaches the threshold', () => {
    expect(evaluateAchievement({ metric: 'tasks_approved', threshold: 3 }, metrics)).toBe(true)
    expect(evaluateAchievement({ metric: 'total_xp', threshold: 1_500 }, metrics)).toBe(true)
  })

  it('stays locked below the threshold', () => {
    expect(evaluateAchievement({ metric: 'tasks_approved', threshold: 4 }, metrics)).toBe(false)
  })

  it('uses >= so overshooting the threshold between evaluations still unlocks', () => {
    expect(evaluateAchievement({ metric: 'tasks_approved', threshold: 1 }, metrics)).toBe(true)
  })

  it('rejects malformed criteria instead of throwing', () => {
    expect(evaluateAchievement(null, metrics)).toBe(false)
    expect(evaluateAchievement(undefined, metrics)).toBe(false)
    expect(evaluateAchievement([{ metric: 'level', threshold: 1 }], metrics)).toBe(false)
    expect(evaluateAchievement('level', metrics)).toBe(false)
    expect(evaluateAchievement({ metric: 'level' }, metrics)).toBe(false)
    expect(evaluateAchievement({ threshold: 1 }, metrics)).toBe(false)
    expect(evaluateAchievement({ metric: 'level', threshold: Number.NaN }, metrics)).toBe(false)
    expect(evaluateAchievement({ metric: 'level', threshold: Infinity }, metrics)).toBe(false)
  })

  it('never unlocks against a metric the server did not compute', () => {
    expect(evaluateAchievement({ metric: 'fast_reviews', threshold: 1 }, metrics)).toBe(false)
  })

  it('documents the exact metric vocabulary the server computes', () => {
    expect(ACHIEVEMENT_METRICS).toEqual([
      'tasks_approved',
      'revisions_overcome',
      'recognitions_received',
      'streak_days',
      'level',
      'total_xp',
    ])
  })
})
