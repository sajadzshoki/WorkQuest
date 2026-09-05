# AI_CONTEXT.md — WorkQuest

**Purpose:** a complete, code-verified handoff for an AI coding agent taking
over this project. Everything below describes what **actually exists** in the
repository; anything from earlier requirement lists that was never built is
explicitly marked **NOT IMPLEMENTED**. The last full verification (lint,
typecheck, unit, integration, build) is recorded in `PROJECT_STATUS.md`.

**One rule above all others: the application UI is Persian-first and RTL.**
All user-facing copy goes through `i18n/locales/fa.json` (with `en.json` kept
in 1:1 key parity), numbers render as Persian digits, dates use the Persian
calendar. Code comments, commit messages and these handoff files are English.

---

## 1. Product overview

WorkQuest (ورک‌کوئست) is a **multi-tenant, Persian-first, RTL employee
performance-management SaaS with a gamification layer**. A company signs up,
invites employees by phone, organises them into teams, and runs a scored task
lifecycle. Approvals pay out XP and coins through immutable ledgers; levels,
streaks, achievements, badges, peer recognition, windowed leaderboards, a
reward marketplace, challenges and notifications are all built on those
ledgers. A role-scoped analytics dashboard closes the loop for
owners/admins/managers.

## 2. Product goals

- Performance management that employees trust: every number (score, XP,
  coins, level, streak, board rank, challenge progress) is **derived from
  real data** — never faked, never client-computed, never mutated after the
  fact.
- Money-like integrity: append-only ledgers, at-most-once payouts, atomic
  purchases, versioned (never rewritten) reward rules.
- Tenant isolation as a structural property, not a discipline.
- Persian-first UX: RTL layout, Vazirmatn, Persian calendar and digits.
- "Gamification without toy-ness": restrained, professional design.

## 3. Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Nuxt 4 (Vue 3, TypeScript strict, SSR) — app + Nitro API in one repo |
| UI | Nuxt UI v4 over Tailwind CSS v4 (no UnoCSS — deliberate, see README §1) |
| Font | Vazirmatn variable, self-hosted via `@fontsource-variable/vazirmatn` |
| i18n | `@nuxtjs/i18n` — `fa` default (RTL), `en` secondary |
| DB | PostgreSQL + Prisma 7 with `@prisma/adapter-pg`; generated client committed at `prisma/generated/prisma` (alias `#prisma/client`) |
| Validation | Zod, schemas in `shared/schemas/index.ts`, shared client+server |
| Auth | Phone OTP → JWT (jose HS256) in httpOnly cookie + revocable `Session` rows |
| Tests | Vitest — 332 unit, 299 integration (integration drives a real dev server over HTTP) |
| Tooling | ESLint 10, `vue-tsc` typecheck, `nuxt build` |

## 4. Architecture

Three layers, one repo:

- `app/` — pages, components, composables, layouts (SSR + browser).
- `server/` — Nitro handlers under `server/api/**`, shared services in
  `server/utils/**`, one auth middleware, one error handler, notification
  channel plugin.
- `shared/` — the contract: Zod schemas, API response types
  (`shared/types/api.ts`), and **pure** utilities (permissions, task
  lifecycle, reward maths, levels, streaks, leaderboard ranking, analytics
  helpers, formatting). No I/O in `shared/`; both sides import it via the
  `#shared` alias.

Key architectural invariants (all enforced in one place each):

- **Tenant scope** — `createTenantClient(auth)` (`server/utils/tenant.ts`)
  rewrites every query on tenant models to filter/stamp `companyId`.
- **Auth context** — `server/middleware/1.auth-context.ts` resolves the JWT,
  re-reads the user, checks ACTIVE + role match, attaches `event.context.auth`.
- **Errors** — one envelope `{statusCode, code, message}` via
  `server/utils/error-handler.ts`.
- **Money** — only `applyXpDelta` / `applyCoinDelta` (`server/utils/wallet.ts`)
  write the ledgers, always inside the caller's transaction, always with an
  idempotency key.
- **Gamification** — `server/utils/gamification.ts` is the only place a
  streak advances or an achievement unlocks; it runs inside the approval
  transaction.

Deep-dives: `docs/architecture.md`, `docs/database.md`, `docs/api.md`.

## 5. Folder structure

