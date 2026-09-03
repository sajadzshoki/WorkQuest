<script setup lang="ts">
/**
 * The streak surface: current run, longest run, and the 7/14/30 milestone
 * markers. Numbers come from the server; the component only positions them.
 */
const props = defineProps<{
  current: number
  longest: number
  milestones?: Array<{ days: number, reached: boolean }>
  next?: number | null
}>()

const { t } = useI18n()
const format = useLocaleFormat()

/** Marker placement along a 0..30 track. */
function left(days: number): string {
  return `${Math.round((days / 30) * 100)}%`
}
</script>

<template>
  <section class="wq-panel p-5">
    <div class="flex items-center justify-between gap-3">
      <h3 class="text-sm font-bold text-highlighted">
        {{ t('gamification.streak') }}
      </h3>
      <UIcon
        name="i-heroicons-fire-solid"
        class="size-5 text-streak-500"
      />
    </div>

    <div class="mt-3 flex items-end justify-between gap-3">
      <div>
        <p class="text-xs text-muted">
          {{ t('gamification.currentStreak') }}
        </p>
        <p class="mt-0.5 text-3xl font-black tabular-nums text-streak-600 dark:text-streak-400">
          {{ format.number(props.current) }}
        </p>
      </div>
      <div class="text-end">
        <p class="text-xs text-muted">
          {{ t('gamification.longestStreak') }}
        </p>
        <p class="mt-0.5 text-xl font-black tabular-nums text-highlighted">
          {{ format.number(props.longest) }}
        </p>
      </div>
    </div>

    <!-- Milestone track: markers at 7 / 14 / 30 days. -->
    <div class="relative mt-6 h-2 rounded-full bg-elevated">
      <div
        class="absolute inset-y-0 start-0 rounded-full bg-gradient-to-l from-streak-400 to-streak-600 transition-[width] duration-700"
        :style="{ width: `${Math.min(100, Math.round((props.current / 30) * 100))}%` }"
      />

      <span
        v-for="milestone in props.milestones ?? []"
        :key="milestone.days"
        class="absolute top-1/2 -translate-y-1/2"
        :style="{ insetInlineStart: left(milestone.days) }"
      >
        <span
          class="grid size-4 -translate-x-1/2 place-items-center rounded-full text-[9px] font-black tabular-nums ring-2 ring-bg"
          :class="milestone.reached ? 'bg-streak-500 text-white' : 'bg-elevated text-dimmed'"
          :title="t('gamification.streakMilestone', { days: format.number(milestone.days) })"
        >
          {{ format.number(milestone.days) }}
        </span>
      </span>
    </div>

    <p
      v-if="props.next !== null && props.next !== undefined"
      class="mt-3 text-xs text-muted"
    >
      {{ t('gamification.streakNext', { days: format.number(props.next) }) }}
    </p>
    <p
      v-else
      class="mt-3 text-xs text-success"
    >
      {{ t('gamification.streakMax') }}
    </p>
  </section>
</template>
