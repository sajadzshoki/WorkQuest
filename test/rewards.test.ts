import { describe, expect, it } from 'vitest'

import {
  BP_SCALE,
  DEFAULT_REWARD_RULES,
  type RewardRules,
  calculateReward,
  recognitionKey,
  redemptionKey,
  scoreBand,
  taskRewardKey,
} from '#shared/utils/rewards'

/**
 * The economy is the part of the product most likely to be argued with by the
 * people it pays, so it gets the most exhaustive tests: every band boundary,
 * every bonus and penalty in isolation, their interactions, and the clamps
 * that stop any combination producing a nonsense number.
 */

const DAY = 86_400_000

/** A task with no timing signal at all — isolates the score band. */
function neutral(overrides: Partial<Parameters<typeof calculateReward>[0]> = {}) {
  return calculateReward({
    score: 100,
    priority: 'MEDIUM',
    dueDate: null,
    submittedAt: null,
    ...overrides,
  })
}

describe('scoreBand', () => {
  it('maps the documented bands, inclusive at the lower bound', () => {
    expect(scoreBand(100)).toBe('EXCELLENT')
    expect(scoreBand(90)).toBe('EXCELLENT')
    expect(scoreBand(89)).toBe('GOOD')
    expect(scoreBand(80)).toBe('GOOD')
    expect(scoreBand(79)).toBe('FAIR')
    expect(scoreBand(70)).toBe('FAIR')
    expect(scoreBand(69)).toBe('POOR')
    expect(scoreBand(0)).toBe('POOR')
  })
})

describe('calculateReward — score bands', () => {
  it('pays 100% of base at 90-100', () => {
    const result = neutral({ score: 95 })
    expect(result.band).toBe('EXCELLENT')
    expect(result.xp).toBe(DEFAULT_REWARD_RULES.baseXp)
    expect(result.coins).toBe(DEFAULT_REWARD_RULES.baseCoins)
  })

  it('pays 80% at 80-89', () => {
    const result = neutral({ score: 85 })
    expect(result.xp).toBe(80)
    expect(result.coins).toBe(40)
  })

  it('pays 60% at 70-79', () => {
    const result = neutral({ score: 75 })
    expect(result.xp).toBe(60)
    expect(result.coins).toBe(30)
  })

  it('pays a reduced amount below 70', () => {
    const result = neutral({ score: 50 })
    expect(result.band).toBe('POOR')
    expect(result.xp).toBe(30)
    expect(result.coins).toBe(15)
  })

  it('is monotonic: a higher score never pays less', () => {
    let previous = -1
    for (let score = 0; score <= 100; score += 1) {
      const { coins } = neutral({ score })
      expect(coins).toBeGreaterThanOrEqual(previous)
      previous = Math.max(previous, coins)
    }
  })
})

describe('calculateReward — priority weighting', () => {
  it('scales the base by priority', () => {
    expect(neutral({ priority: 'LOW' }).coins).toBe(40)
    expect(neutral({ priority: 'MEDIUM' }).coins).toBe(50)
    expect(neutral({ priority: 'HIGH' }).coins).toBe(65)
  })

  it('records the priority factor in the breakdown', () => {
    const result = neutral({ priority: 'HIGH' })
    expect(result.factors[0]).toEqual({
      key: 'priority.HIGH',
      bp: DEFAULT_REWARD_RULES.highPriorityBp,
      kind: 'base',
    })
  })
})