```
app/
  components/         auto-imported by directory (auth/, common/, gamification/,
                      leaderboard/, members/, recognition/, rewards/, tasks/,
                      analytics/, challenges/, layout/)
  composables/        useSession, useCan, useNav, useTasks, useRewards,
                      useConfirm, useLocaleFormat, useNotifications, …
  layouts/default.vue sidebar + topbar + bottom tab bar + global ConfirmDialog
  pages/              dashboard, tasks/, team/, members/, invitations/, leaderboard,
                      recognition/, rewards/, challenges/, achievements, wallet,
                      notifications, analytics/, settings/, profile, login/, onboarding/
server/
  api/                ~70 endpoints (see docs/api.md)
  middleware/1.auth-context.ts
  plugins/notifications.ts   channel registration (env-gated)
  utils/              20 services: tenant, auth, session, otp, wallet,
                      marketplace, rewards, gamification, levels, streak usage,
                      leaderboard, recognition, challenges, notifications,
                      tasks, members, analytics, onboarding, invitation, http
shared/
  schemas/index.ts    every request schema
  types/api.ts        every response type
  utils/              pure logic (see §13–§27)
prisma/               schema.prisma, migrations/ (11), seed.ts, generated/
test/                 *.test.ts (unit, 15 files) + integration/ (10 files)
scripts/              local-db.mjs (PGlite on TCP 5433), apply-migrations.mjs,
                      run-integration.sh, run-integration-local.sh
docs/                 feature docs per phase + architecture/database/api/qa-report
i18n/locales/         fa.json, en.json (1062 keys each)
```

## 6. Database schema overview

35 models, 11 migrations. Four groups:

1. **Tenancy & access:** `Company`, `User`, `Session`, `OtpCode`,
   `OnboardingTicket`, `Invitation`, `Team`, `TeamMember`.
2. **Work:** `Task`, `TaskReview`, `TaskComment`, `TaskAttachment`,
   `TaskEvent`.
3. **Money & progression:** `RewardRule`, `XpTransaction`, `CoinTransaction`,
   `Wallet`, `UserProgress`, `Level`, `Achievement`, `UserAchievement`,
   `Badge`, `UserBadge`.
4. **Programmes:** `Recognition*` (7 models), `Reward`,
   `RewardRedemption`, `Challenge`, `ChallengeParticipant`, `Notification`,
   `AuditLog`.

85 explicit `@@index`/`@@unique` declarations, all co-designed with query
paths. Full map: `docs/database.md`.

## 7. All models and relationships (essentials)

- `Company 1—N User/Team/…` — every tenant-owned row carries `companyId`;
  deleting a company cascades to everything (tenant = unit of disposal).
- `User 1—1 UserProgress` (xp, coins, currentStreak, longestStreak,
  lastActiveDate), `User 1—1 Wallet` (balance, lifetimeEarned,
  lifetimeSpent), `User 1—N XpTransaction/CoinTransaction`.
- `TeamMember` joins `User↔Team`, carries `role` (LEAD/MEMBER) and
  `managerId` (**the manager-scope edge**). Uniques: `(teamId, userId)` and
  `(companyId, userId)` — one primary team per employee.
- `Team.leadId → User` (SetNull); `Task.assigneeId/assignerId → User`
  (SetNull — work history survives person removal); `Task.teamId → Team`
  (SetNull).
- `TaskReview` — one row per review decision; approval **requires** a score;
  `APPROVED` is terminal ⇒ exactly one scored APPROVED review per approved
  task. Also stores qualityScore/timelinessScore (1–5), xpAwarded,
  coinsAwarded, frozen `rewardBreakdown` JSON + ruleVersion.
- `RewardRule` — versioned economy; `isActive` flips on publish (PUT never
  mutates).
- `Reward 1—N RewardRedemption`; redemption carries userId, rewardId, status,
  decision fields.
- `RecognitionCategory` (per-company, with xpReward/coinReward/title/badge
  flag) — `RecognitionCycle` (WEEKLY/MONTHLY, window sealed on the row) —
  `RecognitionVote` (unique `(cycleId, categoryId, voterId)`) —
  `RecognitionResult` (sealed winners).
- `Challenge` (INDIVIDUAL/TEAM, goalKey/goalValue, window) —
  `ChallengeParticipant` (unique `(challengeId, userId)`, progress, status).
- `Notification` — unique `(companyId, userId, dedupeKey)`.
- `AuditLog` — actor/action/target/payload for admin mutations.
- `Level` — per-company ladder (`level`, `minXp`, `title`, `iconKey`),
  unique `(companyId, level)`.

## 8. Authentication architecture

Phone-OTP, no passwords.

1. `POST /api/auth/otp/request` — normalises the phone, enforces a 90s
   resend cooldown per `(phone, purpose)` and a rolling per-IP hourly cap
   (`otpMaxRequestsPerIpPerHour`, default 30). Reply includes
   `accountExists` (drives the register-vs-login fork — an accepted
   enumeration trade-off).
2. `POST /api/auth/otp/verify` — max 5 attempts per code; 120s TTL; on
   success either issues a session cookie (existing user) or an httpOnly
   **onboarding ticket** (unknown phone → founder flow).
3. Session = JWT (HS256, `NUXT_SESSION_SECRET` ≥ 32 chars or the server
   refuses to boot) with `sub` (user), `jti` (session row id), `cid`, `role`;
   cookie is httpOnly + secure + sameSite=lax; 7-day expiry with 24h sliding
   renewal.
