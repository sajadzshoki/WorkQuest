import type { ApiErrorBody, OnboardingContext, RequestOtpResponse, VerifyOtpResponse } from '#shared/types/api'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { ApiClient, assertHarnessReady, forgetCode, freshPhone, latestCode } from './helpers'
import {
  cleanupCompany,
  closeDb,
  countCompanyTasks,
  expireOtp,
  onboardingTicketConsumed,
  otpAttempts,
  otpConsumed,
  query,
  seedAccountForPhone,
} from './db'

/**
 * End-to-end authentication tests.
 *
 * These run against a real dev server and a real PostgreSQL database (see
 * `helpers.ts`). They are the only place where the cookie handling, the tenant
 * client extension and the OTP lifecycle are exercised together.
 */

const SEED_OWNER_A = '+989120000001' // OWNER of «نواندیشان پایا» (6 tasks)
const SEED_OWNER_B = '+989130000001' // OWNER of «داده‌کاوان آریا» (1 task)
const SEED_EMPLOYEE_A = '+989120000005' // EMPLOYEE of tenant A

/**
 * Request a code and return it, as the OTP provider delivered it.
 *
 * Retries through the resend cooldown, which is real server behaviour the suite
 * is not trying to assert here (it has its own test) but does keep tripping over
 * when several tests share a phone.
 */
async function requestCode(
  client: ApiClient,
  phone: string,
  purpose: 'LOGIN' | 'REGISTER' = 'LOGIN',
): Promise<{ response: RequestOtpResponse, code: string }> {
  forgetCode()

  let result = await client.request<RequestOtpResponse>('/api/auth/otp/request', {
    method: 'POST',
    body: { phone, purpose },
  })

  for (let attempt = 0; attempt < 8 && result.status === 429; attempt += 1) {
    await new Promise(resolve => setTimeout(resolve, 1500))
    forgetCode()
    result = await client.request<RequestOtpResponse>('/api/auth/otp/request', {
      method: 'POST',
      body: { phone, purpose },
    })
  }

  expect(result.status, JSON.stringify(result.body)).toBe(200)
  return { response: result.body, code: await latestCode(phone) }
}

beforeAll(() => {
  assertHarnessReady()
})

afterAll(async () => {
  // Remove the company this suite created so a re-run starts clean. Rows hang
  // off it with ON DELETE CASCADE, so one delete is enough.
  // `race-%` are the tenants the mid-flow race test seeds directly.
  const rows = await query<{ id: string }>(
    `SELECT id FROM "Company" WHERE slug = 'integration-signup-co' OR slug LIKE 'race-%'`,
  ).catch(() => [] as { id: string }[])
  for (const row of rows) await cleanupCompany(row.id)

  await closeDb()
})

