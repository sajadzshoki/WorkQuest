import { can as hasPermission } from '#shared/utils/permissions'
import type { Permission } from '#shared/utils/permissions'

/**
 * Client-side mirror of the server RBAC matrix.
 * Used to hide affordances — never as the actual security boundary.
 */
export function useCan() {
  const { user } = useSession()

  return {
    can: (permission: Permission) => hasPermission(user.value?.role, permission),
    role: computed(() => user.value?.role ?? null),
  }
}
