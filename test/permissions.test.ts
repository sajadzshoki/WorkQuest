import { describe, expect, it } from 'vitest'

import { PERMISSIONS, ROLES, can, isRole, roleAtLeast } from '#shared/utils/permissions'

describe('permission matrix', () => {
  it('grants owners and admins everything', () => {
    for (const permission of PERMISSIONS) {
      expect(can('OWNER', permission)).toBe(true)
      expect(can('ADMIN', permission)).toBe(true)
    }
  })

  it('lets employees read their own work but not review it', () => {
    expect(can('EMPLOYEE', 'task:read:own')).toBe(true)
    expect(can('EMPLOYEE', 'task:review')).toBe(false)
    expect(can('EMPLOYEE', 'task:read:all')).toBe(false)
    expect(can('EMPLOYEE', 'member:manage')).toBe(false)
    expect(can('EMPLOYEE', 'wallet:adjust')).toBe(false)
  })

  it('lets managers review and assign, but not manage members', () => {
    expect(can('MANAGER', 'task:review')).toBe(true)
    expect(can('MANAGER', 'task:assign')).toBe(true)
    expect(can('MANAGER', 'task:read:team')).toBe(true)
    expect(can('MANAGER', 'task:read:all')).toBe(false)
    expect(can('MANAGER', 'member:manage')).toBe(false)
    expect(can('MANAGER', 'company:update')).toBe(false)
  })

  it('denies everything for an unknown or missing role', () => {
    expect(can(undefined, 'task:read:own')).toBe(false)
    expect(can(null, 'task:read:own')).toBe(false)
    expect(can('SUPERUSER' as never, 'task:read:own')).toBe(false)
  })

  it('covers every role in the matrix', () => {
    // A new role added to ROLES without a matrix entry would silently allow nothing.
    expect(ROLES).toEqual(['OWNER', 'ADMIN', 'MANAGER', 'EMPLOYEE'])
    for (const role of ROLES) {
      expect(isRole(role)).toBe(true)
    }
  })
})

describe('role ranking', () => {
  it('orders roles by privilege', () => {
    expect(roleAtLeast('OWNER', 'ADMIN')).toBe(true)
    expect(roleAtLeast('MANAGER', 'ADMIN')).toBe(false)
    expect(roleAtLeast('EMPLOYEE', 'EMPLOYEE')).toBe(true)
    expect(roleAtLeast(undefined, 'EMPLOYEE')).toBe(false)
  })
})
