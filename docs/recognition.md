# Employee Recognition — Implementation Report

Phase 6: peer-to-peer recognition — recurring weekly/monthly cycles, one vote
per coworker per category, and an idempotent finalization step that tallies
winners, seals results and pays rewards through the existing ledgers. Persian-first
and RTL throughout.

## Scope

- **Categories** — the voting buckets («مسئول‌ترین همکار», «بهترین هم‌تیمی», …).
  An admin can create, edit, reorder and disable them, and configure each
  category's reward (XP, coins, optional badge) and the title the winner earns.
- **Cycles** — weekly (Monday → Monday) or monthly (1st → 1st) in the company
  timezone, with the cadence configurable by an admin. Changing the cadence
  closes the current cycle immediately and opens a fresh one.
- **Voting** — each employee chooses **one coworker per category per cycle**.
  Self-voting and duplicate votes are rejected; cross-company nominees resolve
  to nothing (a 404, not a leak).
- **Privacy** — votes are written and never read back by the API. The only
  things exposed are the caller's *own* selection and aggregated results
  (winner + count). There is no endpoint that returns who voted for whom.
- **Finalization** — at cycle end the engine tallies winners, creates a
  `RecognitionResult`, assigns the title, grants XP and coins, and unlocks the
  linked badge — all in one transaction, and at-most-once by construction.

## The cycle window (`shared/utils/recognition.ts`)

`cycleWindow(frequency, reference, timeZone)` returns the half-open interval the
reference instant falls into:

- **WEEKLY** — the Monday (00:00 wall-clock) on or before `reference` through
  the following Monday.
- **MONTHLY** — the 1st of the month through the next 1st.

The maths is DST-safe: wall-clock midnight is converted to UTC by iterating
against the fixed wall-clock target and the timezone's offset at each guess
(`zonedMidnightToUtc`), so boundaries stay correct across DST transitions in
zones such as `America/New_York` and are stable in fixed-offset zones such as
`Asia/Tehran`. `tallyVotes` and `pickWinner` are deterministic: nominees are
ranked by vote count descending, then by earliest first vote, then by id — so
ties break the same way every run.

## The engine (`server/utils/recognition.ts`)

- `ensureActiveCycle` — returns the ACTIVE cycle, creating it when none exists;
  a cycle that has expired, or belongs to a *previous* cadence, is finalized
  first so winners are always tallied before a fresh cycle opens. Creation is
  guarded by the unique `(companyId, frequency, startsAt)` index for the rare
  concurrent first-vote race.
- `castVote` — the only way a vote is created. Guards, in order: the category
  must exist and be active; nobody may vote for themselves; the nominee must be
  an ACTIVE member of the same company; a voter gets exactly one choice per
  category per cycle (the `(cycleId, categoryId, voterId)` unique index plus an
  explicit check for a clean `409 ALREADY_VOTED`).
- `finalizeDueCycles` / `finalizeCycle` — finalize every ACTIVE cycle whose
  window has closed. Per category with votes: `pickWinner` selects the winner,
  a `RecognitionResult` is sealed (with a `titleName` snapshot), XP and coins
  are paid through `applyXpDelta` / `applyCoinDelta`, the badge is granted if
  configured, and a `RECOGNITION_RECEIVED` notification is created. The cycle
  then flips to `FINALIZED`, which is terminal — it never re-runs.

### Idempotency

Re-finalizing pays nothing twice:

