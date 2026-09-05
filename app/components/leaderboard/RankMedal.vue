<script setup lang="ts">
/**
 * The rank marker.
 *
 * Gold / silver / bronze for the podium, a quiet neutral tile for everybody
 * else. A tie shares the medal — two people who earned the same score see the
 * same rank, which is the point of competition ranking.
 */
const props = withDefaults(
  defineProps<{
    rank: number
    size?: 'sm' | 'md' | 'lg'
    tied?: boolean
  }>(),
  { size: 'md', tied: false },
)

const { t } = useI18n()
const format = useLocaleFormat()

const tones: Record<number, string> = {
  1: 'bg-gradient-to-b from-coin-300 to-coin-500 text-coin-950 shadow-[0_6px_18px_-8px_var(--color-coin-500)]',
  2: 'bg-gradient-to-b from-slate-200 to-slate-400 text-slate-800',
  3: 'bg-gradient-to-b from-amber-600 to-amber-800 text-white',
}

const sizes = {
  sm: 'size-6 rounded-lg text-[11px]',
  md: 'size-9 rounded-xl text-sm',
  lg: 'size-12 rounded-2xl text-lg',
}

const tone = computed(() => tones[props.rank] ?? 'bg-elevated text-muted')
const size = computed(() => sizes[props.size])
</script>

<template>
  <span
    class="relative grid shrink-0 place-items-center font-black tabular-nums"
    :class="[tone, size]"
    :aria-label="`${t('gamification.rank')} ${format.number(props.rank)}`"
  >
    <UIcon
      v-if="props.rank === 1 && props.size === 'lg'"
      name="i-heroicons-trophy-solid"
      class="size-5"
    />
    <template v-else>
      {{ format.number(props.rank) }}
    </template>

    <span
      v-if="props.tied"
      class="absolute -top-1 -end-1 grid size-3.5 place-items-center rounded-full bg-primary text-[8px] font-black text-inverted"
      :title="t('leaderboard.tied')"
    >
      =
    </span>
  </span>
</template>
