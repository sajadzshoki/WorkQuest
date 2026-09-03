<script setup lang="ts">
import type { TaskStatus } from '#shared/utils/task'

/**
 * The one place a task status is turned into colour and iconography, so the
 * board, the cards, the dashboards and the detail page always read the same.
 */
const props = withDefaults(defineProps<{ status: TaskStatus, size?: 'sm' | 'md' }>(), {
  size: 'sm',
})

const { t } = useI18n()

const tones: Record<TaskStatus, 'primary' | 'success' | 'warning' | 'info' | 'neutral'> = {
  TODO: 'neutral',
  IN_PROGRESS: 'primary',
  SUBMITTED: 'info',
  NEEDS_REVISION: 'warning',
  APPROVED: 'success',
}

const icons: Record<TaskStatus, string> = {
  TODO: 'i-heroicons-inbox-stack',
  IN_PROGRESS: 'i-heroicons-play-circle',
  SUBMITTED: 'i-heroicons-paper-airplane',
  NEEDS_REVISION: 'i-heroicons-arrow-path',
  APPROVED: 'i-heroicons-check-badge',
}
</script>

<template>
  <UBadge
    :color="tones[props.status] ?? 'neutral'"
    variant="subtle"
    :icon="icons[props.status]"
    :size="props.size"
    class="shrink-0"
  >
    {{ t(`status.task.${props.status}`) }}
  </UBadge>
</template>
