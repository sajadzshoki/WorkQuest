import type {
  AnalyticsOverviewResponse,
  ApiErrorBody,
  CompanyUpdateResponse,
  MemberDetailResponse,
  TaskMutationResponse,
} from '#shared/types/api'

import { randomUUID } from 'node:crypto'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { dayKeyRange, localDayKey } from '#shared/utils/analytics'

import { closeDb, cleanupCompany, query } from './db'
import { ApiClient, assertHarnessReady, requestCode } from './helpers'

/**
 * The company analytics dashboard, end to end.
 *
 * `test/analytics.test.ts` proves the maths (day keys, series building,
 * honest nulls). This file proves the *system*: that the endpoint answers with
 * the numbers the ledgers and task rows actually hold — exact averages,
 * on-time rates, XP and redemption sums — and that the three boundaries hold:
 * an EMPLOYEE cannot read it at all, a MANAGER sees exactly their own
 * subordinates and led teams, and no number ever crosses a tenant line.
 *
 * The fixture is two fresh tenants so every assertion can be exact: seeded
 * companies carry data other suites depend on, and a dashboard that shows
 * "some" numbers is precisely the bug this file exists to catch.
 */

const TIMEZONE = 'Asia/Tehran'

const PHONES = {
  boss: '+989330000001',
  mgr: '+989330000002',
  emp1: '+989330000003',
  emp2: '+989330000004',
  ghost: '+989330000005',
  adminB: '+989340000001',
  empB: '+989340000002',
} as const

const ids: Record<string, string> = {}
const clients: Record<string, ApiClient> = {}

let companyA = ''
let companyB = ''
let slugB = ''

/** Task titles, remembered for the recent-tasks assertion. */
const approvedTitles: string[] = []

function envelope(result: { status: number, body: unknown }): ApiErrorBody {
  return (result.body ?? {}) as ApiErrorBody
}

async function login(key: keyof typeof PHONES): Promise<void> {
  const client = new ApiClient()
  const code = await requestCode(client, PHONES[key])
  const result = await client.request('/api/auth/otp/verify', {
    method: 'POST',
    body: { phone: PHONES[key], code },
  })
  expect(result.status, JSON.stringify(result.body)).toBe(200)
  clients[key] = client
}

async function overviewAs(key: string): Promise<{ status: number, body: AnalyticsOverviewResponse | unknown }> {
  return clients[key]!.request<AnalyticsOverviewResponse>('/api/analytics/overview')
}

/** The overview, asserted 200 and typed. */
async function overviewOf(key: string): Promise<AnalyticsOverviewResponse> {
  const result = await overviewAs(key)
  expect(result.status, JSON.stringify(result.body)).toBe(200)
  return result.body as AnalyticsOverviewResponse
}

beforeAll(() => {
  assertHarnessReady()
})

