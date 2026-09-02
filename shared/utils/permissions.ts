/**
 * Roles are intentionally flat. Higher roles inherit everything below them,
 * and managers are additionally constrained by the team/employee graph.
 */
export const ROLES = ['OWNER', 'ADMIN', 'MANAGER', 'EMPLOYEE'] as const
export type Role = (typeof ROLES)[number]

/** Numeric rank used for `atLeast` comparisons. Higher = more privileged. */
export const ROLE_RANK: Record<Role, number> = {
  OWNER: 40,
  ADMIN: 30,
  MANAGER: 20,
  EMPLOYEE: 10,
}

/**
 * Every action a request can be authorised for.
 * Keeping them in one enum-like union makes `can()` exhaustive and grep-able.
 */
export const PERMISSIONS = [
  // company
  'company:read',
  'company:update',
  'member:read',
  'member:manage',
  // teams
  'team:read',
  'team:manage',
  // tasks
  'task:read:own',
  'task:read:team',
  'task:read:all',
  'task:assign',
  'task:review',
  // gamification
  'achievement:read',
  'achievement:manage',
  'reward:read',
  'reward:manage',
  'reward:redeem',
  'challenge:read',
  'challenge:manage',
  'recognition:create',
  'leaderboard:read',
  'wallet:adjust',
] as const

export type Permission = (typeof PERMISSIONS)[number]

/**
 * Permission matrix. `'*'` means "everything".
 * Deliberately coarse — a per-resource ACL is not a Phase 1 goal.
 */
const MATRIX: Record<Role, readonly Permission[] | '*'> = {
  OWNER: '*',
  ADMIN: '*',
  MANAGER: [
    'company:read',
    'member:read',
    'team:read',
    'task:read:own',
    'task:read:team',
    'task:assign',
    'task:review',
    'achievement:read',
    'reward:read',
    'challenge:read',
    'recognition:create',
    'leaderboard:read',
  ],
  EMPLOYEE: [
    'company:read',
    'task:read:own',
    'achievement:read',
    'reward:read',
    'reward:redeem',
    'challenge:read',
    'recognition:create',
    'leaderboard:read',
  ],
}

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value)
}

/** True when `role` grants `permission` according to the static matrix. */
export function can(role: Role | undefined | null, permission: Permission): boolean {
  if (!isRole(role)) return false
  const granted = MATRIX[role]
  if (granted === '*') return true
  return granted.includes(permission)
}

/** True when `role` ranks at least as high as `minimum`. */
export function roleAtLeast(role: Role | undefined | null, minimum: Role): boolean {
  if (!isRole(role)) return false
  return ROLE_RANK[role] >= ROLE_RANK[minimum]
}
