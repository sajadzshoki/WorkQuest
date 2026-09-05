# Windowed Leaderboards — Implementation Report

Weekly, monthly, team and personal-progress boards, ranked on **performance XP
plus achievement progress** inside a calendar window. There is no all-time
board, no coin ranking, and no screen that lists every employee's position: a
board is the top few names plus your own place. Resetting a period is the window
moving forward — XP, coins, levels and achievements are never touched.
Persian-first and RTL throughout.

## Scope

- **Periods** — `week` (Monday → Monday) and `month` (1st → 1st), in the company
  timezone. The old `range=all` option is gone: `LEADERBOARD_PERIODS` is
  `['week', 'month']` and the zod schema rejects anything else, so a permanent
  ranking cannot even be requested.
- **Scopes** — `company` (the whole tenant) and `team` (one team the caller may
  see), plus a third surface, **personal progress**, which is its own endpoint
  and only ever answers about the caller.
- **Ranking** — derived from the immutable ledgers: XP rows whose source counts
  as performance, XP paid by achievements, and a flat bonus per achievement
  unlocked in the window. Coins are never read.
- **Reset** — nothing is deleted, zeroed or backfilled. A period is a query
  bound; when the calendar moves, the board turns over by itself and the
  lifetime totals (`UserProgress`, wallets, `UserAchievement`) stay exactly as
  they were.
- **Privacy** — at most five rows, always including the caller's own rank, with
  the distance to the next rank expressed as a number and never as a name.

## The period window (`shared/utils/period.ts`)

`calendarWindow(cadence, reference, timeZone)` returns the half-open interval
`[startsAt, endsAt)` the reference instant falls into:

- **WEEKLY** — Monday 00:00 wall-clock through the following Monday.
- **MONTHLY** — the 1st through the 1st of the next month.

Wall-clock midnight is converted to UTC by iterating against a fixed target
(`zonedMidnightToUtc`), so boundaries stay correct across DST transitions
(`America/New_York`) and are stable in fixed-offset zones (`Asia/Tehran`).
Half-open matters: an event exactly on the boundary belongs to the *later*
window, which is what makes consecutive periods add up without double-counting.

Alongside it: `previousCalendarWindow` (the period before, for comparisons and
movement), `calendarWindowKey` (a stable `week:2026-08-31` identity for caching
and tests), `daysUntil` (the "۳ روز تا پایان دوره" chip) and `isInsideWindow`.

Recognition cycles previously carried their own copy of this maths. They now
re-export it (`cycleWindow`, `cycleWindowKey`, `CycleWindow`), so "a week" means
the same thing in both features and the duplication is gone — 108 lines removed
from `shared/utils/recognition.ts` with no behaviour change (its 9 integration
tests still pass).

## Scoring (`shared/utils/leaderboard.ts`)

```
score = performanceXp × 1          (TASK_REVIEW, STREAK, RECOGNITION,
                                    CHALLENGE, MANUAL_ADJUSTMENT, REFUND)
      + achievementXp × 1          (ACHIEVEMENT — what an unlock pays)
      + achievementsUnlocked × 50  (progress as a ranking input in its own right)
```

- `leaderboardScore` rounds and clamps at zero: a corrective negative ledger row
  can move somebody down, but can never put them in "negative rank" territory.
- `REWARD_REDEMPTION` is classified `unranked` and dropped during aggregation.
  Spending coins you earned is not performance, and must not cost a place.
- Coins are not an input anywhere. There is no code path from a wallet balance
  to a rank, which is the whole point of ranking on XP: the board rewards work,
  not thrift.
- The weights live in one exported object (`LEADERBOARD_SCORING`) and
  `scoringExplanation()` ships them to the client, so the UI's "how is this
  score built?" panel always describes the formula the server actually used.

## Ranking and determinism

- `aggregateParticipants` folds a window's XP rows and unlocks into one record
  per person, tracking `reachedScoreAt` — the instant the running score first
  reached its final value.
- `rankParticipants` uses **competition ranking**: equal scores share a rank and
  the next rank is skipped (1, 1, 3). Only scores above zero count as
  participants, so an empty board is honest rather than padded.
