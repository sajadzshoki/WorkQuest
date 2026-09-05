/**
 * Calendar period maths — pure, timezone-aware, no I/O.
 *
 * A "period" is a half-open wall-clock window (`[startsAt, endsAt)`) in an IANA
 * timezone: a calendar week (Monday → Monday) or a calendar month (1st → 1st).
 * Everything that turns over on a calendar boundary in WorkQuest — recognition
 * cycles and the windowed leaderboards — derives its window from here, so
 * "this week" means exactly the same span of time on every screen.
 *
 * The maths is DST-safe by construction: a wall-clock midnight is converted to
 * a UTC instant by iterating against the timezone's offset (`zonedMidnightToUtc`),
 * never by adding a fixed number of hours. A fixed-offset zone such as
 * `Asia/Tehran` converges on the first pass; a DST zone on the second.
 */

/** How a period turns over. */
export type CalendarCadence = 'WEEKLY' | 'MONTHLY'

export interface PeriodWindow {
  /** Inclusive. */
  startsAt: Date
  /** Exclusive — two adjacent windows never overlap, so an event lands in exactly one. */
  endsAt: Date
}

/** Wall-clock parts of an instant in a given IANA timezone. */
interface TzParts {
  year: number
  month: number
  day: number
}

function tzParts(date: Date, timeZone: string): TzParts {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find(part => part.type === type)?.value ?? '0'

  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
  }
}

/** The UTC offset of an instant in a timezone, in milliseconds. */
function timeZoneOffsetMs(date: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date)

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find(part => part.type === type)?.value ?? '0')

  const wallClock = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour') % 24,
    get('minute'),
    get('second'),
  )
  return wallClock - Math.floor(date / 1000) * 1000
}

/**
 * The UTC instant of `00:00` on the given wall-clock date in `timeZone`.
 *
 * Iterated so it stays correct across DST: `t = wall − offset(t)` is refined
 * against the fixed wall-clock target until it stops moving.
 */
function zonedMidnightToUtc(year: number, month: number, day: number, timeZone: string): number {
  // The wall-clock midnight expressed as if it were UTC — a fixed target.
  const midnightWall = Date.UTC(year, month - 1, day)
  let guess = midnightWall
  for (let pass = 0; pass < 2; pass += 1) {
    const next = midnightWall - timeZoneOffsetMs(guess, timeZone)
    if (next === guess) break
    guess = next
  }
  return guess
}

/** `YYYY-MM-DD` for an instant, in the given timezone. */
function zonedDateKey(date: Date, timeZone: string): string {
  const { year, month, day } = tzParts(date, timeZone)
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/**
 * The window of the period containing `reference`.
 *
 * WEEKLY runs Monday 00:00 → the next Monday 00:00 (wall-clock in `timeZone`);
 * MONTHLY runs the 1st of the month → the 1st of the next.
 */
export function calendarWindow(
  cadence: CalendarCadence,
  reference: Date,
  timeZone: string,
): PeriodWindow {
  const { year, month, day } = tzParts(reference, timeZone)

  if (cadence === 'MONTHLY') {
    return {
      startsAt: new Date(zonedMidnightToUtc(year, month, 1, timeZone)),
      endsAt: new Date(zonedMidnightToUtc(year, month + 1, 1, timeZone)),
    }
  }

  // Days since Monday (0 = Monday) of the reference wall-clock date.
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay() // 0 = Sunday
  const daysSinceMonday = (weekday + 6) % 7

  // The Monday of this week and the Monday of the next, as wall-clock dates,
  // then their midnights in the zone.
  const monday = new Date(Date.UTC(year, month - 1, day) - daysSinceMonday * 86_400_000)
  const nextMonday = new Date(monday.getTime() + 7 * 86_400_000)

  return {
    startsAt: new Date(zonedMidnightToUtc(monday.getUTCFullYear(), monday.getUTCMonth() + 1, monday.getUTCDate(), timeZone)),
    endsAt: new Date(zonedMidnightToUtc(nextMonday.getUTCFullYear(), nextMonday.getUTCMonth() + 1, nextMonday.getUTCDate(), timeZone)),
  }
}

/**
 * The window immediately before the one containing `reference`.
 *
 * Derived from the current window's start rather than by subtracting a fixed
 * span, so a month of 28 days and a month of 31 days both step back correctly.
 */
export function previousCalendarWindow(
  cadence: CalendarCadence,
  reference: Date,
  timeZone: string,
): PeriodWindow {
  const current = calendarWindow(cadence, reference, timeZone)
  return calendarWindow(cadence, new Date(current.startsAt.getTime() - 1), timeZone)
}

/**
 * A stable identifier for a window: `week:2026-08-31` (its Monday) or
 * `month:2026-09`.
 *
 * Computed from the window's own start in the company timezone, so the key is
 * the same for every request inside the period and different across periods —
 * which is what makes it usable as a cache key or an analytics dimension.
 */
export function calendarWindowKey(cadence: CalendarCadence, window: PeriodWindow, timeZone: string): string {
  const startsAt = zonedDateKey(window.startsAt, timeZone)
  return cadence === 'MONTHLY' ? `month:${startsAt.slice(0, 7)}` : `week:${startsAt}`
}

/** Whole days left in a window, rounded up — `0` once it has closed. */
export function daysUntil(windowEndsAt: Date, reference: Date = new Date()): number {
  return Math.max(0, Math.ceil((windowEndsAt.getTime() - reference.getTime()) / 86_400_000))
}

/** Is `instant` inside the half-open window? */
export function isInsideWindow(instant: Date | string | number, window: PeriodWindow): boolean {
  const at = new Date(instant).getTime()
  return at >= window.startsAt.getTime() && at < window.endsAt.getTime()
}
