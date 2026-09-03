import { describe, expect, it } from 'vitest'

import { cycleWindow, pickWinner, tallyVotes } from '#shared/utils/recognition'

/**
 * Recognition maths: cycle windows (timezone-aware) and winner tallies
 * (deterministic tie-breaking). Everything else lives behind a database and is
 * covered by `test/integration/recognition.integration.test.ts`.
 */

describe('cycleWindow — WEEKLY', () => {
  it('starts on Monday 00:00 of the company timezone', () => {
    // 2026-09-02 is a Wednesday; its Monday is 2026-08-31, whose midnight in
    // Tehran (UTC+3:30) is 2026-08-30T20:30Z.
    const window = cycleWindow('WEEKLY', new Date('2026-09-02T12:00:00.000Z'), 'Asia/Tehran')
    expect(window.startsAt.toISOString()).toBe('2026-08-30T20:30:00.000Z')
    expect(window.endsAt.toISOString()).toBe('2026-09-06T20:30:00.000Z')
  })

  it('treats a Monday reference as the first day of its own week', () => {
    const window = cycleWindow('WEEKLY', new Date('2026-09-07T12:00:00.000Z'), 'Asia/Tehran')
    expect(window.startsAt.toISOString()).toBe('2026-09-06T20:30:00.000Z')
    expect(window.endsAt.toISOString()).toBe('2026-09-13T20:30:00.000Z')
  })

  it('is timezone-aware: the same instant can fall in different weeks', () => {
    const instant = new Date('2026-09-06T22:00:00.000Z') // late Sunday in UTC, early Monday in Tehran
    const tehran = cycleWindow('WEEKLY', instant, 'Asia/Tehran')
    const utc = cycleWindow('WEEKLY', instant, 'UTC')

    expect(tehran.startsAt.toISOString()).toBe('2026-09-06T20:30:00.000Z')
    expect(utc.startsAt.toISOString()).toBe('2026-08-31T00:00:00.000Z')
  })
})

describe('cycleWindow — MONTHLY', () => {
  it('runs from the 1st of the month to the 1st of the next', () => {
    const window = cycleWindow('MONTHLY', new Date('2026-09-15T12:00:00.000Z'), 'Asia/Tehran')
    // Sept 1 00:00 Tehran = Aug 31 20:30Z; Oct 1 00:00 Tehran = Sep 30 20:30Z.
    expect(window.startsAt.toISOString()).toBe('2026-08-31T20:30:00.000Z')
    expect(window.endsAt.toISOString()).toBe('2026-09-30T20:30:00.000Z')
  })

  it('keeps a 1st-of-month reference in the month that just started', () => {
    const window = cycleWindow('MONTHLY', new Date('2026-09-01T02:00:00.000Z'), 'Asia/Tehran')
    expect(window.startsAt.toISOString()).toBe('2026-08-31T20:30:00.000Z')
    expect(window.endsAt.toISOString()).toBe('2026-09-30T20:30:00.000Z')
  })
})

describe('tallyVotes', () => {
  it('counts per nominee and puts the highest count first', () => {
    const tallies = tallyVotes([
      { nomineeId: 'a', createdAt: '2026-09-01T10:00:00.000Z' },
      { nomineeId: 'b', createdAt: '2026-09-01T10:01:00.000Z' },
      { nomineeId: 'a', createdAt: '2026-09-01T10:02:00.000Z' },
    ])
    expect(tallies).toEqual([
      { nomineeId: 'a', count: 2 },
      { nomineeId: 'b', count: 1 },
    ])
  })

  it('breaks an equal-count tie by the earliest first vote', () => {
    // 2–2, but a's first vote landed before b's.
    const tallies = tallyVotes([
      { nomineeId: 'a', createdAt: '2026-09-01T09:00:00.000Z' },
      { nomineeId: 'b', createdAt: '2026-09-01T11:00:00.000Z' },
      { nomineeId: 'a', createdAt: '2026-09-01T12:00:00.000Z' },
      { nomineeId: 'b', createdAt: '2026-09-01T13:00:00.000Z' },
    ])
    expect(tallies[0]).toEqual({ nomineeId: 'a', count: 2 })

    // Same counts, but b's first vote is now the earliest → b wins.
    const reversed = tallyVotes([
      { nomineeId: 'a', createdAt: '2026-09-01T11:00:00.000Z' },
      { nomineeId: 'b', createdAt: '2026-09-01T09:00:00.000Z' },
      { nomineeId: 'a', createdAt: '2026-09-01T12:00:00.000Z' },
      { nomineeId: 'b', createdAt: '2026-09-01T13:00:00.000Z' },
    ])
    expect(reversed[0]).toEqual({ nomineeId: 'b', count: 2 })
  })

  it('breaks a full tie by id for a reproducible outcome', () => {
    const at = '2026-09-01T10:00:00.000Z'
    const winner = pickWinner([
      { nomineeId: 'zzz', createdAt: at },
      { nomineeId: 'aaa', createdAt: at },
    ])
    expect(winner).toBe('aaa')
  })
})

describe('pickWinner', () => {
  it('returns null when nobody voted', () => {
    expect(pickWinner([])).toBeNull()
  })

  it('returns the top nominee', () => {
    const winner = pickWinner([
      { nomineeId: 'x', createdAt: '2026-09-01T10:00:00.000Z' },
      { nomineeId: 'y', createdAt: '2026-09-01T10:01:00.000Z' },
      { nomineeId: 'y', createdAt: '2026-09-01T10:02:00.000Z' },
    ])
    expect(winner).toBe('y')
  })
})