- Display order inside a tie is total: score desc → achievements unlocked desc →
  `reachedScoreAt` asc → user id asc. Two requests over the same data can never
  disagree, and nobody's row flickers between page loads.
- `rankForScore` answers "what rank is this score?" for a single person, which
  is how the caller's own place is computed when they are outside the visible
  rows; `pointsToNextRank` gives the gap to the rank above as a bare number.
- Suspended accounts are filtered out before ranking (`activeMemberIds`), so
  leaving the company removes a row instead of freezing one in place.

## Privacy

- `MAX_LEADERBOARD_ENTRIES = 5`, `PODIUM_SIZE = 3`, and the query schema accepts
  `limit` only between them. The server clamps again — a client asking for 500
  gets a validation error, not a list.
- `selectBoard` is the only projection the API may serve: the top N rows. There
  is deliberately no helper that returns a full ranking, and no pagination to
  walk one into existence.
- The caller's own row is always in the response (`me`: rank, score, XP,
  achievements unlocked, distance to the next rank, `inScope`), even from rank
  40, and even when they are watching a team they do not belong to — where
  `rank` is `null` rather than a misleading zero.
- Board rows carry name, avatar, job title, role, level, XP, score, streak and
  up to three achievement chips. No phone number, no email.
- Being unranked is written as an invitation («با تکمیل و تأیید یک تسک، نام شما
  روی جدول می‌آید»), never as a last place.

## Team boards and access

`resolveTeamAccess` builds the graph once per request and `canViewTeamLeaderboard`
(a pure rule, unit-tested) decides it:

| role | teams they may open |
| --- | --- |
| OWNER / ADMIN | every team in the company |
| MANAGER | teams they lead, teams they sit in, and teams their transitive reports sit in |
| EMPLOYEE | their own team only |

- No `teamId` → the caller's own team (`defaultTeamId`: led first, then member).
- A team scope for somebody with no team returns an **empty board**, not a
  company-wide one wearing a team label.
- Unknown id in this tenant → `404`. Known but out of reach → `403`, never a
  silent fallback to a board they *may* see, which would hide the mistake.
- `availableTeams` only ever lists teams the caller may open, with `isMember` /
  `isLead` flags so the picker can say «تیم شما».

## API surface

| route | access | purpose |
| --- | --- | --- |
| `GET /api/leaderboard?period&scope&teamId&limit` | `leaderboard:read` (every role) | the windowed board: window, top rows, `me`, participants, teams in scope, scoring formula |
| `GET /api/leaderboard/progress?weeks&months` | `leaderboard:read` | the caller's own week and month versus the previous ones, a series of past windows, rank movement, and lifetime totals |
| `GET /api/dashboard/summary` | any member | the «پیشروهای این هفته» strip — the same weekly board through the same service, capped at three |

All ranking arithmetic lives in `server/utils/leaderboard.ts`
(`buildLeaderboard`, `buildPersonalProgress`); the handlers only validate the
query and authorise the caller. No number the UI shows is computed in a Vue
component.

History is bounded too: `weeks` ≤ 8, `months` ≤ 6, both ≥ 2 — long enough for a
trend, short enough that one ledger query covers it.

## UI

- `app/pages/leaderboard.vue` — three tabs (شرکت / تیم / پیشرفت شخصی), a
  week–month switch, a team picker shown only when the caller has more than one
  choice, the period header (window dates, days left, participants), the board,
  the "your position" card, the scoring note, and the reset + privacy notes.
- `app/components/leaderboard/` — `Podium.vue` (top three, winner centred),
  `EntryRow.vue` (ranks 4–5), `RankMedal.vue`, `AchievementChips.vue`,
  `MeCard.vue`, `ScoringNote.vue`, `PeriodProgressCard.vue`, `ScoreDelta.vue`,
  `ProgressSeries.vue`.
- `app/composables/useLeaderboard.ts` — owns the request shape so the query
  string and the server schema cannot drift apart.
- `app/pages/dashboard.vue` — the weekly strip now renders the real board: rank
  medals, scores, `isMe` highlight, days left, and an empty state that invites
  rather than shames.

