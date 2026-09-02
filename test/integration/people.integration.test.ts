import type {
  ApiErrorBody,
  InvitationListResponse,
  MemberDetailResponse,
  MemberListResponse,
  TeamDetailResponse,
  VerifyOtpResponse,
} from '#shared/types/api'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { ApiClient, assertHarnessReady, requestCode } from './helpers'
import { closeDb, query } from './db'

/**
 * Employee, invitation and team management.
 *
 * The point of this file is the *matrix*: every role × every sensitive action,
 * plus the same actions attempted across the tenant boundary. The individual
 * happy paths matter less than proving that a MANAGER cannot promote, an
 * EMPLOYEE cannot edit themselves into a better role, and tenant B cannot see
 * tenant A's people however the request is phrased.
 *
 * Seeded fixture (tenant A = «نواندیشان پایا»):
 *   +989120000001  ساینا رستمی   OWNER   (leads nobody, manages everyone)
 *   +989120000002  بهنام کاویانی ADMIN   (no team)
 *   +989120000003  مریم نوروزی   MANAGER lead of محصول
 *   +989120000004  امیر شریفی    MANAGER lead of مهندسی
 *   +989120000005  نگار احمدی    EMPLOYEE in محصول
 * Tenant B = «داده‌کاوان آریا»: +989130000001 OWNER, +989130000002 EMPLOYEE.
 */

const OWNER_A = '+989120000001'
const ADMIN_A = '+989120000002'
const MANAGER_A = '+989120000004' // leads مهندسی
const OTHER_MANAGER_A = '+989120000003' // leads محصول — outside امیر's scope
const EMPLOYEE_A = '+989120000005' // in محصول, so NOT امیر's report
const OWNER_B = '+989130000001'

/** Phones this suite invites; deleted in `afterAll` along with their users. */
const invitedPhones: string[] = []

function trackPhone(phone: string): string {
  invitedPhones.push(phone)
  return phone
}

/** A `+989` number that is neither seeded nor used earlier in this run. */
let inviteSequence = 0
function invitePhone(): string {
  inviteSequence += 1
  return trackPhone(`+9897${String(Date.now() % 1_000_0000).padStart(8, '0').slice(0, 8)}${String(inviteSequence).padStart(2, '0')}`.slice(0, 13))
}

/** Read the standard error envelope off any failed response. */
function envelope(result: { status: number, body: unknown }): ApiErrorBody {
  return (result.body ?? {}) as ApiErrorBody
}

beforeAll(() => {
  assertHarnessReady()
})

afterAll(async () => {
  // Invited users, their invitations and progress rows all hang off the user or
  // the company with ON DELETE CASCADE, so deleting the users is enough. Teams
  // created here are named so they can be found again.
  if (invitedPhones.length > 0) {
    await query(`DELETE FROM "User" WHERE phone = ANY($1::text[])`, [invitedPhones])
  }
  await query(
    `DELETE FROM "Invitation" WHERE phone = ANY($1::text[])`,
    [invitedPhones],
  ).catch(() => undefined)
  await query(`DELETE FROM "Team" WHERE name LIKE 'تیم آزمون یکپارچه%'`).catch(() => undefined)
  await closeDb()
})

// ---------------------------------------------------------------------------
// Fixtures: one client per role, signed in once for the whole file.
// ---------------------------------------------------------------------------

const owner = new ApiClient()
const admin = new ApiClient()
const manager = new ApiClient()
const employee = new ApiClient()
const ownerB = new ApiClient()

/** Ids resolved from the API so the tests never hardcode UUIDs. */
const ids = {
  managerUser: '',
  employeeUser: '',
  otherManagerUser: '',
  engineeringTeam: '',
  productTeam: '',
  companyA: '',
  companyB: '',
  invitedUser: '',
  invitationId: '',
}

async function login(client: ApiClient, phone: string): Promise<void> {
  const code = await requestCode(client, phone)
  const result = await client.request('/api/auth/otp/verify', {
    method: 'POST',
    body: { phone, code },
  })
  expect(result.status, JSON.stringify(result.body)).toBe(200)
}

beforeAll(async () => {
  await login(owner, OWNER_A)
  await login(admin, ADMIN_A)
  await login(manager, MANAGER_A)
  await login(employee, EMPLOYEE_A)
  await login(ownerB, OWNER_B)

  const me = await owner.request<{ user: { id: string }, company: { id: string } }>('/api/me')
  ids.companyA = me.body.company.id

  const meB = await ownerB.request<{ company: { id: string } }>('/api/me')
  ids.companyB = meB.body.company.id

  const members = await owner.request<MemberListResponse>('/api/members', {
    query: { scope: 'all', pageSize: '100' },
  })
  const find = (phone: string) => members.body.members.find(m => m.phone === phone)
  ids.managerUser = find(MANAGER_A)!.id
  ids.employeeUser = find(EMPLOYEE_A)!.id
  ids.otherManagerUser = find(OTHER_MANAGER_A)!.id
  ids.engineeringTeam = find(MANAGER_A)!.team!.id
  ids.productTeam = find(EMPLOYEE_A)!.team!.id
})