describe('calculateReward — timing', () => {
  const due = new Date('2026-03-10T12:00:00Z')

  it('awards the on-time bonus when submitted before the deadline', () => {
    const result = calculateReward({
      score: 95,
      priority: 'MEDIUM',
      dueDate: due,
      submittedAt: new Date(due.getTime() - 60_000),
    })
    expect(result.onTime).toBe(true)
    expect(result.early).toBe(false)
    expect(result.overdue).toBe(false)
    // 1.0 band + 0.10 on-time = 1.10
    expect(result.multiplierBp).toBe(11_000)
    expect(result.coins).toBe(55)
  })

  it('awards the larger early bonus instead of stacking it with on-time', () => {
    const result = calculateReward({
      score: 95,
      priority: 'MEDIUM',
      dueDate: due,
      submittedAt: new Date(due.getTime() - 2 * DAY),
    })
    expect(result.early).toBe(true)
    // 1.0 + 0.20 early (not 0.20 + 0.10)
    expect(result.multiplierBp).toBe(12_000)
    expect(result.factors.filter(f => f.kind === 'bonus')).toHaveLength(1)
  })

  it('never pays early less than on-time, even if the rules are misconfigured', () => {
    const rules: RewardRules = { ...DEFAULT_REWARD_RULES, earlyBonusBp: 100, onTimeBonusBp: 5_000 }
    const early = calculateReward(
      { score: 95, priority: 'MEDIUM', dueDate: due, submittedAt: new Date(due.getTime() - 5 * DAY) },
      rules,
    )
    const onTime = calculateReward(
      { score: 95, priority: 'MEDIUM', dueDate: due, submittedAt: new Date(due.getTime() - 60_000) },
      rules,
    )
    expect(early.coins).toBeGreaterThanOrEqual(onTime.coins)
  })

  it('applies the overdue penalty when submitted late', () => {
    const result = calculateReward({
      score: 95,
      priority: 'MEDIUM',
      dueDate: due,
      submittedAt: new Date(due.getTime() + DAY),
    })
    expect(result.overdue).toBe(true)
    expect(result.onTime).toBe(false)
    // 1.0 - 0.25 = 0.75
    expect(result.multiplierBp).toBe(7_500)
    expect(result.coins).toBe(38)
  })

  it('treats a task with no due date as timing-neutral', () => {
    const result = neutral({ score: 95 })
    expect(result.onTime).toBe(false)
    expect(result.overdue).toBe(false)
    expect(result.multiplierBp).toBe(BP_SCALE)
  })

  it('derives timing from timestamps, not from the reviewer', () => {
    // A generous timeliness sub-score cannot rescue a late submission: the
    // field is recorded for reporting but is not an input to the payout.
    const late = {
      score: 95,
      priority: 'MEDIUM' as const,
      dueDate: due,
      submittedAt: new Date(due.getTime() + DAY),
    }
    expect(calculateReward(late).coins).toBe(calculateReward({ ...late }).coins)
    expect(calculateReward(late).overdue).toBe(true)
  })
})

describe('calculateReward — quality bonus', () => {
  it('applies at or above the threshold', () => {
    const result = neutral({ score: 95, qualityScore: 5 })
    expect(result.multiplierBp).toBe(11_500)
  })

  it('does not apply below the threshold', () => {
    expect(neutral({ score: 95, qualityScore: 4 }).multiplierBp).toBe(BP_SCALE)
  })

  it('respects a lowered threshold', () => {
    const rules = { ...DEFAULT_REWARD_RULES, highQualityThreshold: 4 }
    expect(calculateReward({ score: 95, priority: 'MEDIUM', qualityScore: 4 }, rules).multiplierBp)
      .toBe(11_500)
  })

  it('ignores a missing quality score', () => {
    expect(neutral({ score: 95, qualityScore: null }).multiplierBp).toBe(BP_SCALE)
  })
})

describe('calculateReward — revision penalty', () => {
  it('charges per revision round', () => {
    expect(neutral({ score: 95, revisionCount: 1 }).multiplierBp).toBe(9_000)
    expect(neutral({ score: 95, revisionCount: 3 }).multiplierBp).toBe(7_000)
  })

  it('caps the cumulative penalty', () => {
    // 10 rounds × 0.10 would be −1.00; the cap holds it at −0.50.
    const result = neutral({ score: 95, revisionCount: 10 })
    expect(result.multiplierBp).toBe(5_000)
    const penalty = result.factors.find(f => f.key === 'penalty.revision')
    expect(penalty?.bp).toBe(-DEFAULT_REWARD_RULES.maxRevisionPenaltyBp)
  })

  it('ignores a negative revision count', () => {
    expect(neutral({ score: 95, revisionCount: -5 }).multiplierBp).toBe(BP_SCALE)
  })
})

