# Architecture

How WorkQuest is put together, and why. For the data model see
`docs/database.md`; for the HTTP surface see `docs/api.md`.

## The product

A Persian-first, RTL, multi-tenant employee performance platform: companies
manage people and teams, run a full task lifecycle with scored review, and pay
out XP and coins through immutable ledgers. Gamification (levels, streaks,
achievements, badges), peer recognition, windowed leaderboards, a reward
marketplace, challenges, notifications and a role-scoped analytics dashboard
are all built on those ledgers — nothing gamified is ever invented on the
client or counted outside a transaction.

## Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Nuxt 4 (Vue 3, SSR) | one codebase for app + server API |
| UI | Nuxt UI v4 over Tailwind CSS v4 | one design system; custom `wq-panel` surfaces |
| Font | Vazirmatn, self-hosted (`@fontsource-variable/vazirmatn`) | Persian-first typography |
| i18n | `@nuxtjs/i18n` | `fa` (default, RTL) and `en`, 100% key parity |
| Database | PostgreSQL + Prisma 7 (`adapter-pg`) | every tenant-owned row carries `companyId` |
| Validation | Zod schemas in `shared/schemas` | one definition per endpoint, server-authoritative |
| Auth | Phone OTP → JWT (jose, HS256) + revocable `Session` rows | httpOnly cookie |
| Tests | Vitest: 332 unit, 299 integration | integration drives a real dev server over HTTP |

## Layout

```
app/            pages, components, composables, layouts        (browser + SSR)
server/         Nitro API handlers, utils, middleware, plugins (server only)
shared/         schemas (zod), types (API contracts), pure utils (no I/O)
prisma/         schema, migrations, seed
test/           unit tests (pure) + integration (HTTP + real DB)
docs/           feature and reference documentation
scripts/        local-db (PGlite), migrations, integration runners
```

The `shared/` layer is the contract: types that both sides import (via the
`#shared` alias) and pure functions — permissions, task lifecycle, analytics
maths, formatting — that are unit-tested without a server. Business logic
that needs the database lives in `server/utils/` and is imported by handlers,
never duplicated in them.

## Multi-tenancy

Every tenant-owned model (31 of 35 — everything except `Company`, `OtpCode`,
`Session`, `OnboardingTicket`) is enforced through `createTenantClient(auth)`
(`server/utils/tenant.ts`): a Prisma client extension that rewrites **every**
read to include `companyId = auth.companyId` and stamps `companyId` on every
create. A handler cannot forget the filter, because there is no path that
skips it. Handlers that legitimately need cross-tenant access (`/api/health`,
onboarding, invitations) use `usePrisma()` directly and are called out in
comments.

`auth.companyId`, `auth.userId` and `auth.role` come from the session, which
is resolved in `server/middleware/1.auth-context.ts` from the JWT **plus a
fresh read of the user row** — a client can never assert them. The middleware
also re-checks that the JWT's role still matches the database (a role change
forces re-login), that the user is `ACTIVE`, and that the company is active.

## Authorization

A single permission matrix in `shared/utils/permissions.ts`
(`PERMISSIONS` × roles, OWNER/ADMIN = `'*'`). Two enforcement points:

1. `requirePermission(event, 'x:y')` on every privileged endpoint — the UI's
   `can()` is cosmetic only.
2. Row-level scope for managers: `getManagedUserIds` walks the transitive
   `TeamMember.managerId` chain (self excluded) and gates task visibility,
   member detail, analytics scope and member editing.

In-company invisibility returns **404, not 403** — confirming that an id
exists is itself information.

## Money: the ledger rules

XP and coins are append-only ledgers (`XpTransaction`, `CoinTransaction`).
There is no `update` or `delete` call on either anywhere in the codebase.

- Every payout runs through `applyXpDelta` / `applyCoinDelta`
  (`server/utils/wallet.ts`) inside the caller's transaction, with an
  `idempotencyKey` backed by a unique `(companyId, idempotencyKey)` index —
  a retried event credits once, not twice.
- Wallet balances and `UserProgress` counters are derived state, updated in
  the same transaction, with `balanceAfter` frozen onto each row so a
  statement renders without re-summing history.
- Market purchases lock the reward row `FOR UPDATE`, decrement stock with the
  guard in the `WHERE` clause, and follow one lock order (reward → wallet)
  everywhere, which is what makes deadlocks impossible rather than unlikely.
- Reward rules are **versioned, never mutated**: editing publishes a new
  `RewardRule` row and flips `isActive`; past payouts keep the `ruleVersion`
  that produced them.

## The gamification engine

`server/utils/gamification.ts` runs inside the approval transaction: score →
reward breakdown (from the active rule version) → XP/coin deltas → streak
advance (company-timezone, at most once per local day) → level resync →
achievement evaluation against server-computed metrics → badge grants →
notifications. Check-then-create with unique indexes as the hard guarantee;
a failing unique constraint aborts the transaction rather than half-applying.

## Frontend conventions

- Persian-first: every user-visible string through `i18n` (`fa.json` and
  `en.json` stay in 1:1 key parity); dates via the Persian calendar, numbers
  as Persian digits; logical CSS properties (`ps-`/`pe-`, `start`/`end`) so
  RTL is structural, not patched. Charts and phone numbers render in LTR
  blocks on purpose.
- One design system: `wq-panel` surfaces, `CommonPageHeader` /
  `CommonSectionCard` / `CommonEmptyState`, `useLocaleFormat` for every
  number and date. No component introduces its own color or shape language.
- Destructive actions confirm through the single `CommonConfirmDialog`
  (`useConfirm()`), never `window.confirm`.
- State is `useFetch`/`$fetch` against the JSON API — no client-side store to
  drift from the server.

## Testing strategy

- **Unit** (`test/*.test.ts`): every pure function — permissions, lifecycle,
  reward maths, leaderboard ranking, analytics helpers, formatting.
- **Integration** (`test/integration/*.integration.test.ts`): ten files, 299
  tests, driving a real Nuxt dev server over HTTP with its own PostgreSQL
  (PGlite over a TCP socket locally, real PostgreSQL in CI). Fixtures are
  fresh tenants created through SQL; flows that the product performs through
  its API (OTP login, task approval, redemption) are exercised through those
  same endpoints, not seeded around.
- Gates: `npm run lint`, `npm run typecheck`, `npm test`,
  `npm run test:integration:local`, `npm run build`.

## Deployment

SSR Node server (`node .output/server/index.mjs`), stateless between requests
— all state is PostgreSQL. See the "Production deployment" section of the
README for the checklist.