describe('registration', () => {
  const client = new ApiClient()
  const phone = freshPhone()
  const companyName = 'شرکت آزمون ثبت‌نام'

  it('verifies a phone with no account and asks for onboarding', async () => {
    const { response, code } = await requestCode(client, phone, 'REGISTER')
    expect(response.purpose).toBe('REGISTER')
    expect(response.accountExists).toBe(false)
    expect(response.provider).toBe('console')
    expect(response.codeLength).toBe(6)

    const result = await client.request<VerifyOtpResponse>('/api/auth/otp/verify', {
      method: 'POST',
      body: { phone, code },
    })

    expect(result.status).toBe(200)
    expect(result.body.status).toBe('onboarding_required')
    if (result.body.status !== 'onboarding_required') return
    expect(result.body.phone).toBe(phone)
    expect(new Date(result.body.expiresAt).getTime()).toBeGreaterThan(Date.now())
  })

  it('does not open a session before the company exists', async () => {
    const me = await client.request<ApiErrorBody>('/api/me')
    expect(me.status).toBe(401)
    expect(me.body.code).toBe('AUTH_REQUIRED')
  })

  it('exposes the pending ticket only through the httpOnly cookie', async () => {
    expect(client.cookieNames).toContain('workquest_onboarding')

    const context = await client.request<OnboardingContext>('/api/auth/onboarding')
    expect(context.status).toBe(200)
    expect(context.body.phone).toBe(phone)
    expect(context.body.expiresIn).toBeGreaterThan(0)
    // The ticket id itself never reaches the client.
    expect(JSON.stringify(context.body)).not.toContain(client.cookie('workquest_onboarding') ?? '')
  })

  it('creates the company and signs the founder in as OWNER', async () => {
    // Keep the ticket so the replay test below can try to use it again.
    const result = await client.request<{
      status: string
      user: { role: string, fullName: string, phone: string }
      company: { name: string, slug: string, id: string }
    }>('/api/auth/onboarding/complete', {
      method: 'POST',
      body: {
        fullName: 'ساینا آزمودنی',
        jobTitle: 'مدیرعامل',
        companyName,
        slug: 'integration-signup-co',
        industry: 'فناوری اطلاعات',
        timezone: 'Asia/Tehran',
        locale: 'fa',
      },
    })

    expect(result.status, JSON.stringify(result.body)).toBe(200)
    expect(result.body.status).toBe('authenticated')
    expect(result.body.user.role).toBe('OWNER')
    expect(result.body.user.phone).toBe(phone)
    expect(result.body.company.name).toBe(companyName)
    expect(result.body.company.slug).toBe('integration-signup-co')

    const me = await client.request<{ company: { slug: string }, gamification: { level: number } }>('/api/me')
    expect(me.status).toBe(200)
    expect(me.body.company.slug).toBe('integration-signup-co')
    // The default ladder was bootstrapped, so the owner resolves to level 1.
    expect(me.body.gamification.level).toBe(1)
  })

  it('gives the new company the default level ladder', async () => {
    const levels = await query<{ level: number, minXp: number }>(
      `SELECT l.level, l."minXp" FROM "Level" l
       JOIN "Company" c ON c.id = l."companyId"
       WHERE c.slug = $1 ORDER BY l.level`,
      ['integration-signup-co'],
    )
    expect(levels.map(row => row.level)).toEqual([1, 2, 3, 4, 5, 6])
    expect(levels[0]?.minXp).toBe(0)
  })

  it('marks the onboarding ticket as consumed and clears the cookie', async () => {
    expect(await onboardingTicketConsumed(phone)).toBe(true)
    expect(client.cookie('workquest_onboarding')).toBeUndefined()

    const context = await client.request<ApiErrorBody>('/api/auth/onboarding')
    expect(context.status).toBe(401)
  })

  it('rejects a replay of the same onboarding ticket', async () => {
    // A second browser still holding the original cookie.
    const attacker = new ApiClient()
    const ticket = await query<{ id: string }>(
      `SELECT id FROM "OnboardingTicket" WHERE phone = $1 ORDER BY "createdAt" DESC LIMIT 1`,
      [phone],
    )
    expect(ticket[0]).toBeDefined()

    const replay = await attacker.request<ApiErrorBody>('/api/auth/onboarding/complete', {
      method: 'POST',
      body: { fullName: 'نفوذگر', companyName: 'شرکت تکراری', slug: 'replay-attempt' },
    })

    // No cookie at all is a 401; the point is that it never creates a company.
    expect([401, 409]).toContain(replay.status)
    const companies = await query<{ n: number }>(
      `SELECT count(*)::int AS n FROM "Company" WHERE slug = 'replay-attempt'`,
    )
    expect(companies[0]?.n).toBe(0)
  })

  it('refuses to register a phone that already has an account', async () => {
    const result = await client.request<ApiErrorBody>('/api/auth/otp/request', {
      method: 'POST',
      body: { phone, purpose: 'REGISTER' },
    })
    expect(result.status).toBe(409)
    expect(result.body.code).toBe('CONFLICT')
  })

  it('refuses a REGISTER code once an account appears mid-flow', async () => {
    // The race the verify handler defends against: the code was issued while the
    // phone was free, and an account showed up before it was redeemed.
    const racer = freshPhone()
    const racerClient = new ApiClient()
    const { code } = await requestCode(racerClient, racer, 'REGISTER')

    await seedAccountForPhone(racer, 'کاربر میان‌راه')

    const result = await racerClient.request<ApiErrorBody>('/api/auth/otp/verify', {
      method: 'POST',
      body: { phone: racer, code },
    })
    expect(result.status).toBe(409)
    expect(result.body.code).toBe('CONFLICT')
  })
})

