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

import type { CalendarCadence } from './period'

export type RecognitionFrequency = CalendarCadence

/**
 * The cycle window is the generic calendar window (`shared/utils/period.ts`).
 *
 * Re-exported under its recognition name so this module stays the vocabulary
 * owners of the cycle read, while the *implementation* — and therefore the
 * definition of a week or a month — is shared with the windowed leaderboards.
 */
export { calendarWindow as cycleWindow, calendarWindowKey as cycleWindowKey } from './period'
export type { PeriodWindow as CycleWindow } from './period'

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
