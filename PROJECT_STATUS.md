# PROJECT_STATUS.md — WorkQuest

Snapshot of the project state for a continuing AI coding agent.
Companion document: **`AI_CONTEXT.md`** (full system context). When these two
disagree with the code, the code wins.

- **Branch:** `arena/01a07058-workquest`
- **Last verified commit:** `3e4ddc5` (docs: production-readiness
  documentation + final QA report) — verification numbers below were run on
  this tree.
- **App language:** Persian-first, RTL (non-negotiable). Docs/code in
  English.

## Current phase

**Production-readiness pass complete.** All ten planned feature phases are
implemented and tested; the final phase (phase 11 in practice) was an audit
+ hardening + documentation pass with no new product features. The project
is production-**oriented**: deployable as an SSR Node app against real
PostgreSQL, with a short, explicit list of operational gaps (below) — the
largest being that **no SMS vendor is wired, so real production logins
cannot yet deliver codes** (the `console` provider deliberately refuses to
run outside development).

Phase history: 0 foundation · 1 auth · 2 people & teams · 3 task management
· 4 performance & reward engine · 5 gamification · 6 recognition · 7 reward
marketplace + leaderboards · 8 challenges · 9 notifications · 10 company
analytics & administration dashboard · production-readiness audit (headers,
confirm dialogs, mobile layouts, lazy images, full docs, QA report).

## Completed features

All of the following exist end-to-end (server + Persian/RTL UI + tests) and
run on real data:

- Phone-OTP auth (register + login), revocable JWT sessions, brute-force
  and cooldown protections.
- Self-service company onboarding (founder flow, httpOnly ticket).
- Invitations by phone → OTP acceptance → join; revoke; race-safe.
- People: roles, per-field edit rules, soft-remove (sessions revoked),
  team CRUD, one-primary-team rule, in-team manager edges.
- Task lifecycle (TODO → IN_PROGRESS → SUBMITTED → APPROVED + rework loop),
  comments, URL attachments, events, manager/employee dashboards.
- Scored review → versioned reward engine (bp formula, frozen breakdowns)
  → XP/coin payout in one transaction.
- Immutable ledgers, wallet with `balanceAfter`, bounded admin adjustments.
- Levels (default curve + per-company ladders), streaks (company-timezone),
  achievements (data-driven), badges.
- Peer recognition: categories, weekly/monthly cycles, private ballots,
  idempotent sealed finalization with payouts.
- Windowed leaderboards (week/month/team, 5-entry privacy cap) + personal
  progress.
- Reward marketplace: shelf with per-user standing, atomic redemption,
  auto/admin approval, refunds, queue UI.
- Challenges: individual/team, goals computed from real data
  (tasks_completed, on_time_rate, team_completion_rate), windows resolve on
  read, at-most-once payouts.
- In-app notifications: 16 types, at-most-once delivery, bell + feed,
  mark-read/read-all; env-gated channel seams (dormant).
- Company analytics: 11 KPIs, 4 hand-rolled SVG charts, employee/team
  performance tables, per-employee performance profile on member detail.
- Company rename + gamification-rules editor UI.
- Security hardening: global browser headers, tenant-scoped Prisma client,
  404-not-403 invisibility, audit log.
- Docs: README (12 sections incl. production deployment),
  `docs/architecture.md`, `docs/database.md`, `docs/api.md`, per-phase
  feature docs, `docs/qa-report.md`, `AI_CONTEXT.md`, this file,
  annotated `.env.example`.

## In-progress features

**None.** No half-built feature branches or TODO-stubbed endpoints exist in
the working tree. (Grep-verified: the only `TODO` occurrences in `server/`,
`app/` and `shared/` are the task-status enum value `'TODO'` — there are no
TODO/FIXME code markers.)

## Known bugs

**None open.** All suites green on the verified commit:

