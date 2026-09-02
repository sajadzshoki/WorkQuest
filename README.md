# WorkQuest — ورک‌کوئست

Persian-first, multi-tenant employee performance management SaaS with a gamification layer.

This repository is the **foundation phase (phase 0)**: architecture, design system, RTL/i18n
plumbing, database layer, server API conventions and the authentication/authorization skeleton.
Product features (task assignment, review workflows, reward redemption, challenge engine) are
modelled in the database and stubbed as read-only endpoints, but are **not** implemented yet —
see [Remaining work](#remaining-work-for-phase-1).

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

---

## 3. Project structure

```
app/                          # everything rendered in the browser (Nuxt 4 srcDir)
  assets/css/main.css         # design tokens, @theme, component classes
  components/
    layout/                   # shell: sidebar, topbar, mobile tab bar, switchers
    common/                   # PageHeader, SectionCard, EmptyState
    gamification/             # XpProgress, StatTile, StreakPill, status/priority badges
    auth/                     # OtpCodeInput
  composables/                # useSession, useCan, useLocaleFormat, useNavItems…
  layouts/                    # default (app shell), auth, landing
  middleware/                 # auth.ts, guest.ts (route guards)
  pages/                      # index, login, dashboard, tasks, team, leaderboard, …
i18n/locales/                 # fa.json (source of truth), en.json
server/
  middleware/1.auth-context.ts# resolves the session cookie → event.context.auth
  utils/                      # db, tenant, auth, session, http, otp, crypto, error-handler
  api/                        # one file per endpoint (Nitro file routing)
shared/                       # code shared by client and server
  schemas/                    # zod request/query schemas
  types/                      # API contracts (AuthContext, MeResponse, ApiErrorBody)
  utils/                      # permissions matrix, XP maths, locale formatting
prisma/
  schema.prisma               # domain model
  migrations/                 # SQL migrations
  generated/prisma/           # generated client (git-ignored, aliased as #prisma/client)
  seed.ts                     # demo data for two tenants
test/                         # unit tests for shared/** (no database needed)
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

`Company`, `OtpCode` and `Session` are intentionally outside that list (tenant root / pre-auth).

Layers, in order:

| Layer | File | Responsibility |
| --- | --- | --- |
| Session | `server/middleware/1.auth-context.ts` | verify JWT, load user + session row, attach `event.context.auth` |
| RBAC | `shared/utils/permissions.ts` + `server/utils/auth.ts` | `can(role, permission)`, `requirePermission(event, …)` |
| Scope | `resolveVisibleUserIds(auth, scope)` | managers only see their (transitive) reports |
| Tenant | `server/utils/tenant.ts` | hard `companyId` filter on every query |

Roles are deliberately flat — `OWNER`, `ADMIN`, `MANAGER`, `EMPLOYEE` — with higher roles
inheriting everything below. Manager authority comes from the `TeamMember.managerId` graph, not
from a second permission system.

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
| `DELETE` | `/api/auth/session` | required |
| `GET` | `/api/me` | required |
| `GET` | `/api/dashboard/summary` | required |
| `GET` | `/api/tasks` | required (`scope=mine\|team\|all`) |
| `GET` | `/api/teams` | required |
| `GET` | `/api/leaderboard` | required |
| `GET` | `/api/achievements` | required |
| `GET` | `/api/rewards` | required |
| `GET` | `/api/notifications` | required |

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

1. `POST /api/auth/otp/request` → cooldown check, invalidate previous codes, store a **scrypt
   digest**, deliver through the provider. The plaintext is never returned.
2. `POST /api/auth/otp/verify` → attempt counter, timing-safe compare, consume the code, create a
   `Session` row, write an `AuditLog`, sign a JWT (`sub`, `sid`, `cid`, `role`), set the
   httpOnly/`SameSite=Lax` cookie.
3. `server/middleware/1.auth-context.ts` re-verifies the JWT **and** the `Session` row on every
   API call, so revocation works, and re-signs the token inside the renewal window (sliding
   expiry).

Accounts are never auto-provisioned: an unknown phone number is a `404`, not a signup.

---

## 7. Data model

23 tables, grouped by concern:

- **Tenancy** — `Company`, `User`, `OtpCode`, `Session`
- **Structure** — `Team`, `TeamMember` (carries `managerId`, the manager-scope edge)
- **Gamification** — `Level`, `UserProgress`, `XpTransaction`, `CoinTransaction`, `Achievement`,
  `UserAchievement`, `Badge`, `UserBadge`, `Recognition`
- **Work** — `Task`, `TaskReview`
- **Rewards & challenges** — `Reward`, `RewardRedemption`, `Challenge`, `ChallengeParticipant`
- **Messaging & audit** — `Notification`, `AuditLog`

Conventions:

- UUIDv7 primary keys (`uuid(7)`) — sortable, index friendly.
- Every tenant-owned table has `companyId` + an FK with `ON DELETE CASCADE`, plus indexes that
  start with `companyId`.
- Counters (`xp`, `coins`, streaks) are denormalised in `UserProgress`, but every change must be
  mirrored by an immutable `XpTransaction` / `CoinTransaction` ledger row.
- Statuses are enums, not free text.

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
npm run verify     # lint + typecheck + test + build
```

---

## 11. Remaining work for phase 1

**Writes / core loop**

- `POST /api/tasks` and `PATCH /api/tasks/:id` (assign, progress, submit) with validation and
  audit logging.
- `POST /api/tasks/:id/review` → score → XP/coin award inside a transaction, level recalculation,
  achievement evaluation, notification fan-out.
- Reward redemption (`POST /api/rewards/:id/redeem`) with stock/coin checks and a coin ledger row.
- Challenge engine: metric collectors that advance `ChallengeParticipant.progress`.
- Notification read/mark-all-read endpoints (currently read-only).

**Gamification rules**

- Server-side achievement rule evaluation from `Achievement.criteria` (already stored as JSON).
- Streak calculation bound to the company timezone.
- Windowed leaderboards computed from `XpTransaction` instead of the denormalised counter.

**Administration**

- Member management (invite by phone/email, role changes, suspend).
- Company settings: level ladder editor, reward catalogue, achievement catalogue.
- Cross-company identity (`Membership` join model) if a person must belong to several tenants.

**Platform**

- Automated tests for handlers (happy path + cross-tenant negative cases).
- Rate limiting beyond the OTP cooldown (per-IP token bucket).
- Structured logging, request IDs and error reporting.
- CI pipeline: `npm run verify` + migration dry-run.
- Persian/English parity pass on `en.json` once the UI settles.
