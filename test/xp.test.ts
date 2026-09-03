import { describe, expect, it } from 'vitest'

import { computeLevelProgress, defaultLadder, defaultLevelForXp, defaultMinXp, resolveLevel } from '#shared/utils/xp'

const boundaries = [
  { level: 1, minXp: 0, title: 'جوانه' },
  { level: 2, minXp: 500, title: 'کاوشگر' },
  { level: 3, minXp: 1500, title: 'سازنده' },
]

describe('level maths', () => {
  it('resolves the level an XP total falls into', () => {
    expect(resolveLevel(0, boundaries)).toBe(1)
    expect(resolveLevel(499, boundaries)).toBe(1)
    expect(resolveLevel(500, boundaries)).toBe(2)
    expect(resolveLevel(9_999, boundaries)).toBe(3)
  })

  it('computes progress inside the current level', () => {
    const progress = computeLevelProgress(1_000, boundaries)
    expect(progress).toMatchObject({ level: 2, currentXp: 500, neededXp: 1_000, percent: 50 })
    expect(progress.title).toBe('کاوشگر')
  })

  it('never exceeds 100%', () => {
    const progress = computeLevelProgress(100_000, boundaries)
    expect(progress.level).toBe(3)
    expect(progress.percent).toBe(100)
  })

  it('falls back to the default curve without boundaries', () => {
    expect(defaultMinXp(1)).toBe(0)
    // The curve is now accelerating rather than linear: L3 sits at 1200.
    expect(defaultMinXp(3)).toBe(1_200)
    const progress = computeLevelProgress(700, [])
    expect(progress.level).toBe(2)
    // 700 XP is 200 into level 2, which spans 500 → 1200.
    expect(progress.percent).toBe(29)
  })
})

describe('default level curve', () => {
  it('matches the documented ladder', () => {
    expect(defaultMinXp(1)).toBe(0)
    expect(defaultMinXp(2)).toBe(500)
    expect(defaultMinXp(3)).toBe(1200)
    expect(defaultMinXp(4)).toBe(2100)
    expect(defaultMinXp(5)).toBe(3200)
  })

  it('is strictly increasing, with each level costing more than the last', () => {
    let previousStep = 0
    for (let level = 2; level <= 30; level += 1) {
      const step = defaultMinXp(level) - defaultMinXp(level - 1)
      expect(step).toBeGreaterThan(previousStep)
      previousStep = step
    }
  })

  it('round-trips through defaultLevelForXp', () => {
    for (let level = 1; level <= 20; level += 1) {
      expect(defaultLevelForXp(defaultMinXp(level))).toBe(level)
      // One XP short of the next rung is still the current level.
      expect(defaultLevelForXp(defaultMinXp(level + 1) - 1)).toBe(level)
    }
  })

  it('clamps nonsense input to level 1', () => {
    expect(defaultLevelForXp(0)).toBe(1)
    expect(defaultLevelForXp(-500)).toBe(1)
    expect(defaultMinXp(0)).toBe(0)
    expect(defaultMinXp(-3)).toBe(0)
  })

  it('falls back to the curve when a company defines no ladder', () => {
    const progress = computeLevelProgress(1500, [])
    expect(progress.level).toBe(3)
    // Level 3 spans 1200 → 2100.
    expect(progress.neededXp).toBe(900)
    expect(progress.currentXp).toBe(300)
  })

  it('generates a seedable ladder', () => {
    const ladder = defaultLadder(4)
    expect(ladder.map(l => l.minXp)).toEqual([0, 500, 1200, 2100])
    expect(defaultLadder(0)).toEqual([])
  })
})
