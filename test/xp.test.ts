import { describe, expect, it } from 'vitest'

import { computeLevelProgress, defaultMinXp, resolveLevel } from '#shared/utils/xp'

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
    expect(defaultMinXp(3)).toBe(1_000)
    const progress = computeLevelProgress(700, [])
    expect(progress.level).toBe(2)
    expect(progress.percent).toBe(40)
  })
})
