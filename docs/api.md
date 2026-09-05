# HTTP API reference

JSON only, under `/api`. Every response is either the documented payload or
an error envelope:

```json
{ "statusCode": 403, "code": "FORBIDDEN", "message": "…" }
```

Status codes: `400` bad input shape, `401` no/invalid session, `403`
authenticated but not allowed, `404` missing **or invisible** (the API does
not distinguish), `409` state conflicts (invalid transition, closed
invitation), `422` schema validation (Zod, field-level Persian messages),
`429` rate limited, `500` unexpected.

## Conventions

- **Identity is never a parameter.** `companyId`, `userId` and `role` come
  from the session (JWT + a fresh user read); no endpoint accepts them.
- **Tenancy is structural.** All reads/writes go through the tenant-scoped
  Prisma client; cross-company access is impossible by construction, not by
  discipline.
- **Validation is shared.** Each body/query is a Zod schema from
  `shared/schemas/index.ts` — the same rules the (optional) client form
  validation uses.
- **Lists are paginated** where they can grow (`?page=&pageSize=`, capped);
  finite catalogues (the reward shelf, the level ladder) are not.
- `/api/**` responses are `cache-control: no-store` with `nosniff`, no CORS.

## Authentication

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/otp/request` | public | Send a login code. 90s resend cooldown per `(phone, purpose)`, per-IP hourly cap. Reply includes `accountExists` — needed to route register vs. login. |
| POST | `/api/auth/otp/verify` | public | Exchange the code for a session cookie. 5 attempts per code; verifies into an `OnboardingTicket` instead when the phone has no account. |
| GET | `/api/auth/onboarding` | onboarding ticket | What the founder-tobe may still set (name, company, slug). |
| POST | `/api/auth/onboarding/complete` | onboarding ticket | Create profile + company + OWNER role + default ladders/catalogues. |
| GET | `/api/auth/invitations` | onboarding ticket | Open invitations for this phone. |
| POST | `/api/auth/invitations/accept` | onboarding ticket | Join a company by invitation (creates the EMPLOYEE account + membership). |
| DELETE | `/api/auth/session` | session | Sign out (revokes the session row). |
| GET | `/api/me` | session | Caller + company summary for the client bootstrap. |
| GET | `/api/profile` | session | Own profile incl. gamification snapshot. |

## People, teams, company

| Method | Path | Permission | Purpose |
| --- | --- | --- | --- |
| GET | `/api/members` | `member:read` | Paginated; managers see their reports, admins the company. |
| POST | `/api/members/invite` | `member:invite` | Invite by phone (one open invite per phone per company). |
| GET | `/api/members/:id` | visibility rules | Full profile + performance summary + `performanceProfile` (avg score, on-time rate, coins, achievements, recognition, 30-day score trend, recent approved tasks). |
| PATCH | `/api/members/:id` | per-field rules | Name/title: admin or own manager. Role/status: admins only, never self, never the last OWNER, role ceiling by caller. |
| DELETE | `/api/members/:id` | `member:manage` | Soft removal (DEACTIVATED + membership drop + session revocation). |
| GET | `/api/teams` | `team:read` | Own teams for employees, all for admins. |
| POST | `/api/teams` | `team:manage` | Create team. |
| GET/PATCH/DELETE | `/api/teams/:id` | `team:manage`/scoped | Detail, rename/edit, delete (tasks survive with `teamId` nulled; memberships cascade). |
| POST | `/api/teams/:id/members` | `team:manage`/scoped | Add an employee (one primary team per company). |
| PATCH/DELETE | `/api/teams/:id/members/:userId` | scoped | Change in-team role/manager, or remove. |
| GET | `/api/invitations` | `member:invite` | Invitation list (managers: their own). |
| DELETE | `/api/invitations/:id` | `member:invite` | Revoke (admins any, managers their own; race-safe). |
| GET | `/api/companies/slug` | public | Slug availability — boolean + suggestion only. |
| PATCH | `/api/companies` | `company:update` | Rename the company (name only). |
| GET | `/api/achievements` | session | Achievement catalogue with own progress. |
| GET | `/api/dashboard/summary` | session | First-screen payload (own gamification, task counts, weekly board top, recognitions, active challenge). |

## Tasks

| Method | Path | Permission | Purpose |
| --- | --- | --- | --- |
| GET | `/api/tasks` | `task:read:own`+ | Paginated list, filters by status/team/assignee (visibility-scoped). |
| POST | `/api/tasks` | `task:manage` | Create + assign (optional team, due date, XP/coin rewards). |
| GET | `/api/tasks/dashboard` | session | Manager counts + team completion, or the employee's own board. |
| GET | `/api/tasks/:id` | visibility | Task with comments, attachments, reviews, events. |
| PATCH | `/api/tasks/:id` | `task:manage` | Edit fields (never status — the lifecycle has one door). |
| POST | `/api/tasks/:id/progress` | assignee | Self-reported 0–100. |
| POST | `/api/tasks/:id/transition` | actor rules | `start`/`submit` (assignee), `approve`/`request_revision`/`reopen` (reviewer). Approval requires a 0–100 score and runs the full payout transaction. |
| POST | `/api/tasks/:id/comments` | visibility | Comment. |
| POST | `/api/tasks/:id/attachments` | visibility | Link an attachment (URL protocol allow-list; storage is not part of the product yet). |

## Gamification, recognition, analytics

| Method | Path | Permission | Purpose |
| --- | --- | --- | --- |
| GET | `/api/leaderboard` | `leaderboard:read` | Weekly/monthly/team boards from windowed XP. |
| GET | `/api/leaderboard/progress` | session | Own trajectory: two windows + series + lifetime. |
| GET | `/api/analytics/overview` | `analytics:read` | Admin dashboard in one request: scope (company / manager's subordinates + led teams), 11 KPIs, employee and team rows, 30-day series — all from tasks, review scores and the ledgers. |
| GET | `/api/recognition` | `recognition:create` | Cycle state, own ballot, past results. |
| POST | `/api/recognition/vote` | `recognition:create` | One vote per category per cycle; no self, no duplicates. |
| POST | `/api/recognition/finalize` | `recognition:manage` | Idempotent tally: seals results, pays winners. |
| GET | `/api/recognition/admin` | `recognition:manage` | Categories, titles, cycle config. |
| POST/PATCH | `/api/recognition/categories…`, `/titles`, `cycle` | `recognition:manage` | Configure the programme. |
| GET | `/api/challenges` | `challenge:read` | Board (windows resolve on read; progress from real data). |
| POST/PATCH | `/api/challenges…` | `challenge:manage` | Create/edit/cancel. |
| GET | `/api/wallet` | session | Own balance + recent ledger. |
| GET | `/api/wallet/transactions` | session | Own paginated statement. |
| POST | `/api/wallet/adjust` | `reward:manage` | Bounded admin correction (reason mandatory; still a ledger row). |

## Rewards marketplace

| Method | Path | Permission | Purpose |
| --- | --- | --- | --- |
| GET | `/api/rewards` | `reward:read` | ACTIVE shelf with the caller's standing per item. |
| GET | `/api/rewards/:id` | `reward:read` | One item. |
| POST | `/api/rewards` | `reward:manage` | List a reward (rules: auto-approve, caps, level gate, window). |
| PATCH | `/api/rewards/:id` | `reward:manage` | Edit/reprice/restock/pause/archive. |
| POST | `/api/rewards/preview` | `reward:read` | Preview a payout before reviewing. |
| POST | `/api/rewards/:id/redeem` | `reward:redeem` | Atomic purchase: stock/level/allowance checks, wallet debit, optional auto-approval. Price is server-side, never a parameter. |
| GET | `/api/rewards/redemptions` | session | Own requests. |
| POST | `/api/rewards/redemptions/:id/cancel` | owner-of-request | Cancel while pending (refunds). |
| GET | `/api/rewards/admin` | `reward:manage` | Shelf + queue stats. |
| GET | `/api/rewards/admin/redemptions` | `reward:manage` | Decision queue (paginated, filterable). |
| POST | `/api/rewards/admin/redemptions/:id/decision` | `reward:manage` | Approve/fulfil/reject (reject refunds + restocks). |
| GET | `/api/rewards/rules` | session | Active economy version (rules are public to the company). |
| PUT | `/api/rewards/rules` | `reward:manage` | Publish a new version (never mutates history). |

## Notifications

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/api/notifications` | session | Own feed (paginated, unread-first). |
| GET | `/api/notifications/summary` | session | Unread count for the bell. |
| POST | `/api/notifications/:id/read` | owner | Mark one read (404 for anybody else's, idempotent). |
| POST | `/api/notifications/read-all` | session | Mark all read. |

## Operations

- `GET /api/health` — liveness + database ping. Public.
- Admin mutations write `AuditLog` rows (actor, action, target, payload):
  onboarding completion, invitation issue/revoke/accept, member edits and
  removals, team CRUD and membership changes, recognition configuration,
  reward-rule publishing, task edits and reviews.