4. Every request: middleware verifies the JWT, loads the user **fresh from
   the DB**, requires `ACTIVE` user + active company + non-revoked session,
   and forces re-login if the DB role no longer matches the token claim.
5. Sign-out revokes the `Session` row (`DELETE /api/auth/session`).
6. OTP providers: `console` (dev only — **refuses to run when
   `NODE_ENV=production`**) and `http` (vendor-agnostic POST to
   `NUXT_OTP_HTTP_URL`). **No named SMS vendor driver is implemented.**

## 9. Authorization rules

- Central matrix: `shared/utils/permissions.ts` — `PERMISSIONS` ×
  `OWNER/ADMIN/MANAGER/EMPLOYEE`; OWNER and ADMIN hold `'*'`.
- Enforced **server-side** by `requirePermission(event, perm)`; the UI's
  `useCan()` only hides affordances.
- Manager scope = `getManagedUserIds(companyId, managerId)` — transitive
  `TeamMember.managerId` chain, **self excluded**. Used by task visibility,
  member detail/edit, analytics scope.
- In-company invisibility returns **404, not 403** (an id is a secret).
- Per-field rules on member PATCH (name/title vs role/status); nobody changes
  their own role; the last active OWNER cannot be demoted/deactivated;
  `maxAssignableRole` ceilings apply.

## 10. Multi-tenancy rules

- 31 of 35 models are tenant-scoped through the Prisma client extension:
  reads get `companyId = auth.companyId` injected, creates get it stamped.
  Handlers use `createTenantClient(auth)`; there is no path that forgets the
  filter.
- The 4 exceptions are deliberate: `Company` (tenant root), `OtpCode` /
  `OnboardingTicket` (pre-auth), `Session` (revocation list).
- Endpoints that must cross tenants (onboarding, invitation accept, health)
  use `usePrisma()` directly and derive the tenant from a ticket/row —
  never from the request body.
- Integration suites in analytics/leaderboard/people/tasks/rewards/
  notifications assert cross-tenant blindness.

## 11. Roles and permissions

Roles: `OWNER`, `ADMIN`, `MANAGER`, `EMPLOYEE` (no `isRole` hierarchy beyond
`roleAtLeast` helpers in `shared/utils/member-scope.ts`).

Key permissions (full list in `shared/utils/permissions.ts`):

| Permission | OWNER | ADMIN | MANAGER | EMPLOYEE |
| --- | --- | --- | --- | --- |
| `member:read` / `member:invite` / `member:manage` | ✓ | ✓ | invite: own sends | — |
| `task:manage` / `task:read:all` | ✓ | ✓ | scoped (reports + led teams) | — |
| `task:read:own` | ✓ | ✓ | ✓ | ✓ |
| `reward:manage` (incl. wallet adjust, rules PUT) | ✓ | ✓ | — | — |
| `recognition:manage` / `challenge:manage` | ✓ | ✓ | — | — |
| `analytics:read` | ✓ | ✓ | ✓ (scoped to subordinates + led teams) | — |
| `company:update` (rename) | ✓ | ✓ | — | — |
| `reward:redeem`, `recognition:create`, `leaderboard:read`, `challenge:read` | ✓ | ✓ | ✓ | ✓ |

## 12. Task lifecycle

States: `TODO → IN_PROGRESS → SUBMITTED → APPROVED`, with
`NEEDS_REVISION` as the rework loop (`NEEDS_REVISION → IN_PROGRESS`).
`APPROVED` is terminal. One door: `POST /api/tasks/:id/transition`
(`shared/utils/task.ts` defines the edges with actor kinds):

- `start` (assignee): TODO/NEEDS_REVISION → IN_PROGRESS
- `submit` (assignee): IN_PROGRESS → SUBMITTED, sets progress 100
- `approve` (reviewer): SUBMITTED → APPROVED — **requires score 0–100**
  (Zod-rejected, not clamped, at the boundary), runs the whole payout
  transaction
- `request_revision` (reviewer): SUBMITTED → NEEDS_REVISION (reason
  required), increments `revisionCount`
- `reopen` (reviewer): SUBMITTED/NEEDS_REVISION → TODO

Reviewer = someone with task-manage rights over the assignee (assigner,
manager chain, admin). `TaskEvent` records every transition; comments and
attachments (external URLs, protocol-allow-listed) hang off the task.
Overdue = `dueDate < now` and not closed; undated tasks are never overdue.

## 13. Performance scoring system

Scores live **only on `TaskReview`** (0–100 overall + optional 1–5
quality/timeliness sub-scores). The payout formula
(`shared/utils/rewards.ts`, `calculateReward`):

1. Score band multiplier: ≥90 EXCELLENT, ≥80 GOOD, ≥70 FAIR, else POOR —
   band bp from rules.
2. Additive bonuses/penalties in basis points (bp, 10_000 = 1.0×):
   on-time or early (the larger of the two, never stacked),
   high-quality (qualityScore ≥ threshold), overdue penalty,
   revision penalty (capped at `maxRevisionPenaltyBp`).
