import { describe, expect, it } from 'vitest'

import {
  averageOf,
  buildAverageDaySeries,
  buildDaySeries,
  dayKeyRange,
  isOnTime,
  localDayKey,
  rateOrNull,
} from '#shared/utils/analytics'

describe('analytics helpers', () => {
  describe('localDayKey', () => {
    it('formats an instant as YYYY-MM-DD in the given timezone', () => {
      // 22:30 UTC on the 4th is already the 5th in Tehran (UTC+3:30).
      expect(localDayKey(new Date('2026-09-04T22:30:00Z'), 'Asia/Tehran')).toBe('2026-09-05')
      // …but still the 4th in UTC.
      expect(localDayKey(new Date('2026-09-04T22:30:00Z'), 'UTC')).toBe('2026-09-04')
    })

    it('keeps zero padding', () => {
      expect(localDayKey(new Date('2026-01-05T09:00:00Z'), 'UTC')).toBe('2026-01-05')
    })
  })

  describe('dayKeyRange', () => {
    it('returns the window oldest-first ending today', () => {
      const now = new Date('2026-09-05T12:00:00Z')
      const keys = dayKeyRange(3, 'UTC', now)
      expect(keys).toEqual(['2026-09-03', '2026-09-04', '2026-09-05'])
    })

    it('steps across month boundaries', () => {
      const now = new Date('2026-03-02T12:00:00Z')
      const keys = dayKeyRange(4, 'UTC', now)
      expect(keys).toEqual(['2026-02-27', '2026-02-28', '2026-03-01', '2026-03-02'])
    })

    it('anchors on the local day, not the UTC one', () => {
      // 01:00 UTC on the 5th is 04:30 in Tehran — the local day is still the 5th.
      const now = new Date('2026-09-05T01:00:00Z')
      const keys = dayKeyRange(2, 'Asia/Tehran', now)
      expect(keys).toEqual(['2026-09-04', '2026-09-05'])
    })
  })

  describe('averageOf', () => {
    it('averages and rounds', () => {
      expect(averageOf([80, 90, 100])).toBe(90)
      expect(averageOf([80, 85])).toBe(83) // 82.5 rounds up
      expect(averageOf([80, 84])).toBe(82) // 82 → stays
    })

    it('is null over nothing — no average of zero', () => {
      expect(averageOf([])).toBeNull()
    })
  })

  describe('rateOrNull', () => {
    it('returns a rounded percentage', () => {
      expect(rateOrNull(1, 3)).toBe(33)
      expect(rateOrNull(2, 3)).toBe(67)
    })

    it('handles 100% and rejects empty denominators', () => {
      expect(rateOrNull(5, 5)).toBe(100)
      expect(rateOrNull(0, 0)).toBeNull()
      expect(rateOrNull(0, -3)).toBeNull()
    })
  })

  describe('buildDaySeries', () => {
    it('zero-fills missing days and sums duplicates', () => {
      const series = buildDaySeries(
        [
          { day: '2026-09-01', value: 2 },
          { day: '2026-09-01', value: 3 },
          { day: '2026-09-04', value: 1 },
        ],
        ['2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04'],
      )
      expect(series).toEqual([
        { day: '2026-09-01', value: 5 },
        { day: '2026-09-02', value: 0 },
        { day: '2026-09-03', value: 0 },
        { day: '2026-09-04', value: 1 },
      ])
    })
  })

  describe('buildAverageDaySeries', () => {
    it('averages per day and gaps empty days as null', () => {
      const series = buildAverageDaySeries(
        [
          { day: '2026-09-01', value: 80 },
          { day: '2026-09-01', value: 90 },
          { day: '2026-09-04', value: 70 },
        ],
        ['2026-09-01', '2026-09-02', '2026-09-04'],
      )
      expect(series).toEqual([
        { day: '2026-09-01', value: 85 },
        { day: '2026-09-02', value: null },
        { day: '2026-09-04', value: 70 },
      ])
    })
  })

  describe('isOnTime', () => {
    it('compares completion against the due date', () => {
      expect(isOnTime({ completedAt: new Date('2026-09-03T10:00:00Z'), dueDate: new Date('2026-09-03T18:00:00Z') })).toBe(true)
      expect(isOnTime({ completedAt: new Date('2026-09-03T19:00:00Z'), dueDate: new Date('2026-09-03T18:00:00Z') })).toBe(false)
      // Completing exactly at the deadline counts as on time.
      expect(isOnTime({ completedAt: new Date('2026-09-03T18:00:00Z'), dueDate: new Date('2026-09-03T18:00:00Z') })).toBe(true)
    })

    it('never counts undated or timestamp-less tasks', () => {
      expect(isOnTime({ completedAt: new Date(), dueDate: null })).toBe(false)
      expect(isOnTime({ completedAt: null, dueDate: new Date() })).toBe(false)
    })
  })
})
