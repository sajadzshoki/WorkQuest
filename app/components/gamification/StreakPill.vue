<script setup lang="ts">
const props = defineProps<{ value: number }>()
const { t } = useI18n()
const format = useLocaleFormat()
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full bg-streak-500/12 px-2.5 py-1 text-xs font-bold text-streak-600 dark:text-streak-400"
    :title="t('gamification.currentStreak')"
  >
    <UIcon
      name="i-heroicons-fire-solid"
      class="size-3.5"
    />
    <span class="tabular-nums">{{ format.number(props.value) }}</span>
  </span>
</template>
