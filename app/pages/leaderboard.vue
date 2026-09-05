<script setup lang="ts">
import type { ApiErrorBody, LeaderboardResponse, PersonalProgressResponse } from '#shared/types/api'

definePageMeta({ middleware: ['auth'] })

/**
 * Leaderboards.
 *
 * Four boards on one page — the company week, the company month (the period
 * toggle), the team board, and personal progress. There is no all-time board:
 * the period is the point, so a newcomer can win the week they joined in.
 *
 * The page renders what the API returns and nothing more: a handful of rows plus
 * the caller's own position. It cannot show a full ranking even if asked to,
 * because the server never sends one.
 */
const { t } = useI18n()
const format = useLocaleFormat()
const localePath = useLocalePath()

const {
  tab,
  tabs,
  period,
  periodOptions,
  teamId,
  boardQuery,
  setTab,
  setPeriod,
  setTeam,
} = useLeaderboard()

const { data: board, status, error, refresh } = await useFetch<LeaderboardResponse>('/api/leaderboard', {
  query: boardQuery,
  watch: [boardQuery],
})

// Personal progress is its own endpoint and only worth fetching once the tab is
// opened — it is a heavier read (two windows, plus the series) for data the
// board tabs never render.
const { data: progress, status: progressStatus, refresh: refreshProgress } = await useFetch<PersonalProgressResponse>(
  '/api/leaderboard/progress',
  { immediate: false },
)

watch(
  tab,
  async (value) => {
    if (value === 'progress' && !progress.value) await refreshProgress()
  },
  { immediate: true },
)

/** Top three positions — the podium. */
const podium = computed(() => (board.value?.entries ?? []).slice(0, 3))
/** Whatever the cap allows below the podium (ranks 4 and 5). */
const rest = computed(() => (board.value?.entries ?? []).slice(3))

const teamOptions = computed(() =>
  (board.value?.availableTeams ?? []).map(team => ({
    label: team.isLead ? `${team.name} · ${t('team.lead')}` : team.name,
    value: team.id,
  })),
)

const windowLabel = computed(() => {
  const window = board.value?.window
  if (!window) return ''
  return `${format.shortDate(window.startsAt)} — ${format.shortDate(window.endsAt)}`
})

/** A manager looking at a team they are not part of gets told so, plainly. */
const watching = computed(() =>
  board.value?.scope === 'team' && board.value.team !== null && board.value.me.inScope === false)

const errorMessage = computed(() => {
  const body = error.value?.data as ApiErrorBody | undefined
  return body?.message ?? null
})

const lifetimeStats = computed(() => {
  const lifetime = progress.value?.lifetime
  if (!lifetime) return []
  return [
    { label: t('leaderboard.progress.stats.xp'), value: format.compact(lifetime.xp), icon: 'i-heroicons-bolt', tone: 'primary' as const },
    { label: t('leaderboard.progress.stats.coins'), value: format.number(lifetime.coins), icon: 'i-heroicons-circle-stack-solid', tone: 'coin' as const },
    {
      label: t('leaderboard.progress.stats.achievements'),
      value: format.number(lifetime.achievementsUnlocked),
      hint: t('leaderboard.progress.achievementsOf', {
        unlocked: format.number(lifetime.achievementsUnlocked),
        total: format.number(lifetime.achievementsTotal),
      }),
      icon: 'i-heroicons-star-solid',
      tone: 'success' as const,
    },
    { label: t('leaderboard.progress.stats.badges'), value: format.number(lifetime.badges), icon: 'i-heroicons-check-badge', tone: 'primary' as const },
    {
      label: t('leaderboard.progress.stats.streak'),
      value: format.number(lifetime.currentStreak),
      hint: `${t('leaderboard.progress.stats.longestStreak')}: ${format.number(lifetime.longestStreak)}`,
      icon: 'i-heroicons-fire-solid',
      tone: 'streak' as const,
    },
  ]
})

const nextLevelText = computed(() => {
  const lifetime = progress.value?.lifetime
  if (!lifetime) return ''
  if (!lifetime.nextLevel) return t('leaderboard.progress.maxLevel')
  return t('leaderboard.progress.nextLevel', {
    xp: format.number(Math.max(0, lifetime.nextLevel.minXp - lifetime.xp)),
    level: format.number(lifetime.nextLevel.level),
  })
})
</script>