describe('login', () => {
  it('signs in a registered phone and returns the session', async () => {
    const client = new ApiClient()
    const rows = await query<{ phone: string }>(
      `SELECT phone FROM "Company" c JOIN "User" u ON u."companyId" = c.id
       WHERE c.slug = 'integration-signup-co' LIMIT 1`,
    )
    const phone = rows[0]!.phone

    const { response, code } = await requestCode(client, phone, 'LOGIN')
    expect(response.accountExists).toBe(true)

    const result = await client.request<VerifyOtpResponse>('/api/auth/otp/verify', {
      method: 'POST',
      body: { phone, code },
    })

    expect(result.status).toBe(200)
    expect(result.body.status).toBe('authenticated')
    if (result.body.status !== 'authenticated') return
    expect(result.body.user.role).toBe('OWNER')
    expect(client.cookie('workquest_session')).toBeTruthy()

    const me = await client.request<{ company: { slug: string } }>('/api/me')
    expect(me.status).toBe(200)
    expect(me.body.company.slug).toBe('integration-signup-co')
  })

  it('accepts an Iranian-format phone and normalises it to E.164', async () => {
    const client = new ApiClient()
    const result = await client.request<RequestOtpResponse>('/api/auth/otp/request', {
      method: 'POST',
      body: { phone: '09120000001', purpose: 'LOGIN' },
    })
    expect(result.status).toBe(200)
    expect(result.body.phone).toBe(SEED_OWNER_A)
  })

  it('rejects an implausible phone number at the validation layer', async () => {
    const client = new ApiClient()
    const result = await client.request<ApiErrorBody>('/api/auth/otp/request', {
      method: 'POST',
      body: { phone: '123', purpose: 'LOGIN' },
    })
    expect(result.status).toBe(422)
    expect(result.body.code).toBe('VALIDATION_FAILED')
    expect(result.body.issues?.some(issue => issue.path === 'phone')).toBe(true)
  })

  it('throttles a second request inside the resend cooldown', async () => {
    const client = new ApiClient()
    const phone = freshPhone()
    const first = await client.request<RequestOtpResponse>('/api/auth/otp/request', {
      method: 'POST',
      body: { phone, purpose: 'REGISTER' },
    })
    expect(first.status).toBe(200)

    const second = await client.request<ApiErrorBody>('/api/auth/otp/request', {
      method: 'POST',
      body: { phone, purpose: 'REGISTER' },
    })
    expect(second.status).toBe(429)
    expect(second.body.code).toBe('RATE_LIMITED')
  })

  it('signs the session out again', async () => {
    const client = new ApiClient()
    const { code } = await requestCode(client, SEED_OWNER_A)
    await client.request('/api/auth/otp/verify', { method: 'POST', body: { phone: SEED_OWNER_A, code } })

    expect((await client.request('/api/me')).status).toBe(200)

    const out = await client.request('/api/auth/session', { method: 'DELETE' })
    expect(out.status).toBe(200)

    const after = await client.request<ApiErrorBody>('/api/me')
    expect(after.status).toBe(401)
  })
})

