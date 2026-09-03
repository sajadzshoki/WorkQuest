# Gamification Layer — Implementation Report

Phase 3: levels, achievements, badges, streaks and the employee profile —
server-calculated, data-driven, Persian-first and RTL, with animations kept
deliberately subtle.

## Scope

- **Levels** — XP, current level and progress to the next level, resolved by a
  single reusable server-side service.
- **Achievements** — First Task, 10 / 50 / 100 Tasks Completed, Perfect Week,
  Team Player, Problem Solver, MVP, Rising Star. Permanent once earned, and
  defined as *data* so an admin can add new ones without code.
- **Badges** — the visual face of an achievement, rendered by reusable
  components everywhere a badge appears.
- **Streaks** — a simple, reliable consecutive-day system (7 / 14 / 30 day
  milestones). No daily quests.
- **Profile** — avatar, name, position, level, XP, XP progress, coins, badges,
  achievements, current streak and recent activity in one round trip.
- **Animations** — subtle only: level up, achievement unlocked, coin earned,
  badge unlocked. Everything honours `prefers-reduced-motion`.

## The central idea: achievements are data, not code

An achievement is an `Achievement` row whose `criteria` JSON names a metric and
a threshold:

```json
{ "metric": "tasks_approved", "threshold": 10 }
```

`shared/utils/achievements.ts` is the single interpreter of that JSON. The
metric vocabulary it understands is exactly what the server can compute
(`server/utils/gamification.ts`), and nothing else:

| metric | meaning |
| --- | --- |
| `tasks_approved` | approved tasks assigned to the user |
| `revisions_overcome` | approved tasks that survived a revision loop |
| `recognitions_received` | recognitions received from colleagues |
| `streak_days` | current consecutive-activity streak |
| `level` | current level on the company ladder |
| `total_xp` | lifetime XP |

Evaluation is `>=` (not `===`) on purpose: metrics are monotonic, so an unlock
survives overshooting the threshold between evaluations. An admin adds a new
achievement by inserting a row with a `key`, a `criteria` and reward amounts —
the engine picks it up on the next evaluation. Nothing about the reward
arithmetic lives in Vue components; the numbers a client shows are always the
server's.

## Level calculation service

`server/utils/levels.ts` exposes `resolveLevelProgress(db, companyId, xp)`. It
is the only level resolver used by the API (`/api/me`, `/api/wallet`,
`/api/dashboard/summary`, `/api/profile`), and it returns the shared
`LevelProgress` (`level`, `currentXp`, `neededXp`, `percent`, `title`) plus the
next rung (`next`, `levelId`, `iconKey`) so a screen never has to derive the
boundary for itself. The underlying arithmetic is the pure, unit-tested
`shared/utils/xp.ts`.

## Streaks

`shared/utils/streak.ts` holds the pure, timezone-aware maths:

- a "streak day" is a calendar day in the **user's** timezone (the company
  timezone, passed in by the server);
- activity on the next consecutive day extends the run; a gap of one or more
  days resets it to 1; the same day is a no-op (idempotent);
- `longest` is a high-water mark and never decreases;
- milestones are exactly `[7, 14, 30]`, exposed with their reached flags and the
  next target.

`runGamification` advances the streak at most once per calendar day and persists
`UserProgress.currentStreak / longestStreak / lastActiveDate` in the same
transaction as the event that caused it.

## The gamification engine

`server/utils/gamification.ts` is the only place a streak is advanced or an
achievement unlocked. It runs **inside the same transaction** as the task
approval (`POST /api/tasks/:id/transition`), after the task payout, so an unlock
and its ledger rows commit or roll back together. Per approval it:

1. advances the streak;
2. computes the metric snapshot (`computeMetrics`);
3. evaluates the ACTIVE catalogue;
4. for each newly-unlocked achievement: writes the `UserAchievement` row, pays
   its XP and coins through the ledgers (`applyXpDelta` / `applyCoinDelta`),
   awards any badges linked to it, and creates an `ACHIEVEMENT_UNLOCKED`
   notification.