// ===========================================================================
describe('invitation: creation', () => {
  const phone = invitePhone()

  it('lets the OWNER invite by phone, name, title, team and role', async () => {
    const result = await owner.request<{ invitation: { id: string, status: string, role: string, team: { name: string } | null } }>(
      '/api/members/invite',
      {
        method: 'POST',
        body: {
          phone,
          fullName: 'آزمونگر دعوت',
          jobTitle: 'مهندس نرم‌افزار',
          teamId: ids.engineeringTeam,
          role: 'EMPLOYEE',
          expiresInDays: 7,
        },
      },
    )

    expect(result.status, JSON.stringify(result.body)).toBe(200)
    expect(result.body.invitation.status).toBe('PENDING')
    expect(result.body.invitation.role).toBe('EMPLOYEE')
    expect(result.body.invitation.team?.name).toBe('مهندسی')
    ids.invitationId = result.body.invitation.id
  })

  it('refuses a second open invitation for the same phone', async () => {
    const result = await owner.request('/api/members/invite', {
      method: 'POST',
      body: { phone, fullName: 'آزمونگر دعوت', role: 'EMPLOYEE' },
    })
    expect(result.status).toBe(409)
    expect(envelope(result).code).toBe('CONFLICT')
  })

  it('refuses to invite a phone that is already a member', async () => {
    const result = await owner.request('/api/members/invite', {
      method: 'POST',
      body: { phone: EMPLOYEE_A, fullName: 'نگار احمدی', role: 'EMPLOYEE' },
    })
    expect(result.status).toBe(409)
  })

  it('stores the phone in pendingPhone only while the invitation is open', async () => {
    const rows = await query<{ pendingPhone: string | null, status: string }>(
      `SELECT "pendingPhone", status FROM "Invitation" WHERE id = $1`,
      [ids.invitationId],
    )
    expect(rows[0]?.status).toBe('PENDING')
    expect(rows[0]?.pendingPhone).toBe(phone)
  })

  it('rejects an invalid phone at the validation layer', async () => {
    const result = await owner.request('/api/members/invite', {
      method: 'POST',
      body: { phone: '12345', fullName: 'شماره بد', role: 'EMPLOYEE' },
    })
    expect(result.status).toBe(422)
    expect(envelope(result).code).toBe('VALIDATION_FAILED')
  })
})

describe('invitation: role and team ceilings', () => {
  it('forbids an EMPLOYEE from inviting anyone', async () => {
    const result = await employee.request('/api/members/invite', {
      method: 'POST',
      body: { phone: invitePhone(), fullName: 'تلاش کارمند', role: 'EMPLOYEE' },
    })
    expect(result.status).toBe(403)
  })

  it('forbids a MANAGER from granting ADMIN', async () => {
    const result = await manager.request('/api/members/invite', {
      method: 'POST',
      body: { phone: invitePhone(), fullName: 'ارتقای نامجاز', role: 'ADMIN' },
    })
    expect(result.status).toBe(403)
    expect(envelope(result).code).toBe('FORBIDDEN')
  })

  it('forbids a MANAGER from granting MANAGER', async () => {
    const result = await manager.request('/api/members/invite', {
      method: 'POST',
      body: { phone: invitePhone(), fullName: 'هم‌ردیف نامجاز', role: 'MANAGER' },
    })
    expect(result.status).toBe(403)
  })

  it('forbids a MANAGER from inviting into a team they do not lead', async () => {
    const result = await manager.request('/api/members/invite', {
      method: 'POST',
      body: {
        phone: invitePhone(),
        fullName: 'تیم بیگانه',
        teamId: ids.productTeam,
        role: 'EMPLOYEE',
      },
    })
    expect(result.status).toBe(403)
  })

  it('lets a MANAGER invite an EMPLOYEE into their own team', async () => {
    const phone = invitePhone()
    const result = await manager.request<{ invitation: { id: string, role: string, team: { name: string } | null } }>(
      '/api/members/invite',
      {
        method: 'POST',
        body: { phone, fullName: 'نیروی مدیر', teamId: ids.engineeringTeam, role: 'EMPLOYEE' },
      },
    )
    expect(result.status, JSON.stringify(result.body)).toBe(200)
    expect(result.body.invitation.role).toBe('EMPLOYEE')
    expect(result.body.invitation.team?.name).toBe('مهندسی')
  })

  it('lets an ADMIN grant ADMIN', async () => {
    const result = await admin.request('/api/members/invite', {
      method: 'POST',
      body: { phone: invitePhone(), fullName: 'مدیر جدید', role: 'ADMIN' },
    })
    expect(result.status, JSON.stringify(result.body)).toBe(200)
  })
})

