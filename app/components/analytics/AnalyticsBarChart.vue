<script setup lang="ts">
/**
 * A day-bucketed bar chart — the shape behind "tasks completed over time"
 * and "XP earned over time".
 *
 * Hand-rolled SVG on purpose: the project has no chart dependency, and these
 * two plots (bars + a line) are all the dashboard needs. The plot itself is
 * always LTR — time flows left→right in charts regardless of the page's RTL
 * direction — while every label is rendered through the locale formatter so
 * it comes out Persian-first. Tooltips are native `<title>` elements: no
 * floating-ui, no javascript, and they work on every browser.
 */
const props = defineProps<{
  /** One bucket per day; the x-axis is its index. */
  points: Array<{ day: string, value: number }>
  /** Tooltip text for a bucket's value. */
  formatValue?: (value: number) => string
  /** Tooltip text for a bucket's day label. */
  formatDay?: (day: string) => string
}>()

const format = useLocaleFormat()

const VIEW_WIDTH = 640
const VIEW_HEIGHT = 208
const PADDING_TOP = 12
const PADDING_BOTTOM = 26
const AXIS_LEFT = 40
const AXIS_RIGHT = 8

const plotWidth = VIEW_WIDTH - AXIS_LEFT - AXIS_RIGHT
const plotHeight = VIEW_HEIGHT - PADDING_TOP - PADDING_BOTTOM

/** A readable axis ceiling: 1/2/2.5/5 × 10^k just above the data maximum. */
const niceMax = computed(() => {
  const max = Math.max(1, ...props.points.map(point => point.value))
  const exponent = Math.floor(Math.log10(max))
  const base = 10 ** exponent
  for (const step of [1, 2, 2.5, 5, 10]) {
    if (step * base >= max) return step * base
  }
  return 10 * base
})

const gridLines = computed(() =>
  [0, 1, 2, 3, 4].map(step => ({
    y: PADDING_TOP + plotHeight - (step / 4) * plotHeight,
    label: format.compact((step / 4) * niceMax.value),
  })),
)

const slots = computed(() => {
  const count = Math.max(1, props.points.length)
  const slotWidth = plotWidth / count
  return props.points.map((point, index) => {
    const barWidth = Math.max(2, slotWidth * 0.6)
    const x = AXIS_LEFT + index * slotWidth + (slotWidth - barWidth) / 2
    const barHeight = (point.value / niceMax.value) * plotHeight
    return {
      x,
      y: PADDING_TOP + plotHeight - barHeight,
      width: barWidth,
      height: barHeight,
      point,
      // Label the first bucket, then every 5th, so a 30-day axis stays legible.
      showLabel: index % 5 === 0 || index === count - 1,
    }
  })
})

const valueText = (value: number) => props.formatValue?.(value) ?? format.number(value)
const dayText = (day: string) =>
  props.formatDay?.(day) ?? format.number(Number.parseInt(day.slice(8), 10))

const barTitle = (point: { day: string, value: number }) =>
  `${dayText(point.day)}: ${valueText(point.value)}`
</script>

<template>
  <svg
    :viewBox="`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`"
    class="w-full text-dimmed"
    dir="ltr"
    role="img"
  >
    <!-- gridlines + y labels -->
    <g
      v-for="line in gridLines"
      :key="line.y"
    >
      <line
        :x1="AXIS_LEFT"
        :x2="VIEW_WIDTH - AXIS_RIGHT"
        :y1="line.y"
        :y2="line.y"
        stroke="currentColor"
        stroke-opacity="0.15"
        stroke-width="1"
      />
      <text
        :x="AXIS_LEFT - 6"
        :y="line.y + 3"
        text-anchor="end"
        class="fill-current text-[9px]"
      >
        {{ line.label }}
      </text>
    </g>

    <!-- one bar per day -->
    <g class="text-primary">
      <rect
        v-for="slot in slots"
        :key="slot.point.day"
        :x="slot.x"
        :y="slot.y"
        :width="slot.width"
        :height="slot.height"
        rx="2"
        fill="currentColor"
        :fill-opacity="slot.point.value > 0 ? 0.85 : 0.12"
      >
        <title>{{ barTitle(slot.point) }}</title>
      </rect>
    </g>

    <!-- x labels: first day + every 5th + last day -->
    <template v-for="slot in slots">
      <text
        v-if="slot.showLabel"
        :key="`label-${slot.point.day}`"
        :x="slot.x + slot.width / 2"
        :y="VIEW_HEIGHT - 8"
        text-anchor="middle"
        class="fill-current text-[9px]"
      >
        {{ dayText(slot.point.day) }}
      </text>
    </template>
  </svg>
</template>
