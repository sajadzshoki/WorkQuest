<script setup lang="ts">
const props = defineProps<{
  level: number
  title?: string | null
  percent: number
  currentXp?: number
  neededXp?: number
}>()

const { t } = useI18n()
const format = useLocaleFormat()
</script>

<template>
  <div class="flex items-center gap-4">
    <div class="relative grid size-16 shrink-0 place-items-center">
      <svg
        viewBox="0 0 48 48"
        class="size-16 -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          class="text-elevated"
        />
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          stroke-linecap="round"
          class="text-primary transition-[stroke-dasharray] duration-700"
          :stroke-dasharray="`${(props.percent / 100) * 125.6} 125.6`"
        />
      </svg>
      <span class="absolute text-lg font-black tabular-nums text-highlighted">
        {{ format.number(props.level) }}
      </span>
    </div>

    <div class="min-w-0 flex-1">
      <p class="text-sm font-bold text-highlighted">
        {{ props.title ?? t('dashboard.level', { level: format.number(props.level) }) }}
      </p>
      <p
        v-if="props.currentXp !== undefined && props.neededXp"
        class="mt-0.5 text-xs text-muted"
      >
        {{
          t('dashboard.xpToNext', {
            current: format.number(props.currentXp ?? 0),
            needed: format.number(props.neededXp ?? 0),
          })
        }}
      </p>
      <UProgress
        :model-value="props.percent"
        size="sm"
        color="primary"
        class="mt-2"
      />
    </div>
  </div>
</template>