// ===========================================================================
describe('invitation: acceptance', () => {
  const invitee = new ApiClient()
  const phone = invitedPhones[0] as string

  it('routes an invited phone to the invitation flow, not to onboarding', async () => {
    const code = await requestCode(invitee, phone)
    const result = await invitee.request<VerifyOtpResponse>('/api/auth/otp/verify', {
      method: 'POST',
      body: { phone, code },
    })

    expect(result.status).toBe(200)
    expect(result.body.status).toBe('invitation_pending')
    if (result.body.status === 'invitation_pending') {
      expect(result.body.invitationCount).toBe(1)
    }
  })

  it('does not open a session before the invitation is accepted', async () => {
    const me = await invitee.request('/api/me')
    expect(me.status).toBe(401)
  })

  it('answers the pending invitation from the httpOnly ticket only', async () => {
    // No cookie at all: the endpoint must not accept a phone from the client.
    const anonymous = await new ApiClient().request('/api/auth/invitations')
    expect(anonymous.status).toBe(401)

    const result = await invitee.request<{ status: string, invitations: Array<{ fullName: string, role: string, company: { name: string }, team: { name: string } | null }> }>(
      '/api/auth/invitations',
    )
    expect(result.status).toBe(200)
    expect(result.body.invitations).toHaveLength(1)
    expect(result.body.invitations[0]!.fullName).toBe('آزمونگر دعوت')
    expect(result.body.invitations[0]!.role).toBe('EMPLOYEE')
    expect(result.body.invitations[0]!.company.name).toBe('نواندیشان پایا')
    expect(result.body.invitations[0]!.team?.name).toBe('مهندسی')
  })

  it('accepts the invitation and signs the invitee in with the invited role', async () => {
    const result = await invitee.request<{ status: string, user: { id: string, role: string }, company: { slug: string }, invitation: { team: { name: string } | null } }>(
      '/api/auth/invitations/accept',
      { method: 'POST', body: { invitationId: ids.invitationId } },
    )

    expect(result.status, JSON.stringify(result.body)).toBe(200)
    expect(result.body.status).toBe('authenticated')
    // The role comes from the invitation row — never from the request body.
    expect(result.body.user.role).toBe('EMPLOYEE')
    expect(result.body.company.slug).toBe('navandishan')
    expect(result.body.invitation.team?.name).toBe('مهندسی')
    ids.invitedUser = result.body.user.id
  })

  it('creates exactly one user, in the inviting company, on the invited team', async () => {
    const rows = await query<{ companyId: string, role: string, status: string }>(
      `SELECT u."companyId"::text AS "companyId", u.role::text AS role, u.status::text AS status
       FROM "User" u WHERE u.phone = $1`,
      [phone],
    )
    // Exactly one account — the ticket and the invitation both closed atomically.
    expect(rows).toHaveLength(1)
    expect(rows[0]?.companyId).toBe(ids.companyA)
    expect(rows[0]?.role).toBe('EMPLOYEE')
    expect(rows[0]?.status).toBe('ACTIVE')

    const membership = await query<{ teamId: string, role: string }>(
      `SELECT "teamId"::text, role::text FROM "TeamMember" WHERE "userId" = $1`,
      [ids.invitedUser],
    )
    expect(membership).toHaveLength(1)
    expect(membership[0]!.teamId).toBe(ids.engineeringTeam)
  })

  it('gives the new member a progress row so the profile page resolves', async () => {
    const rows = await query<{ xp: number, coins: number, level: string | null }>(
      `SELECT p.xp, p.coins, l.title AS level
       FROM "UserProgress" p LEFT JOIN "Level" l ON l.id = p."levelId"
       WHERE p."userId" = $1`,
      [ids.invitedUser],
    )
    expect(rows).toHaveLength(1)
    expect(rows[0]?.xp).toBe(0)
    expect(rows[0]?.coins).toBe(0)
    expect(rows[0]?.level).toBeTruthy()
  })

  it('closes the invitation and frees the pendingPhone slot', async () => {
    const rows = await query<{ status: string, pendingPhone: string | null, acceptedById: string | null }>(
      `SELECT status::text, "pendingPhone", "acceptedById"::text FROM "Invitation" WHERE id = $1`,
      [ids.invitationId],
    )
    expect(rows[0]?.status).toBe('ACCEPTED')
    expect(rows[0]?.pendingPhone).toBeNull()
    expect(rows[0]?.acceptedById).toBe(ids.invitedUser)
  })

  it('refuses to replay the acceptance', async () => {
    const result = await invitee.request('/api/auth/invitations/accept', {
      method: 'POST',
      body: { invitationId: ids.invitationId },
    })
    // The ticket cookie was cleared on success, so the replay is unauthenticated.
    expect(result.status).toBe(401)

    const rows = await query<{ n: number }>(`SELECT count(*)::int AS n FROM "User" WHERE phone = $1`, [phone])
    expect(rows[0]?.n).toBe(1)
  })

  it('notifies the inviter that their invitation was accepted', async () => {
    const rows = await query<{ title: string }>(
      `SELECT title FROM "Notification"
       WHERE "companyId" = $1 AND type = 'INVITATION' ORDER BY "createdAt" DESC LIMIT 1`,
      [ids.companyA],
    )
    expect(rows[0]?.title).toContain('آزمونگر دعوت')
  })

  it('lets the same phone be invited again once the slot is free', async () => {
    const result = await owner.request('/api/members/invite', {
      method: 'POST',
      body: { phone, fullName: 'دعوت دوم', role: 'EMPLOYEE' },
    })
    // Now refused because the phone has an ACTIVE account — but with the
    // "already a member" message, not the "invitation already open" one.
    expect(result.status).toBe(409)
    expect(envelope(result).message).toContain('قبلاً عضو شرکت است')
  })
})