- the `(cycleId, categoryId)` unique index means a result is sealed once;
- the ledger writes are keyed `recognition:result:<id>:xp` and
  `recognition:result:<id>:coins`, so the wallet's unique `(companyId,
  idempotencyKey)` index makes the payout at-most-once by construction;
- a finalized cycle no longer matches the "due" query, so a re-run is a no-op.

## API surface

| route | access | purpose |
| --- | --- | --- |
| `GET /api/recognition` | any member | the voting board: active cycle, categories with `myVote`, the coworker directory, and the latest finalized winners (aggregated) |
| `POST /api/recognition/vote` | `recognition:create` | nominate one coworker for one category |
| `GET /api/recognition/admin` | `recognition:manage` | categories (incl. disabled, with live vote counts), titles, badges, active cycle |
| `POST /api/recognition/categories` | `recognition:manage` | create a category with its reward config |
| `PATCH /api/recognition/categories/:id` | `recognition:manage` | edit / reorder / disable a category |
| `PUT /api/recognition/cycle` | `recognition:manage` | set the cadence (weekly / monthly) |
| `POST /api/recognition/finalize` | `recognition:manage` | tally and seal every closed cycle (idempotent) |
| `POST /api/recognition/titles` | `recognition:manage` | create an admin title |

`recognition:manage` is OWNER/ADMIN-only (`shared/utils/permissions.ts`); every
member holds `recognition:create`. No reward arithmetic lives in a Vue
component — the numbers the UI shows are always the server's.

## UI

- `app/pages/recognition.vue` — the board: cycle header with a guarded date
  range, category cards with a coworker picker (avatars, one choice per
  category), and a winners section showing aggregated results only.
- `app/pages/recognition/admin.vue` — cadence toggle, category create/edit,
  disable, reward and title configuration.
- `app/components/recognition/` — `CategoryCard.vue`, `CoworkerPicker.vue`,
  `WinnerCard.vue`.
- `app/composables/useNav.ts` — the `recognition` nav item
  (`/recognition`, `i-heroicons-hand-thumb-up`).

The interface is Persian-first and RTL; the English locale is wired but
secondary. Animations are subtle (card hover, picker highlight) and honour
`prefers-reduced-motion`.

## Data model

Five new tables, all tenant-scoped with `companyId` + `ON DELETE CASCADE`:

- `RecognitionCycle` — `frequency`, `status` (ACTIVE/FINALIZED/CANCELLED),
  `startsAt`/`endsAt`, unique on `(companyId, frequency, startsAt)`.
- `RecognitionCategory` — name, description, icon/tone, `sortOrder`,
  `isActive`, `xpReward`, `coinReward`, optional `titleId`/`badgeId`.
- `RecognitionVote` — `(cycleId, categoryId, voterId, nomineeId)`, unique on
  `(cycleId, categoryId, voterId)` (the duplicate-vote guard).
- `RecognitionResult` — `winnerId`, `voteCount`, denormalised `titleName`,
  `xpReward`/`coinReward`, `rewardedAt`, unique on `(cycleId, categoryId)`.
- `RecognitionTitle` — system-defined (seeded) or admin-created names.

Rewards reuse the existing `LedgerSource.RECOGNITION` and
`CoinTransactionType.RECOGNITION_REWARD` enums, so no enum migration was needed.

## Tests

- **Unit** (`test/recognition.test.ts`) — 10 tests: weekly Monday boundaries,
  monthly boundaries, timezone awareness (Asia/Tehran vs. UTC), tally ordering,
  the equal-count earliest-first-vote tie-break, the id tie-break, and the
  null/top `pickWinner` cases.
- **Integration** (`test/integration/recognition.integration.test.ts`) — 9 tests
  against a real server + database: a nomination is recorded; a self-vote is
  rejected (`400 SELF_VOTE`); a duplicate vote is rejected (`409
  ALREADY_VOTED`); cross-company voting — both the nominee and the category
  directions — is a 404; an admin can create and disable a category (which then
  disappears from the board and refuses votes); employees cannot manage
  categories or the cadence; switching cadence takes effect; and finalization
  tallies winners, seals results, pays XP and coins through the ledgers exactly
  once, notifies the winner, and pays nothing on re-finalization.

`typecheck`, `lint`, the unit suite (194 tests) and the integration suite
(188 tests) all pass.

## Known limitations

- The board returns the latest three finalized cycles; there is no paginated
  results history endpoint yet.
- The category's title/badge are configured per-category only; there is no
  "company-wide default title" setting.
- Winner notification copy is fixed Persian prose in the engine; it can be moved
  into the i18n catalogue later without schema change.