### Idempotency and no-duplicate-rewards

The previous "create and catch the unique violation" pattern turned out to be
unsound inside a Postgres transaction: a constraint violation aborts the *whole*
transaction (`25P02`), so a user who already held a seeded achievement broke
every subsequent approval. The engine now uses **check-then-create**:

- read `UserAchievement` / `UserBadge` first, and skip the write when the row
  already exists;
- the unique `(userId, achievementId)` and `(userId, badgeId)` indexes remain
  the hard guarantee — they simply never fire on the normal path, only when two
  first-approvals genuinely race;
- the XP and coin ledgers are keyed `achievement:<id>:<user>:xp` and
  `achievement:<id>:<user>:coins`, so a payout is at-most-once by construction.

This is proven end to end (`test/integration/gamification.integration.test.ts`):
the first approval unlocks once, pays once, awards the badge once and notifies
once; a second approval unlocks nothing and pays nothing further.

## API surface

- `GET /api/achievements` — the catalogue merged with the caller's unlock
  state, per-achievement progress, the badge shelf and the streak with its
  milestones.
- `GET /api/profile` — the employee's own gamified profile in one round trip:
  identity, server-computed level and XP progress, authoritative wallet
  balance, badges, achievements (locked ones with progress), streak and recent
  activity.
- `GET /api/members/:id` — the manager-facing member profile now also returns
  `badges`.
- `POST /api/tasks/:id/transition` — on approval, now returns a `gamification`
  field (`streak`, `achievements`, `badges`) alongside `reward` and `payout`.

## UI

- `app/components/gamification/` — `Badge.vue` (the one badge renderer, with
  tone / size / locked states), `AchievementCard.vue` (catalogue card with
  progress bar and reward chips), `StreakCard.vue` (current / longest runs and
  the 7-14-30 milestone track), plus the existing `XpProgress`, `StatTile` and
  `ProgressCard`.
- `app/pages/profile.vue` — the full profile surface, consuming `/api/profile`.
- `app/pages/achievements.vue` — catalogue + streak + badge shelf.
- `app/components/gamification/Celebration.vue` + `app/composables/useCelebration.ts`
  — a single app-shell queue for unlock toasts. `TaskReviewModal.vue` pushes the
  server's payout/gamification result onto it, so a level-up from deep inside a
  modal surfaces at the shell. The CSS (`wq-anim-pop`, `wq-badge-shine`,
  `wq-ring-pulse`) is subtle and disabled under reduced motion.

The interface is Persian-first and RTL; the English locale is wired but
secondary.

## Tests

- **Unit** (`test/gamification.test.ts`): streak advancement (first activity,
  consecutive day, same-day no-op, gap reset, high-water mark, timezone-aware
  day keys), milestone helpers, and `evaluateAchievement` (threshold `>=`
  semantics, malformed-criteria rejection, unknown-metric rejection).
- **Integration** (`test/integration/gamification.integration.test.ts`):
  first approval unlocks `first_approved_task`, pays its XP and coins through
  the ledgers exactly once, awards the linked badge, notifies once; a second
  approval re-awards nothing; a streak advances once per calendar day and is
  persisted.
- Level maths are covered by the existing `test/xp.test.ts`.

`typecheck`, `lint`, the unit suite (`184` tests) and the integration suite
(`179` tests) all pass.

## Known limitations

- The dev seed's `reviewer_fast` achievement uses a `fast_reviews` metric that
  the engine does not compute, so it stays locked by design (it is a seed
  fixture, not part of the shipped achievement set). Admins define achievements
  against the documented `ACHIEVEMENT_METRICS` vocabulary above.
- Unlock notification text is currently fixed Persian prose in the engine; it
  can be moved into the i18n catalogue later without schema change.
