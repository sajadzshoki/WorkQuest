# Final QA Report — Production Readiness

Date: 2026-09-05 · Branch: `arena/01a07058-workquest` · Scope: full audit of
correctness, security, UX, performance, responsiveness, design, testing and
documentation. **No new product features were added in this pass.**

## 1. Completed features

Everything below is implemented end-to-end (server + UI + tests) and driven
by real data — no mocked flows:

| Area | Status |
| --- | --- |
| Phone-OTP auth (register + login), revocable JWT sessions | done |
| Self-service company onboarding (founder flow) | done |
| People: invite by phone → OTP acceptance → join, roles, suspend, soft-remove | done |
| Teams: CRUD, one-primary-team rule, lead + direct-manager edges | done |
| Task lifecycle: TODO → IN_PROGRESS → SUBMITTED → APPROVED (+ rework loop), comments, attachments (URL), dashboards | done |
| Scored review → versioned reward engine → XP/coin payout | done |
| Wallet + immutable ledgers, admin adjustments | done |
| Levels, streaks (company-timezone), achievements, badges | done |
| Peer recognition: categories, weekly/monthly cycles, ballots, sealed finalization with payouts | done |
| Windowed leaderboards (week/month/team) with privacy cap | done |
| Reward marketplace: shelf, atomic redemption, auto/admin approval, refunds | done |
| Challenges (individual/team) with goals computed from real data | done |
| In-app notifications: 14-event catalogue, at-most-once delivery, bell + feed | done |
| Company analytics: 11 KPIs, 4 charts, employee/team tables, per-employee performance profile | done |
| Company name editing + gamification-rules editor (first UI over the versioned economy) | done |

## 2. Security checks (performed this pass)

| Check | Result |
| --- | --- |
| Session handling | JWT (HS256, ≥32-char secret enforced) + `Session` row revocation; httpOnly/secure/sameSite cookie; sliding renewal; user re-read on every request; role-change forces re-login; `ACTIVE` user + active company checked |
| Client-supplied identity | **No endpoint accepts `companyId`, `userId` or `role`.** Grep-verified: the only `input.companyId` is an internal function parameter derived from `auth`; invitation acceptance derives the tenant from the invitation row |
| Multi-tenancy | 31 of 35 models behind the tenant-scoped Prisma client (reads filtered, creates stamped). The 4 exceptions (`Company`, `OtpCode`, `Session`, `OnboardingTicket`) are pre-auth/tenant-root by design |
| IDOR (in-company) | Tasks and sub-resources via `loadVisibleTask` (assignee/manager/assigner/led-team); member detail 404s for non-visible ids; notification read 404s for foreign rows (integration-tested); invitation revoke limited to own sends for managers |
| Cross-company access | Integration tests in analytics, leaderboard, people, tasks, rewards and notifications suites assert tenant-B callers never see tenant-A data — all passing |
| Authorization | Server-side permission matrix on every privileged route; UI `can()` is cosmetic; per-field rules on member PATCH |
| Role escalation | Self role-change blocked; last-OWNER protection; assigner's role ceiling enforced; sessions revoked on role change and member removal |
| Input validation | Every body/query through shared Zod schemas with Persian messages; out-of-range scores rejected, not clamped |
| SQL queries | Raw SQL only where locking demands it — all parameterised (`FOR UPDATE` reward locks, guarded stock updates) |
| OTP | 90s resend cooldown per (phone, purpose), 5-attempt cap, 120s TTL, per-IP hourly quota; `console` provider **refuses to run outside development** |
| Rate limiting | OTP paths only (see limitations) |
| File uploads | None exist — attachments are client-supplied URLs validated against an http/https allow-list (XSS-aware); no storage surface to abuse |
| Response headers | Global `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`; `/api/**` adds `no-store` and disables CORS |

**Found and fixed this pass:** global browser-hardening headers were missing
(added); three `<img>` tags lacked lazy loading (added); four destructive
actions used `window.confirm` (replaced with the themed, RTL, i18n'd
`CommonConfirmDialog`).

## 3. Database checks

| Check | Result |
| --- | --- |
| Indexes | 85 explicit `@@index`/`@@unique`, co-designed with query paths (tenant-first composites, ledger lookups, queue scans, manager-scope walk) |
| Foreign keys + cascades | Audited. Company → everything (tenant disposal). `Task.assignee/team` `SetNull` (work history survives); task sub-resources cascade; memberships cascade |
| Member deletion | Soft (DEACTIVATED) — ledger history preserved, sessions revoked |
| Coin/XP immutability | **Verified: no `update`/`delete`/`deleteMany` call exists on either ledger anywhere in `server/`** |
| Duplicate reward grants | Impossible by construction: `idempotencyKey` unique per `(companyId, key)` on both ledgers; check-then-create + unique indexes for achievements/badges; integration tests hammer concurrent approvals |
| Wallet consistency | Balance + `balanceAfter` written in the same transaction as the ledger row; purchases lock reward `FOR UPDATE` with guarded stock decrement; one lock order everywhere |
| Transaction integrity | Every multi-write flow in one Prisma interactive transaction (approval payout, redemption, finalization, challenge completion, rule publish, member removal) |
| Migration hygiene | 11 committed migrations, forward-only; `migrate deploy` for production |

## 4. Performance checks

