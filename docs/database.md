# Database

PostgreSQL via Prisma 7 (`prisma/schema.prisma`, migrations in
`prisma/migrations/`, demo data in `prisma/seed.ts`). This document is the
map: what each model is for, and the integrity rules that keep the numbers
trustworthy. The application-level rules live in code — this file explains
where the database itself enforces them.

## Migrations

```bash
npx prisma migrate dev --name <change>     # development (or scripts/apply-migrations.mjs for PGlite)
npx prisma migrate deploy                  # production / CI: apply committed migrations only
npx prisma migrate status                  # drift check
```

Eleven migrations to date, from `init` through `notifications`. The generated
client is committed under `prisma/generated/` (`#prisma/client` alias) so
builds never race `prisma generate`.

## Tenancy and cascade rules

35 models. 31 are **tenant-owned**: every row carries `companyId` and is
reached only through the tenant-scoped Prisma client. Four are deliberately
outside the scope — `Company` (the tenant root), `OtpCode` /
`OnboardingTicket` (pre-auth), `Session` (revocation list, keyed by user id).

Deleting a `Company` cascades to everything it owns — the tenant is the unit
of disposal. Within a tenant:

| Relation | On delete | Rationale |
| --- | --- | --- |
| `Task.assignee` / `Task.team` | `SetNull` | removing a person must not destroy their work history; the task becomes unassigned, not gone |
| ledger rows (`Xp/CoinTransaction`) → user | `Cascade` | a hard user delete only happens with the tenant |
| `TaskReview`, `TaskComment`, `TaskAttachment`, `TaskEvent` → task | `Cascade` | a task's conversation belongs to the task |
| `TeamMember` → user / team | `Cascade` | membership is a join row |
| `User` (member removal) | — | the API never hard-deletes a member: `DELETE /api/members/:id` sets `status: DEACTIVATED` and drops memberships, so ledger history survives |

## Money — the invariants

- **Append-only ledgers.** `XpTransaction` and `CoinTransaction` are written
  by `applyXpDelta` / `applyCoinDelta` only. No code path updates or deletes
  ledger rows; corrections are new rows.
- **At-most-once payouts.** Every programmatic credit carries an
  `idempotencyKey`, unique per `(companyId, idempotencyKey)`:
  `task:<id>:reward`, `achievement:<id>:<uid>:xp|coins`,
  `challenge:<cid>:<uid>:…`, `recognition:<resultId>:winner:<uid>`,
  `redemption:<id>` / `redemption:<id>:refund`. A retried event is a no-op.
- **Wallets are derived.** `Wallet.balance`, `lifetimeEarned`,
  `lifetimeSpent` and `UserProgress.xp`/`coins` are updated in the same
  transaction as the ledger row; `balanceAfter` is frozen onto the row so a
  statement never re-sums history.
- **Marketplace atomicity.** `RewardRedemption` creation locks the reward
  `FOR UPDATE`, decrements stock with the guard in the `WHERE`
  (`stock > 0`, `stock IS NULL` = unlimited), and debits the wallet — one
  transaction, one lock order (reward → wallet) everywhere.
- **Versioned economy.** `RewardRule` rows are immutable once published;
  `isActive` flips on publish, and `TaskReview.rewardBreakdown` +
  `ruleVersion` freeze the computation that produced each payout.

## Unique constraints that encode product rules

| Constraint | Rule |
| --- | --- |
| `TeamMember (companyId, userId)` | one primary team per employee per company |
| `Team (companyId, slug)` | team addresses are per-tenant |
| `UserProgress (userId)` | one progress row per person |
| `Wallet (userId)` | one wallet per person |
| `UserAchievement (userId, achievementId)`, `UserBadge (userId, badgeId)` | an unlock or badge happens once |
| `Notification (companyId, userId, dedupeKey)` | an event notifies a person at most once |
| `Invitation (companyId, pendingPhone)` | one open invitation per phone per company |
| `Xp/CoinTransaction (companyId, idempotencyKey)` | at-most-once payouts (above) |
| `RecognitionVote (cycleId, categoryId, voterId)` | one vote per person per category per cycle |
| `ChallengeParticipant (challengeId, userId)` | a person is enrolled once per challenge |
| `OtpCode` — latest-live-code checks in the handlers | one usable code per `(phone, purpose)`; resend cooldown, 5-attempt cap and a per-IP hourly quota back it up |

## Indexes

85 explicit `@@index` / `@@unique` declarations, all co-designed with the
query paths:

- **Tenant-first composites** mirror the actual access patterns, e.g.
  `Task (companyId, assigneeId, status)`, `Task (companyId, teamId, status)`,
  `Task (companyId, dueDate)`, `XpTransaction (companyId, userId, createdAt)`
  and `(companyId, createdAt)` for windowed leaderboards.
- **Ledger lookups** by `idempotencyKey`, `referenceId`.
- **Queue scans**: `RewardRedemption (companyId, status, createdAt)`,
  `Notification (companyId, userId, createdAt)`.
- **Manager scope**: `TeamMember (companyId, managerId)` makes
  `getManagedUserIds` an index walk.

`Task.score` deliberately does not exist — scores live on `TaskReview` (one
APPROVED review per approved task, since approval requires a grade and
`APPROVED` is terminal), which is what analytics and profiles read.

## Transactions

Every multi-write flow runs in one Prisma interactive transaction:
task approval (review + payout + streak + level + achievements + badges +
notifications), reward redemption (stock + debit + request row), recognition
finalization (tallies + payouts + sealed results), challenge completion
(payouts + status), member removal (membership drop + deactivation +
revocation), rule publishing (deactivate old + create new + audit log).
Ledger rows append inside those transactions, so a failed step leaves no
partial money movement.

## Seeding & local database

`scripts/local-db.mjs` runs PGlite (real PostgreSQL engine) over a TCP socket
on port 5433 — no Docker needed for development. `prisma/seed.ts` builds two
demo tenants (an Owner + managers + employees, tasks across the lifecycle,
ledgers, challenges, rewards) with Persian names and content.

> Note: PGlite is a **development** engine with a small connection cap
> (~8–10). Production should run a real PostgreSQL — the integration runner
> documents the same (`scripts/run-integration.sh` for CI on real PG,
> `…:local` for PGlite).
