<script setup lang="ts">
const props = defineProps<{ status: string }>()
const { t } = useI18n()

const tones: Record<string, 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
  DRAFT: 'neutral',
  ASSIGNED: 'info',
  IN_PROGRESS: 'primary',
  SUBMITTED: 'warning',
  APPROVED: 'success',
  CHANGES_REQUESTED: 'warning',
  REJECTED: 'error',
  CANCELLED: 'neutral',
}

const icons: Record<string, string> = {
  DRAFT: 'i-heroicons-pencil-square',
  ASSIGNED: 'i-heroicons-paper-airplane',
  IN_PROGRESS: 'i-heroicons-play-circle',
  SUBMITTED: 'i-heroicons-arrow-up-tray',
  APPROVED: 'i-heroicons-check-badge',
  CHANGES_REQUESTED: 'i-heroicons-pencil',
  REJECTED: 'i-heroicons-x-circle',
  CANCELLED: 'i-heroicons-no-symbol',
}
</script>

<template>
  <UBadge
    :color="tones[props.status] ?? 'neutral'"
    variant="subtle"
    :icon="icons[props.status]"
    size="sm"
  >
    {{ t(`status.task.${props.status}`) }}
  </UBadge>
</template>
