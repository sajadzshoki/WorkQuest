import type { AuthContext } from '#shared/types/api'

import { usePrisma } from './db'

/**
 * Tenant isolation, enforced where it cannot be forgotten.
 *
 * `createTenantClient(auth)` returns a Prisma client whose every query on a
 * tenant-owned model is rewritten to include `companyId = auth.companyId`, and
 * whose every create is stamped with it. Handlers therefore cannot leak — or
 * accidentally read — another company's rows, even if they forget a filter.
 *
 * Rules:
 *  - models listed in TENANT_MODELS always carry `companyId`;
 *  - `Company`, `OtpCode` and `Session` are deliberately excluded (pre-auth or
 *    tenant root);
 *  - an explicit `companyId` that disagrees with the session is a hard error,
 *    never a silent override.
 */
export const TENANT_MODELS = [
  'User',
  'Team',
  'TeamMember',
  'Level',
  'UserProgress',
  'XpTransaction',
  'CoinTransaction',
  'Task',
  'TaskReview',
  'Achievement',
  'UserAchievement',
  'Badge',
  'UserBadge',
  'Recognition',
  'Reward',
  'RewardRedemption',
  'Challenge',
  'ChallengeParticipant',
  'Notification',
  'AuditLog',
] as const

export type TenantModel = (typeof TENANT_MODELS)[number]

const TENANT_MODEL_SET: ReadonlySet<string> = new Set(TENANT_MODELS)

const READ_OPERATIONS = new Set([
  'findUnique',
  'findUniqueOrThrow',
  'findFirst',
  'findFirstOrThrow',
  'findMany',
  'count',
  'aggregate',
  'groupBy',
  'update',
  'updateMany',
  'delete',
  'deleteMany',
  'upsert',
])

const CREATE_OPERATIONS = new Set(['create', 'createMany', 'upsert'])

/** Models the extension must never touch. */
export function isTenantModel(model: string | undefined): model is TenantModel {
  return typeof model === 'string' && TENANT_MODEL_SET.has(model)
}

/**
 * Add the tenant predicate to a `where` clause.
 *
 * Top-level keys in a Prisma `where` are AND-ed, so `companyId` is merged as a
 * sibling rather than wrapped in `AND`: wrapping would break the
 * `WhereUniqueInput` contract used by `findUnique`/`update`/`delete`, which
 * requires the unique field to stay at the top level.
 *
 * A conflicting `companyId` in the incoming filter is a hard error — never a
 * silent override.
 */
function scopedWhere(where: unknown, companyId: string) {
  if (where === undefined || where === null) return { companyId }
  if (typeof where !== 'object') return { companyId }

  const record = where as Record<string, unknown>
  assertSameTenant(record.companyId, companyId)

  return { ...record, companyId }
}

function assertSameTenant(value: unknown, companyId: string): void {
  if (typeof value === 'string' && value !== companyId) {
    throw new Error('WorkQuest: cross-tenant query blocked by the tenant-scoped client.')
  }
}

export function createTenantClient(auth: AuthContext) {
  const db = usePrisma()

  return db.$extends({
    name: 'tenantScope',
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (!isTenantModel(model)) return query(args)

          const input = args as Record<string, unknown>

          if (READ_OPERATIONS.has(operation)) {
            input.where = scopedWhere(input.where, auth.companyId)
          }

          if (CREATE_OPERATIONS.has(operation)) {
            if (operation === 'createMany') {
              const data = input.data
              if (Array.isArray(data)) {
                input.data = data.map((row) => {
                  const record = row as Record<string, unknown>
                  assertSameTenant(record.companyId, auth.companyId)
                  return { ...record, companyId: auth.companyId }
                })
              }
            }
            else {
              const data = input.data as Record<string, unknown> | undefined
              if (data && typeof data === 'object') {
                assertSameTenant(data.companyId, auth.companyId)
                input.data = { ...data, companyId: auth.companyId }
              }
            }
          }

          return query(input)
        },
      },
    },
  })
}

export type TenantClient = ReturnType<typeof createTenantClient>
