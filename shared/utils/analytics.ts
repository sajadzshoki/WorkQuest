/**
 * Pure analytics helpers — the maths behind the company dashboard.
 *
 * Everything here is framework-free and unit-tested: the endpoints only fetch
 * rows and hand them over, so a wrong number is always a bug in *these*
 * functions, not in a query. Two rules matter for correctness:
 *
 *  1. **Days are company-local.** A task approved at 23:30 Tehran time and one
 *     at 00:30 the next morning fall on different days even though they are an
 *     hour apart; bucketing by UTC would blur exactly the boundary that
 *     matters to the people reading the chart.
 *  2. **Averages are honest about emptiness.** An average over nothing is
 *     `null` («—»), never 0 — an employee with no scored tasks has no average
 *     performance, not a zero.
 */

/** `YYYY-MM-DD` for the moment, in the given IANA timezone. */
export function localDayKey(date: Date, timeZone: string): string {
  // en-CA formats as year-month-day with zero padding — the one locale whose
  // ISO-shaped output can be relied on.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

/** The last `days` day keys ending today (inclusive), oldest first. */
export function dayKeyRange(days: number, timeZone: string, now: Date): string[] {
  const today = localDayKey(now, timeZone)
  const anchor = new Date(`${today}T12:00:00Z`) // midday anchor: DST-safe day stepping
  const keys: string[] = []
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    keys.push(localDayKey(new Date(anchor.getTime() - offset * 86_400_000), timeZone))
  }
  return keys
}

/** Rounded average, or null when there is nothing to average. */
export function averageOf(values: readonly number[]): number | null {
  if (values.length === 0) return null
  const total = values.reduce((sum, value) => sum + value, 0)
  return Math.round(total / values.length)
}

/** Percentage 0–100, or null when the denominator is empty. */
export function rateOrNull(part: number, total: number): number | null {
  if (total <= 0) return null
  return Math.round((part / total) * 100)
}

/** One point per day in `days`, zero-filled: charts never skip a day. */
export function buildDaySeries(
  rows: ReadonlyArray<{ day: string, value: number }>,
  days: readonly string[],
): Array<{ day: string, value: number }> {
  const byDay = new Map<string, number>()
  for (const row of rows) byDay.set(row.day, (byDay.get(row.day) ?? 0) + row.value)
  return days.map(day => ({ day, value: byDay.get(day) ?? 0 }))
}

/**
 * Average per day — days with no rows are `null` so the line chart shows a
 * gap rather than a misleading dive to zero.
 */
export function buildAverageDaySeries(
  rows: ReadonlyArray<{ day: string, value: number }>,
  days: readonly string[],
): Array<{ day: string, value: number | null }> {
  const byDay = new Map<string, number[]>()
  for (const row of rows) {
    const list = byDay.get(row.day) ?? []
    list.push(row.value)
    byDay.set(row.day, list)
  }
  return days.map((day) => {
    const values = byDay.get(day)
    return { day, value: values ? averageOf(values) : null }
  })
}

/**
 * On-time judgement for one approved task: on time when it was completed by
 * its due date. Undated tasks have no deadline to miss — they are excluded
 * from the rate, not counted as late. A null `completedAt` never happens on
 * an approved task, but the type allows it and honesty is cheap.
 */
export function isOnTime(task: { completedAt: Date | null, dueDate: Date | null }): boolean {
  return task.completedAt !== null
    && task.dueDate !== null
    && task.completedAt.getTime() <= task.dueDate.getTime()
}