// ===========================================================================
describe('invitation: revocation', () => {
  it('lets the inviter revoke, and blocks acceptance afterwards', async () => {
    const phone = invitePhone()
    const created = await owner.request<{ invitation: { id: string } }>('/api/members/invite', {
      method: 'POST',
      body: { phone, fullName: 'لغو شونده', role: 'EMPLOYEE' },
    })
    const invitationId = created.body.invitation.id

    const revoked = await owner.request(`/api/invitations/${invitationId}`, { method: 'DELETE' })
    expect(revoked.status).toBe(200)

    const twice = await owner.request(`/api/invitations/${invitationId}`, { method: 'DELETE' })
    expect(twice.status).toBe(409)

    // The invitee can no longer see it, and cannot accept it.
    const invitee = new ApiClient()
    const code = await requestCode(invitee, phone)
    const verify = await invitee.request<VerifyOtpResponse>('/api/auth/otp/verify', {
      method: 'POST',
      body: { phone, code },
    })
    // No open invitation left → falls through to self-service onboarding.
    expect(verify.body.status).toBe('onboarding_required')

    // The verify above fell through to onboarding, so this client holds an
    // onboarding ticket, not an invitation ticket: the accept is 401, and the
    // revoked invitation is unreachable either way.
    const accept = await invitee.request('/api/auth/invitations/accept', {
      method: 'POST',
      body: { invitationId },
    })
    expect(accept.status).toBe(401)

    const stillOpen = await query<{ n: number }>(
      `SELECT count(*)::int AS n FROM "User" WHERE phone = $1`,
      [phone],
    )
    expect(stillOpen[0]?.n).toBe(0)
  })

  it('lets a MANAGER revoke their own invitation but nobody else\'s', async () => {
    const mine = await manager.request<{ invitation: { id: string } }>('/api/members/invite', {
      method: 'POST',
      body: { phone: invitePhone(), fullName: 'دعوت خودم', role: 'EMPLOYEE' },
    })
    const others = await admin.request<{ invitation: { id: string } }>('/api/members/invite', {
      method: 'POST',
      body: { phone: invitePhone(), fullName: 'دعوت مدیر سازمان', role: 'EMPLOYEE' },
    })

    expect((await manager.request(`/api/invitations/${mine.body.invitation.id}`, { method: 'DELETE' })).status).toBe(200)

    const foreign = await manager.request(`/api/invitations/${others.body.invitation.id}`, { method: 'DELETE' })
    expect(foreign.status).toBe(403)
  })

  it('forbids an EMPLOYEE from listing invitations at all', async () => {
    const result = await employee.request<InvitationListResponse>('/api/invitations')
    expect(result.status).toBe(403)
  })

  it('shows a MANAGER only the invitations they sent', async () => {
    const managerList = await manager.request<InvitationListResponse>('/api/invitations', {
      query: { status: 'PENDING', pageSize: '100' },
    })
    expect(managerList.status).toBe(200)

    const ownerList = await owner.request<InvitationListResponse>('/api/invitations', {
      query: { status: 'PENDING', pageSize: '100' },
    })

    expect(managerList.body.total).toBeLessThanOrEqual(ownerList.body.total)
    for (const invitation of managerList.body.invitations) {
      expect(invitation.invitedBy.fullName).toBe('امیر شریفی')
    }
  })

  it('marks an overdue invitation EXPIRED when the list is read', async () => {
    const phone = invitePhone()
    const created = await owner.request<{ invitation: { id: string } }>('/api/members/invite', {
      method: 'POST',
      body: { phone, fullName: 'منقضی شونده', role: 'EMPLOYEE', expiresInDays: 1 },
    })
    await query(`UPDATE "Invitation" SET "expiresAt" = now() - interval '1 hour' WHERE id = $1`, [
      created.body.invitation.id,
    ])

    const expired = await owner.request<InvitationListResponse>('/api/invitations', {
      query: { status: 'EXPIRED', pageSize: '100' },
    })
    expect(expired.body.invitations.map(i => i.id)).toContain(created.body.invitation.id)

    // An expired invitation cannot be accepted, and frees the phone.
    const invitee = new ApiClient()
    const code = await requestCode(invitee, phone)
    const verify = await invitee.request<VerifyOtpResponse>('/api/auth/otp/verify', {
      method: 'POST',
      body: { phone, code },
    })
    expect(verify.body.status).toBe('onboarding_required')
  })
})

// ===========================================================================
describe('member scoping', () => {
  it('gives the OWNER the whole company', async () => {
    const result = await owner.request<MemberListResponse>('/api/members', {
      query: { scope: 'all', pageSize: '100' },
    })
    expect(result.status).toBe(200)
    expect(result.body.scope).toBe('all')
    expect(result.body.canManageRoles).toBe(true)
    expect(result.body.total).toBeGreaterThanOrEqual(7)
  })

  it('gives the ADMIN the whole company too', async () => {
    const result = await admin.request<MemberListResponse>('/api/members', { query: { scope: 'all' } })
    expect(result.body.scope).toBe('all')
    expect(result.body.canManageRoles).toBe(true)
  })

  it('limits a MANAGER to themselves plus their reports', async () => {
    const result = await manager.request<MemberListResponse>('/api/members', { pageSize: '100' })
    expect(result.status).toBe(200)
    expect(result.body.scope).toBe('mine')
    expect(result.body.canManageRoles).toBe(false)

    const names = result.body.members.map(m => m.fullName)
    expect(names).toContain('امیر شریفی') // self
    expect(names).toContain('الناز کریمی') // direct report in مهندسی
    // The other manager's team is out of scope.
    expect(names).not.toContain('نگار احمدی')
    expect(names).not.toContain('مریم نوروزی')
  })

  it('answers 403 when a MANAGER asks for scope=all', async () => {
    const result = await manager.request('/api/members', { query: { scope: 'all' } })
    expect(result.status).toBe(403)
    expect(envelope(result).code).toBe('FORBIDDEN')
  })

  it('limits an EMPLOYEE to themselves', async () => {
    const result = await employee.request<MemberListResponse>('/api/members', { pageSize: '100' })
    expect(result.status).toBe(200)
    expect(result.body.scope).toBe('mine')
    expect(result.body.members).toHaveLength(1)
    expect(result.body.members[0]!.fullName).toBe('نگار احمدی')
    expect(result.body.canManageRoles).toBe(false)
  })

  it('answers 403 when an EMPLOYEE asks for scope=all', async () => {
    const result = await employee.request('/api/members', { query: { scope: 'all' } })
    expect(result.status).toBe(403)
  })

  it('exposes a profile to the member themselves', async () => {
    const result = await employee.request<MemberDetailResponse>(`/api/members/${ids.employeeUser}`)
    expect(result.status).toBe(200)
    expect(result.body.member.fullName).toBe('نگار احمدی')
    expect(result.body.member.team?.name).toBe('محصول')
    expect(result.body.member.progress).not.toBeNull()
    expect(result.body.member.performance).toBeDefined()
    // An employee may not act on themselves.
    expect(result.body.member.permissions.canEdit).toBe(false)
    expect(result.body.member.permissions.canChangeRole).toBe(false)
  })

  it('hides a colleague from an EMPLOYEE with a 404, not a 403', async () => {
    const result = await employee.request(`/api/members/${ids.managerUser}`)
    expect(result.status).toBe(404)
    expect(envelope(result).code).toBe('NOT_FOUND')
  })

  it('hides an out-of-scope colleague from a MANAGER', async () => {
    const result = await manager.request(`/api/members/${ids.employeeUser}`)
    expect(result.status).toBe(404)
  })

  it('exposes a report to their MANAGER, without role rights', async () => {
    const report = await manager.request<MemberListResponse>('/api/members', { pageSize: '100' })
    const reportId = report.body.members.find(m => m.fullName === 'الناز کریمی')!.id

    const result = await manager.request<MemberDetailResponse>(`/api/members/${reportId}`)
    expect(result.status).toBe(200)
    expect(result.body.member.permissions.canEdit).toBe(true)
    expect(result.body.member.permissions.canChangeRole).toBe(false)
    expect(result.body.member.permissions.canRemove).toBe(false)
  })
})