3. Clamp to `[minMultiplierBp, maxMultiplierBp]`.
4. Multiply the base (`baseXp`/`baseCoins`) by the multiplier **and** the
   priority weighting (low/medium/high bp).
5. Round once. Timing comes from timestamps, never reviewer opinion.

Defaults (`DEFAULT_REWARD_RULES`): base 100 XP / 50 coins; priority
8_000/10_000/13_000 bp; bands 10_000/8_000/6_000/3_000 bp; on-time +1_000,
early +2_000, high-quality +1_500; overdue −2_500, revision −1_000 (cap
5_000); multiplier clamp 0–20_000 bp; earlyDays 1, highQualityThreshold 5.
A `RewardBreakdown` (factors + version) is frozen onto the review row.
Employees can preview a payout (`POST /api/rewards/preview`).

## 14. XP system

- `XpTransaction` — append-only ledger (`amount`, `source`
  TASK/ACHIEVEMENT/RECOGNITION/CHALLENGE/ADMIN, `reason`, `referenceType/Id`,
  `idempotencyKey`, `createdAt`).
- `UserProgress.xp` is the derived total, updated in the same transaction.
- XP sources: task approval (engine), achievement rewards, recognition
  wins, challenge completion, (negative) admin adjustments are coins-only —
  XP admin adjustment is **NOT IMPLEMENTED**.
- Windowed sums (`companyId, createdAt` index) power leaderboards and
  analytics series.

## 15. Coin economy

- `CoinTransaction` — append-only, signed amounts (positive = credit,
  negative = debit), `type`: TASK_REWARD, RECOGNITION_REWARD,
  ACHIEVEMENT_REWARD, CHALLENGE_REWARD, REWARD_REDEMPTION,
  ADMIN_ADJUSTMENT.
- Coins are earned by approvals, achievements, recognition wins, challenges,
  and bounded admin adjustments (`POST /api/wallet/adjust`, reason
  mandatory, |amount| ≤ 10_000). Coins are spent only on reward redemption.
- Analytics: "earned" = Σ positive rows; "redeemed" = |Σ REWARD_REDEMPTION|.

## 16. Wallet and transaction rules

- One `Wallet` per user (`balance`, `lifetimeEarned`, `lifetimeSpent`);
  created/upserted lazily by `applyCoinDelta`.
- **Immutability:** no code path updates or deletes either ledger.
- **At-most-once:** every programmatic delta carries an idempotency key
  unique per `(companyId, key)` — e.g. `task:<id>:reward`,
  `achievement:<id>:<uid>:coins`, `challenge:<cid>:<uid>:…`,
  `recognition:<resultId>:winner:<uid>`, `redemption:<id>` /
  `redemption:<id>:refund`. Duplicates are no-ops.
