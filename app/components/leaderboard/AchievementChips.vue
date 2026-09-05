<script setup lang="ts">
import type { LeaderboardAchievementInfo } from '#shared/types/api'

/**
 * Achievement indicators.
 *
 * A row earns its chips by unlocking achievements *inside the period*, so the
 * board shows mastery next to output. Icons come from the catalogue
 * (`Achievement.iconKey`) and fall back to a star, which keeps a badly
 * configured achievement from rendering as an empty box.
 */
const props = withDefaults(
  defineProps<{
    achievements: LeaderboardAchievementInfo[]
    total?: number
    size?: 'sm' | 'md'
  }>(),
  { size: 'sm' },
)

const { t } = useI18n()
const format = useLocaleFormat()

const chipSize = computed(() => (props.size === 'md' ? 'size-7 rounded-lg' : 'size-6 rounded-md'))
const iconSize = computed(() => (props.size === 'md' ? 'size-4' : 'size-3.5'))

const extra = computed(() => {
  const total = props.total ?? props.achievements.length
  return Math.max(0, total - props.achievements.length)
})
</script>

<template>
  <div
    v-if="props.achievements.length > 0 || extra > 0"
    class="flex items-center gap-1"
  >
    <UTooltip
      v-for="(achievement, index) in props.achievements"
      :key="`${achievement.key ?? 'achievement'}-${index}`"
      :text="achievement.title ?? t('gamification.achievement')"
    >
      <span
        class="grid place-items-center bg-primary/10 text-primary ring-1 ring-primary/15"
        :class="chipSize"
      >
        <UIcon
          :name="achievement.iconKey ?? 'i-heroicons-star-solid'"
          :class="iconSize"
        />
      </span>
    </UTooltip>

    <span
      v-if="extra > 0"
      class="grid place-items-center rounded-md bg-elevated px-1.5 text-[10px] font-bold text-muted tabular-nums"
      :class="props.size === 'md' ? 'h-7' : 'h-6'"
      :title="t('leaderboard.achievements.unlocked', { count: format.number(props.total ?? 0) })"
    >
      +{{ format.number(extra) }}
    </span>
  </div>

  <span
    v-else
    class="text-[11px] text-dimmed"
  >
    {{ t('leaderboard.achievements.none') }}
  </span>
</template>
