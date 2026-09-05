import { describe, expect, it } from 'vitest'

import {
  CHALLENGE_GOAL_KEYS,
  CHALLENGE_GOALS,
  CHALLENGE_PRESETS,
  CHALLENGE_STATUSES,
  CHALLENGE_TYPES,
  GOAL_BOUNDS,
  TERMINAL_CHALLENGE_STATUSES,
  challengePercent,
  daysRemaining,
  goalAllowedFor,
  goalReached,
  goalValueFloor,
  isCancellableChallenge,
  isChallengeGoalKey,
  isChallengeType,
  isEditableChallenge,
  isRateGoal,
  participantPhase,
  validateWindow,
  windowState,
} from '#shared/utils/challenges'

/**
 * The challenge rules are the boundary everything else trusts: the API
 * validates goals against them, the engine decides completion with them, and
 * the UI clamps its bars with them. These tests are written against the
 * *rules*, not an implementation detail.
 */

const NOW = new Date('2026-09-05T12:00:00.000Z')

/** A window around `NOW`, in whole days. */
function around(startOffsetDays: number, endOffsetDays: number) {
  return {
    startsAt: new Date(NOW.getTime() + startOffsetDays * 86_400_000),
    endsAt: new Date(NOW.getTime() + endOffsetDays * 86_400_000),
  }
}

describe('goal vocabulary', () => {
  it('binds each goal to the challenge types that may track it', () => {
    expect(goalAllowedFor('INDIVIDUAL', 'tasks_completed')).toBe(true)
    expect(goalAllowedFor('TEAM', 'tasks_completed')).toBe(true)
    expect(goalAllowedFor('INDIVIDUAL', 'on_time_rate')).toBe(true)
    expect(goalAllowedFor('TEAM', 'on_time_rate')).toBe(false)
    expect(goalAllowedFor('INDIVIDUAL', 'team_completion_rate')).toBe(false)
    expect(goalAllowedFor('TEAM', 'team_completion_rate')).toBe(true)
  })

  it('marks exactly the two rate goals as deadline-judged', () => {
    for (const key of CHALLENGE_GOAL_KEYS) {
      expect(isRateGoal(key)).toBe(CHALLENGE_GOALS[key].unit === 'percent')
      expect(CHALLENGE_GOALS[key].resolvesAtDeadline).toBe(isRateGoal(key))
    }
  })

  it('recognises valid values and rejects everything else', () => {
    expect(isChallengeType('TEAM')).toBe(true)
    expect(isChallengeType('company')).toBe(false)
    expect(isChallengeGoalKey('tasks_completed')).toBe(true)
    expect(isChallengeGoalKey('tasks_on_time')).toBe(false)
  })

  it('keeps percent goals inside 1–100 and count goals bounded', () => {
    expect(GOAL_BOUNDS.percent).toEqual({ min: 1, max: 100 })
    expect(GOAL_BOUNDS.tasks.min).toBe(1)
    expect(GOAL_BOUNDS.tasks.max).toBeGreaterThan(100)
  })
})

describe('goal values and progress', () => {
  it('reaches the goal at >=, never below it', () => {
    expect(goalReached(10, 10)).toBe(true)
    expect(goalReached(11, 10)).toBe(true)
    expect(goalReached(9, 10)).toBe(false)
    expect(goalReached(0, 0)).toBe(false)
  })

  it('clamps the bar to 0–100 but never the numbers themselves', () => {
    expect(challengePercent(0, 10)).toBe(0)
    expect(challengePercent(5, 10)).toBe(50)
    expect(challengePercent(14, 10)).toBe(100)
    expect(challengePercent(3, 0)).toBe(0)
  })

  it('floors rate progress and rounds count progress', () => {
    expect(goalValueFloor('on_time_rate', 89.9)).toBe(89)
    expect(goalValueFloor('on_time_rate', 100.4)).toBe(100)
    expect(goalValueFloor('tasks_completed', 2.6)).toBe(3)
    expect(goalValueFloor('tasks_completed', -1)).toBe(0)
  })

  it('maps live progress onto participant phases', () => {
    expect(participantPhase(0, 10)).toBe('NOT_STARTED')
    expect(participantPhase(3, 10)).toBe('IN_PROGRESS')
    expect(participantPhase(10, 10)).toBe('COMPLETED')
    expect(participantPhase(12, 10)).toBe('COMPLETED')
  })
})