- `balanceAfter` is frozen on each row (statements don't re-sum).
- Redemption (`server/utils/marketplace.ts`): transaction locks the reward
  `FOR UPDATE`, decrements stock with the guard in the `WHERE`
  (`stock > 0`, NULL = unlimited), debits the wallet, writes the
  `RewardRedemption`. Lock order is always reward → wallet. Rejection
  refunds + restocks; employee cancellation refunds while PENDING.
- Duplicate grant prevention is integration-tested (concurrent approvals of
  the same task, concurrent purchases).

## 17. Level calculation

- Company ladder = `Level` rows (seeded from the default curve; editable via
  SQL — **a ladder editor UI is NOT IMPLEMENTED**).
- Default curve (`shared/utils/xp.ts`):
  `minXp(n) = 500·(n−1) + 100·(n−1)·(n−2)` → L1:0, L2:500, L3:1200,
  L4:2100, L5:3200…
- Server-side `resolveLevelProgress(db, companyId, xp)`
  (`server/utils/levels.ts`) folds XP through the ladder (falls back to the
  default curve when no rows) and returns level, title, percent, current/
  needed XP, next rung. Level resync happens inside the approval
  transaction; a `LEVEL_UP` notification fires on change.

## 18. Achievements

- Data-driven per company: `Achievement` rows with `criteria
  {metric, threshold}` (JSON), `xpReward`, `coinReward`, optional linked
  badges, `status` ACTIVE/INACTIVE.
- Metric vocabulary (`shared/utils/achievements.ts`): `tasks_approved`,
  `revisions_overcome`, `recognitions_received`, `streak_days`, `level`.
- Evaluation runs **inside the approval transaction**
  (`server/utils/gamification.ts`) against server-computed metrics;
  check-then-create with the `(userId, achievementId)` unique index as the
  guarantee; payouts carry idempotency keys.
- Seeded catalogue (titles are Persian): first_approved_task, streak_7,
  ten_approved_tasks, team_player (5 recognitions), reviewer_fast, …
- **An achievement-catalogue editor UI is NOT IMPLEMENTED** (manage via
  seed/SQL).

## 19. Badges

- `Badge` per company (name, description, iconKey, tone, imageUrl), linked
  to achievements via `Badge.achievementId`; awarded together with the
  unlock (`UserBadge`, unique `(userId, badgeId)`); recognition category
  wins can also mint a badge (`badge: true` on the category).
- Displayed on the member profile ("badge shelf") and member lists.

## 20. Streaks

- `shared/utils/streak.ts` — pure, timezone-aware: a "day" is a calendar day
  in the **company timezone**; same-day activity is idempotent; consecutive
  day extends; a gap resets to 1. `longest` is a high-water mark.
- Stored on `UserProgress.currentStreak/longestStreak/lastActiveDate`.
- Advanced at most once per local day, inside the approval transaction.
- Milestones celebrated: 7, 14, 30.

## 21. Recognition system

Peer-to-peer voting with cycles (`server/utils/recognition.ts`):

- `RecognitionCategory` — per company (name, description, icon, tone,
  xpReward, coinReward, winner `title`, `badge` flag). Seeded with 8
  Persian categories (مسئول‌ترین همکار، وقت‌شناس‌ترین، بهترین هم‌تیمی،
  خلاق‌ترین، طنزپرداز دفتر، مهربان‌ترین، پرانرژی‌ترین، حلّال مسائل).
- `RecognitionCycle` — WEEKLY (default) or MONTHLY; the window is sealed
  onto the row so history survives cadence changes; at most one ACTIVE
  cycle; expired cycles are auto-sealed on read.
- Voting: `POST /api/recognition/vote` — one vote per person per category
  per cycle (unique index); no self-votes, no duplicates, no cross-company
  nominees; ballots are private.
- Finalization: `POST /api/recognition/finalize` (recognition:manage) —
  idempotent tally per category, seals `RecognitionResult` rows, pays
  winners XP+coins through the ledgers (idempotency keys), mints badges
  where the category says so, sends RECOGNITION_WINNER notifications.

## 22. Recognition categories

Admin CRUD exists (`POST /api/recognition/categories`,
`PATCH /api/recognition/categories/:id`, titles config,
`PUT /api/recognition/cycle` for cadence) and an admin page
(`/recognition/admin`). Categories define the payout and the winner title —
see §21 for the seeded set.

## 23. Leaderboards

`shared/utils/leaderboard.ts` + `server/utils/leaderboard.ts`:

- **Windowed only** (weekly Mon→Mon, monthly 1st→1st, company-local
  timezone): no all-time board exists, by design.
- Score = `performanceXp·1 + achievementXp·1 + 50·achievementsUnlocked`
  inside the window (constants in `LEADERBOARD_SCORING`).
- Hard privacy cap: **`MAX_LEADERBOARD_ENTRIES = 5`** — the API never
  returns more; ties share a rank.
- Boards: company week, company month, team. Plus a personal progress page
  (two windows + series + lifetime). Team board visible when in scope.

## 24. Reward system

- `Reward` per company: title, description, type (`PHYSICAL, VOUCHER,
  TIME_OFF, DONATION, MEAL, TICKET, BONUS, CUSTOM`), `coinCost` (≥1),
  `stock` (NULL = unlimited), `imageUrl`, `status`
  (`DRAFT/ACTIVE/PAUSED/ARCHIVED`; only ACTIVE is redeemable and
  employee-visible), per-reward `rules`: `autoApprove`, `maxPerUser`,
  `minLevel`, `requiresNote`, `availableFrom/Until`.
- Admin shelf: `/rewards/admin` (create/edit/reprice/restock/pause/archive,
  queue with approve/fulfil/reject). Gamification rules card + grouped
  editor modal over `GET/PUT /api/rewards/rules` (19 fields, publish-new-
  version semantics).

## 25. Reward redemption flow

1. Employee opens `/rewards` (ACTIVE shelf + their standing per item:
   affordability, stock, allowance, level).
2. `POST /api/rewards/:id/redeem` — **price is read server-side, never a
   parameter**; optional client `idempotencyKey` (UUID) makes double-clicks
   one purchase. Checks: ACTIVE + window, level gate, per-user allowance,
   balance, stock.
3. Transaction: lock reward FOR UPDATE → guarded stock decrement → wallet
   debit (idempotency `redemption:<id>`) → create `RewardRedemption`
   (PENDING or APPROVED when autoApprove).
4. Queue: admins approve/fulfil/reject (`decision` endpoint); rejection
   refunds coins + restocks + notifies; the employee may cancel while
   PENDING (refund). Statuses: `PENDING, APPROVED, REJECTED, FULFILLED,
   CANCELLED`.
5. Notifications at each step; every money movement is a ledger row.

## 26. Challenges

`shared/utils/challenges.ts` + `server/utils/challenges.ts`:

- Types: INDIVIDUAL, TEAM. Statuses: DRAFT, ACTIVE, COMPLETED, ENDED,
  CANCELLED. Participant statuses: NOT_STARTED, IN_PROGRESS, COMPLETED,
  CLAIMED.
- Goals (computed from real data, never asserted):
  `tasks_completed` (both types, live), `on_time_rate` (INDIVIDUAL,
  judged at deadline — a rate is a promise about the whole window),
  `team_completion_rate` (TEAM, at deadline).
- Windows resolve on read (`refreshChallenges`): enrols the roster when a
  DRAFT challenge's window opens (INDIVIDUAL without teamId = every ACTIVE
  member), syncs live progress, completes/ends and pays rewards at-most-once
  at the window close.