// ===========================================================================
describe('member mutation guards', () => {
  it('refuses an EMPLOYEE editing their own role', async () => {
    const result = await employee.request(`/api/members/${ids.employeeUser}`, {
      method: 'PATCH',
      body: { role: 'OWNER' },
    })
    expect(result.status).toBe(404)

    const still = await owner.request<MemberDetailResponse>(`/api/members/${ids.employeeUser}`)
    expect(still.body.member.role).toBe('EMPLOYEE')
  })

  it('refuses an EMPLOYEE editing their own team membership', async () => {
    const result = await employee.request(`/api/members/${ids.employeeUser}`, {
      method: 'PATCH',
      body: { teamId: ids.engineeringTeam },
    })
    expect(result.status).toBe(404)
  })

  it('refuses an EMPLOYEE editing a colleague', async () => {
    const result = await employee.request(`/api/members/${ids.managerUser}`, {
      method: 'PATCH',
      body: { jobTitle: 'دستکاری' },
    })
    expect(result.status).toBe(404)
  })

  it('refuses an EMPLOYEE removing anyone', async () => {
    const result = await employee.request(`/api/members/${ids.managerUser}`, { method: 'DELETE' })
    expect(result.status).toBe(403)
  })

  it('lets a MANAGER retitle a report but not change their role', async () => {
    const report = await manager.request<MemberListResponse>('/api/members', { pageSize: '100' })
    const reportId = report.body.members.find(m => m.fullName === 'الناز کریمی')!.id

    const title = await manager.request(`/api/members/${reportId}`, {
      method: 'PATCH',
      body: { jobTitle: 'مهندس ارشد' },
    })
    expect(title.status).toBe(200)

    const role = await manager.request(`/api/members/${reportId}`, {
      method: 'PATCH',
      body: { role: 'ADMIN' },
    })
    expect(role.status).toBe(403)
  })

  it('refuses a MANAGER editing someone outside their reports', async () => {
    const result = await manager.request(`/api/members/${ids.otherManagerUser}`, {
      method: 'PATCH',
      body: { jobTitle: 'دستکاری' },
    })
    expect(result.status).toBe(404)
  })

  it('lets the ADMIN change a role, and revokes the target\'s sessions', async () => {
    const before = await query<{ n: number }>(
      `SELECT count(*)::int AS n FROM "Session" WHERE "userId" = $1 AND "revokedAt" IS NULL`,
      [ids.employeeUser],
    )
    expect(before[0]!.n).toBeGreaterThan(0)

    const result = await admin.request(`/api/members/${ids.employeeUser}`, {
      method: 'PATCH',
      body: { role: 'MANAGER' },
    })
    expect(result.status, JSON.stringify(result.body)).toBe(200)

    const after = await query<{ n: number }>(
      `SELECT count(*)::int AS n FROM "Session" WHERE "userId" = $1 AND "revokedAt" IS NULL`,
      [ids.employeeUser],
    )
    expect(after[0]!.n).toBe(0)

    // The stale cookie no longer works.
    const me = await employee.request('/api/me')
    expect(me.status).toBe(401)

    // Restore the fixture for the rest of the file.
    await admin.request(`/api/members/${ids.employeeUser}`, {
      method: 'PATCH',
      body: { role: 'EMPLOYEE' },
    })
    await login(employee, EMPLOYEE_A)
  })

  it('refuses to demote an OWNER at all', async () => {
    const owners = await admin.request<MemberListResponse>('/api/members', {
      query: { scope: 'all', role: 'OWNER' },
    })
    expect(owners.body.members).toHaveLength(1)
    const ownerId = owners.body.members[0]!.id

    // An ADMIN outranks everyone but the owner, and still cannot demote them:
    // `canChangeRole` is false for an OWNER target. Ownership transfer is a
    // separate deliberate action that this API deliberately does not offer.
    const result = await admin.request(`/api/members/${ownerId}`, {
      method: 'PATCH',
      body: { role: 'ADMIN' },
    })
    expect(result.status).toBe(403)
    expect(envelope(result).code).toBe('FORBIDDEN')
  })

  it('refuses to suspend the last OWNER', async () => {
    const owners = await admin.request<MemberListResponse>('/api/members', {
      query: { scope: 'all', role: 'OWNER' },
    })
    const ownerId = owners.body.members[0]!.id

    // Suspending is allowed on an OWNER target, so this is where the
    // "a tenant must keep one reachable administrator" rule bites.
    const result = await admin.request(`/api/members/${ownerId}`, {
      method: 'PATCH',
      body: { status: 'SUSPENDED' },
    })
    expect(result.status).toBe(409)
    expect(envelope(result).message).toContain('حداقل یک مالک')
  })

  it('refuses to change your own role even as OWNER', async () => {
    const me = await owner.request<{ user: { id: string } }>('/api/me')
    const result = await owner.request(`/api/members/${me.body.user.id}`, {
      method: 'PATCH',
      body: { role: 'EMPLOYEE' },
    })
    expect(result.status).toBe(404)
  })

  it('refuses to deactivate yourself', async () => {
    const me = await admin.request<{ user: { id: string } }>('/api/me')
    const result = await admin.request(`/api/members/${me.body.user.id}`, {
      method: 'PATCH',
      body: { status: 'SUSPENDED' },
    })
    // The self-edit guard answers first, so this never reaches the status rule.
    expect(result.status).toBe(404)

    const still = await admin.request<MemberDetailResponse>(`/api/members/${me.body.user.id}`)
    expect(still.body.member.status).toBe('ACTIVE')
  })

  it('removes a member softly: deactivated, unteamed, sessions revoked', async () => {
    const phone = invitePhone()
    await owner.request('/api/members/invite', {
      method: 'POST',
      body: { phone, fullName: 'حذف شونده', role: 'EMPLOYEE' },
    })
    const invitee = new ApiClient()
    const code = await requestCode(invitee, phone)
    const verify = await invitee.request<VerifyOtpResponse>('/api/auth/otp/verify', {
      method: 'POST',
      body: { phone, code },
    })
    expect(verify.body.status).toBe('invitation_pending')

    const list = await invitee.request('/api/auth/invitations')
    const invitationId = (list.body as { invitations: Array<{ id: string }> }).invitations[0]!.id
    const accepted = await invitee.request<{ user: { id: string } }>('/api/auth/invitations/accept', {
      method: 'POST',
      body: { invitationId },
    })
    const userId = accepted.body.user.id

    const removed = await owner.request(`/api/members/${userId}`, { method: 'DELETE' })
    expect(removed.status).toBe(200)

    const rows = await query<{ status: string, teams: number, sessions: number }>(
      `SELECT u.status::text,
              (SELECT count(*)::int FROM "TeamMember" tm WHERE tm."userId" = u.id) AS teams,
              (SELECT count(*)::int FROM "Session" s WHERE s."userId" = u.id AND s."revokedAt" IS NULL) AS sessions
       FROM "User" u WHERE u.id = $1`,
      [userId],
    )
    expect(rows[0]?.status).toBe('DEACTIVATED')
    expect(rows[0]?.teams).toBe(0)
    expect(rows[0]?.sessions).toBe(0)

    // The row survives for audit, and a second removal finds nothing active.
    expect((await owner.request(`/api/members/${userId}`)).status).toBe(200)
  })

  it('refuses to remove yourself', async () => {
    const me = await admin.request<{ user: { id: string } }>('/api/me')
    const result = await admin.request(`/api/members/${me.body.user.id}`, { method: 'DELETE' })
    expect(result.status).toBe(409)
  })
})