describe('the window', () => {
  it('schedules before the start, runs through the deadline, is over after', () => {
    const window = around(-2, 3)
    expect(windowState(window, new Date(NOW.getTime() - 3 * 86_400_000))).toBe('scheduled')
    expect(windowState(window, NOW)).toBe('running')
    // The deadline itself is still running: work completed at exactly endsAt counts.
    expect(windowState(window, window.endsAt)).toBe('running')
    expect(windowState(window, new Date(window.endsAt.getTime() + 1))).toBe('over')
  })

  it('counts whole days remaining and goes negative after the deadline', () => {
    expect(daysRemaining(around(-2, 3).endsAt, NOW)).toBe(3)
    expect(daysRemaining(around(-2, -1).endsAt, NOW)).toBe(-1)
  })

  it('accepts a starting-today window but refuses a dead one', () => {
    expect(validateWindow(around(0, 7), NOW)).toBeUndefined()
    expect(validateWindow(around(-2, -1), NOW)).toBe('PAST')
    expect(validateWindow(around(-2, -1), new Date(NOW.getTime() - 5 * 86_400_000))).toBeUndefined()
  })

  it('refuses reversed and over-long windows', () => {
    expect(validateWindow(around(3, 1), NOW)).toBe('ORDER')
    expect(validateWindow(around(0, 400), NOW)).toBe('TOO_LONG')
  })
})

describe('lifecycle gates', () => {
  it('allows editing only before the challenge has started', () => {
    const future = { status: 'ACTIVE' as const, startsAt: around(2, 9).startsAt }
    expect(isEditableChallenge(future, NOW)).toBe(true)

    const draft = { status: 'DRAFT' as const, startsAt: around(-1, 9).startsAt }
    expect(isEditableChallenge(draft, NOW)).toBe(true)

    const running = { status: 'ACTIVE' as const, startsAt: around(-2, 9).startsAt }
    expect(isEditableChallenge(running, NOW)).toBe(false)
  })

  it('forbids editing and allows cancelling only for non-terminal statuses', () => {
    for (const status of TERMINAL_CHALLENGE_STATUSES) {
      expect(isEditableChallenge({ status, startsAt: around(2, 9).startsAt }, NOW)).toBe(false)
      expect(isCancellableChallenge({ status })).toBe(false)
    }
    for (const status of ['DRAFT', 'ACTIVE'] as const) {
      expect(isCancellableChallenge({ status })).toBe(true)
    }
    // Every status is one of the two buckets, so nothing can fall between.
    for (const status of CHALLENGE_STATUSES) {
      expect(TERMINAL_CHALLENGE_STATUSES.includes(status) || ['DRAFT', 'ACTIVE'].includes(status))
        .toBe(true)
    }
  })
})

describe('creation presets', () => {
  it('covers the six promised shapes with valid, type-compatible goals', () => {
    expect(CHALLENGE_PRESETS).toHaveLength(6)
    expect(new Set(CHALLENGE_PRESETS.map(preset => preset.key)).size).toBe(6)

    const individual = CHALLENGE_PRESETS.filter(preset => preset.type === 'INDIVIDUAL')
    const team = CHALLENGE_PRESETS.filter(preset => preset.type === 'TEAM')
    expect(individual).toHaveLength(3)
    expect(team).toHaveLength(3)
    expect(individual.some(preset => preset.goalKey === 'tasks_completed' && preset.goalValue === 10)).toBe(true)
    expect(individual.some(preset => preset.goalKey === 'tasks_completed' && preset.goalValue === 20)).toBe(true)
    expect(individual.some(preset => preset.goalKey === 'on_time_rate' && preset.goalValue === 90)).toBe(true)
    expect(team.some(preset => preset.goalKey === 'tasks_completed' && preset.goalValue === 100)).toBe(true)
    expect(team.some(preset => preset.goalKey === 'team_completion_rate' && preset.goalValue === 90)).toBe(true)
    // The project milestone: everything on the board cleared by the deadline.
    expect(team.some(preset => preset.goalKey === 'team_completion_rate' && preset.goalValue === 100)).toBe(true)

    for (const preset of CHALLENGE_PRESETS) {
      expect(CHALLENGE_TYPES).toContain(preset.type)
      expect(goalAllowedFor(preset.type, preset.goalKey)).toBe(true)
      const bounds = GOAL_BOUNDS[CHALLENGE_GOALS[preset.goalKey].unit]
      expect(preset.goalValue).toBeGreaterThanOrEqual(bounds.min)
      expect(preset.goalValue).toBeLessThanOrEqual(bounds.max)
    }
  })
})