- UI: `/challenges` board; manage modal for `challenge:manage`.

## 27. Notifications

- 16 types (`shared/utils/notifications.ts`): 14 product events
  (task assigned/submitted/approved/needs-revision, coins earned,
  achievement unlocked, level up, recognition received/winner, challenge
  started/completed, reward redeemed/approved/rejected) + internal
  `INVITATION` and `SYSTEM` catch-alls.
- One service (`server/utils/notifications.ts`): self-suppression (actors
  are not notified about their own action), at-most-once via
  `(companyId, userId, dedupeKey)` — keys like `task:<id>:approved`,
  `levelup:<uid>:<level>`, `challenge:<cid>:started`.
- Endpoints: list (paginated, unread-first), summary (unread count),
  mark-one-read (404 for foreign rows, idempotent), read-all.
- UI: topbar bell + dropdown, `/notifications` page.
- Channels: in-app only; email/SMS/push are env-gated DSN seams
  (`NUXT_NOTIFICATION_{EMAIL,SMS,PUSH}_DSN`) — **no vendor integration is
  configured or tested** (dormant by design).

## 28. Admin functionality (OWNER/ADMIN)

- Company: rename (`PATCH /api/companies`, name-only; slug/timezone/locale
  intentionally fixed post-onboarding).
- People: invite/revoke, edit members (per-field rules), role/status
  changes, soft-remove, team CRUD + membership + in-team manager.
- Economy: reward shelf CRUD, redemption queue decisions, wallet
  adjustments, gamification rules editor (publishes versions).
- Programmes: recognition categories/titles/cadence + finalize;
  challenge create/edit/cancel.
- Analytics: company-wide dashboard (`/analytics`) — 11 KPIs, 4 charts,
  employee/team tables, admin hub shortcuts.

## 29. Employee functionality

Dashboard (own gamification + task surfaces), own tasks (start/submit/
progress slider), task detail (comments/attachments/history),
achievements + badges page, wallet + statement, reward marketplace +
redemption + own requests, challenges board, recognition voting,
leaderboards (company/team + personal progress), notifications
(bell + feed), own profile + settings (preferences), **own member profile
with the full performance profile** (self-visible).

## 30. Manager functionality

Everything an employee has, plus: create/assign/edit tasks, review queue
(approve with score / request revision / reopen), team management for teams
they lead, invite + revoke own invitations, edit their reports (name/title/
team moves into teams they lead), member profiles of their chain, and the
**analytics dashboard scoped to their subordinates + led teams**
(scope: `team`, labelled «نمای تیمی»).

## 31. API architecture

~70 JSON endpoints under `/api`. Conventions (full reference
`docs/api.md`):

- Identity never in parameters (companyId/userId/role from session).
- One error envelope; 404 for invisible; 409 for state conflicts; 422 for
  Zod (Persian messages); 429 rate-limited.
- Chatty single-request screens (`/api/dashboard/summary`,
  `/api/analytics/overview`); paginated lists (tasks, members,
  notifications, wallet, redemption queue); fan-out ≤ 6 concurrent queries.
- `GET /api/health` — liveness + DB ping (public).
- AuditLog on admin mutations.

## 32. Validation rules

Every body/query → a Zod schema in `shared/schemas/index.ts`
(`readValidated` / `readValidatedQuery` in `server/utils/http.ts`):
Persian error messages; UUID-shaped ids everywhere (bad ids → clean 404,
not 500); scores 0–100 rejected out-of-range; URL protocol allow-lists
(http/https, no `javascript:`); enums for statuses/types; `z.coerce` for
numeric inputs; empty-string → null normalisation for optional
fields ("unlimited stock" vs "sold out" are distinct).

## 33. Security rules

- The whole §8–§10 apparatus, plus: per-IP OTP quota; 5-attempt codes;
  90s cooldowns; secure cookies; role-change forced re-login; session
  revocation on removal/role change/sign-out.
- Global headers: `X-Frame-Options: DENY`, `nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`;
  `/api/**`: + `no-store`, CORS disabled.
- Raw SQL only where locking requires it — always parameterised.
- CSP: **NOT IMPLEMENTED** (no Content-Security-Policy header today).
- General API rate limiting beyond OTP: **NOT IMPLEMENTED**.
- No file uploads (URL attachments only). No secrets in the client bundle
  (runtimeConfig private keys are server-only).

