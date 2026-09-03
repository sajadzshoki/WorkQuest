# WorkQuest — ورک‌کوئست

Persian-first, multi-tenant employee performance management SaaS with a gamification layer.

Implemented so far:

- **Phase 0 — foundation.** Architecture, design system, RTL/i18n plumbing, database layer,
  server API conventions, and the authentication/authorization skeleton.
- **Phase 1 — authentication.** Phone-OTP sign-in with a pluggable delivery transport, revocable
  JWT sessions, and self-service company registration for founders.
- **Phase 2 — people and teams.** Employee invitation by phone, acceptance through OTP, role and
  scope management, and team CRUD with a one-primary-team rule.
- **Phase 3 — task management.** The full task lifecycle (`TODO → IN_PROGRESS → SUBMITTED →
  APPROVED`, with a `NEEDS_REVISION` rework loop), manager/employee dashboards and permissions —
  see `docs/task-management.md`.
- **Phase 4 — performance & reward engine.** Scored task review (quality, timeliness, overall
  score), a centralized, configurable, versioned reward calculation service, permanent XP with
  level progression, and a transactional coin wallet whose balance is only ever reached through
  an immutable ledger — see `docs/reward-engine.md`.
- **Phase 5 — gamification.** A server-side gamification engine (streaks, achievements, badges)
  that runs in the approval transaction, a reusable server-side level calculation service,
  a data-driven achievement catalogue, an employee profile and a quiet celebration feed —
  see `docs/gamification.md`.
- **Phase 6 — employee recognition.** Peer-to-peer recognition with weekly/monthly cycles,
  one vote per coworker per category (no self-votes, no duplicates, no cross-company votes),
  private ballots, and an idempotent finalization step that tallies winners, seals results and
  pays XP/coins through the ledgers — see `docs/recognition.md`.

