<script setup lang="ts">
import type { Role } from '#shared/utils/permissions'

const props = defineProps<{
  role: Role
  /** Compact variant for table rows. */
  size?: 'xs' | 'sm' | 'md'
}>()

const { t } = useI18n()

/**
 * Colour by rank so the hierarchy reads at a glance without a legend.
 * Deliberately four distinct colours for four roles — no "severity" semantics.
 */
const tone: Record<Role, 'primary' | 'info' | 'warning' | 'neutral'> = {
  OWNER: 'primary',
  ADMIN: 'info',
  MANAGER: 'warning',
  EMPLOYEE: 'neutral',
}
</script>

<template>
  <UBadge
    :color="tone[props.role]"
    variant="subtle"
    :size="props.size ?? 'sm'"
  >
    {{ t(`roles.${props.role}`) }}
  </UBadge>
</template>
