# Task Management — Implementation Report

Persian-first, RTL task management for WorkQuest: lifecycle, permissions, dashboards and UI.

## Lifecycle

Statuses: `TODO`, `IN_PROGRESS`, `SUBMITTED`, `NEEDS_REVISION`, `APPROVED`.

```
TODO → IN_PROGRESS → SUBMITTED → APPROVED
                        ↓
                 NEEDS_REVISION → IN_PROGRESS → SUBMITTED
```

The transition table lives in `shared/utils/task.ts` as pure, dependency-free
logic, so the identical rules run in the browser (to decide which buttons to
show) and on the server (to decide what is actually permitted). The UI never
gets a vote on authorisation — it only avoids offering doomed actions.

Key exports: `checkTransition`, `availableActions`, `nextStatus`, `isOverdue`,
`daysUntilDue`, `isDueToday`, `completionRate`.

## Permissions

Every mutation re-derives the actor's rights server-side from the session:

- **Employees** may start, update progress on, submit, and comment on tasks
  assigned to them. They cannot approve or request revision — including on
  their own submissions, which is asserted explicitly rather than falling out
  of the transition table by accident.
- **Managers** may create, assign, edit, review, request revision and approve
  within their scope: their own teams (as lead) plus their direct reports.
  Owners/admins are company-wide.

`loadVisibleTask` resolves a task through the actor's visibility set, so an
out-of-scope id returns 404 rather than 403 — an id in another team is not
even acknowledged to exist.

## Data model

`Task` gained `status`, `priority`, `dueDate`, `estimatedMinutes`,
`progressPercent`, `assigneeId`, `teamId`, plus `TaskComment`,
`TaskAttachment` and `TaskEvent` (an append-only audit trail of every
transition, written by `recordTaskEvent`).

Indexes are composite and company-leading — `(companyId, assigneeId, status)`,
`(companyId, status, dueDate)`, `(companyId, teamId, status)` — matching the
dashboard's actual access patterns rather than indexing each column alone.

All three new models are registered in `TENANT_MODELS`, so the tenant client
injects and enforces `companyId` on every read and write against them.

## API

| Endpoint | Purpose |
| --- | --- |
| `GET /api/tasks` | list, filtered by scope/status/priority/overdue |
| `POST /api/tasks` | create + assign (managers) |
| `GET /api/tasks/:id` | detail with comments, attachments, timeline |
| `PATCH /api/tasks/:id` | edit fields (managers) |
| `POST /api/tasks/:id/transition` | drive the lifecycle |
| `PATCH /api/tasks/:id/progress` | assignee progress updates |
| `POST /api/tasks/:id/comments` | comment |
| `POST /api/tasks/:id/attachments` | attach |
| `GET /api/tasks/dashboard` | both dashboards in one round trip |

Every endpoint validates its body and query with Zod schemas from
`shared/schemas/index.ts`.

## Dashboards

- **Employee:** today's tasks, active, pending submissions, completed, upcoming
  deadlines.
- **Manager:** active, pending reviews, overdue, per-team completion rate.

Multi-query endpoints use `fanOut(thunks, limit)` instead of a bare
`Promise.all`, which bounds concurrent queries while preserving positional
order so callers still destructure normally.

## UI

`TaskCard`, `TaskFormModal`, `TaskDashboard`, plus `TaskStatusBadge` and
`PriorityBadge`. Layout uses CSS logical properties (`ps-*`/`pe-*`,
`start`/`end`) throughout, so RTL is structural rather than a mirrored
stylesheet. Dates render through the Persian (Jalali) formatter. Creation and
review flows are single-column and thumb-reachable on mobile.

## Notable fixes found during verification

1. **Dashboard 500s.** `prisma dev` allows ~10 connections *in total*; the app
   pool (10) plus the test pool (3) exceeded it, and whichever endpoint fanned
   out widest got "Server has closed the connection". Pool size is now
   configurable via `NUXT_DB_POOL_MAX` (default 10); the integration harness
   uses 5. The initial suspicion — query concurrency — was wrong, and bounding
   the fan-out alone did not fix it.
2. **Empty dropdowns in the create-task form.** `TaskFormModal` expected
   `{ items: [...] }` from `/api/members` and `/api/teams`, but those endpoints
   return `{ members }` and `{ teams }`. Both selects would have rendered
   empty with no error. Now matched to the existing contract.
3. **Seeded deadlines read as overdue.** Due dates were stamped at the seed's
   exact instant, so a task "due today" was already late. They now resolve to
   end-of-day in the company timezone, DST-correct via `Intl`.
4. **Duplicate `TaskSummary` type** exported from `server/utils/tasks.ts`
   shadowed the auto-imported one in `shared/types/api.ts`; replaced with a
   structural assertion that still fails the build if the shapes diverge.

## Verification

| Gate | Result |
| --- | --- |
| `npm run lint` | clean |
| `npm run typecheck` | clean |
| `npm test` | 127 passed (7 files) |
| `npm run test:integration` | 136 passed (3 files) |
| `npm run build` | success — 13.6 MB (3.67 MB gzip) |

Test coverage includes the required cases: create, assign, submit, request
revision, approve, unauthorized update, and overdue calculation.

Dashboards were also verified against live seeded data: the engineering
manager sees 2 pending reviews, 1 overdue task and a 20% team completion rate,
while the product manager correctly sees none of the engineering queue.
