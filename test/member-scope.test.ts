import { describe, expect, it } from 'vitest'

import {
  canEditTeam,
  canLeadRole,
  maxAssignableRole,
  memberPermissions,
  roleAtMost,
  visibleMemberScope,
} from '#shared/utils/member-scope'
import { PERMISSIONS, can } from '#shared/utils/permissions'

/**
 * The role × action matrix for people and teams.
 *
 * These are the rules the API endpoints call before touching the database, so
 * the whole security model is asserted here in isolation: no server, no
 * Prisma, no chance of a test passing because a query happened to return
 * nothing.
 */

const OWNER = { userId: 'u-owner', role: 'OWNER' as const }
const ADMIN = { userId: 'u-admin', role: 'ADMIN' as const }
const MANAGER = { userId: 'u-manager', role: 'MANAGER' as const }
const EMPLOYEE = { userId: 'u-employee', role: 'EMPLOYEE' as const }

/** امیر's reports, as walked from `TeamMember.managerId`. */
const REPORTS = ['u-report-1', 'u-report-2']

describe('visibleMemberScope', () => {
  it('gives OWNER and ADMIN the whole company', () => {
    expect(visibleMemberScope(OWNER, [])).toBeNull()
    expect(visibleMemberScope(ADMIN, [])).toBeNull()
  })

  it('gives a MANAGER themselves plus their reports, de-duplicated', () => {
    const scope = visibleMemberScope(MANAGER, [...REPORTS, 'u-manager'])
    expect(scope).toEqual(['u-manager', 'u-report-1', 'u-report-2'])
  })

  it('still includes a MANAGER with no reports', () => {
    expect(visibleMemberScope(MANAGER, [])).toEqual(['u-manager'])
  })

  it('gives an EMPLOYEE only themselves', () => {
    expect(visibleMemberScope(EMPLOYEE, REPORTS)).toEqual(['u-employee'])
  })
})

describe('memberPermissions', () => {
  const colleague = { id: 'u-other', role: 'EMPLOYEE' as const, status: 'ACTIVE' }
  const owner = { id: 'u-owner', role: 'OWNER' as const, status: 'ACTIVE' }
  const report = { id: 'u-report-1', role: 'EMPLOYEE' as const, status: 'ACTIVE' }

  it('lets OWNER and ADMIN act on anyone but themselves', () => {
    for (const subject of [OWNER, ADMIN]) {
      expect(memberPermissions(subject, colleague, [])).toEqual({
        canEdit: true,
        canChangeRole: true,
        canRemove: true,
      })
    }
  })

  it('never lets anyone change their own role', () => {
    const self = { id: 'u-admin', role: 'ADMIN' as const, status: 'ACTIVE' }
    const permissions = memberPermissions(ADMIN, self, [])
    expect(permissions.canEdit).toBe(false)
    expect(permissions.canChangeRole).toBe(false)
    expect(permissions.canRemove).toBe(false)
  })

  it('never lets an ADMIN change an OWNER role or remove them', () => {
    const permissions = memberPermissions(ADMIN, owner, [])
    expect(permissions.canEdit).toBe(true)
    expect(permissions.canChangeRole).toBe(false)
    expect(permissions.canRemove).toBe(false)
  })

  it('lets a MANAGER edit a report but never change a role or remove anyone', () => {
    expect(memberPermissions(MANAGER, report, REPORTS)).toEqual({
      canEdit: true,
      canChangeRole: false,
      canRemove: false,
    })
  })

  it('gives a MANAGER nothing over someone outside their reports', () => {
    expect(memberPermissions(MANAGER, colleague, REPORTS)).toEqual({
      canEdit: false,
      canChangeRole: false,
      canRemove: false,
    })
  })

  it('gives an EMPLOYEE nothing, not even over themselves', () => {
    const self = { id: 'u-employee', role: 'EMPLOYEE' as const, status: 'ACTIVE' }
    expect(memberPermissions(EMPLOYEE, self, [])).toEqual({
      canEdit: false,
      canChangeRole: false,
      canRemove: false,
    })
    expect(memberPermissions(EMPLOYEE, colleague, REPORTS).canEdit).toBe(false)
  })
})