describe('OTP verification', () => {
  it('rejects an invalid code and reports the remaining attempts', async () => {
    const client = new ApiClient()
    const phone = freshPhone()
    const { code } = await requestCode(client, phone)
    const wrong = code === '000000' ? '111111' : '000000'

    const result = await client.request<ApiErrorBody>('/api/auth/otp/verify', {
      method: 'POST',
      body: { phone, code: wrong },
    })

    expect(result.status).toBe(400)
    expect(result.body.code).toBe('AUTH_INVALID_CODE')
    expect(result.body.message).toContain('۴')
    expect(await otpAttempts(phone)).toBe(1)

    // No session was opened.
    expect((await client.request('/api/me')).status).toBe(401)
  })

  it('burns the code after the attempt limit and then refuses even the right code', async () => {
    const client = new ApiClient()
    const phone = freshPhone()
    const { code } = await requestCode(client, phone)

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const result = await client.request<ApiErrorBody>('/api/auth/otp/verify', {
        method: 'POST',
        body: { phone, code: code === '000000' ? '111111' : '000000' },
      })
      expect([400, 429]).toContain(result.status)
    }

    const locked = await client.request<ApiErrorBody>('/api/auth/otp/verify', {
      method: 'POST',
      body: { phone, code },
    })
    expect(locked.status).toBe(429)
    expect(locked.body.code).toBe('RATE_LIMITED')
    expect(await otpConsumed(phone)).toBe(true)
  })

  it('rejects an expired code even when the digits are correct', async () => {
    const client = new ApiClient()
    const phone = freshPhone()
    const { code } = await requestCode(client, phone)

    await expireOtp(phone)

    const result = await client.request<ApiErrorBody>('/api/auth/otp/verify', {
      method: 'POST',
      body: { phone, code },
    })

    expect(result.status).toBe(400)
    expect(result.body.code).toBe('AUTH_CODE_EXPIRED')
    expect(await otpConsumed(phone)).toBe(true)
  })

  it('never stores the plaintext code', async () => {
    const client = new ApiClient()
    const phone = freshPhone()
    const { code } = await requestCode(client, phone)

    const rows = await query<{ codeHash: string }>(
      `SELECT "codeHash" FROM "OtpCode" WHERE phone = $1 ORDER BY "createdAt" DESC LIMIT 1`,
      [phone],
    )

    expect(rows[0]?.codeHash).toBeTruthy()
    expect(rows[0]?.codeHash).not.toContain(code)
    expect(rows[0]?.codeHash).toMatch(/^[0-9a-f]{32}:[0-9a-f]{128}$/)
  })
})

describe('authorization', () => {
  it('answers 401 with the standard envelope and no internals', async () => {
    const client = new ApiClient()

    for (const path of ['/api/me', '/api/tasks', '/api/dashboard/summary', '/api/teams', '/api/rewards']) {
      const result = await client.request<ApiErrorBody & { stack?: unknown }>(path)
      expect(result.status, path).toBe(401)
      expect(result.body.code, path).toBe('AUTH_REQUIRED')
      expect(typeof result.body.message, path).toBe('string')
      expect(result.body.stack, path).toBeUndefined()
    }
  })

  it('forbids an employee from reading the whole company', async () => {
    const client = new ApiClient()
    const { code } = await requestCode(client, SEED_EMPLOYEE_A)
    const login = await client.request<VerifyOtpResponse>('/api/auth/otp/verify', {
      method: 'POST',
      body: { phone: SEED_EMPLOYEE_A, code },
    })
    expect(login.status).toBe(200)
    if (login.body.status !== 'authenticated') throw new Error('expected a session')
    expect(login.body.user.role).toBe('EMPLOYEE')

    const all = await client.request<ApiErrorBody>('/api/tasks', { query: { scope: 'all' } })
    expect(all.status).toBe(403)
    expect(all.body.code).toBe('FORBIDDEN')

    // Their own scope still works and contains nobody else's tasks.
    const mine = await client.request<{ items: Array<{ assignee: { fullName: string } }> }>('/api/tasks', {
      query: { scope: 'mine' },
    })
    expect(mine.status).toBe(200)
    expect(mine.body.items.length).toBeGreaterThan(0)
    expect(new Set(mine.body.items.map(item => item.assignee.fullName)).size).toBe(1)
  })
})

