# Company Analytics & Administration Dashboard — Implementation Report

Phase 10: the administration dashboard — KPI tiles, four simple charts, an
employee performance table, a team comparison, a per-employee performance
profile, and the two admin surfaces the product was missing (company profile
editing and a gamification-rules editor). Every number is computed from real
task rows, review scores and the XP/coin ledgers; nothing is cached, counted
by hand or invented. Persian-first and RTL throughout.

## Scope

- **KPIs** — eleven tiles on one screen: total and active employees, all
  tasks, completed tasks, pending reviews, overdue tasks, average score,
  on-time rate, total XP generated, coins earned and coins redeemed.
- **Employee performance table** — one row per person: completed tasks,
  average score, on-time rate, XP, level (and its Persian title), coins
  earned/spent, achievements, recognition received, current streak.
- **Team performance** — per team: completion rate (a real bar, not a
  number in a cell), average score, on-time rate, active tasks, overdue
  tasks, member count.
- **Charts** — four, deliberately simple: tasks completed over time (bar),
  average score over time (line, 0–100 fixed axis), XP earned over time
  (bar), coins earned vs redeemed (two-series line). Hand-rolled SVG — the
  project has no chart dependency, and these two shapes are all the story
  needs. LTR plots (time reads left→right in charts everywhere), Persian
  labels, native `<title>` tooltips.
- **Employee details** — `/members/:id` gains a *performance profile*: six
  headline tiles, the 30-day score trend the average came from, and the
  latest approved tasks with their grades — a review conversation, not a
  database record.
- **Administration surfaces** — an editable company name in settings
  (`PATCH /api/companies`), and the first UI over the existing
  `GET/PUT /api/rewards/rules` economy endpoints: a rules card plus a
  grouped editor modal. The analytics page doubles as an admin hub with
  permission-gated shortcuts to the management pages.

## Permissions & scope

One new permission, `analytics:read`: OWNER/ADMIN get it through `'*'`,
MANAGER explicitly, EMPLOYEE not at all. The route
(`GET /api/analytics/overview`, `requirePermission`) enforces it; the nav
item («تحلیل سازمان») is filtered by the same permission, and a hand-typed
URL gets a plain 403 screen, never a smaller chart.

Scope is decided by role **inside the service**, not by a query parameter:

| Role | Population | Teams | Label |
| --- | --- | --- | --- |
| OWNER / ADMIN | the whole company | all company teams | «نمای کل سازمان» |
| MANAGER | their transitive subordinates (`getManagedUserIds`, self excluded) | teams they lead | «نمای تیمی» |
| EMPLOYEE | — (403) | — | — |

The member-detail profile keeps its existing visibility rules (self, the
management chain, or `member:manage`) — the performance block adds no new
reach, only new depth for people who could already see the page.

## Where each number comes from

All of it is derived on request, through the tenant-scoped Prisma client —
which is what makes cross-tenant leakage a non-question:

- **Completed** = tasks with status `APPROVED`. **Pending reviews** =
  `SUBMITTED`. **Overdue** = `dueDate < now` and not in
  `CLOSED_TASK_STATUSES` (undated tasks never count as late).
- **Score** lives on `TaskReview`, not on `Task`: approval *requires* a
  score and `APPROVED` is terminal, so every approved task has exactly one
  APPROVED review carrying its grade. That review is the single source of
  "performance" — the company average, the per-employee average, the team
  average and the trend all read the same rows.
- **On-time** = `completedAt <= dueDate`, over approved tasks that *have* a
  due date; the rate is `null` when the denominator is empty.
- **XP / coins** — straight sums over `XpTransaction` and `CoinTransaction`
  for the scoped users (credits are positive rows; `coinsRedeemed` is the
  magnitude of `REWARD_REDEMPTION` debits). Per-employee lifetime
  earned/spent come from the `Wallet` counters the ledger maintains.
- **Series** — daily buckets over the last 30 days, keyed by
  `localDayKey(instant, company.timezone)` so a 23:30 Tehran approval lands
  on the Tehran day, zero-filled, and *gapped* (not zeroed) on days with no
  scored work: an empty day is missing data, not a performance collapse.

The honest-null rule runs through everything: an employee with no scored
tasks has **no** average and **no** on-time rate (`—`), not `0` — in the
KPIs, the table, the team rows and the charts alike.

## Concurrency discipline