- **N+1:** loop-with-await sites audited — all are deliberate, documented
  check-then-create sequences inside transactions over small catalogues; no
  request-path N+1 found.
- **Query fan-out:** read endpoints run ≤ 6 concurrent queries (waves), sized
  for pooled deployments and the PGlite dev server.
- **Pagination:** tasks, members, notifications, wallet statement, redemption
  queue — all paginated. The reward shelf and level ladder are finite
  catalogues by design.
- **Frontend:** one chatty request per screen (dashboard, analytics) instead
  of per-widget requests; all images `loading="lazy" decoding="async"`;
  hand-rolled SVG charts (no chart library payload).
- **Known scale trade-off:** analytics aggregates in memory after one bounded
  fetch per table — right for hundreds-to-low-thousands of tasks per tenant;
  windowed SQL aggregates would be the next step beyond that.

## 5. Responsiveness

- Mobile: bottom tab bar (safe-area aware), off-canvas sidebar, real card
  layouts — the analytics employee table now renders per-employee cards on
  phones instead of a shrunken 12-column table (added this pass).
- Tablet/desktop: `sm:`/`lg:` breakpoint grids throughout; wide tables scroll
  within their panel only from `sm` up.
- RTL: logical CSS properties (`ps/pe`, `start/end`) everywhere; charts and
  phone numbers render in LTR blocks on purpose; Persian calendar + digits.

## 6. UX / design

- Loading: skeletons on the analytics first paint; `pending` states and
  toasts across pages.
- Empty/error states: `CommonEmptyState` everywhere; one Persian error
  envelope server-side, surfaced inline or via toast.
- Confirmations: single themed dialog for all destructive actions.
- Forms: shared Zod validation, Persian messages, disabled-while-saving.
- Design system: one kit — `wq-panel` surfaces, shared cards/badges/icons,
  semantic tokens, dark mode, reduced motion. No ad-hoc colors or components.
- Gamification stays premium: restrained accents, no cartoon assets.

## 7. Tests performed (this pass, final numbers)

| Gate | Result |
| --- | --- |
| `npm run lint` | clean |
| `npm run typecheck` | 0 errors |
| `npm test` (unit) | **332/332** across 15 files |
| `npm run test:integration:local` | **299/299** across 10 files |
| `npm run build` | success (15.1 MB / 3.94 MB gzip) |

Critical-flow coverage (all via the integration suite, over HTTP against a
real server + database): register · login (valid, expired, brute-forced,
rate-limited codes) · create company · invite employee · join by invitation ·
create team · create task · submit · review (approve/revise) · earn XP · earn
coins · unlock achievement · recognition vote/finalize · leaderboard · reward
redemption (incl. concurrency and refunds) · challenges · notifications.

## 8. Build result

`nuxt build` → `.output/` Node SSR server, built cleanly with strict
TypeScript. Deployment checklist in README §12.

## 9. Known limitations (honest list)

1. **OTP delivery is not wired to a vendor.** The `http` adapter is ready but
   untested against a real gateway; no Kavenegar/SMS.ir driver exists. In
   development codes print to the server log. Production cannot run on
   `console` — the provider refuses.
2. **Out-of-app notification channels are dormant.** Email/SMS/push DSN seams
   exist (`NUXT_NOTIFICATION_*_DSN`); none is configured or vendor-tested.
   In-app notifications are fully functional.
3. **No file/avatar upload storage.** Attachments are external URLs (protocol
   validated); avatars show initials. An S3-compatible store is the missing
   piece.
4. **No general API rate limiting** beyond the OTP paths — the product assumes
   authenticated, semi-trusted internal users.
5. **`accountExists` in the OTP response** reveals whether a phone is
   registered — a deliberate UX trade-off for the register/login fork; noted
   as accepted risk for a B2B tool.
6. **No automated browser tests** (Playwright). RTL/mobile layouts are
   verified by responsive markup review and manual smoke, not automation.
7. **No CI pipeline, structured logging, request IDs or error reporting.**
8. **PGlite is development-only** (~10 connections). Production requires real
   PostgreSQL.
9. **Direct-manager assignment has no UI** — `TeamMember.managerId` exists and
   is enforced, but is set via seed/SQL today.
10. **Level-ladder and achievement-catalogue editors are missing** (admins
    currently define them via seed/SQL; reward catalogue *is* editable).
11. **Company timezone/locale/slug are intentionally not editable** (history
    depends on them); only the display name is.
12. **English locale is a light pass** — keys are 1:1 with `fa.json`, but
    Persian is the product language and the English copy is functional, not
    polished.
13. **Analytics in-memory aggregation** — see §4 scale trade-off.

## 10. Recommended next steps (priority order)

1. SMS vendor driver + one live test against the real gateway (unblocks real
   logins).
2. CI: `npm run verify` + `test:integration` on real PostgreSQL + migration
   dry-run on every PR.
3. Playwright: wizard, login, task flow, redemption — one RTL mobile
   viewport, one desktop.
4. Object storage for avatars/attachments.
5. Structured logging + request IDs + error reporting.
6. General rate limiting (per-session quotas in a Nitro middleware).
7. Direct-manager picker in the member editor; ladder/achievement editors.
8. Windowed SQL aggregates for analytics when tenants exceed ~10k tasks.