<template>
  <div>
    <CommonPageHeader
      :title="t('leaderboard.title')"
      :subtitle="t('leaderboard.subtitle')"
    >
      <template #actions>
        <UButton
          color="neutral"
          variant="outline"
          icon="i-heroicons-arrow-path"
          :loading="status === 'pending'"
          :aria-label="t('common.retry')"
          square
          @click="refresh()"
        />
      </template>
    </CommonPageHeader>

    <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <UTabs
        :items="tabs"
        :content="false"
        :model-value="tab"
        value-key="value"
        color="primary"
        variant="link"
        class="w-full sm:w-auto"
        @update:model-value="setTab($event as 'company' | 'team' | 'progress')"
      />

      <div
        v-if="tab !== 'progress'"
        class="flex flex-wrap items-center gap-2"
      >
        <div class="inline-flex items-center gap-1 rounded-xl bg-elevated p-1">
          <UButton
            v-for="option in periodOptions"
            :key="option.value"
            size="sm"
            :color="period === option.value ? 'primary' : 'neutral'"
            :variant="period === option.value ? 'solid' : 'ghost'"
            :aria-pressed="period === option.value"
            @click="setPeriod(option.value)"
          >
            {{ option.label }}
          </UButton>
        </div>

        <USelectMenu
          v-if="tab === 'team' && teamOptions.length > 1"
          :model-value="teamId ?? board?.team?.id ?? undefined"
          :items="teamOptions"
          value-key="value"
          label-key="label"
          :placeholder="t('leaderboard.teamPicker')"
          icon="i-heroicons-user-group"
          size="md"
          class="min-w-44"
          @update:model-value="setTeam(($event as string | null) ?? null)"
        />
      </div>
    </div>

    <!-- ---------------------------------------------------------------- -->
    <!-- Boards: company & team                                            -->
    <!-- ---------------------------------------------------------------- -->
    <template v-if="tab !== 'progress'">
      <div class="wq-hero-gradient mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-default p-4">
        <div class="min-w-0">
          <p class="text-xs font-semibold text-muted">
            {{ t(`leaderboard.periodFull.${period}`) }}
            <template v-if="tab === 'team' && board?.team">
              · {{ t('leaderboard.scope.team') }} «{{ board.team.name }}»
            </template>
            <template v-else>
              · {{ t('leaderboard.scope.company') }}
            </template>
          </p>
          <p class="mt-1 truncate text-sm font-black text-highlighted tabular-nums">
            {{ windowLabel }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2 text-[11px]">
          <span
            v-if="board && board.window.endsInDays > 0"
            class="inline-flex items-center gap-1 rounded-full bg-default/70 px-2.5 py-1 font-semibold text-muted tabular-nums"
          >
            <UIcon
              name="i-heroicons-clock"
              class="size-3.5"
            />
            {{ t('leaderboard.endsIn', { days: format.number(board.window.endsInDays) }) }}
          </span>
          <span
            v-else-if="board"
            class="inline-flex items-center gap-1 rounded-full bg-coin-500/15 px-2.5 py-1 font-semibold text-coin-600 dark:text-coin-300"
          >
            <UIcon
              name="i-heroicons-clock"
              class="size-3.5"
            />
            {{ t('leaderboard.endsToday') }}
          </span>

          <span
            v-if="board"
            class="inline-flex items-center gap-1 rounded-full bg-default/70 px-2.5 py-1 font-semibold text-muted tabular-nums"
          >
            <UIcon
              name="i-heroicons-users"
              class="size-3.5"
            />
            {{ t('leaderboard.participants', { count: format.number(board.participants) }) }}
          </span>
        </div>
      </div>

      <UAlert
        v-if="errorMessage"
        color="error"
        variant="subtle"
        icon="i-heroicons-exclamation-triangle"
        :title="errorMessage"
        class="mb-4"
      />

      <UAlert
        v-else-if="watching"
        color="info"
        variant="subtle"
        icon="i-heroicons-eye"
        :title="t('leaderboard.watchingTeam', { team: board?.team?.name ?? '' })"
        class="mb-4"
      />

      <div class="grid gap-4 lg:grid-cols-3">
        <div class="space-y-4 lg:col-span-2">
          <!-- Loading -->
          <section
            v-if="status === 'pending' && !board"
            class="wq-panel space-y-3 p-5"
          >
            <div class="wq-skeleton h-40 rounded-xl" />
            <div class="wq-skeleton h-12 rounded-xl" />
            <div class="wq-skeleton h-12 rounded-xl" />
          </section>

          <!-- No team at all -->
          <CommonEmptyState
            v-else-if="tab === 'team' && !board?.team"
            class="wq-panel"
            icon="i-heroicons-user-group"
            :title="t('leaderboard.noTeam')"
            :description="t('leaderboard.noTeamHint')"
          >
            <UButton
              :to="localePath('/team')"
              color="primary"
              variant="soft"
              icon="i-heroicons-arrow-left"
              class="mt-2"
            >
              {{ t('nav.team') }}
            </UButton>
          </CommonEmptyState>

          <!-- Nobody scored in this window yet -->
          <CommonEmptyState
            v-else-if="!board?.entries.length"
            class="wq-panel"
            icon="i-heroicons-trophy"
            :title="t('leaderboard.noData')"
            :description="t('leaderboard.noDataHint')"
          />

          <template v-else>
            <section class="wq-panel-elevated overflow-hidden">
              <div class="px-4 pb-5 pt-6 sm:px-6">
                <LeaderboardPodium :entries="podium" />
              </div>
            </section>

            <ol
              v-if="rest.length"
              class="wq-panel divide-y divide-default"
            >
              <LeaderboardEntryRow
                v-for="entry in rest"
                :key="entry.user.id"
                :entry="entry"
              />
            </ol>
          </template>
        </div>

        <div class="space-y-4">
          <LeaderboardMeCard
            v-if="board"
            :me="board.me"
            :period="board.period"
            :participants="board.participants"
          />

          <LeaderboardScoringNote
            v-if="board"
            :scoring="board.scoring"
            :period="board.period"
            :max-entries="board.maxEntries"
            :participants="board.participants"
          />
        </div>
      </div>
    </template>

    <!-- ---------------------------------------------------------------- -->
    <!-- Personal progress                                                 -->
    <!-- ---------------------------------------------------------------- -->
    <template v-else>
      <div
        v-if="progressStatus === 'pending' && !progress"
        class="space-y-4"
      >
        <div class="wq-skeleton h-32 rounded-2xl" />
        <div class="grid gap-4 lg:grid-cols-2">
          <div class="wq-skeleton h-80 rounded-2xl" />
          <div class="wq-skeleton h-80 rounded-2xl" />
        </div>
      </div>

      <template v-else-if="progress">
        <CommonSectionCard
          :title="t('leaderboard.progress.lifetime')"
          :description="t('leaderboard.progress.lifetimeHint')"
          icon="i-heroicons-shield-check"
        >
          <div class="flex flex-col gap-5 sm:flex-row sm:items-center">
            <GamificationXpProgress
              :level="progress.lifetime.level"
              :title="progress.lifetime.levelTitle"
              :percent="progress.lifetime.levelPercent"
              :current-xp="progress.lifetime.levelCurrentXp"
              :needed-xp="progress.lifetime.levelNeededXp"
              class="sm:max-w-xs sm:flex-1"
            />
            <p class="text-xs font-semibold text-muted sm:ms-auto">
              {{ nextLevelText }}
            </p>
          </div>

          <div class="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <GamificationStatTile
              v-for="stat in lifetimeStats"
              :key="stat.label"
              v-bind="stat"
            />
          </div>
        </CommonSectionCard>

        <div class="mt-4 grid gap-4 xl:grid-cols-2">
          <LeaderboardPeriodProgressCard
            :progress="progress.week"
            period="week"
            :team-name="progress.team?.name ?? null"
          />
          <LeaderboardPeriodProgressCard
            :progress="progress.month"
            period="month"
            :team-name="progress.team?.name ?? null"
          />
        </div>
      </template>
    </template>
  </div>
</template>