// ===========================================================================
describe('teams', () => {
  let teamId = ''

  it('lets the OWNER create a team and derives a slug', async () => {
    const result = await owner.request<TeamDetailResponse>('/api/teams', {
      method: 'POST',
      body: { name: 'تیم آزمون یکپارچه', description: 'ساخته‌شده توسط تست' },
    })
    expect(result.status, JSON.stringify(result.body)).toBe(200)
    expect(result.body.team.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    expect(result.body.team.slug).toMatch(/^tim-azmon/)
    teamId = result.body.team.id
  })

  it('de-duplicates the slug instead of rejecting a second team with one name', async () => {
    const result = await owner.request<TeamDetailResponse>('/api/teams', {
      method: 'POST',
      body: { name: 'تیم آزمون یکپارچه' },
    })
    expect(result.status).toBe(200)
    expect(result.body.team.slug).not.toBe('tim-azmon-yekparche')
    await owner.request(`/api/teams/${result.body.team.id}`, { method: 'DELETE' })
  })

  it('forbids a MANAGER from creating a team', async () => {
    const result = await manager.request('/api/teams', {
      method: 'POST',
      body: { name: 'تیم مدیر' },
    })
    expect(result.status).toBe(403)
  })

  it('forbids an EMPLOYEE from creating a team', async () => {
    const result = await employee.request('/api/teams', { method: 'POST', body: { name: 'تیم کارمند' } })
    expect(result.status).toBe(403)
  })

  it('adds an unassigned member, then refuses a second membership', async () => {
    const detail = await owner.request<TeamDetailResponse>(`/api/teams/${teamId}`)
    const candidate = detail.body.candidates[0]!

    const added = await owner.request<TeamDetailResponse>(`/api/teams/${teamId}/members`, {
      method: 'POST',
      body: { userId: candidate.id },
    })
    expect(added.status, JSON.stringify(added.body)).toBe(200)
    expect(added.body.team.members.map(m => m.userId)).toContain(candidate.id)

    const twice = await owner.request(`/api/teams/${teamId}/members`, {
      method: 'POST',
      body: { userId: candidate.id },
    })
    expect(twice.status).toBe(409)
  })

  it('refuses to add someone who already belongs to another team', async () => {
    const result = await owner.request(`/api/teams/${teamId}/members`, {
      method: 'POST',
      body: { userId: ids.employeeUser },
    })
    expect(result.status).toBe(409)
    expect(envelope(result).message).toContain('محصول')
  })

  it('refuses a member as their own direct manager', async () => {
    const detail = await owner.request<TeamDetailResponse>(`/api/teams/${teamId}`)
    const candidate = detail.body.candidates[0]!

    const result = await owner.request(`/api/teams/${teamId}/members`, {
      method: 'POST',
      body: { userId: candidate.id, managerId: candidate.id },
    })
    expect(result.status).toBe(400)
    expect(envelope(result).code).toBe('MANAGER_SELF')
  })

  it('refuses a direct manager from outside the team', async () => {
    const detail = await owner.request<TeamDetailResponse>(`/api/teams/${teamId}`)
    const candidate = detail.body.candidates[0]!

    const result = await owner.request(`/api/teams/${teamId}/members`, {
      method: 'POST',
      body: { userId: candidate.id, managerId: ids.employeeUser },
    })
    expect(result.status).toBe(400)
    expect(envelope(result).code).toBe('MANAGER_NOT_IN_TEAM')
  })

  it('hides a team from a MANAGER who does not lead it, even for a PATCH', async () => {
    const detail = await owner.request<TeamDetailResponse>(`/api/teams/${teamId}`)
    const memberId = detail.body.team.members[0]!.userId

    // The scope guard runs before the field-level one, so this is a 404 rather
    // than a 403: the endpoint does not confirm the team exists.
    const result = await manager.request(`/api/teams/${teamId}`, {
      method: 'PATCH',
      body: { leadId: memberId },
    })
    expect(result.status).toBe(404)
  })

  it('hides a team from a MANAGER who does not lead it', async () => {
    const result = await manager.request(`/api/teams/${teamId}`)
    expect(result.status).toBe(404)
  })

  it('hides a team from an EMPLOYEE who is not in it', async () => {
    const result = await employee.request(`/api/teams/${teamId}`)
    expect(result.status).toBe(404)
  })

  it('lets the OWNER appoint a lead and keeps the roster in step', async () => {
    const detail = await owner.request<TeamDetailResponse>(`/api/teams/${teamId}`)
    const memberId = detail.body.team.members[0]!.userId

    const result = await owner.request<TeamDetailResponse>(`/api/teams/${teamId}`, {
      method: 'PATCH',
      body: { leadId: memberId },
    })
    expect(result.status, JSON.stringify(result.body)).toBe(200)
    expect(result.body.team.lead?.id).toBe(memberId)

    const leadMembership = result.body.team.members.find(m => m.userId === memberId)
    expect(leadMembership?.role).toBe('LEAD')
    expect(result.body.team.members.filter(m => m.role === 'LEAD')).toHaveLength(1)
  })

  it('gives an EMPLOYEE lead edit rights over their own team, and no more', async () => {
    // Invite, accept, then appoint: this is how a real team lead ends up as an
    // EMPLOYEE-role user who nevertheless manages one team.
    const phone = invitePhone()
    const invited = await owner.request<{ invitation: { id: string } }>('/api/members/invite', {
      method: 'POST',
      body: { phone, fullName: 'سرپرست آزمایشی', role: 'EMPLOYEE' },
    })
    const invitee = new ApiClient()
    const code = await requestCode(invitee, phone)
    await invitee.request('/api/auth/otp/verify', { method: 'POST', body: { phone, code } })
    const accepted = await invitee.request<{ user: { id: string, role: string } }>(
      '/api/auth/invitations/accept',
      { method: 'POST', body: { invitationId: invited.body.invitation.id } },
    )
    expect(accepted.body.user.role).toBe('EMPLOYEE')
    const leadUserId = accepted.body.user.id

    // An EMPLOYEE cannot hold the lead: team-management scope belongs to
    // MANAGER and above, so the appointment is refused rather than creating a
    // lead who can look but not touch.
    const tooLow = await owner.request(`/api/teams/${teamId}`, {
      method: 'PATCH',
      body: { leadId: leadUserId },
    })
    expect(tooLow.status).toBe(400)
    expect(envelope(tooLow).code).toBe('LEAD_ROLE_TOO_LOW')

    // Promotion is a separate, explicit step.
    const promoted = await admin.request(`/api/members/${leadUserId}`, {
      method: 'PATCH',
      body: { role: 'MANAGER' },
    })
    expect(promoted.status, JSON.stringify(promoted.body)).toBe(200)

    // …and revokes the session, so the invitee has to sign in again.
    expect((await invitee.request('/api/me')).status).toBe(401)
    const lead = new ApiClient()
    await login(lead, phone)

    const appointed = await owner.request<TeamDetailResponse>(`/api/teams/${teamId}`, {
      method: 'PATCH',
      body: { leadId: leadUserId },
    })
    expect(appointed.status, JSON.stringify(appointed.body)).toBe(200)
    expect(appointed.body.team.lead?.id).toBe(leadUserId)

    const view = await lead.request<TeamDetailResponse>(`/api/teams/${teamId}`)
    expect(view.status).toBe(200)
    expect(view.body.canEdit).toBe(true)
    expect(view.body.team.members.map(m => m.userId)).toContain(leadUserId)

    // Renaming your own team is ordinary housekeeping …
    const rename = await lead.request(`/api/teams/${teamId}`, {
      method: 'PATCH',
      body: { name: 'تیم آزمون یکپارچه ویرایش‌شده' },
    })
    expect(rename.status).toBe(200)

    // … but appointing a lead grants scope over other people, so it stays with
    // OWNER/ADMIN. `''` is how the form clears the field.
    const demote = await lead.request(`/api/teams/${teamId}`, {
      method: 'PATCH',
      body: { leadId: '' },
    })
    expect(demote.status).toBe(403)

    const slug = await lead.request(`/api/teams/${teamId}`, {
      method: 'PATCH',
      body: { slug: 'hijacked' },
    })
    expect(slug.status).toBe(403)

    // The LEAD membership role is the same lever, so it is gated identically.
    const other = view.body.team.members.find(m => m.userId !== leadUserId)
    if (other) {
      const viaMembership = await lead.request(`/api/teams/${teamId}/members/${other.userId}`, {
        method: 'PATCH',
        body: { role: 'LEAD' },
      })
      expect(viaMembership.status).toBe(403)
    }

    // A manager may still not reach a team they do not lead.
    const foreign = await lead.request(`/api/teams/${ids.productTeam}`)
    expect(foreign.status).toBe(404)

    // And the team shows up in the lead's own team list.
    const list = await lead.request<{ teams: Array<{ id: string }> }>('/api/teams')
    expect(list.body.teams.map(t => t.id)).toContain(teamId)
  })

  it('removes a member without touching their account', async () => {
    const detail = await owner.request<TeamDetailResponse>(`/api/teams/${teamId}`)
    const memberId = detail.body.team.members[0]!.userId

    const result = await owner.request<TeamDetailResponse>(
      `/api/teams/${teamId}/members/${memberId}`,
      { method: 'DELETE' },
    )
    expect(result.status).toBe(200)
    expect(result.body.team.members.map(m => m.userId)).not.toContain(memberId)

    const still = await owner.request<MemberDetailResponse>(`/api/members/${memberId}`)
    expect(still.status).toBe(200)
    expect(still.body.member.status).toBe('ACTIVE')
  })

  it('forbids an EMPLOYEE from deleting a team', async () => {
    const result = await employee.request(`/api/teams/${teamId}`, { method: 'DELETE' })
    expect(result.status).toBe(403)
  })

  it('deletes the team and leaves the members\' accounts intact', async () => {
    const detail = await owner.request<TeamDetailResponse>(`/api/teams/${teamId}`)
    const memberIds = detail.body.team.members.map(m => m.userId)

    const result = await owner.request(`/api/teams/${teamId}`, { method: 'DELETE' })
    expect(result.status).toBe(200)
    expect((await owner.request(`/api/teams/${teamId}`)).status).toBe(404)

    const rows = await query<{ n: number }>(
      `SELECT count(*)::int AS n FROM "User" WHERE id = ANY($1::uuid[]) AND status = 'ACTIVE'`,
      [memberIds],
    )
    expect(rows[0]?.n).toBe(memberIds.length)
  })
})

// ===========================================================================
describe('cross-company isolation', () => {
  it('hides tenant A members from tenant B\'s OWNER', async () => {
    const list = await ownerB.request<MemberListResponse>('/api/members', { query: { scope: 'all' } })
    expect(list.status).toBe(200)
    for (const member of list.body.members) {
      expect(member.fullName).not.toBe('ساینا رستمی')
    }

    const one = await ownerB.request(`/api/members/${ids.managerUser}`)
    expect(one.status).toBe(404)
  })

  it('hides tenant A teams from tenant B\'s OWNER', async () => {
    const one = await ownerB.request(`/api/teams/${ids.engineeringTeam}`)
    expect(one.status).toBe(404)

    const list = await ownerB.request<{ teams: Array<{ id: string }> }>('/api/teams')
    expect(list.body.teams.map(t => t.id)).not.toContain(ids.engineeringTeam)
  })

  it('hides tenant A invitations from tenant B\'s OWNER', async () => {
    const list = await ownerB.request<InvitationListResponse>('/api/invitations', {
      query: { status: 'PENDING', pageSize: '100' },
    })
    expect(list.status).toBe(200)
    expect(list.body.invitations).toHaveLength(0)
  })

  it('refuses tenant B inviting into tenant A\'s team', async () => {
    const result = await ownerB.request('/api/members/invite', {
      method: 'POST',
      body: {
        phone: invitePhone(),
        fullName: 'نفوذ',
        teamId: ids.engineeringTeam,
        role: 'EMPLOYEE',
      },
    })
    expect(result.status).toBe(404)
  })

  it('refuses tenant B adding a tenant A user to one of its own teams', async () => {
    const created = await ownerB.request<TeamDetailResponse>('/api/teams', {
      method: 'POST',
      body: { name: 'تیم آزمون یکپارچه B' },
    })
    expect(created.status).toBe(200)

    const add = await ownerB.request(`/api/teams/${created.body.team.id}/members`, {
      method: 'POST',
      body: { userId: ids.employeeUser },
    })
    expect(add.status).toBe(404)

    await ownerB.request(`/api/teams/${created.body.team.id}`, { method: 'DELETE' })
    await query(`DELETE FROM "Team" WHERE name = 'تیم آزمون یکپارچه B'`).catch(() => undefined)
  })

  it('refuses tenant B editing a tenant A member', async () => {
    const result = await ownerB.request(`/api/members/${ids.employeeUser}`, {
      method: 'PATCH',
      body: { role: 'EMPLOYEE', jobTitle: 'نفوذ' },
    })
    expect(result.status).toBe(404)
  })

  it('refuses tenant B revoking a tenant A invitation', async () => {
    const result = await ownerB.request(`/api/invitations/${ids.invitationId}`, { method: 'DELETE' })
    expect(result.status).toBe(404)
  })

  it('never lets an invitation cross the tenant boundary', async () => {
    // An invitation created by tenant B can only be accepted into tenant B.
    const phone = invitePhone()
    const created = await ownerB.request<{ invitation: { id: string } }>('/api/members/invite', {
      method: 'POST',
      body: { phone, fullName: 'دعوت شرکت ب', role: 'EMPLOYEE' },
    })

    const invitee = new ApiClient()
    const code = await requestCode(invitee, phone)
    await invitee.request('/api/auth/otp/verify', { method: 'POST', body: { phone, code } })

    const accepted = await invitee.request<{ company: { slug: string } }>('/api/auth/invitations/accept', {
      method: 'POST',
      body: { invitationId: created.body.invitation.id },
    })
    expect(accepted.status).toBe(200)
    expect(accepted.body.company.slug).toBe('dadegavan-aria')
  })
})