Still not implemented (see [Remaining work](#11-remaining-work)): the reward **catalogue**
redemption flow, the challenge engine, and windowed leaderboards — modelled in the database,
but not wired to endpoints yet.

---

## 1. Stack

| Layer | Choice |
| --- | --- |
| Framework | Nuxt 4 (Vue 3, TypeScript, strict) |
| UI kit | Nuxt UI v4 (Tailwind CSS v4 under the hood) |
| i18n | `@nuxtjs/i18n` — `fa` default, RTL; `en` wired for LTR |
| Typography | Vazirmatn (variable, self-hosted from `node_modules`) |
| Icons | Nuxt Icon / Iconify (`i-heroicons-*`) |
| Database | PostgreSQL + Prisma ORM 7 (`@prisma/adapter-pg`) |
| Validation | Zod (schemas shared between client and server) |
| Sessions | Signed JWT in an httpOnly cookie (`jose`) + revocable `Session` rows |
| Tooling | ESLint 10 (`@nuxt/eslint`), `vue-tsc` typecheck, Vitest |

> **Why not UnoCSS?** Nuxt UI v4 is built on Tailwind CSS v4, which already ships a complete
> atomic-utility engine. Running UnoCSS next to it would mean two preflights and two competing
> utility layers for zero gain, so the foundation uses Tailwind only. Swapping the design system
> to UnoCSS later means replacing the Nuxt UI layer, not just adding a module.

---

## 2. Quick start

```bash
cp .env.example .env          # then edit at least NUXT_SESSION_SECRET
npm install

# 1. start PostgreSQL
docker compose up -d postgres
#    …or use Prisma's bundled local server (no Docker needed):
npm run db:local              # prints a DATABASE_URL; put it in .env

# 2. create the schema and demo data
npm run db:generate
npm run db:deploy             # applies prisma/migrations
npm run db:seed

# 3. run
npm run dev
```

Open <http://localhost:3000>. Sign in with a seeded phone number — the OTP code is **printed in
the dev server log** (the `console` OTP provider):

| Role | Phone |
| --- | --- |
| OWNER (نواندیشان پایا) | `+989120000001` |
| ADMIN | `+989120000002` |
| MANAGER | `+989120000003` |
| EMPLOYEE | `+989120000005` |
| OWNER (داده‌کاوان آریا — other tenant) | `+989130000001` |

Logging in as two different tenants side by side is the fastest way to see the isolation at work.

### Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server on `0.0.0.0:3000` |
| `npm run build` / `npm start` | Production build / run |
| `npm run typecheck` | `vue-tsc` across app, server, shared and node projects |
| `npm run lint` / `lint:fix` | ESLint |
| `npm test` | Vitest unit tests (no database required) |
| `npm run verify` | lint + typecheck + test + build |
| `npm run db:generate` | Generate the Prisma client into `prisma/generated` (required before `typecheck`) |
| `npm run db:migrate` / `db:deploy` | Create / apply migrations |
| `npm run db:seed` | Reset demo data |
| `npm run db:studio` | Prisma Studio |
| `npm run db:local` | Prisma's bundled local PostgreSQL server (`prisma dev`) |
| `npm run db:local:pglite` | Local PostgreSQL on a fixed port (PGlite over TCP, no Docker) |
| `npm run test:integration` | Real server + real PostgreSQL, over HTTP (needs `DATABASE_URL`) |
| `npm run test:integration:local` | The whole integration suite on PGlite — migrates, seeds, runs, tears down |

---

## 3. Project structure

```
app/                          # everything rendered in the browser (Nuxt 4 srcDir)
  assets/css/main.css         # design tokens, @theme, component classes
  components/
    layout/                   # shell: sidebar, topbar, mobile tab bar, switchers
    common/                   # PageHeader, SectionCard, EmptyState
    gamification/             # XpProgress, StatTile, StreakPill, status/priority badges
    members/                  # RoleBadge, StatusBadge, InviteModal
    auth/                     # OtpCodeInput, OnboardingStepper
  composables/                # useSession, useOnboarding, useInvitation, useCan,
                              # useLocaleFormat, useNavItems…
  layouts/                    # default (app shell), auth, landing
  middleware/                 # auth.ts, guest.ts, onboarding.ts, invitation.ts (route guards)
  pages/                      # index, login, onboarding, dashboard, tasks, team, team/[id],
                              # members, members/[id], invitations, invitations/join, …
i18n/locales/                 # fa.json (source of truth), en.json
server/
  middleware/1.auth-context.ts# resolves the session cookie → event.context.auth
  utils/                      # db, tenant, auth, session, onboarding, invitation, members,
                              # http, otp, crypto, error-handler
  api/                        # one file per endpoint (Nitro file routing)
                              #   auth/, members/, invitations/, teams/, tasks/, …
shared/                       # code shared by client and server
  constants.ts                # default level ladder, supported timezones/locales
  schemas/                    # zod request/query schemas
  types/                      # API contracts (AuthContext, MeResponse, member/team payloads)
  utils/                      # permissions matrix, member-scope rules, XP maths,
                              # locale formatting, slugify
prisma/
  schema.prisma               # domain model
  migrations/                 # SQL migrations
  generated/prisma/           # generated client (git-ignored, aliased as #prisma/client)
  seed.ts                     # demo data for two tenants
test/                         # unit tests (no database needed)
  integration/                # HTTP tests against a real server + database
scripts/run-integration.sh    # boots that server for the integration suite
```

### Aliases

- `#prisma/client` → the generated Prisma client (`nuxt.config.ts` → `alias`).
- `#shared/*` → `shared/*` (Nuxt 4 built-in).
- `~` → `app/`, `~~` → repository root.

---

## 4. Multi-tenancy and authorization

Tenant isolation is enforced **on the server**, in one place that handlers cannot bypass:

```ts
const db = createTenantClient(auth)          // server/utils/tenant.ts
const tasks = await db.task.findMany({ where: { status: 'ASSIGNED' } })
// → executed as WHERE ("status" = 'ASSIGNED' AND "companyId" = <session company>)
```

`createTenantClient()` returns a Prisma client extension that:

1. rewrites `where` on every tenant-owned model to `AND`-in `companyId`;
2. stamps `companyId` on every `create` / `createMany` / `upsert`;
3. **throws** if a handler passes a `companyId` that disagrees with the session.

`Company`, `OtpCode`, `Session` and `OnboardingTicket` are intentionally outside that list
(tenant root / pre-auth). `Invitation` **is** scoped — the pre-auth lookup that an invitee's
ticket performs goes through `usePrisma()` directly, never through this client.

Layers, in order:

| Layer | File | Responsibility |
| --- | --- | --- |
| Session | `server/middleware/1.auth-context.ts` | verify JWT, load user + session row, attach `event.context.auth` |
| RBAC | `shared/utils/permissions.ts` + `server/utils/auth.ts` | `can(role, permission)`, `requirePermission(event, …)` |
| Scope | `shared/utils/member-scope.ts` | *which rows* a role may reach |
| Tenant | `server/utils/tenant.ts` | hard `companyId` filter on every query |

Roles are deliberately flat — `OWNER`, `ADMIN`, `MANAGER`, `EMPLOYEE` — with higher roles
inheriting everything below. Manager authority comes from the `TeamMember.managerId` graph, not
from a second permission system.

The matrix answers "may this role act at all"; `shared/utils/member-scope.ts` answers "on which
rows". Keeping those helpers **pure** (subject in, boolean out) is what makes the whole model
unit-testable without a database:

| Rule | OWNER / ADMIN | MANAGER | EMPLOYEE |
| --- | --- | --- | --- |
| `visibleMemberScope` | whole company (`null`) | self + transitive reports | self only |
| `memberPermissions.canEdit` | anyone but self | own reports | nobody, incl. self |
| `memberPermissions.canChangeRole` | anyone but self, never an OWNER | never | never |
| `canEditTeam` | any team | teams they lead | none |
| `maxAssignableRole` | `ADMIN` | `EMPLOYEE` | — |

Two invariants follow from those rules and are enforced server-side, not in the UI: **nobody
changes their own role**, and **a company always keeps at least one active OWNER**.

---

## 5. API conventions

- One endpoint per file under `server/api/**`; handlers stay thin and delegate to `server/utils`.
- Every body/query is validated with a **shared zod schema** (`shared/schemas`).
- Every error goes through `server/utils/error-handler.ts` and returns one envelope:

```json
{ "statusCode": 422, "code": "VALIDATION_FAILED", "message": "…", "issues": [{ "path": "phone", "message": "…" }] }
```

- `code` is stable and machine-readable; `message` is user-facing.

Current endpoints:

| Method | Path | Auth |
| --- | --- | --- |
| `GET` | `/api/health` | public |
| `POST` | `/api/auth/otp/request` | public (rate limited) |
| `POST` | `/api/auth/otp/verify` | public |
| `GET` | `/api/auth/onboarding` | onboarding ticket |
| `POST` | `/api/auth/onboarding/complete` | onboarding ticket |
| `GET` | `/api/auth/invitations` | invitation ticket |
| `POST` | `/api/auth/invitations/accept` | invitation ticket |
| `DELETE` | `/api/auth/session` | required |
| `GET` | `/api/me` | required |
| `GET` | `/api/dashboard/summary` | required |
| `GET` | `/api/tasks` | required (`scope=mine\|team\|all`) |
| `GET` | `/api/leaderboard` | required |
| `GET` | `/api/achievements` | required |
| `GET` | `/api/rewards` | required |
| `GET` | `/api/notifications` | required |
| `GET` | `/api/companies/slug` | public (boolean only) |

People and teams:

| Method | Path | Auth |
| --- | --- | --- |
| `GET` | `/api/members` | `member:read` (`scope=mine\|team\|all`; `all` is admin-only) |
| `GET` | `/api/members/:id` | self, own reports, or admin |
| `PATCH` | `/api/members/:id` | admin; managers only retitle/move their reports |
| `DELETE` | `/api/members/:id` | `member:manage` |
| `POST` | `/api/members/invite` | `member:invite` |
| `GET` | `/api/invitations` | `member:invite` (managers see only their own) |
| `DELETE` | `/api/invitations/:id` | admin, or the inviter |
| `GET` | `/api/teams` | required (scoped to the teams you lead or staff) |
| `POST` | `/api/teams` | `team:manage` |
| `GET` | `/api/teams/:id` | lead, member, their manager, or admin |
| `PATCH` | `/api/teams/:id` | `team:manage`; a lead may only rename their own |
| `DELETE` | `/api/teams/:id` | `team:manage` |
| `POST` | `/api/teams/:id/members` | `team:manage` or the team's lead |
| `PATCH` | `/api/teams/:id/members/:userId` | `team:manage` or the team's lead |
| `DELETE` | `/api/teams/:id/members/:userId` | `team:manage` or the team's lead |

---

## 6. Authentication

Phone-number OTP with a **pluggable delivery transport** (`server/utils/otp.ts`):

```ts
export interface OtpProvider {
  readonly id: string
  isConfigured(): boolean
  send(input: OtpSendInput): Promise<void>
}
```

| Driver | Use |
| --- | --- |
| `console` | development; logs the code and **refuses to run in production** |
| `http` | vendor-agnostic gateway: `POST` JSON to `NUXT_OTP_HTTP_URL` with a `{code}` template |

Adding Kavenegar/SMS.ir/Twilio means implementing `OtpProvider` and registering it in
`resolveOtpProvider()` — no handler changes.

Flow:

1. `POST /api/auth/otp/request` → per-IP cap, per-phone resend cooldown, invalidate previous
   codes, store a **scrypt digest**, deliver through the provider. The plaintext is never
   returned, and `accountExists` in the response is the only existence signal the API exposes.
2. `POST /api/auth/otp/verify` → attempt counter, timing-safe compare, consume the code, then
   either open a session or hand out an onboarding ticket (below).
3. `server/middleware/1.auth-context.ts` re-verifies the JWT **and** the `Session` row on every
   API call, so revocation works, and re-signs the token inside the renewal window (sliding
   expiry).

Rate limiting has three layers: a rolling per-IP cap
(`NUXT_OTP_MAX_REQUESTS_PER_IP_PER_HOUR`), a per-phone resend cooldown, and a per-code attempt
budget that burns the code after `NUXT_OTP_MAX_ATTEMPTS` wrong guesses.

### Self-service registration

A verified phone with no account is the entry point for creating a company:

```
phone → OTP → verify → onboarding ticket (httpOnly cookie)
      → /onboarding/profile → /onboarding/company → OWNER session
```

`server/utils/onboarding.ts` issues a **single-use `OnboardingTicket` row** whose id lives in an
httpOnly, `SameSite=Lax` cookie. The browser never sees the id, so it cannot be lifted by script
or leak into a URL or log; `GET /api/auth/onboarding` is the only way the client learns which
phone it is registering for. Backing the ticket with a row rather than a stateless JWT is what
makes it revocable and replay-proof.

`POST /api/auth/onboarding/complete` then creates the tenant in one transaction:

- consumes the ticket **inside the transaction** — two concurrent submits cannot both win;
- derives and de-duplicates the slug (`reserveCompanySlug`), so a name collision never blocks
  a founder;
- creates the `Company`, its `OWNER` and the default level ladder + zeroed `UserProgress`;
- writes an `AuditLog` row and opens the session.

The phone comes from the ticket and the role is assigned server-side — neither is an input, so a
caller cannot register a number they do not control or grant themselves a higher role.

### Employee invitation

Adding a person to an existing company is a separate flow, because the company and the role
already exist:

```
manager enters phone/name/title/team/role
   → Invitation row (PENDING)
   → invitee signs in with an OTP
   → verify returns `invitation_pending` + invitation ticket
   → /invitations/join → accept → EMPLOYEE/MANAGER session in that company
```

`POST /api/auth/otp/verify` has **three** outcomes, checked in this order: an existing account
opens a session; otherwise a pending invitation issues an *invitation* ticket; otherwise an
onboarding ticket. The order is a security property — an invited phone must not be able to
sidestep the invitation and self-register as an `OWNER`.

Invitations are their own table rather than `User` rows with `status = INVITED`:

- the invitee has no account yet, and a phantom user would appear in the people list unable to
  sign in;
- one phone may be invited by several companies at once;
- invitations expire and can be revoked, which must not touch the user table.

`pendingPhone` carries the phone only while the invitation is open and is nulled on
accept/revoke/expire, so the unique `(companyId, pendingPhone)` index enforces "one open
invitation per company and phone" while keeping the history of closed ones (Postgres treats
NULLs as distinct).

`POST /api/auth/invitations/accept` takes **only** the invitation id. Phone comes from the
ticket; company, role, team, name and title come from the invitation row. The ticket and the
invitation are both closed inside one transaction, so neither a double submit nor a concurrent
revoke can produce two accounts. Acceptance also creates the `UserProgress` row, the optional
`TeamMember`, a notification for the inviter, and an audit entry.

Scope limits on inviting:

| Caller | Role they may grant | Teams they may invite into | Invitations they may see |
| --- | --- | --- | --- |
| OWNER / ADMIN | up to `ADMIN` | any | all |
| MANAGER | `EMPLOYEE` only | teams they lead | their own |
| EMPLOYEE | — | — | — (403) |

### Public API routes

`server/middleware/1.auth-context.ts` holds an explicit allowlist of routes reachable without a
session. Every entry is guarded some other way (OTP rate limits, the onboarding ticket, or a
boolean-only response) and nothing tenant-scoped belongs there. Adding an endpoint under an
already-public prefix is not enough — add the exact path.

---

## 7. Data model

35 tables, grouped by concern:

- **Tenancy & auth** — `Company`, `User`, `OtpCode`, `Session`, `OnboardingTicket`
- **Structure** — `Team`, `TeamMember` (carries `managerId`, the manager-scope edge),
  `Invitation`
- **Gamification** — `Level`, `UserProgress`, `XpTransaction`, `CoinTransaction`, `Achievement`,
  `UserAchievement`, `Badge`, `UserBadge`, `Recognition`, `Wallet`, `RewardRule`
- **Recognition (peer voting)** — `RecognitionCycle`, `RecognitionCategory`,
  `RecognitionVote`, `RecognitionResult`, `RecognitionTitle`
- **Work** — `Task`, `TaskComment`, `TaskAttachment`, `TaskEvent`, `TaskReview`
- **Rewards & challenges** — `Reward`, `RewardRedemption`, `Challenge`, `ChallengeParticipant`
- **Messaging & audit** — `Notification`, `AuditLog`

Conventions:

- UUIDv7 primary keys (`uuid(7)`) — sortable, index friendly.
- Every tenant-owned table has `companyId` + an FK with `ON DELETE CASCADE`, plus indexes that
  start with `companyId`.
- Counters (`xp`, `coins`, streaks) are denormalised in `UserProgress`, but every change must be
  mirrored by an immutable `XpTransaction` / `CoinTransaction` ledger row.
- Statuses are enums, not free text.
- `TeamMember` is unique on `(companyId, userId)` as well as `(teamId, userId)`: **one primary
  team per employee** is a data rule, not a UI convention. The endpoints that would create a
  second membership answer `409` naming the team the person is already in, rather than letting
  the unique index surface as a `500`.

---

## 8. Design system

- **RTL by default.** Layouts use logical utilities only (`ps-*`, `pe-*`, `ms-*`, `me-*`,
  `start-*`, `end-*`, `text-start`), so flipping `dir` is enough for LTR. `<html lang dir>` is set
  by i18n and reinforced in `app.vue`.
- **Vazirmatn Variable**, self-hosted (`@fontsource-variable/vazirmatn`), weights 100–900, with
  Arabic, Latin and Latin-ext subsets. No font CDN is contacted.
- **Tokens** live in `app/assets/css/main.css` under `@theme`: brand palette, coin/streak accents,
  `--shadow-soft` / `--shadow-lifted`, and the `.wq-panel`, `.wq-hero-gradient`, `.wq-skeleton`
  component classes.
- **Persian-first numbers and dates.** `shared/utils/format.ts` renders Persian digits and the
  Persian calendar for `fa`, and switches automatically with the locale.
- **Gamification without toy-ness.** XP, coins, streaks and badges are rendered as restrained
  accents inside professional surfaces — no cartoon art, no confetti.
- **Reduced motion** and dark mode are respected globally.

---

## 9. Environment

All configuration flows through `runtimeConfig`; every key is overridable with a `NUXT_*`
variable. See `.env.example` for the annotated list. Nothing is hard-coded.

Minimum for a real deployment:

```
DATABASE_URL=…
NUXT_SESSION_SECRET=…            # >= 32 chars, `openssl rand -base64 48`
NUXT_SECURE_COOKIES=true
NUXT_OTP_PROVIDER=http           # never `console` in production
NUXT_OTP_HTTP_URL=…
NUXT_APP_URL=https://app.example.com
```

---

## 10. Development conventions

- **Strict TypeScript everywhere**, plus `noUncheckedIndexedAccess` and `noImplicitOverride`.
- **Validate at the edge.** Request shapes are declared once in `shared/schemas` and used by both
  the client and the handler.
- **Never trust the client for permissions.** `useCan()` only hides affordances.
- **One error envelope**, one error handler.
- **Components over duplication.** If a snippet appears twice, it becomes `components/**`.
- **Persian strings live in `i18n/locales/fa.json`.** Components never hard-code copy; `fa.json`
  is the source of truth and `en.json` mirrors its keys.
- **Migrations are hand-editable SQL.** `prisma/migrations/**` is committed; never edit an applied
  migration — add a new one.
- Commit messages and code comments are in English; UI copy is Persian.

### Checks

```bash
npm run verify                  # lint + typecheck + unit tests + build
npm test                        # unit tests — no database needed
npm run test:integration        # real server + real PostgreSQL, over HTTP
npm run test:integration:local  # same suite, on PGlite — no Docker, no DATABASE_URL
```

`npm test` covers the framework-free layers (`shared/**` and `server/utils/crypto`) and needs no
database — including the whole role × action scope matrix in `test/member-scope.test.ts`.
`npm run test:integration` boots a real dev server against the configured database and drives the
API over HTTP: registration, login, invalid/expired/brute-forced codes, unauthorized access,
cross-company isolation, the full invitation lifecycle, the task lifecycle, the reward
engine (duplicate approval, duplicate reward prevention, invalid scores, authorization), and
the gamification engine (achievement unlock, badge award, streak advancement, no duplicate
rewards).

The integration runner (`scripts/run-integration.sh`) starts its own server on `TEST_PORT`
(default 3100), so it must not collide with a running `npm run dev`. It boots the server from a
shell rather than from inside Vitest on purpose: a `npx nuxt dev` child answers HTTP but its
stdout does not reliably reach a Node worker here, and the suite reads the OTP codes the `console`
provider prints from that output.

`npm run test:integration:local` wraps that runner in `scripts/run-integration-local.sh`: it boots
a local PostgreSQL (PGlite over a TCP socket, `scripts/local-db.mjs`), applies the migrations and
seed, and runs the same suite before tearing the database down again. PGlite is a single-connection
engine multiplexed over the socket, so this is the convenient day-to-day path while CI keeps a real
PostgreSQL. Both runners need `NUXT_SESSION_SECRET` (≥ 32 chars); the local wrapper generates a
throwaway one, and `npm run test:integration` reads it from `.env` like the server does.

---

## 11. Remaining work

**Writes / core loop**

- ~~Task write endpoints~~ — done in phase 3 (create, edit, assign, progress, submit, comment,
  attach, dashboard).
- ~~Task review~~ — done in phase 4: score → XP/coin award inside a transaction, level
  recalculation and notification fan-out (`POST /api/tasks/:id/transition` with `action:
  approve`/`request_revision`).
- Reward redemption (`POST /api/rewards/:id/redeem`) with stock/coin checks and a coin ledger row.
  The `REWARD_REDEMPTION` ledger type, wallet debit helper and `redemptionKey()` idempotency key
  already exist and are tested; only the catalogue endpoint and UI remain.
- Challenge engine: metric collectors that advance `ChallengeParticipant.progress`.
- Notification read/mark-all-read endpoints (currently read-only).

**Gamification rules**

- ~~Server-side achievement rule evaluation from `Achievement.criteria`~~ — done in phase 5:
  `server/utils/gamification.ts` evaluates the ACTIVE catalogue against server-computed metrics
  inside the approval transaction.
- ~~Streak calculation bound to the company timezone~~ — done in phase 5:
  `shared/utils/streak.ts` + `advanceUserStreak` (at most once per calendar day).
- Badges are awarded alongside achievements (linked via `Badge.achievementId`).
- Windowed leaderboards computed from `XpTransaction` instead of the denormalised counter.

**Administration**

- ~~Member management~~ — done in phase 2 (invite by phone, role changes, suspend, remove,
  team CRUD, invitation lifecycle).
- Transferring company ownership. Deliberately absent: nobody can change an `OWNER` role today,
  so a tenant cannot be left ownerless by accident either.
- Assigning a member's **direct manager** from the UI. The field and its validation exist
  (`TeamMember.managerId`, `MANAGER_NOT_IN_TEAM`); only the owner/manager-facing control is
  missing, so manager scope currently comes from the seed data.
- Company settings: level ladder editor, reward catalogue, achievement catalogue.
- Cross-company identity (`Membership` join model) if a person must belong to several tenants.
  Today `User` is per-company and `TeamMember` is unique per company, so one person per tenant.

**Platform**

- Company profile editing (name, logo upload, timezone) — the onboarding form only creates them.
- Avatar upload for members; the profile shows initials until then.
- Browser tests (Playwright) for the wizard and the people screens; the HTTP-level flows are
  already covered.
- Structured logging, request IDs and error reporting.
- CI pipeline: `npm run verify` + migration dry-run.
- Persian/English parity pass on `en.json` once the UI settles.