beforeAll(async () => {
  // ---- tenant A: the analytics fixture --------------------------------
  companyA = randomUUID()
  const slugA = `analytics-a-${Date.now().toString(36)}`
  await query(
    `INSERT INTO "Company" (id, name, slug, locale, timezone, "isActive", "createdAt", "updatedAt")
     VALUES ($1, 'شرکت آزمون تحلیل', $2, 'fa', $3, true, now(), now())`,
    [companyA, slugA, TIMEZONE],
  )

  // The default ladder, so levels resolve the way they do in a real tenant.
  const ladder = [0, 500, 1200, 2100, 3200, 4500]
  for (const [index, minXp] of ladder.entries()) {
    await query(
      `INSERT INTO "Level" (id, "companyId", level, "minXp", title)
       VALUES ($1, $2, $3, $4, $5)`,
      [randomUUID(), companyA, index + 1, minXp, `سطح ${index + 1}`],
    )
  }

  const people: Array<[key: string, name: string, role: string, status: string]> = [
    ['boss', 'مدیرعامل آزمون تحلیل', 'OWNER', 'ACTIVE'],
    ['mgr', 'مدير تیم سرخ', 'MANAGER', 'ACTIVE'],
    ['emp1', 'کارمند فعال آزمون', 'EMPLOYEE', 'ACTIVE'],
    ['emp2', 'کارمند بدون تسک', 'EMPLOYEE', 'ACTIVE'],
    ['ghost', 'کارمند معلق تحلیل', 'EMPLOYEE', 'SUSPENDED'],
  ]
  for (const [key, name, role, status] of people) {
    ids[key] = randomUUID()
    await query(
      `INSERT INTO "User" (id, "companyId", phone, "fullName", role, status, locale, "jobTitle", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5::"UserRole", $6::"UserStatus", 'fa', $7, now(), now())`,
      [ids[key], companyA, PHONES[key as keyof typeof PHONES], name, role, status, key],
    )
    await query(
      `INSERT INTO "UserProgress" (id, "companyId", "userId", xp, coins, "currentStreak", "longestStreak", "updatedAt")
       VALUES ($1, $2, $3, 0, 0, 0, 0, now())`,
      [randomUUID(), companyA, ids[key]],
    )
  }

  // One team, led by the manager, with exactly her two subordinates on it.
  ids.teamRed = randomUUID()
  await query(
    `INSERT INTO "Team" (id, "companyId", name, slug, "leadId", "createdAt", "updatedAt")
     VALUES ($1, $2, 'تیم سرخ', 'red', $3, now(), now())`,
    [ids.teamRed, companyA, ids.mgr],
  )
  const memberships: Array<[user: string, role: string, manager: string | null]> = [
    ['mgr', 'LEAD', ids.boss],
    ['emp1', 'MEMBER', ids.mgr],
    ['emp2', 'MEMBER', ids.mgr],
  ]
  for (const [user, role, manager] of memberships) {
    await query(
      `INSERT INTO "TeamMember" (id, "companyId", "teamId", "userId", "managerId", role, "joinedAt")
       VALUES ($1, $2, $3, $4, $5, $6::"TeamRole", now())`,
      [randomUUID(), companyA, ids.teamRed, ids[user], manager, role],
    )
  }

  // ---- tenant B: the isolation witness --------------------------------
  companyB = randomUUID()
  slugB = `analytics-b-${Date.now().toString(36)}`
  await query(
    `INSERT INTO "Company" (id, name, slug, locale, timezone, "isActive", "createdAt", "updatedAt")
     VALUES ($1, 'شرکت بتای آزمون تحلیل', $2, 'fa', $3, true, now(), now())`,
    [companyB, slugB, TIMEZONE],
  )
  for (const [key, name, role] of [['adminB', 'مدیر شرکت بتا', 'ADMIN'], ['empB', 'کارمند شرکت بتا', 'EMPLOYEE']] as const) {
    ids[key] = randomUUID()
    await query(
      `INSERT INTO "User" (id, "companyId", phone, "fullName", role, status, locale, "jobTitle", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5::"UserRole", 'ACTIVE'::"UserStatus", 'fa', $6, now(), now())`,
      [ids[key], companyB, PHONES[key], name, role, key],
    )
    await query(
      `INSERT INTO "UserProgress" (id, "companyId", "userId", xp, coins, "currentStreak", "longestStreak", "updatedAt")
       VALUES ($1, $2, $3, 0, 0, 0, 0, now())`,
      [randomUUID(), companyB, ids[key]],
    )
  }

  // ---- sessions ---------------------------------------------------------
  await login('boss')
  await login('mgr')
  await login('emp1')
  await login('adminB')

  // ---- the economy of the fixture, through the real endpoints -----------

  // A coin cushion so the redemption below is affordable whatever the payout
  // maths does with the two approvals.
  const adjust = await clients.boss!.request<{ balance: number }>('/api/wallet/adjust', {
    method: 'POST',
    body: { userId: ids.emp1, amount: 200, reason: 'ریال‌سازی آزمون تحلیل سازمان' },
  })
  expect(adjust.status, JSON.stringify(adjust.body)).toBe(200)

  /** The assignee's half of every lifecycle: pick up, then hand in. */
  async function startAndSubmit(taskId: string): Promise<void> {
    for (const action of ['start', 'submit'] as const) {
      const step = await clients.emp1!.request(`/api/tasks/${taskId}/transition`, {
        method: 'POST',
        body: { action },
      })
      expect(step.status, JSON.stringify(step.body)).toBe(200)
    }
  }

  /**
   * Four tasks, one per interesting state. Two approved with known scores and
   * deadlines (one on time, one late), one overdue in TODO, one parked in
   * SUBMITTED — every KPI gets a number it cannot arrive at by accident.
   */
  async function createTask(title: string, dueDate: string): Promise<string> {
    const result = await clients.boss!.request<TaskMutationResponse>('/api/tasks', {
      method: 'POST',
      body: {
        title,
        description: 'تسک ساخت مجموعه آزمون تحلیل سازمان',
        assigneeId: ids.emp1,
        teamId: ids.teamRed,
        priority: 'MEDIUM',
        dueDate,
        xpReward: 100,
        coinReward: 50,
      },
    })
    expect(result.status, JSON.stringify(result.body)).toBe(201)
    return result.body.task.id
  }

  async function driveToApproval(taskId: string, score: number): Promise<void> {
    await startAndSubmit(taskId)
    const approve = await clients.boss!.request(`/api/tasks/${taskId}/transition`, {
      method: 'POST',
      body: { action: 'approve', score, note: 'بررسی آزمون تحلیل' },
    })
    expect(approve.status, JSON.stringify(approve.body)).toBe(200)
  }

  const day = 86_400_000
  approvedTitles.push('تحلیل: تسک به‌موقع')
  await driveToApproval(await createTask(approvedTitles[0]!, new Date(Date.now() + 2 * day).toISOString()), 90)
  approvedTitles.push('تحلیل: تسک دیرکرده')
  await driveToApproval(await createTask(approvedTitles[1]!, new Date(Date.now() - day).toISOString()), 70)
  // Overdue and untouched: past deadline, still TODO.
  await createTask('تحلیل: تسک عقب‌افتاده', new Date(Date.now() - day).toISOString())
  // Submitted and waiting: the pending-review KPI.
  const submittedId = await createTask('تحلیل: تسک در انتظار بررسی', new Date(Date.now() + 2 * day).toISOString())
  await startAndSubmit(submittedId)

  // One redemption, auto-approved so the debit is immediate and exact.
  const reward = await clients.boss!.request<{ reward: { id: string } }>('/api/rewards', {
    method: 'POST',
    body: {
      title: 'قهوهٔ آزمون تحلیل',
      description: 'پاداش ساده برای آزمون تحلیل',
      type: 'MEAL',
      coinCost: 50,
      rules: { autoApprove: true },
    },
  })
  // Reward creation answers 200 with the shelf row — unlike tasks (201).
  expect(reward.status, JSON.stringify(reward.body)).toBe(200)

  const redeem = await clients.emp1!.request(`/api/rewards/${reward.body.reward.id}/redeem`, {
    method: 'POST',
    body: { note: 'خرید آزمون تحلیل' },
  })
  expect(redeem.status, JSON.stringify(redeem.body)).toBe(200)
}, 120_000)