## 34. Environment variables

See `.env.example` (annotated). Essentials:

- `DATABASE_URL` (required), `NUXT_DB_POOL_MAX` (default 10).
- `NUXT_SESSION_SECRET` (required, ≥32 chars — boot refusal below that),
  `NUXT_SESSION_*` (cookie name/issuer/max-age/renew/secure).
- `NUXT_OTP_PROVIDER` (`console` dev-only | `http`),
  `NUXT_OTP_HTTP_URL/API_KEY/TEMPLATE`, `NUXT_OTP_CODE_LENGTH/TTL_SECONDS/
  MAX_ATTEMPTS/RESEND_COOLDOWN_SECONDS/MAX_REQUESTS_PER_IP_PER_HOUR`.
- `NUXT_ONBOARDING_TICKET_TTL_SECONDS`, `NUXT_BOOTSTRAP_ADMIN_PHONE`
  (seed helper).
- `NUXT_NOTIFICATION_{EMAIL,SMS,PUSH}_DSN` (optional, dormant).
- `NUXT_PUBLIC_APP_NAME/APP_URL/APP_VERSION/DEFAULT_LOCALE/SUPPORT_EMAIL`,
  `NUXT_APP_URL`.

## 35. External services

**None at runtime today.** The seams exist and are env-gated:

- SMS gateway — generic `http` OTP provider (POST JSON, bearer key,
  template with `{code}/{ttl}/{app_name}`). **No named vendor driver
  (Kavenegar, SMS.ir, …) is implemented.**
- Email/SMS/push notification channels — DSN-shaped placeholders, dormant
  when unset.
- Object storage — **NOT IMPLEMENTED** (avatars/attachments are URLs).
- Database is the only hard dependency (PostgreSQL).

## 36. Important business rules

- An approval without a score is refused; scores are never clamped at the
  boundary.
- `APPROVED` is terminal; rework goes through NEEDS_REVISION.
- On-time/early/overdue judgements use timestamps only.
- No self: no self-votes, no self-notifications, no self role changes, no
  approving your own task.
- One primary team per employee per company; one open invitation per phone
  per company.
- The company always keeps ≥1 active OWNER.
- Reward price is server-side; redemption is atomic; refunds on
  reject/cancel.
- Reward rules are versioned — history is never rewritten.
- Leaderboards are windowed only and capped at 5 entries.
- Manager scope never includes the manager themself.
- Challenges resolve their own windows; rate goals are judged at deadline.
- Only admins rename the company; slug/timezone/locale are fixed
  post-onboarding.
- Ledgers are append-only; wallet/progress are derived.

## 37. Important edge cases (already handled + tested)

- OTP: resend cooldown 90s (per phone+purpose, even after consumption),
  5 wrong attempts invalidate, expired codes, per-IP quota, race between
  verify and a concurrently created account.
- Double-submit / retry: idempotency keys on every programmatic ledger
  write; client UUID idempotency key on redemption.
- Concurrent approvals of the same task → exactly one payout
  (integration-tested).
- Empty populations: analytics averages/rates are `null`, never 0
  ("—" in the UI); score-trend days without data are gaps, not zeros.
- Day boundaries: streaks and analytics series bucket in the **company
  timezone** (DST-safe period maths in `shared/utils/period.ts`).
- Revision loops keep `revisionCount`; penalties cap at
  `maxRevisionPenaltyBp`.
- Member removal is soft; sessions revoked; history survives.
- Last-owner protection; role ceilings; self-edit bans.
- PGlite dev server caps ~8–10 connections — read endpoints use query
  **waves of ≤6**, never one wide `Promise.all` (this killed the DB when
  violated; it is encoded in `fanOut` and both analytics paths).
- Persian digits everywhere user-facing; charts/phones LTR inside RTL pages.

## 38. Known limitations (do not pretend otherwise)

1. OTP delivery not wired to a real vendor; `console` refuses in
   production.
2. Out-of-app notification channels dormant (no DSN, no vendor test).
3. No file/avatar upload storage (URLs only).
4. No general API rate limiting (OTP paths only).
5. `accountExists` in OTP response = accepted phone-enumeration trade-off.
6. No Playwright/browser tests; no CI pipeline; no structured logging /
   request IDs / error reporting.
7. PGlite is dev-only (~10 connections); production needs real PostgreSQL.
8. Direct-manager assignment (`TeamMember.managerId`) has **no UI** — set
   via seed/SQL.
9. Level-ladder editor and achievement-catalogue editor: **NOT
   IMPLEMENTED** (SQL/seed only).
10. Company timezone/locale/slug editing: intentionally not implemented.
11. XP admin adjustment: NOT IMPLEMENTED (coins only).
12. Analytics aggregates in memory (fine to ~10k tasks/tenant; windowed SQL
    beyond).
