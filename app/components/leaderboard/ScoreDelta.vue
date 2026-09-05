<script setup lang="ts">
/**
 * A period-over-period delta.
 *
 * Up is green, down is amber rather than red: a slower week is information, not
 * a failure, and the board is meant to keep people coming back.
 */
const props = withDefaults(
  defineProps<{
    value: number
    direction: 'up' | 'down' | 'flat'
    /** Rendered after the number, e.g. `XP`. */
    suffix?: string
    compact?: boolean
  }>(),
  { suffix: '', compact: false },
)

const { t } = useI18n()
const format = useLocaleFormat()

const tones = {
  up: 'bg-success/12 text-success',
  down: 'bg-warning/12 text-warning',
  flat: 'bg-elevated text-muted',
}

const icons = {
  up: 'i-heroicons-arrow-trending-up',
  down: 'i-heroicons-arrow-trending-down',
  flat: 'i-heroicons-minus',
}

const labels = {
  up: 'leaderboard.progress.deltaUp',
  down: 'leaderboard.progress.deltaDown',
  flat: 'leaderboard.progress.deltaFlat',
}

const text = computed(() => {
  const amount = format.number(Math.abs(props.value))
  const sign = props.value > 0 ? '+' : props.value < 0 ? '−' : ''
  return props.suffix ? `${sign}${amount} ${props.suffix}` : `${sign}${amount}`
})
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold tabular-nums"
    :class="tones[props.direction]"
    :title="t(labels[props.direction])"
  >
    <UIcon
      :name="icons[props.direction]"
      class="size-3.5"
    />
    {{ text }}
    <span
      v-if="!props.compact"
      class="hidden font-medium opacity-80 sm:inline"
    >
      {{ t(labels[props.direction]) }}
    </span>
  </span>
</template>
