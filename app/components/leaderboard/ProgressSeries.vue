<script setup lang="ts">
import type { SeriesBucket } from '#shared/utils/leaderboard'

/**
 * The sparkline behind personal progress.
 *
 * One bar per window, oldest first in the DOM — which in RTL puts the oldest on
 * the right and the current period on the left, the direction Persian readers
 * scan a timeline in. Empty periods keep a stub bar: a gap in the chart is
 * information, and a hole would read as missing data.
 */
const props = defineProps<{
  buckets: SeriesBucket[]
  /** `week` labels by day, `month` by month name. */
  period: 'week' | 'month'
}>()

const { t } = useI18n()
const format = useLocaleFormat()

const max = computed(() => Math.max(1, ...props.buckets.map(bucket => bucket.score)))

const labelFor = (bucket: SeriesBucket) => {
  const date = new Date(bucket.startsAt)
  return props.period === 'week'
    ? format.date(date, { month: 'short', day: 'numeric' })
    : format.date(date, { month: 'long' })
}
</script>

<template>
  <div>
    <ol class="flex h-28 items-end gap-1.5 sm:gap-2">
      <li
        v-for="(bucket, index) in props.buckets"
        :key="bucket.key"
        class="group flex min-w-0 flex-1 flex-col items-center justify-end gap-1.5"
      >
        <span
          class="text-[10px] font-bold tabular-nums opacity-0 transition-opacity group-hover:opacity-100"
          :class="bucket.score > 0 ? 'text-highlighted' : 'text-dimmed'"
        >
          {{ format.number(bucket.score) }}
        </span>

        <UTooltip
          :text="`${labelFor(bucket)} · ${format.number(bucket.score)} ${t('leaderboard.points')}`"
          class="flex w-full flex-1 items-end"
        >
          <span
            class="w-full rounded-t-md transition-all duration-500"
            :class="[
              index === props.buckets.length - 1
                ? 'bg-primary'
                : bucket.score > 0 ? 'bg-primary/35 group-hover:bg-primary/55' : 'bg-elevated',
            ]"
            :style="{ height: `${Math.max(bucket.score > 0 ? 8 : 3, (bucket.score / max) * 100)}%` }"
          />
        </UTooltip>

        <span class="w-full truncate text-center text-[9px] text-dimmed sm:text-[10px]">
          {{ labelFor(bucket) }}
        </span>
      </li>
    </ol>

    <p
      v-if="props.buckets.every(bucket => bucket.score === 0)"
      class="mt-2 text-center text-[11px] text-muted"
    >
      {{ t('leaderboard.progress.emptyHint') }}
    </p>
  </div>
</template>
