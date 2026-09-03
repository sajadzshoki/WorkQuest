<script setup lang="ts">
/**
 * A single badge — the visual face of an achievement or recognition.
 *
 * Reused on the achievements page, the profile, the member profile and the
 * celebration feed, so a badge always looks the same everywhere. Rendering is
 * driven by the server-provided `iconKey` and `tone`; there is no per-badge
 * asset or inline styling.
 */
const props = withDefaults(
  defineProps<{
    name: string
    iconKey?: string | null
    tone?: string | null
    description?: string | null
    /** Locked badges render dimmed without the sheen. */
    unlocked?: boolean
    awardedAt?: string | null
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { iconKey: null, tone: null, description: null, unlocked: true, awardedAt: null, size: 'md' },
)

const format = useLocaleFormat()

type BadgeTone = 'primary' | 'coin' | 'streak' | 'success' | 'info' | 'warning' | 'neutral'

const tones: Record<BadgeTone, { tile: string, ring: string }> = {
  primary: { tile: 'bg-primary/12 text-primary', ring: 'ring-primary/25' },
  coin: { tile: 'bg-coin-500/12 text-coin-600 dark:text-coin-300', ring: 'ring-coin-400/25' },
  streak: { tile: 'bg-streak-500/12 text-streak-600 dark:text-streak-400', ring: 'ring-streak-400/25' },
  success: { tile: 'bg-success/12 text-success', ring: 'ring-success/25' },
  info: { tile: 'bg-info/12 text-info', ring: 'ring-info/25' },
  warning: { tile: 'bg-warning/12 text-warning', ring: 'ring-warning/25' },
  neutral: { tile: 'bg-elevated text-muted', ring: 'ring-default' },
}

const toneKey = computed<BadgeTone>(() => {
  const value = props.tone
  return value && value in tones ? (value as BadgeTone) : 'primary'
})

const toneClasses = computed(() => tones[toneKey.value])

const sizes = {
  sm: { tile: 'size-9 rounded-lg', icon: 'size-4.5', name: 'text-[11px]' },
  md: { tile: 'size-12 rounded-xl', icon: 'size-6', name: 'text-xs' },
  lg: { tile: 'size-16 rounded-2xl', icon: 'size-8', name: 'text-sm' },
} as const

const size = computed(() => sizes[props.size])
</script>

<template>
  <div class="flex flex-col items-center gap-1.5">
    <span
      class="relative grid shrink-0 place-items-center"
      :class="[size.tile, toneClasses.tile, props.unlocked ? `ring-1 ${toneClasses.ring}` : 'opacity-40 saturate-0']"
    >
      <UIcon
        :name="props.iconKey ?? 'i-heroicons-shield-check'"
        :class="size.icon"
      />
      <!-- Subtle sheen for earned badges. -->
      <span
        v-if="props.unlocked"
        class="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
        aria-hidden="true"
      >
        <span class="wq-badge-shine absolute inset-y-0 w-1/2 -skew-x-12 bg-white/20" />
      </span>
    </span>

    <p
      class="max-w-full truncate font-bold text-highlighted"
      :class="size.name"
      :title="props.name"
    >
      {{ props.name }}
    </p>

    <p
      v-if="props.awardedAt"
      class="text-[10px] text-dimmed"
    >
      {{ format.shortDate(props.awardedAt) }}
    </p>
  </div>
</template>
