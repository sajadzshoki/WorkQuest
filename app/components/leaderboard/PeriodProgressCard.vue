<script setup lang="ts">
import type { PersonalProgressPeriod } from '#shared/types/api'

/**
 * One period of the personal-progress board (this week, or this month).
 *
 * Everything on it is about the caller: what they earned now versus the previous
 * window, where that puts them, how far the next rank is, and the recent trend.
 * The only other people implied by the screen are counts — how many scored — so
 * the view stays motivating without publishing anybody's position.
 */
const props = defineProps<{
  progress: PersonalProgressPeriod
  period: 'week' | 'month'
  teamName: string | null
}>()

const { t } = useI18n()
const format = useLocaleFormat()

const title = computed(() => t(props.period === 'week' ? 'leaderboard.progress.weekBoard' : 'leaderboard.progress.monthBoard'))

const windowLabel = computed(() =>
  `${format.shortDate(props.progress.window.startsAt)} — ${format.shortDate(props.progress.window.endsAt)}`)

const movement = computed(() => {
  const value = props.progress.movement
  if (value === null) return { key: 'leaderboard.progress.movementUnknown', tone: 'bg-elevated text-muted', icon: 'i-heroicons-question-mark-circle' }
  if (value > 0) return { key: 'leaderboard.progress.movementUp', tone: 'bg-success/12 text-success', icon: 'i-heroicons-arrow-up' }
  if (value < 0) return { key: 'leaderboard.progress.movementDown', tone: 'bg-warning/12 text-warning', icon: 'i-heroicons-arrow-down' }
  return { key: 'leaderboard.progress.movementFlat', tone: 'bg-elevated text-muted', icon: 'i-heroicons-minus' }
})

const movementText = computed(() => {
  const value = props.progress.movement ?? 0
  return t(movement.value.key, { count: format.number(Math.abs(value)) })
})

const seriesTitle = computed(() =>
  t(props.period === 'week' ? 'leaderboard.progress.seriesWeek' : 'leaderboard.progress.seriesMonth', {
    count: format.number(props.progress.series.length),
  }))
</script>

<template>
  <CommonSectionCard
    :title="title"
    :description="windowLabel"
    icon="i-heroicons-chart-bar"
  >
    <template #header-actions>
      <span
        v-if="props.progress.window.endsInDays > 0"
        class="inline-flex items-center gap-1 rounded-full bg-elevated px-2.5 py-1 text-[11px] font-semibold text-muted tabular-nums"
      >
        <UIcon
          name="i-heroicons-clock"
          class="size-3.5"
        />
        {{ t('leaderboard.endsIn', { days: format.number(props.progress.window.endsInDays) }) }}
      </span>
      <span
        v-else
        class="inline-flex items-center gap-1 rounded-full bg-coin-500/12 px-2.5 py-1 text-[11px] font-semibold text-coin-600 dark:text-coin-300"
      >
        {{ t('leaderboard.endsToday') }}
      </span>
    </template>

    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <p class="text-[11px] font-semibold text-muted">
          {{ t('leaderboard.progress.thisPeriod') }}
        </p>
        <p class="mt-1 text-3xl font-black tabular-nums text-highlighted">
          {{ format.number(props.progress.current.score) }}
          <span class="text-xs font-bold text-muted">{{ t('leaderboard.points') }}</span>
        </p>
        <p class="mt-1 text-xs text-muted tabular-nums">
          {{ t('leaderboard.periodXp') }}: {{ format.number(props.progress.current.xp) }}
        </p>

        <div class="mt-3 flex flex-wrap items-center gap-2">
          <LeaderboardScoreDelta
            :value="props.progress.delta.score"
            :direction="props.progress.delta.direction"
          />
          <span
            class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold"
            :class="movement.tone"
          >
            <UIcon
              :name="movement.icon"
              class="size-3.5"
            />
            {{ movementText }}
          </span>
        </div>

        <p class="mt-3 text-[11px] text-dimmed tabular-nums">
          {{ t('leaderboard.progress.previousPeriod') }}:
          {{ format.number(props.progress.previous.score) }} {{ t('leaderboard.points') }}
          · {{ t('leaderboard.periodXp') }} {{ format.number(props.progress.previous.xp) }}
        </p>
      </div>

      <dl class="grid grid-cols-2 gap-2 self-start">
        <div class="rounded-xl bg-elevated/70 px-3 py-2">
          <dt class="text-[10px] text-muted">
            {{ t('leaderboard.progress.companyRank') }}
          </dt>
          <dd class="mt-0.5 text-lg font-black tabular-nums text-primary">
            {{ props.progress.rank.company !== null ? format.number(props.progress.rank.company) : '—' }}
            <span class="text-[10px] font-semibold text-muted">
              / {{ format.number(props.progress.rank.participants) }}
            </span>
          </dd>
        </div>

        <div class="rounded-xl bg-elevated/70 px-3 py-2">
          <dt class="truncate text-[10px] text-muted">
            {{ props.teamName ?? t('leaderboard.progress.teamRank') }}
          </dt>
          <dd class="mt-0.5 text-lg font-black tabular-nums text-primary">
            {{ props.progress.rank.team !== null ? format.number(props.progress.rank.team) : '—' }}
          </dd>
        </div>

        <div class="col-span-2 rounded-xl bg-elevated/70 px-3 py-2">
          <dt class="text-[10px] text-muted">
            {{ t('leaderboard.achievements.unlocked', { count: format.number(props.progress.current.achievementsUnlocked) }) }}
          </dt>
          <dd class="mt-1.5">
            <LeaderboardAchievementChips
              :achievements="props.progress.current.achievements"
              :total="props.progress.current.achievementsUnlocked"
              size="md"
            />
          </dd>
        </div>

        <div
          v-if="props.progress.pointsToNextRank !== null"
          class="col-span-2 rounded-xl bg-primary/8 px-3 py-2 text-[11px] font-semibold text-primary"
        >
          {{ t('leaderboard.toNextRank', { points: format.number(props.progress.pointsToNextRank ?? 0) }) }}
        </div>
      </dl>
    </div>

    <div class="mt-5 border-t border-default pt-4">
      <p class="mb-2 text-[11px] font-semibold text-muted">
        {{ seriesTitle }}
      </p>
      <LeaderboardProgressSeries
        :buckets="props.progress.series"
        :period="props.period"
      />
    </div>
  </CommonSectionCard>
</template>
