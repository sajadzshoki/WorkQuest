<script setup lang="ts">
import type { LeaderboardScoringInfo } from '#shared/types/api'
import type { LeaderboardPeriod } from '#shared/utils/leaderboard'

/**
 * The rules of the game, stated where the game is played.
 *
 * A board people cannot explain is a board they distrust, so this panel spells
 * out what is scored (performance XP + achievement progress), what is not
 * (coins), when the period turns over, and how much of the company is shown.
 * The numbers come from the API rather than being hard-coded in the copy, so the
 * explanation cannot drift from the calculation.
 */
const props = defineProps<{
  scoring: LeaderboardScoringInfo
  period: LeaderboardPeriod
  maxEntries: number
  participants: number
}>()

const { t } = useI18n()
const format = useLocaleFormat()
</script>

<template>
  <CommonSectionCard
    :title="t('leaderboard.scoring.title')"
    icon="i-heroicons-information-circle"
  >
    <p class="text-xs leading-6 text-muted">
      {{ t('leaderboard.scoring.body') }}
    </p>

    <ul class="mt-3 space-y-2 text-xs">
      <li class="flex items-start gap-2">
        <UIcon
          name="i-heroicons-bolt"
          class="mt-0.5 size-4 shrink-0 text-primary"
        />
        <span class="text-muted">
          <b class="font-bold text-highlighted">{{ t('leaderboard.scoring.performance') }}</b>
          × {{ format.number(props.scoring.performanceXpWeight) }}
        </span>
      </li>
      <li class="flex items-start gap-2">
        <UIcon
          name="i-heroicons-star-solid"
          class="mt-0.5 size-4 shrink-0 text-coin-500"
        />
        <span class="text-muted">
          <b class="font-bold text-highlighted">{{ t('leaderboard.scoring.achievementXp') }}</b>
          × {{ format.number(props.scoring.achievementXpWeight) }}
          · {{ t('leaderboard.scoring.bonus', { points: format.number(props.scoring.achievementUnlockBonus) }) }}
        </span>
      </li>
      <li class="flex items-start gap-2">
        <UIcon
          name="i-heroicons-no-symbol"
          class="mt-0.5 size-4 shrink-0 text-dimmed"
        />
        <span class="text-dimmed">
          {{ t('gamification.coins') }}: {{ t('leaderboard.scoring.coinsExcluded') }}
        </span>
      </li>
    </ul>

    <div class="mt-4 space-y-2 border-t border-default pt-3 text-[11px] leading-5 text-muted">
      <p class="flex items-start gap-2">
        <UIcon
          name="i-heroicons-arrow-path"
          class="mt-0.5 size-3.5 shrink-0"
        />
        {{ t(`leaderboard.resetNote.${props.period}`) }}
      </p>
      <p class="flex items-start gap-2">
        <UIcon
          name="i-heroicons-eye-slash"
          class="mt-0.5 size-3.5 shrink-0"
        />
        {{ t('leaderboard.privacyNote', { count: format.number(props.maxEntries) }) }}
        <span
          v-if="props.participants > 0"
          class="text-dimmed"
        >
          ({{ t('leaderboard.participants', { count: format.number(props.participants) }) }})
        </span>
      </p>
    </div>
  </CommonSectionCard>
</template>
