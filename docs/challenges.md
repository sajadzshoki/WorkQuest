# Challenges — Implementation Report

Phase 8: individual and team challenges with goals measured from real
application data. Persian-first and RTL throughout.

## Scope

- **Types** — `INDIVIDUAL` (every enrolled member races their own bar;
  scoped to the whole company or one team) and `TEAM` (one shared bar filled
  by the team's tagged task board; won together, paid to every enrolled
  participant, or not at all).
- **Goals** — `tasks_completed` (N approved tasks in the window) and
  `on_time_rate` / `team_completion_rate` (percent goals, judged **only at
  the deadline**: "maintain 90 %" is a promise about the whole window, so an
  early 100 % on three tasks must not lock the win in). Count goals pay the
  moment they are reached.
- **Model** — `Challenge` (title, description, type, teamId, goalKey,
  goalValue, xpReward, coinReward, startsAt, endsAt, status, badgeId) and
  `ChallengeParticipant` (per-person progress, status, completedAt,
  rewardedAt). Progress is a **read-model**: there is no endpoint that
  accepts a progress value and no code path that fakes one.
- **Lifecycle** — `DRAFT → ACTIVE → COMPLETED / ENDED / CANCELLED`.
  Managers create and edit **before the start**, cancel while live, watch
  progress and the roster. A manager's reach stops at the teams they lead;
  company-wide challenges stay with OWNER/ADMIN. A TEAM challenge whose team
  was deleted is auto-cancelled; a DRAFT whose window closed unseen is born
  `ENDED` and never enrolls anybody.
- **Completion** — one transaction: mark the participant `CLAIMED`, pay XP
  and coins through the ledgers, grant the linked badge, re-evaluate the
  achievement catalogue, notify the user. At-most-once by construction: the
  ledger keys `challenge:<id>:user:<uid>:{xp|coins}` plus the `CLAIMED`
  marker mean a re-run pays nothing.
- **Windows** — `[startsAt, min(endsAt, now)]`; work approved after the
  deadline never counts, and the on-time denominator excludes undated tasks.

## The engine (`server/utils/challenges.ts`)

The clock is the only scheduler: the engine runs wherever a challenges
surface is read (list, detail, dashboard summary) and after every task
transition that can move a number, so a closed window is always resolved
before anybody sees it. Concurrent runs serialise on a row lock; progress is
computed batched per challenge (one grouped query per goal kind, not one
query per participant).

## API

- `GET /api/challenges` — the board with per-status counts; DRAFTs visible
  only to managers in scope; a CANCELLED challenge is history only when it
  actually ran.
- `POST /api/challenges` / `PATCH /api/challenges/:id` (409 once started) /
  `POST /api/challenges/:id/cancel` (409 when already terminal).
- `GET /api/challenges/:id` — detail plus the roster (managers only).
- `GET /api/dashboard` — the caller's active challenge with real progress.
- `POST /api/tasks/:id/transition` — approvals report the completions they
  caused in `challengeCompletions` so the UI can celebrate them.

## UI

`/challenges` — status filter chips over live counts, running races above
the fold and history below, create/edit modal with the six product presets,
a roster modal (finishers first, per-person bars), and a two-step cancel.
Exciting cards: status-coloured hero, the bar the caller is actually racing
(own vs. team), remaining time with a last-day state, the prize line,
participants and finishers. The dashboard card shows engine-computed
progress and links to the board.

## Tests

Unit (`test/challenges.test.ts`) covers the goal vocabulary, windows,
percent maths, editability and participant phases; the shared suite runs the
endpoints through `test/integration` — task approvals drive live progress,
boundaries pay exactly at the line, and the notifications integration file
proves challenge start/completion notify exactly once across engine re-runs.
