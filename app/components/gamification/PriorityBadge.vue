<script setup lang="ts">
import type { TaskPriority } from '#shared/utils/task'

const props = defineProps<{ priority: TaskPriority }>()
const { t } = useI18n()

const classes: Record<TaskPriority, string> = {
  LOW: 'text-muted bg-elevated',
  MEDIUM: 'text-info bg-info/12',
  HIGH: 'text-error bg-error/12',
}

const icons: Record<TaskPriority, string> = {
  LOW: 'i-heroicons-arrow-down',
  MEDIUM: 'i-heroicons-minus',
  HIGH: 'i-heroicons-arrow-up',
}
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold"
    :class="classes[props.priority] ?? 'text-muted bg-elevated'"
  >
    <UIcon
      :name="icons[props.priority] ?? 'i-heroicons-minus'"
      class="size-3"
    />
    {{ t(`priority.${props.priority}`) }}
  </span>
</template>