The development database is PGlite behind a socket with a small connection
cap. The first cut of the aggregation fanned fourteen queries out at once
and took the whole database down with it — a lesson now encoded in both
read paths: `buildAnalyticsOverview` runs three waves of at most five
queries, and `members/[id]` two waves of five. Real PostgreSQL does not
care; PGlite very much does, and the waves cost single-digit milliseconds.

## API

| Method | Path | Who | Notes |
| --- | --- | --- | --- |
| `GET` | `/api/analytics/overview` | `analytics:read` | One chatty response: `scope`, `range` (30 days), `kpis`, `teams[]`, `employees[]`, `series{tasksCompleted, averageScore, xpEarned, coins{earned, redeemed}}` — every number on the page describes the same instant. |
| `GET` | `/api/members/:id` | visibility unchanged | Response gains `performanceProfile`: `tasksCompleted`, `averageScore`, `onTimeRate`, `coinsEarned/Spent`, `achievements`, `recognition`, `scoreTrend` (30 days), `recentTasks` (8). |
| `PATCH` | `/api/companies` | `company:update` | Body `{ name }` (`updateCompanySchema`, 2–120 chars). Name-only on purpose: the slug is the tenant's public address and timezone/locale are onboarding decisions the streak and cycle calendars are built on. Returns the updated `CompanySummary`. |
| `GET` / `PUT` | `/api/rewards/rules` | any authed / `reward:manage` | Unchanged endpoints (phase 4); the rewards admin page now gives them a card and a grouped editor. Saving publishes a **new version** — history stays explained by the rules that produced it. |

## UI

- `app/pages/analytics/index.vue` — the dashboard. KPI grid, chart grid,
  team comparison with horizontal completion bars, the employee table
  (overflow-safe, every cell a link-free number except the name, which
  opens the member profile), and the admin hub for
  `company:update` holders.
- `app/components/analytics/AnalyticsBarChart.vue` /
  `AnalyticsLineChart.vue` — the two chart shapes. `currentColor` +
  Tailwind text classes keep them theme-aware; the y-axis picks a
  "nice" ceiling (1/2/2.5/5 × 10^k) or a fixed one (scores: 100); the
  x-axis labels the first, every fifth and the last day.
- `app/pages/members/[id].vue` — the performance profile section.
- `app/pages/settings/index.vue` — editable company name (with the
  session refreshed so the header follows), read-only slug/timezone/locale
  and a hint explaining why.
- `app/pages/rewards/admin.vue` — «قوانین گیمیفیکیشن» card + modal: the 19
  rule fields grouped the way the payout formula reads (base, priority,
  quality, bonuses, penalties, caps).

All strings are in `i18n/locales/{fa,en}.json` under `analytics.*`,
`settings.*` and `rewards.admin.rules.*`.

## Tests

- **Unit** (`test/analytics.test.ts`) — the pure helpers: local day keys
  across timezones and month boundaries, range generation, rounding,
  honest nulls, zero-filled and gapped series, on-time edge cases
  (deadline-exact counts as on time). Plus `analytics:read` in the
  permission matrix test.
- **Integration** (`test/integration/analytics.integration.test.ts`, 14
  tests) — two fresh tenants, driven entirely through the real endpoints:
  - *visibility*: employee 403; manager sees exactly her two subordinates
    and her one led team; owner sees the company.
  - *accuracy*: scores 90 (on time) and 70 (late) → `averageScore` 80,
    `onTimeRate` 50; one overdue TODO and one SUBMITTED → the exact KPIs;
    XP/coin KPIs equal SQL sums over the ledgers to the unit; a 50-coin
    redemption → `coinsRedeemed` 50 and `coinsSpent` 50; series lengths,
    first day key, today's points and windowed sums.
  - *profile*: the member-detail `performanceProfile` repeats the same
    numbers; the employee can read their own.
  - *isolation*: tenant B's admin sees exactly tenant B — two employees,
    zero tasks, null averages, no tenant-A name anywhere.
  - *company profile*: manager 403 on `PATCH /api/companies`; admin rename
    echoes and persists; a too-short name is 422.

## What is deliberately not here

- No CSV export, no date-range picker (the window is 30 days by design),
  no custom dashboards. Charts answer "how are we doing", not "everything
  about anything".
- No per-employee drill-down charts on the analytics page — the member
  profile is the drill-down.
- Timezone/locale editing stays an operational change, not a settings
  toggle (see `updateCompanySchema`'s comment for the reasoning).