| Gate | Result |
| --- | --- |
| `npm run lint` | clean |
| `npm run typecheck` | 0 errors |
| `npm test` (unit) | 332/332 (15 files) |
| `npm run test:integration:local` | 299/299 (10 files) |
| `npm run build` | success (15.1 MB / 3.94 MB gzip) |

One historical flake to be aware of (not reproducible, not code-related):
`rewards.integration.test.ts > survives concurrent approvals of the same
task` failed once under heavy parallel DB load (five simultaneous approvals
all returned non-200 under PGlite contention) and passed on re-runs. If it
fails, suspect environment load first, not the code.

## Technical debt

Prioritized, with effort estimates:

1. **No SMS vendor driver** — the generic `http` OTP provider is untested
   against a real gateway. Blocks real production usage. (M)
2. **No CI pipeline** — nothing runs lint/typecheck/tests on PRs. (S)
3. **No browser tests** — RTL/mobile verified by markup review + manual
   smoke only. (M)
4. **No object storage** — avatars/attachments are external URLs; profiles
   show initials. (M)
5. **No structured logging / request IDs / error reporting.** (S–M)
6. **No general API rate limiting** (OTP paths only). (S)
7. **No CSP header** (other hardening headers are in place). (S)
8. **Manager assignment without UI** — `TeamMember.managerId` is enforced
   everywhere but only set via seed/SQL. (S)
9. **Ladder & achievement catalogue editors missing** — admins manage these
   via SQL/seed. (M)
10. **Analytics in-memory aggregation** — one bounded fetch per table then
    in-memory maths; right to ~10k tasks/tenant, needs windowed SQL after.
    (M, only when scale demands)
11. **`en.json` copy is a functional pass**, not polished. (S)
12. **XP admin adjustment missing** (coins only). (S, possibly intentional)

## Next recommended tasks

In priority order (first two are the practical blockers for going live):

1. **SMS vendor driver** (e.g. Kavenegar or SMS.ir) implementing
   `OtpProvider`, plus one live integration test. Acceptance: a real phone
   receives a login code with `NUXT_OTP_PROVIDER` configured.
2. **CI workflow** — `npm run verify` + `npm run test:integration` against a
   real PostgreSQL service + `prisma migrate deploy` dry-run. Acceptance:
   red build on a failing test.
3. **Playwright**: onboarding wizard, login, task create→submit→approve,
   redemption — one mobile RTL viewport + one desktop. Acceptance: suite
   runs headless in CI.
4. **Object storage** for avatars (S3-compatible), wired into
   `PATCH /api/members/:id` + topbar/profile rendering.
5. **Structured logging + request IDs** through the existing error handler.
6. **Direct-manager picker** in the member edit modal (field + validation +
   `MANAGER_NOT_IN_TEAM` error path already exist).
7. **Level ladder + achievement editors** on `/settings` for
   `member:manage` holders.
8. Revisit **CSP** and **per-session rate limiting** once a proxy/CDN layer
   exists.

## Verification performed on this tree

- Full audit (security, DB, performance, responsiveness, UX, language)
  documented in `docs/qa-report.md`, including what was fixed in the
  hardening commit (`f94062f`) and the honest limitations list.
- Live smoke on the dev preview: OTP login, analytics overview + page,
  members page, rewards admin, security headers on pages and API,
  unauthenticated API → 401.

## How to re-verify after changes

```bash
pkill -f "[l]ocal-db.mjs" || true        # stop any running dev DB
# (also stop any `npm run dev` on port 3000)
npm run lint && npm run typecheck && npm test && npm run build
npm run test:integration:local
# restart the preview afterwards:
node scripts/local-db.mjs &              # port 5433
node scripts/apply-migrations.mjs
DATABASE_URL="postgres://postgres:postgres@127.0.0.1:5433/postgres" npx tsx prisma/seed.ts
npm run dev                              # port 3000; OTP codes print to the log
```

Demo login (seeded): بهنام کاویانی `+989120000002` (ADMIN) or مریم نوروزی
`+989120000003` (MANAGER — team-scoped analytics). The OTP code is printed
in the dev-server log.