13. `en.json` translations are functional, not polished; Persian is the
    product language.
14. CSP header: NOT IMPLEMENTED.

## 39. Future roadmap (recommended order)

1. Real SMS vendor driver + live gateway test (unblocks production login).
2. CI: `npm run verify` + `test:integration` on real PostgreSQL +
   migration dry-run.
3. Playwright suites (wizard, login, task flow, redemption) incl. an RTL
   mobile viewport.
4. Object storage for avatars/attachments.
5. Structured logging + request IDs + error reporting.
6. Per-session API rate limiting.
7. Direct-manager picker in the member editor; ladder + achievement editors.
8. Windowed SQL aggregates for analytics at scale.
9. (Optional) email digest of unread notifications once a channel exists.

## 40. Development conventions

- **Strict TypeScript everywhere**; `noUncheckedIndexedAccess`,
  `noImplicitOverride`.
- **Persian UI, English code**: comments/commits English; user copy only in
  `i18n/locales/fa.json` (`en.json` mirrors keys 1:1); never hard-code copy
  in components.
- **RTL is structural**: logical properties (`ps/pe/start/end`), Persian
  digits via `useLocaleFormat`; charts/phone numbers in `dir="ltr"` blocks.
- Validate at the edge with shared Zod schemas; never trust the client for
  permissions or identity.
- One design system: `wq-panel`, `CommonPageHeader/SectionCard/EmptyState`,
  semantic tokens; no ad-hoc colors/components. Destructive actions use
  `useConfirm()` (never `window.confirm`).
- Migrations are hand-editable SQL, forward-only; never edit an applied one.
- New backend logic goes in `server/utils/*` services; handlers stay thin.
- Two-level API route files need `../../../utils` relative imports (Nitro
  auto-import quirk — noted in existing files).
- Numbers that look dynamic must not be dynamic Tailwind classes (they
  won't compile) — use inline styles or static class maps.
- Prisma tenant creates **require** `companyId` explicitly (the extension
  stamps it, but the type demands it).
- Fan out ≤ 6 concurrent DB queries per request (PGlite budget).
- Push after each phase of work on the working branch.

## 41. Testing instructions

```bash
npm run lint            # ESLint (app server shared test prisma configs)
npm run typecheck       # vue-tsc, strict — must be 0 errors
npm test                # 332 unit tests, no DB needed
npm run build           # production build

# Integration (299 tests over real HTTP + real DB):
npm run test:integration:local   # boots PGlite on 5433, migrates, seeds, runs, tears down
npm run test:integration        # same suite against DATABASE_URL (CI, real PostgreSQL)
```

Operational notes for the integration suite:

- It boots its **own** dev server on `TEST_PORT` (3100) — stop any `npm run
  dev` first, and `pkill -f "[l]ocal-db.mjs"` (note the bracket trick:
  a plain pattern matches the pkill command itself).
- Fixtures create fresh tenants via SQL (`gen_random_uuid()`; pgcrypto is
  loaded). OTP phones must be unique per file (90s cooldown per
  phone+purpose is global); always consume requested codes; Vitest file
  order is not alphabetical and varies.
- Reward/challenge create return 200; task create returns 201.
- Raw SQL inserts must provide timestamps (`now()`) and cast enums
  (`$n::"UserRole"` etc.); dropped enum columns need
  `(CASE … END)::text::"Type"` retyping; don't DROP INDEX for dropped
  columns.
- `npx prisma migrate dev` fails under PGlite — use
  `node scripts/apply-migrations.mjs`; `prisma generate` needs
  `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1` when engines are missing.
- Vitest cannot import `#server` from unit tests (relative imports only).
- LEDGER ROWS ARE APPEND-ONLY: integration tests assert deltas, never
  absolute ledger counts.

## 42. Deployment instructions

```bash
npm ci
npx prisma generate        # client is also committed under prisma/generated/
npm run build              # → .output/
node .output/server/index.mjs   # PORT/HOST/NUXT_* env
```

- Terminate TLS at the proxy; `NUXT_SECURE_COOKIES=true`;
  `NUXT_APP_URL` = public origin.
- `DATABASE_URL` → real PostgreSQL (never PGlite in production).
- `NUXT_SESSION_SECRET` ≥ 32 random chars (boot-refused otherwise).
- `NUXT_OTP_PROVIDER=http` + `NUXT_OTP_HTTP_URL` — **required** for real
  logins (console refuses outside dev).
- `npx prisma migrate deploy` on release; `migrate status` as drift check.
  Never seed production (`prisma/seed.ts` is demo data).
- `GET /api/health` for the load balancer.
- Full checklist: README §12. State: stateless SSR between requests; all
  state is PostgreSQL.

---

*Verified against commit `3e4ddc5` (branch `arena/01a07058-workquest`). When
this file and the code disagree, the code wins — then update this file.*