RTL details that were easy to get wrong: the podium's DOM order is
`[2nd, 1st, 3rd]`, which puts the winner in the centre once the row is laid out
right-to-left, and medal styling keys off rank rather than DOM index so a tie
cannot mis-medal anybody. A *fall* in score is amber, not red — the board is
meant to motivate. The progress sparkline runs oldest → newest, matching the
direction Persian readers scan a timeline of their own history.

## Data model

No new tables and no backfill. A period is derived from the ledgers that already
exist, so the migration is two indexes for the two windowed scans:

```sql
CREATE INDEX "XpTransaction_companyId_createdAt_idx"   ON "XpTransaction"("companyId", "createdAt");
CREATE INDEX "UserAchievement_companyId_unlockedAt_idx" ON "UserAchievement"("companyId", "unlockedAt");
```

Both queries are company-wide and time-bounded; the existing indexes lead with
`companyId, userId` and could not serve them without scanning a person at a time.

`prisma/seed.ts` now writes XP as **dated ledger rows** spread across the
current week, the previous week, the current month and beyond (instead of one
row per person), and backdates `UserAchievement.unlockedAt`, so the seeded
tenant exercises real windows. The split preserves each person's XP total —
`UserProgress.xp` still equals the sum of their ledger rows — and coin rows are
untouched, which keeps the wallet invariant the rewards suite asserts.

## Tests

- **Unit** (`test/leaderboard.test.ts`, 42 tests) — weekly/monthly boundaries,
  half-open edges, a year boundary, months of different lengths, timezone
  disagreement on the same instant, a DST fall-back stretching a week, window
  keys, days-left; the score formula and its clamp; coin-blindness; dropping
  redemptions; `reachedScoreAt`; competition ranking and every tie-breaker;
  stability across repeated runs; the privacy ceiling and limit clamping;
  `activitySeries` bucketing; and team access per role.
- **Integration** (`test/integration/leaderboard.integration.test.ts`, 38 tests)
  — against a real server and database, with a purpose-built tenant (owner,
  three managers in a reporting chain, six employees, one suspended account).
  It builds its own fixture rows and **re-derives the expected ranking with the
  same shared pure functions** the server uses, so the API and the maths cannot
  drift apart silently. Covered: the window reported in the company timezone;
  no all-time period; activity outside the window never counted; ranking equals
  the shared maths; not a coin ranking (one account holds 99,999 coins and still ranks
  below a colleague with none); achievement progress counted on top of its XP; redemptions ignored;
  level and lifetime XP permanent while the board turns over; suspended accounts
  absent; the dashboard strip agreeing with the board; ties sharing a rank and
  ordering identically on every request; top-five cap and refusal of a bigger
  one; own rank from outside the top five; the invitation copy for an unranked
  caller; no contact details on a row; team defaults, subordinate-team access,
  the empty board for somebody with no team, `403` outside the span of control,
  `404` for another company's team; tenant isolation in both directions against
  the seeded tenant; session required; every role able to read; malformed
  `teamId` rejected; and the personal-progress endpoint — lifetime totals out of
  the reset, week-over-week deltas, company and team rank, the series ending on
  the current window, answering only about the caller, honesty for somebody with
  no activity at all, and the history caps.

`typecheck`, `lint`, the unit suite (236 tests) and the full integration suite
(226 tests across 7 files) all pass. `auth.integration.test.ts` was updated
where it asserted the old `{ items }` leaderboard shape; it now checks the
windowed response and that a brand-new tenant's board is empty.

## Known limitations

- The scoring weights are global constants, not per-company settings.
  `LEADERBOARD_SCORING` is the single place to change them, and the UI reads the
  formula from the API, so a future admin setting needs no client change.
- A board is computed per request from the ledgers. At this scale that is one
  bounded query per window; a materialised snapshot per `calendarWindowKey` is
  the obvious next step if a tenant grows large.
- Team boards rank the team's members only; there is no "team versus team"
  board yet.
- Rank movement compares against the immediately previous window, so somebody
  who was absent two periods ago reads as «دورهٔ قبل روی جدول نبودید» rather
  than a computed delta.
