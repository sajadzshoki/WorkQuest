<script setup lang="ts">
const props = defineProps<{ priority: string }>()
const { t } = useI18n()

const classes: Record<string, string> = {
  LOW: 'text-muted bg-elevated',
  MEDIUM: 'text-info bg-info/12',
  HIGH: 'text-warning bg-warning/12',
  URGENT: 'text-error bg-error/12',
}

const icons: Record<string, string> = {
  LOW: 'i-heroicons-arrow-down',
  MEDIUM: 'i-heroicons-minus',
  HIGH: 'i-heroicons-arrow-up',
  URGENT: 'i-heroicons-exclamation-triangle-solid',
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold"
    :class="classes[props.priority] ?? 'text-muted bg-elevated'"
  >
    <UIcon
      :name="icons[props.priority] ?? 'i-heroicons-minus'"
      class="size-3"
    />
    {{ t(`priority.${props.priority}`) }}
  </span>
</template>
