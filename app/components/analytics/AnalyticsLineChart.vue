<script setup lang="ts">
/**
 * A one-or-two series day-bucketed line chart — "average performance over
 * time" and the earned-vs-redeemed coins plot.
 *
 * Same philosophy as `AnalyticsBarChart`: no chart library, LTR plot, RTL-safe
 * labels through the locale formatter, native `<title>` tooltips. A series
 * may carry `null` values (a day with no scored work): the line breaks there
 * instead of diving to zero, which would invent a performance collapse the
 * data does not show.
 */
const props = defineProps<{
  series: Array<{
    name: string
    points: Array<{ day: string, value: number | null }>
    /** Tailwind text color class applied to the line and its dots. */
    colorClass?: string
  }>
  formatValue?: (value: number) => string
  formatDay?: (day: string) => string
  /** Fixed axis ceiling (scores are always 0–100); defaults to a nice fit. */
  max?: number
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

const dayCount = computed(() =>
  Math.max(1, ...props.series.map(entry => entry.points.length)))

const niceMax = computed(() => {
  if (props.max !== undefined) return props.max
  const values = props.series.flatMap(entry =>
    entry.points.map(point => point.value).filter(value => value !== null)) as number[]
  const dataMax = Math.max(1, ...values)
  const exponent = Math.floor(Math.log10(dataMax))
  const base = 10 ** exponent
  for (const step of [1, 2, 2.5, 5, 10]) {
    if (step * base >= dataMax) return step * base
  }
  return 10 * base
})

const gridLines = computed(() =>
  [0, 1, 2, 3, 4].map(step => ({
    y: PADDING_TOP + plotHeight - (step / 4) * plotHeight,
    label: format.compact((step / 4) * niceMax.value),
  })))

/** x position of bucket `index` — points spread across the full plot width. */
const xAt = (index: number) => AXIS_LEFT + (index / Math.max(1, dayCount.value - 1)) * plotWidth
const yAt = (value: number) => PADDING_TOP + plotHeight - (value / niceMax.value) * plotHeight

/**
 * One polyline per contiguous run of non-null points: gaps in the data become
 * gaps in the line, never a misleading zero.
 */
const paths = computed(() =>
  props.series.map((entry) => {
    const segments: Array<Array<{ x: number, y: number }>> = []
    let current: Array<{ x: number, y: number }> = []
    entry.points.forEach((point, index) => {
      if (point.value === null) {
        if (current.length > 0) segments.push(current)
        current = []
        return
      }
      current.push({ x: xAt(index), y: yAt(point.value) })
    })
    if (current.length > 0) segments.push(current)
    return {
      ...entry,
      segments,
      dots: entry.points
        .map((point, index) => ({ point, index, x: xAt(index), y: point.value === null ? null : yAt(point.value) }))
        .filter(item => item.point.value !== null),
    }
  }))

const valueText = (value: number) => props.formatValue?.(value) ?? format.number(value)
const dayText = (day: string) =>
  props.formatDay?.(day) ?? format.number(Number.parseInt(day.slice(8), 10))

const hasData = computed(() =>
  props.series.some(entry => entry.points.some(point => point.value !== null)))
</script>

<template>
  <div>
    <p
      v-if="!hasData"
      class="py-10 text-center text-xs text-muted"
    >
      {{ $t('analytics.noData') }}
    </p>

    <svg
      v-else
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

      <!-- x labels: first day + every 5th + last day -->
      <template
        v-for="index in dayCount"
        :key="`tick-${index}`"
      >
        <text
          v-if="(index - 1) % 5 === 0 || index === dayCount"
          :x="xAt(index - 1)"
          :y="VIEW_HEIGHT - 8"
          text-anchor="middle"
          class="fill-current text-[9px]"
        >
          {{ dayText(series[0]?.points[index - 1]?.day ?? '') }}
        </text>
      </template>

      <!-- lines + dots, one group per series -->
      <g
        v-for="entry in paths"
        :key="entry.name"
        :class="entry.colorClass ?? 'text-primary'"
      >
        <polyline
          v-for="(segment, segmentIndex) in entry.segments"
          :key="`${entry.name}-${segmentIndex}`"
          :points="segment.map(point => `${point.x},${point.y}`).join(' ')"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle
          v-for="dot in entry.dots"
          :key="`${entry.name}-dot-${dot.index}`"
          :cx="dot.x"
          :cy="dot.y ?? 0"
          r="2.5"
          fill="currentColor"
        >
          <title>{{ `${entry.name} · ${dayText(dot.point.day)}: ${valueText(dot.point.value!)}` }}</title>
        </circle>
      </g>
    </svg>

    <!-- legend, only when more than one series competes for attention -->
    <div
      v-if="series.length > 1"
      class="mt-2 flex items-center justify-center gap-4 text-[11px] text-muted"
    >
      <span
        v-for="entry in series"
        :key="entry.name"
        class="inline-flex items-center gap-1.5"
      >
        <!-- A tiny stroke sample instead of a color swatch: the same
             currentColor trick as the line itself, so legend and line can
             never drift apart. -->
        <svg
          width="16"
          height="4"
          viewBox="0 0 16 4"
          aria-hidden="true"
        >
          <line
            x1="0"
            y1="2"
            x2="16"
            y2="2"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            :class="entry.colorClass ?? 'text-primary'"
          />
        </svg>
        {{ entry.name }}
      </span>
    </div>
  </div>
</template>
