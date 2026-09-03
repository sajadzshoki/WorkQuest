/**
 * Recognition maths — pure, timezone-aware, no I/O.
 *
 * The cycle *window* (a calendar week or month in the company timezone) and the
 * *winner tally* are the two rules worth unit-testing in isolation; everything
 * else is orchestration that lives server-side (`server/utils/recognition.ts`).
 *
 * Winner selection is deliberately deterministic: the top count wins, ties are
 * broken by the earliest first vote and then by id, so two runs over the same
 * votes can never disagree and an admin can always explain why someone won.
 */

export type RecognitionFrequency = 'WEEKLY' | 'MONTHLY'

export interface CycleWindow {
  startsAt: Date
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
 * Iterated so it stays correct across DST (a fixed-offset zone converges on the
 * first pass, a DST zone on the second).
 */
function zonedMidnightToUtc(year: number, month: number, day: number, timeZone: string): number {
  // The wall-clock midnight expressed as if it were UTC — a fixed target.
  const midnightWall = Date.UTC(year, month - 1, day)
  let guess = midnightWall
  for (let pass = 0; pass < 2; pass += 1) {
    // t = wall − offset(t); refine the guess against the fixed target.
    const next = midnightWall - timeZoneOffsetMs(guess, timeZone)
    if (next === guess) break
    guess = next
  }
  return guess
}

/**
 * The window of the cycle containing `reference`.
 *
 * WEEKLY runs Monday 00:00 → next Monday 00:00 (company timezone); MONTHLY runs
 * the 1st of the month → the 1st of the next. Walls are half-open (`[start, end)`)
 * so two adjacent cycles never overlap and a vote lands in exactly one.
 */
export function cycleWindow(
  frequency: RecognitionFrequency,
  reference: Date,
  timeZone: string,
): CycleWindow {
  const { year, month, day } = tzParts(reference, timeZone)

  if (frequency === 'MONTHLY') {
    return {
      startsAt: new Date(zonedMidnightToUtc(year, month, 1, timeZone)),
      endsAt: new Date(zonedMidnightToUtc(year, month + 1, 1, timeZone)),
    }
  }

  // Days since Monday (0 = Monday) of the reference wall-clock date.
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay() // 0 = Sunday
  const daysSinceMonday = (weekday + 6) % 7

  // The Monday of this week and the Monday of the next, as wall-clock dates,
  // then their midnights in the zone — DST-safe by construction.
  const monday = new Date(Date.UTC(year, month - 1, day) - daysSinceMonday * 86_400_000)
  const nextMonday = new Date(monday.getTime() + 7 * 86_400_000)

  return {
    startsAt: new Date(zonedMidnightToUtc(monday.getUTCFullYear(), monday.getUTCMonth() + 1, monday.getUTCDate(), timeZone)),
    endsAt: new Date(zonedMidnightToUtc(nextMonday.getUTCFullYear(), nextMonday.getUTCMonth() + 1, nextMonday.getUTCDate(), timeZone)),
  }
}

export interface RecognitionVoteInput {
  nomineeId: string
  createdAt: Date | string | number
}

export interface VoteTally {
  nomineeId: string
  count: number
}

interface InternalTally extends VoteTally {
  firstAt: number
}

/**
 * Count votes per nominee, sorted so the winner is first.
 *
 * Ordering: count desc, then the earliest first vote, then nominee id — the
 * last two make a tie unambiguous and reproducible.
 */
export function tallyVotes(votes: RecognitionVoteInput[]): VoteTally[] {
  const byNominee = new Map<string, InternalTally>()

  for (const vote of votes) {
    const at = new Date(vote.createdAt).getTime()
    const existing = byNominee.get(vote.nomineeId)
    if (existing) {
      existing.count += 1
      existing.firstAt = Math.min(existing.firstAt, at)
    }
    else {
      byNominee.set(vote.nomineeId, { nomineeId: vote.nomineeId, count: 1, firstAt: at })
    }
  }

  return [...byNominee.values()]
    .sort((a, b) =>
      b.count - a.count
      || a.firstAt - b.firstAt
      || (a.nomineeId < b.nomineeId ? -1 : a.nomineeId > b.nomineeId ? 1 : 0))
    .map(({ nomineeId, count }) => ({ nomineeId, count }))
}

/** The winner of a category's votes, or null when nobody voted. */
export function pickWinner(votes: RecognitionVoteInput[]): string | null {
  return tallyVotes(votes)[0]?.nomineeId ?? null
}
