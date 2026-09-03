/**
 * Streak maths — pure, date-based, timezone-aware.
 *
 * A "streak day" is a calendar day in the *user's* timezone, so an activity at
 * 23:30 and one at 00:30 the same Tehran night land on different days, while
 * the same instants in a different timezone may not. The server passes the
 * company timezone in; the functions here never read the clock themselves.
 *
 * Deliberately simple (no daily quests): activity on consecutive calendar days
 * extends the streak; a gap of one or more days resets it to 1.
 */

/** Streak lengths the product celebrates. Keep in ascending order. */
export const STREAK_MILESTONES = [7, 14, 30] as const

/** The mutable bits of a user's streak, as stored on `UserProgress`. */
export interface StreakState {
  current: number
  longest: number
  /** Calendar day of the last counted activity, `YYYY-MM-DD` (user timezone). */
  lastActiveDate: string | null
}

/** What advancing a streak did. */
export interface StreakResult extends StreakState {
  /** A new calendar day was counted (the streak started or extended). */
  changed: boolean
  /** The previous run was broken (the activity followed a gap of > 1 day). */
  broken: boolean
}

/** Format an instant as `YYYY-MM-DD` in the given IANA timezone. */
export function dayKey(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find(part => part.type === type)?.value ?? '0'

  return `${get('year')}-${get('month')}-${get('day')}`
}

/**
 * Fold an activity instant into a streak state.
 *
 * Rules, in order:
 *  - same calendar day as the last activity → nothing changes (idempotent);
 *  - exactly the previous calendar day → extend by one;
 *  - anything else (a gap, or the first activity ever) → start at 1.
 *
 * `longest` is the high-water mark and only ever grows.
 */
export function advanceStreak(
  state: StreakState,
  activityAt: Date,
  timeZone: string,
): StreakResult {
  const today = dayKey(activityAt, timeZone)
  const yesterday = dayKey(new Date(activityAt.getTime() - 86_400_000), timeZone)

  if (state.lastActiveDate === today) {
    return { ...state, changed: false, broken: false }
  }

  const continued = state.lastActiveDate === yesterday
  const current = continued ? state.current + 1 : 1
  const longest = Math.max(state.longest, current)

  return {
    current,
    longest,
    lastActiveDate: today,
    changed: true,
    // `broken` means a *prior* run was reset. The very first activity starts a
    // new run rather than breaking one, so it is not reported as broken.
    broken: !continued && state.lastActiveDate !== null,
  }
}

/** The next milestone strictly above `current`, or null when all are reached. */
export function nextStreakMilestone(current: number): number | null {
  for (const days of STREAK_MILESTONES) {
    if (days > current) return days
  }
  return null
}

/** Milestone markers for the streak card, each with its reached flag. */
export function streakMilestones(current: number): Array<{ days: number, reached: boolean }> {
  return STREAK_MILESTONES.map(days => ({ days, reached: current >= days }))
}