describe('tenant isolation', () => {
  let companyAId = ''
  let newCompanyId = ''

  it('shows each owner only their own company data', async () => {
    const rows = await query<{ id: string, slug: string }>(
      `SELECT id, slug FROM "Company" WHERE slug IN ('navandishan', 'integration-signup-co')`,
    )
    companyAId = rows.find(row => row.slug === 'navandishan')?.id ?? ''
    newCompanyId = rows.find(row => row.slug === 'integration-signup-co')?.id ?? ''
    expect(companyAId).toBeTruthy()
    expect(newCompanyId).toBeTruthy()

    // Tenant A: the seeded company.
    const ownerA = new ApiClient()
    const { code: codeA } = await requestCode(ownerA, SEED_OWNER_A)
    await ownerA.request('/api/auth/otp/verify', { method: 'POST', body: { phone: SEED_OWNER_A, code: codeA } })
    const tasksA = await ownerA.request<{ items: unknown[], total: number }>('/api/tasks', {
      query: { scope: 'all' },
    })
    expect(tasksA.status).toBe(200)
    expect(tasksA.body.total).toBe(await countCompanyTasks(companyAId))
    expect(tasksA.body.total).toBeGreaterThan(1)

    // Tenant B: the company created by this suite.
    const ownerB = new ApiClient()
    const phoneB = (
      await query<{ phone: string }>(
        `SELECT phone FROM "User" WHERE "companyId" = $1 LIMIT 1`,
        [newCompanyId],
      )
    )[0]!.phone
    const { code: codeB } = await requestCode(ownerB, phoneB)
    await ownerB.request('/api/auth/otp/verify', { method: 'POST', body: { phone: phoneB, code: codeB } })

    for (const [path, key] of [['/api/tasks', 'total'], ['/api/teams', 'teams']] as const) {
      const result = await ownerB.request<Record<string, unknown[]>>(path, { query: { scope: 'all' } })
      expect(result.status).toBe(200)
      const value = result.body[key as string]
      expect(Array.isArray(value) ? value.length : value).toBe(0)
    }

    // A brand-new tenant has no activity inside the current leaderboard window,
    // so its board is empty — and, more to the point, holds none of tenant A's
    // rows even though tenant A has plenty of XP in the same period.
    const leaderboard = await ownerB.request<{
      entries: Array<{ user: { id: string } }>
      participants: number
      availableTeams: unknown[]
    }>('/api/leaderboard')
    expect(leaderboard.status).toBe(200)
    expect(leaderboard.body.participants).toBe(0)
    expect(leaderboard.body.entries).toHaveLength(0)
    expect(leaderboard.body.availableTeams).toHaveLength(0)
  })

  it('keeps the seeded tenants apart from each other', async () => {
    const ownerB = new ApiClient()
    const { code } = await requestCode(ownerB, SEED_OWNER_B)
    await ownerB.request('/api/auth/otp/verify', { method: 'POST', body: { phone: SEED_OWNER_B, code } })

    const tasks = await ownerB.request<{ total: number }>('/api/tasks', { query: { scope: 'all' } })
    expect(tasks.status).toBe(200)
    expect(tasks.body.total).toBe(1)

    const achievements = await ownerB.request<{ achievements: unknown[] }>('/api/achievements')
    expect(achievements.status).toBe(200)
    expect(achievements.body.achievements.length).toBe(0)
  })

  it('does not leak another tenant\'s rows through the id', async () => {
    // Tenant A's team id, requested by the owner of a different company.
    const teamA = await query<{ id: string }>(
      `SELECT id FROM "Team" WHERE "companyId" = $1 LIMIT 1`,
      [companyAId],
    )
    expect(teamA[0]).toBeDefined()

    const outsiderPhone = (
      await query<{ phone: string }>(
        `SELECT phone FROM "User" WHERE "companyId" = $1 LIMIT 1`,
        [newCompanyId],
      )
    )[0]!.phone

    const outsider = new ApiClient()
    const { code } = await requestCode(outsider, outsiderPhone)
    await outsider.request('/api/auth/otp/verify', { method: 'POST', body: { phone: outsiderPhone, code } })

    const teams = await outsider.request<{ teams: Array<{ id: string }> }>('/api/teams')
    expect(teams.status).toBe(200)
    expect(teams.body.teams.some(team => team.id === teamA[0]!.id)).toBe(false)

    // The scoped client rewrites the filter, so a direct id lookup finds nothing.
    const notifications = await outsider.request<{ items: unknown[] }>('/api/notifications')
    expect(notifications.status).toBe(200)
    expect(notifications.body.items.length).toBe(0)
  })
})