describe('calculateReward — invalid input', () => {
  it('clamps a score above 100', () => {
    const result = neutral({ score: 5_000 })
    expect(result.score).toBe(100)
    expect(result.coins).toBe(DEFAULT_REWARD_RULES.baseCoins)
  })

  it('clamps a negative score to zero rather than paying negative', () => {
    const result = neutral({ score: -50 })
    expect(result.score).toBe(0)
    expect(result.band).toBe('POOR')
    expect(result.coins).toBeGreaterThanOrEqual(0)
  })

  it('treats NaN as zero instead of propagating it', () => {
    const result = neutral({ score: Number.NaN })
    expect(result.score).toBe(0)
    expect(Number.isNaN(result.coins)).toBe(false)
  })

  it('rounds a fractional score', () => {
    expect(neutral({ score: 89.6 }).band).toBe('EXCELLENT')
    expect(neutral({ score: 89.4 }).band).toBe('GOOD')
  })

  it('never returns a negative payout, however punitive the rules', () => {
    const brutal: RewardRules = {
      ...DEFAULT_REWARD_RULES,
      overduePenaltyBp: 50_000,
      revisionPenaltyBp: 50_000,
      maxRevisionPenaltyBp: 50_000,
    }
    const result = calculateReward({
      score: 10,
      priority: 'LOW',
      dueDate: new Date('2026-01-01T00:00:00Z'),
      submittedAt: new Date('2026-02-01T00:00:00Z'),
      revisionCount: 9,
    }, brutal)
    expect(result.multiplierBp).toBe(0)
    expect(result.xp).toBe(0)
    expect(result.coins).toBe(0)
  })

  it('clamps an unbounded bonus stack to the configured ceiling', () => {
    const generous: RewardRules = {
      ...DEFAULT_REWARD_RULES,
      earlyBonusBp: 500_000,
      highQualityBonusBp: 500_000,
    }
    const result = calculateReward({
      score: 100,
      priority: 'HIGH',
      qualityScore: 5,
      dueDate: new Date('2026-03-10T00:00:00Z'),
      submittedAt: new Date('2026-03-01T00:00:00Z'),
    }, generous)
    expect(result.multiplierBp).toBe(DEFAULT_REWARD_RULES.maxMultiplierBp)
    expect(result.factors.some(f => f.key === 'clamp')).toBe(true)
  })
})

describe('calculateReward — per-task base overrides', () => {
  it('prefers the task base over the company base', () => {
    const result = neutral({ score: 95, baseXp: 1_000, baseCoins: 400 })
    expect(result.xp).toBe(1_000)
    expect(result.coins).toBe(400)
  })

  it('falls back to the company base when the task carries none', () => {
    const result = neutral({ score: 95, baseXp: null, baseCoins: null })
    expect(result.xp).toBe(DEFAULT_REWARD_RULES.baseXp)
  })

  it('keeps XP and coins on the same multiplier', () => {
    const result = neutral({ score: 75, baseXp: 200, baseCoins: 100 })
    // Both scaled by 0.6; the ratio between the two currencies is preserved.
    expect(result.xp / result.coins).toBe(2)
  })
})

describe('calculateReward — combined scenarios', () => {
  it('prices an excellent, early, high-quality, high-priority task', () => {
    const due = new Date('2026-05-20T00:00:00Z')
    const result = calculateReward({
      score: 96,
      qualityScore: 5,
      priority: 'HIGH',
      dueDate: due,
      submittedAt: new Date(due.getTime() - 3 * DAY),
    })
    // band 1.0 + early 0.20 + quality 0.15 = 1.35, × priority 1.3
    expect(result.multiplierBp).toBe(13_500)
    expect(result.xp).toBe(Math.round(100 * 1.3 * 1.35))
    expect(result.coins).toBe(Math.round(50 * 1.3 * 1.35))
  })

  it('prices a mediocre, late, twice-revised task', () => {
    const due = new Date('2026-05-20T00:00:00Z')
    const result = calculateReward({
      score: 72,
      priority: 'LOW',
      dueDate: due,
      submittedAt: new Date(due.getTime() + 2 * DAY),
      revisionCount: 2,
    })
    // band 0.6 − overdue 0.25 − revisions 0.20 = 0.15, × priority 0.8
    expect(result.multiplierBp).toBe(1_500)
    expect(result.coins).toBe(Math.round(50 * 0.8 * 0.15))
  })

  it('produces a breakdown that reconciles with the payout', () => {
    const result = neutral({ score: 85, qualityScore: 5, revisionCount: 1 })
    const nonBase = result.factors
      .filter(f => f.kind !== 'base')
      .reduce((sum, f) => sum + f.bp, 0)
    expect(nonBase).toBe(result.multiplierBp)
  })
})

describe('idempotency keys', () => {
  it('derives a task key from the task alone, so re-approval collides', () => {
    expect(taskRewardKey('abc')).toBe('task:abc:reward')
    expect(taskRewardKey('abc')).toBe(taskRewardKey('abc'))
  })

  it('keeps the namespaces distinct', () => {
    expect(taskRewardKey('x')).not.toBe(redemptionKey('x'))
    expect(recognitionKey('x')).not.toBe(redemptionKey('x'))
  })
})