afterAll(async () => {
  if (companyA) await cleanupCompany(companyA)
  if (companyB) await cleanupCompany(companyB)
  await closeDb()
})

describe('analytics: role visibility', () => {
  it('refuses an employee outright', async () => {
    const result = await overviewAs('emp1')
    expect(result.status).toBe(403)
    expect(envelope(result).code).toBe('FORBIDDEN')
  })

  it('narrows a manager to their own subordinates and led teams', async () => {
    const body = await overviewOf('mgr')

    expect(body.scope).toBe('team')
    // Exactly her two reports: not herself, not the suspended user, not the boss.
    expect(new Set(body.employees.map(row => row.id))).toEqual(new Set([ids.emp1, ids.emp2]))
    // The led team and only the led team.
    expect(body.teams.map(team => team.id)).toEqual([ids.teamRed])
    // KPIs over her population: both employees' tasks (emp2 has none).
    expect(body.kpis.totalEmployees).toBe(2)
    expect(body.kpis.activeEmployees).toBe(2)
    expect(body.kpis.tasks).toBe(4)
    expect(body.kpis.completedTasks).toBe(2)
    expect(body.kpis.pendingReviews).toBe(1)
    expect(body.kpis.overdueTasks).toBe(1)
  })

  it('gives an owner the whole company', async () => {
    const body = await overviewOf('boss')

    expect(body.scope).toBe('company')
    expect(body.kpis.totalEmployees).toBe(5)
    expect(body.kpis.activeEmployees).toBe(4)
    expect(body.employees.map(row => row.id)).toEqual(
      expect.arrayContaining([ids.boss, ids.mgr, ids.emp1, ids.emp2, ids.ghost]),
    )
    expect(body.teams.map(team => team.id)).toEqual([ids.teamRed])
  })
})

