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
  'member:invite',
  // teams
  'team:read',
  'team:manage',
  /** Edit the teams a MANAGER leads and move members in/out of them. */
  'team:manage:assigned',
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
  /** Configure categories, cadence and titles. OWNER/ADMIN only. */
  'recognition:manage',
  'leaderboard:read',
  'wallet:adjust',
] as const

export type Permission = (typeof PERMISSIONS)[number]

/**
 * Permission matrix. `'*'` means "everything".
 * Deliberately coarse — a per-resource ACL is not a Phase 1 goal.
 *
 * Two permissions are role gates only and still need a *scope* check in the
 * handler, because the matrix cannot express "which rows":
 *
 *  - `member:read` / `member:invite` — a MANAGER only reaches their own team and
 *    their subordinates (`getManagedUserIds`).
 *  - `team:manage:assigned` — a MANAGER only reaches teams they lead.
 *  - `challenge:manage` — a MANAGER only reaches challenges tied to a team
 *    they lead; company-wide challenges stay with OWNER/ADMIN.
 *
 * OWNER and ADMIN hold `'*'` and are company-wide.
 */
const MATRIX: Record<Role, readonly Permission[] | '*'> = {
  OWNER: '*',
  ADMIN: '*',
  MANAGER: [
    'company:read',
    'member:read',
    'member:invite',
    'team:read',
    'team:manage:assigned',
    'task:read:own',
    'task:read:team',
    'task:assign',
    'task:review',
    'achievement:read',
    'reward:read',
    // A manager earns coins like anybody else, so they may spend their own.
    // `reward:manage` (the shelf) and `wallet:adjust` (other people's balances)
    // stay OWNER/ADMIN — this grants no authority over anybody else's coins.
    'reward:redeem',
    'challenge:read',
    // A manager may run challenges for the teams they lead. The handlers add
    // the scope on top: a MANAGER cannot publish company-wide challenges or
    // touch another team's — those stay with OWNER/ADMIN.
    'challenge:manage',
    'recognition:create',
    'leaderboard:read',
  ],
  EMPLOYEE: [
    'company:read',
    // Scoped by the handler to the teams the employee actually belongs to.
    'team:read',
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
