<script setup lang="ts">
import type { InvitationStatus, UserStatus } from '#shared/types/api'

const props = defineProps<{
  status: UserStatus | InvitationStatus
}>()

const { t } = useI18n()

/**
 * One badge for both status families: they never appear in the same list, and
 * keeping the colour vocabulary shared means "green is fine, red is closed"
 * holds everywhere in the people screens.
 */
const tone: Record<string, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
  ACTIVE: 'success',
  ACCEPTED: 'success',
  PENDING: 'info',
  SUSPENDED: 'warning',
  REVOKED: 'error',
  EXPIRED: 'neutral',
  DEACTIVATED: 'neutral',
}

const key = computed(() => {
  const status = props.status
  // `status.user.*` vs `status.invitation.*` — the two enums share no values
  // except by accident, so look the family up from the value itself.
  return ['PENDING', 'ACCEPTED', 'REVOKED', 'EXPIRED'].includes(status)
    ? `status.invitation.${status}`
    : `status.user.${status}`
})
</script>

<template>
  <UBadge
    :color="tone[props.status] ?? 'neutral'"
    variant="subtle"
    size="sm"
  >
    {{ t(key) }}
  </UBadge>
</template>