describe('analytics: accuracy', () => {
  it('computes the task KPIs exactly', async () => {
    const body = await overviewOf('boss')

    // (90 + 70) / 2, one of the two approved tasks beat its deadline.
    expect(body.kpis.completedTasks).toBe(2)
    expect(body.kpis.averageScore).toBe(80)
    expect(body.kpis.onTimeRate).toBe(50)
    expect(body.kpis.tasks).toBe(4)
    expect(body.kpis.pendingReviews).toBe(1)
    expect(body.kpis.overdueTasks).toBe(1)
  })

  it('derives economy KPIs from the ledgers, to the coin', async () => {
    const body = await overviewOf('boss')

    const [xpSum] = await query<{ total: number }>(
      `SELECT COALESCE(SUM(amount), 0)::int AS total FROM "XpTransaction" WHERE "companyId" = $1`,
      [companyA],
    )
    const [coinEarned] = await query<{ total: number }>(
      `SELECT COALESCE(SUM(amount), 0)::int AS total FROM "CoinTransaction"
       WHERE "companyId" = $1 AND amount > 0`,
      [companyA],
    )
    const [coinRedeemed] = await query<{ total: number }>(
      `SELECT COALESCE(SUM(amount), 0)::int AS total FROM "CoinTransaction"
       WHERE "companyId" = $1 AND type = 'REWARD_REDEMPTION'`,
      [companyA],
    )

    expect(body.kpis.totalXp).toBe(xpSum!.total)
    expect(body.kpis.totalCoinsEarned).toBe(coinEarned!.total)
    expect(body.kpis.coinsRedeemed).toBe(50)
    expect(body.kpis.coinsRedeemed).toBe(Math.abs(coinRedeemed!.total))
  })

  it('sums the series to the same numbers, on company-local days', async () => {
    const body = await overviewOf('boss')
    const now = new Date()

    // A fixed 30-day window, zero-filled.
    expect(body.range.days).toBe(30)
    expect(body.series.tasksCompleted).toHaveLength(30)
    expect(body.series.averageScore).toHaveLength(30)
    expect(body.series.xpEarned).toHaveLength(30)
    expect(body.series.coins).toHaveLength(30)
    expect(body.series.tasksCompleted[0]!.day).toBe(dayKeyRange(30, TIMEZONE, now)[0])

    // Everything the fixture did happened today, company-local.
    const today = localDayKey(now, TIMEZONE)
    const tasksToday = body.series.tasksCompleted.find(point => point.day === today)
    const scoreToday = body.series.averageScore.find(point => point.day === today)
    expect(tasksToday?.value).toBe(2)
    expect(scoreToday?.value).toBe(80)

    // The fixture is minutes old, so the windowed sums are the totals.
    expect(body.series.tasksCompleted.reduce((sum, point) => sum + point.value, 0)).toBe(2)
    expect(body.series.xpEarned.reduce((sum, point) => sum + point.value, 0)).toBe(body.kpis.totalXp)
    expect(body.series.coins.reduce((sum, point) => sum + point.redeemed, 0)).toBe(50)
  })

  it('renders per-employee rows the profile page can stand behind', async () => {
    const body = await overviewOf('boss')
    const emp1 = body.employees.find(row => row.id === ids.emp1)
    const emp2 = body.employees.find(row => row.id === ids.emp2)

    expect(emp1).toBeDefined()
    expect(emp1!.tasksCompleted).toBe(2)
    expect(emp1!.averageScore).toBe(80)
    expect(emp1!.onTimeRate).toBe(50)
    expect(emp1!.coinsSpent).toBe(50)
    expect(emp1!.teamName).toBe('تیم سرخ')

    const [progress] = await query<{ xp: number, streak: number }>(
      `SELECT xp, "currentStreak" AS streak FROM "UserProgress" WHERE "userId" = $1`,
      [ids.emp1],
    )
    const [wallet] = await query<{ earned: number }>(
      `SELECT "lifetimeEarned" AS earned FROM "Wallet" WHERE "userId" = $1`,
      [ids.emp1],
    )
    expect(emp1!.xp).toBe(progress!.xp)
    expect(emp1!.currentStreak).toBe(progress!.streak)
    expect(emp1!.coinsEarned).toBe(wallet!.earned)

    // The engine awarded XP, so the ladder position is real, not fabricated.
    const [level] = await query<{ level: number }>(
      `SELECT level FROM "Level" WHERE "companyId" = $1 AND "minXp" <= $2 ORDER BY "minXp" DESC LIMIT 1`,
      [companyA, progress!.xp],
    )
    expect(emp1!.level).toBe(level!.level)

    // An employee with no scored work has no average and no rate — not zeros.
    expect(emp2).toBeDefined()
    expect(emp2!.tasksCompleted).toBe(0)
    expect(emp2!.averageScore).toBeNull()
    expect(emp2!.onTimeRate).toBeNull()
    expect(emp2!.xp).toBe(0)
    expect(emp2!.level).toBe(1)
  })

  it('summarises the led team from its board', async () => {
    const body = await overviewOf('boss')
    const team = body.teams.find(row => row.id === ids.teamRed)

    expect(team).toBeDefined()
    expect(team!.memberCount).toBe(3)
    // 2 of 4 tagged tasks approved; the TODO and SUBMITTED ones stay open.
    expect(team!.completionRate).toBe(50)
    expect(team!.averageScore).toBe(80)
    expect(team!.onTimeRate).toBe(50)
    expect(team!.activeTasks).toBe(2)
    expect(team!.overdueTasks).toBe(1)
  })
})