describe('canEditTeam', () => {
  const led = ['t-mine']

  it('lets OWNER and ADMIN edit any team', () => {
    expect(canEditTeam(OWNER, 't-any', [])).toBe(true)
    expect(canEditTeam(ADMIN, 't-any', [])).toBe(true)
  })

  it('limits a MANAGER to the teams they lead', () => {
    expect(canEditTeam(MANAGER, 't-mine', led)).toBe(true)
    expect(canEditTeam(MANAGER, 't-theirs', led)).toBe(false)
  })

  it('gives an EMPLOYEE no team, even one they lead', () => {
    // Not reachable in practice — a lead must be MANAGER or above — but the
    // rule must still hold if the data is ever inconsistent.
    expect(canEditTeam(EMPLOYEE, 't-mine', led)).toBe(false)
  })
})

describe('role ceilings', () => {
  it('lets OWNER and ADMIN grant up to ADMIN, and nobody grant OWNER', () => {
    expect(maxAssignableRole('OWNER')).toBe('ADMIN')
    expect(maxAssignableRole('ADMIN')).toBe('ADMIN')
    expect(roleAtMost('OWNER', maxAssignableRole('OWNER'))).toBe(false)
    expect(roleAtMost('ADMIN', maxAssignableRole('ADMIN'))).toBe(true)
  })

  it('limits a MANAGER to granting EMPLOYEE', () => {
    expect(maxAssignableRole('MANAGER')).toBe('EMPLOYEE')
    expect(roleAtMost('EMPLOYEE', maxAssignableRole('MANAGER'))).toBe(true)
    expect(roleAtMost('MANAGER', maxAssignableRole('MANAGER'))).toBe(false)
    expect(roleAtMost('ADMIN', maxAssignableRole('MANAGER'))).toBe(false)
  })

  it('requires MANAGER or above to lead a team', () => {
    expect(canLeadRole('OWNER')).toBe(true)
    expect(canLeadRole('ADMIN')).toBe(true)
    expect(canLeadRole('MANAGER')).toBe(true)
    expect(canLeadRole('EMPLOYEE')).toBe(false)
  })
})

describe('the new Phase 2 permissions are wired into the matrix', () => {
  it('registers both permissions', () => {
    expect(PERMISSIONS).toContain('member:invite')
    expect(PERMISSIONS).toContain('team:manage:assigned')
  })

  it('grants member:invite to OWNER, ADMIN and MANAGER but not EMPLOYEE', () => {
    expect(can('OWNER', 'member:invite')).toBe(true)
    expect(can('ADMIN', 'member:invite')).toBe(true)
    expect(can('MANAGER', 'member:invite')).toBe(true)
    expect(can('EMPLOYEE', 'member:invite')).toBe(false)
  })

  it('grants team:manage:assigned to MANAGER but not EMPLOYEE', () => {
    expect(can('MANAGER', 'team:manage:assigned')).toBe(true)
    expect(can('EMPLOYEE', 'team:manage:assigned')).toBe(false)
    // OWNER/ADMIN hold the stronger team:manage.
    expect(can('OWNER', 'team:manage')).toBe(true)
  })

  it('keeps team:manage away from MANAGER', () => {
    expect(can('MANAGER', 'team:manage')).toBe(false)
    expect(can('EMPLOYEE', 'team:manage')).toBe(false)
  })

  it('lets an EMPLOYEE read teams but nobody else\'s members', () => {
    expect(can('EMPLOYEE', 'team:read')).toBe(true)
    expect(can('EMPLOYEE', 'member:read')).toBe(false)
    expect(can('EMPLOYEE', 'member:manage')).toBe(false)
  })
})