describe('analytics: the employee performance profile', () => {
  it('extends the member detail with the same numbers', async () => {
    const result = await clients.boss!.request<MemberDetailResponse>(`/api/members/${ids.emp1}`)
    expect(result.status, JSON.stringify(result.body)).toBe(200)

    const profile = result.body.member.performanceProfile
    expect(profile.tasksCompleted).toBe(2)
    expect(profile.averageScore).toBe(80)
    expect(profile.onTimeRate).toBe(50)
    expect(profile.coinsSpent).toBe(50)
    expect(profile.recognition).toBe(0)
    expect(profile.achievements).toBe(0)

    const today = localDayKey(new Date(), TIMEZONE)
    expect(profile.scoreTrend).toHaveLength(30)
    expect(profile.scoreTrend.find(point => point.day === today)?.value).toBe(80)

    // The latest approved work, newest first, with its grade.
    expect(profile.recentTasks.map(task => task.title)).toEqual(
      expect.arrayContaining(approvedTitles),
    )
    expect(profile.recentTasks.every(task => task.score !== null)).toBe(true)
  })

  it('lets the employee read their own profile too', async () => {
    const result = await clients.emp1!.request<MemberDetailResponse>(`/api/members/${ids.emp1}`)
    expect(result.status).toBe(200)
    expect(result.body.member.performanceProfile.tasksCompleted).toBe(2)
  })
})

describe('analytics: tenant isolation', () => {
  it('never leaks tenant A into tenant B\'s dashboard', async () => {
    const body = await overviewOf('adminB')

    expect(body.scope).toBe('company')
    expect(body.kpis.totalEmployees).toBe(2)
    expect(body.kpis.tasks).toBe(0)
    expect(body.kpis.completedTasks).toBe(0)
    expect(body.kpis.averageScore).toBeNull()
    expect(body.kpis.onTimeRate).toBeNull()
    expect(body.kpis.totalXp).toBe(0)
    expect(body.kpis.coinsRedeemed).toBe(0)
    expect(body.teams).toEqual([])

    const names = body.employees.map(row => row.fullName)
    expect(names).toEqual(expect.arrayContaining(['مدیر شرکت بتا', 'کارمند شرکت بتا']))
    for (const name of names) {
      expect(name).not.toContain('آزمون تحلیل')
    }
  })
})

describe('analytics: the editable company profile', () => {
  it('keeps managers away from company settings', async () => {
    const result = await clients.mgr!.request('/api/companies', {
      method: 'PATCH',
      body: { name: 'شرکت جعلی' },
    })
    expect(result.status).toBe(403)
  })

  it('renames the company for admins and echoes the profile', async () => {
    const result = await clients.adminB!.request<CompanyUpdateResponse>('/api/companies', {
      method: 'PATCH',
      body: { name: 'شرکت بتای آزمون تحلیل — نسخهٔ جدید' },
    })
    expect(result.status, JSON.stringify(result.body)).toBe(200)
    expect(result.body.name).toBe('شرکت بتای آزمون تحلیل — نسخهٔ جدید')
    // The address is the one onboarding chose — renaming never touches it.
    expect(result.body.slug).toBe(slugB)

    const [row] = await query<{ name: string }>(
      `SELECT name FROM "Company" WHERE id = $1`,
      [companyB],
    )
    expect(row!.name).toBe('شرکت بتای آزمون تحلیل — نسخهٔ جدید')
  })

  it('rejects a name the schema refuses', async () => {
    const result = await clients.adminB!.request('/api/companies', {
      method: 'PATCH',
      body: { name: 'x' },
    })
    expect(result.status).toBe(422)
  })
})
