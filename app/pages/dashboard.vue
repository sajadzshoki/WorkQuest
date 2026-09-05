<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

interface DashboardSummary {
  gamification: {
    xp: number
    coins: number
    level: number
    levelTitle: string | null
    levelPercent: number
    levelCurrentXp: number
    levelNeededXp: number
    currentStreak: number
    longestStreak: number
    /** This week's rank on the windowed board; null before you have scored. */
    rank: number | null
    pointsToNextRank: number | null
    achievementsUnlocked: number
  }
  tasks: {
    /** Per-status counts. The task lists themselves live in `TasksTaskDashboard`. */
    counts: Record<string, number>
  }
  /** The weekly board — the same rows `/api/leaderboard` serves, capped at three. */
  leaderboard: {
    period: 'week' | 'month'
    window: { key: string, startsAt: string, endsAt: string, endsInDays: number }
    participants: number
    entries: Array<{
      rank: number
      tied: boolean
      score: number
      periodXp: number
      achievementsUnlocked: number
      isMe: boolean
      user: { id: string, fullName: string, avatarUrl: string | null, jobTitle: string | null, role: string }
    }>
  }
  recognitions: Array<{
    id: string
    message: string
    type: string
    createdAt: string
    fromUser: { fullName: string, avatarUrl: string | null }
  }>
  activeChallenge: null | {
    id: string
    title: string
    goalValue: number
    xpReward: number
    coinReward: number
    endsAt: string
  }
}

const { t } = useI18n()
const localePath = useLocalePath()
const { user } = useSession()
const format = useLocaleFormat()

const { data, status, refresh } = await useFetch<DashboardSummary>(`/api/dashboard/summary`)

// The wallet is its own endpoint so the coin balance and the ledger shown here
// are the same authoritative rows the wallet page renders.
const { data: wallet } = await useFetch('/api/wallet')

const stats = computed(() => {
  const counts = data.value?.tasks.counts ?? {}
  return [
    {
      label: t('dashboard.openTasks'),
      value: format.number(
        (counts.TODO ?? 0) + (counts.IN_PROGRESS ?? 0) + (counts.NEEDS_REVISION ?? 0) + (counts.SUBMITTED ?? 0),
      ),
      icon: 'i-heroicons-clipboard-document-list',
      tone: 'primary' as const,
    },
    {
      label: t('dashboard.completedTasks'),
      value: format.number(counts.APPROVED ?? 0),
      icon: 'i-heroicons-check-circle',
      tone: 'success' as const,
    },
    {
      label: t('gamification.coins'),
      value: format.number(data.value?.gamification.coins ?? 0),
      icon: 'i-heroicons-circle-stack-solid',
      tone: 'coin' as const,
    },
    {
      label: t('gamification.streak'),
      value: format.number(data.value?.gamification.currentStreak ?? 0),
      icon: 'i-heroicons-fire-solid',
      tone: 'streak' as const,
    },
  ]
})

function daysUntil(date: string): number {
  return Math.max(0, Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000))
}
</script>

<template>
  <div>
    <CommonPageHeader
      :title="t('dashboard.greeting', { name: user?.fullName ?? '' })"
      :subtitle="t('dashboard.subtitle')"
    >
      <template #actions>
        <UButton
          color="neutral"
          variant="outline"
          icon="i-heroicons-arrow-path"
          :loading="status === 'pending'"
          @click="refresh()"
        >
          {{ t('common.retry') }}
        </UButton>
      </template>
    </CommonPageHeader>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <GamificationStatTile
        v-for="stat in stats"
        :key="stat.label"
        v-bind="stat"
      />
    </div>

    <div class="mt-4 grid gap-4 lg:grid-cols-3">
      <div class="space-y-4 lg:col-span-2">
        <CommonSectionCard
          :title="t('dashboard.yourProgress')"
          icon="i-heroicons-arrow-trending-up"
        >
          <GamificationXpProgress
            :level="data?.gamification.level ?? 1"
            :title="data?.gamification.levelTitle"
            :percent="data?.gamification.levelPercent ?? 0"
            :current-xp="data?.gamification.levelCurrentXp ?? 0"
            :needed-xp="data?.gamification.levelNeededXp ?? 0"
          />

          <div class="mt-5 grid grid-cols-3 gap-3 border-t border-default pt-4">
            <div>
              <p class="text-xs text-muted">
                {{ t('gamification.xp') }}
              </p>
              <p class="text-lg font-black tabular-nums">
                {{ format.number(data?.gamification.xp ?? 0) }}
              </p>
            </div>
            <div>
              <p class="text-xs text-muted">
                {{ t('gamification.achievement') }}
              </p>
              <p class="text-lg font-black tabular-nums">
                {{ format.number(data?.gamification.achievementsUnlocked ?? 0) }}
              </p>
            </div>
            <div>
              <p class="text-xs text-muted">
                {{ t('dashboard.myRank') }}
              </p>
              <p
                v-if="data?.gamification.rank !== null && data?.gamification.rank !== undefined"
                class="text-lg font-black tabular-nums"
              >
                {{ format.number(data?.gamification.rank ?? 0) }}
              </p>
              <p
                v-else
                class="truncate text-xs font-bold text-muted"
              >
                {{ t('dashboard.noRank') }}
              </p>
              <p
                v-if="data?.gamification.pointsToNextRank"
                class="mt-0.5 truncate text-[10px] text-primary"
              >
                {{ t('dashboard.toNextRank', { points: format.number(data.gamification.pointsToNextRank) }) }}
              </p>
            </div>
          </div>
        </CommonSectionCard>

        <!--
          Real task surfaces. Everything task-related — today's work, active
          items, pending submissions, upcoming deadlines and, for managers, the
          review queue and team completion — is owned by this component and its
          own endpoint, so the gamification summary above stays a summary.
        -->
        <TasksTaskDashboard />
      </div>

      <div class="space-y-4">
        <!--
          Wallet snapshot. The coin balance and the ledger rows behind it come
          from `/api/wallet`, so this shows the same authoritative numbers as
          the wallet page rather than a second, drifting copy.
        -->
        <GamificationProgressCard
          :wallet="wallet"
          compact
        />

        <CommonSectionCard
          v-if="data?.activeChallenge"
          :title="t('dashboard.activeChallenge')"
          icon="i-heroicons-flag"
        >
          <p class="text-sm font-bold text-highlighted">
            {{ data.activeChallenge.title }}
          </p>
          <p class="mt-1 text-xs text-muted">
            {{ t('dashboard.challengeGoal', { goal: format.number(data.activeChallenge.goalValue) }) }}
          </p>
          <UProgress
            :model-value="30"
            color="primary"
            size="sm"
            class="mt-3"
          />
          <div class="mt-3 flex items-center justify-between text-[11px] text-dimmed">
            <span>{{ t('dashboard.endsIn', { days: format.number(daysUntil(data.activeChallenge.endsAt)) }) }}</span>
            <span class="font-bold text-primary tabular-nums">
              +{{ format.number(data.activeChallenge.xpReward) }} XP
            </span>
          </div>
        </CommonSectionCard>

        <CommonSectionCard
          :title="t('dashboard.topPerformers')"
          icon="i-heroicons-trophy"
          :to="localePath('/leaderboard')"
          :to-label="t('leaderboard.title')"
        >
          <CommonEmptyState
            v-if="!data?.leaderboard.entries.length"
            icon="i-heroicons-trophy"
            :title="t('leaderboard.noData')"
            :description="t('leaderboard.noDataHint')"
          />
          <template v-else>
            <ol class="space-y-2.5">
              <li
                v-for="entry in data.leaderboard.entries"
                :key="entry.user.id"
                class="flex items-center gap-3 rounded-lg px-2 py-1.5"
                :class="entry.isMe ? 'bg-primary/8' : ''"
              >
                <LeaderboardRankMedal
                  :rank="entry.rank"
                  :tied="entry.tied"
                  size="sm"
                />
                <UAvatar
                  :src="entry.user.avatarUrl ?? undefined"
                  :text="entry.user.fullName.charAt(0)"
                  size="sm"
                />
                <span class="min-w-0 flex-1 truncate text-sm font-medium">{{ entry.user.fullName }}</span>
                <span class="text-xs font-bold text-muted tabular-nums">
                  {{ format.number(entry.score) }}
                </span>
              </li>
            </ol>

            <p class="mt-3 border-t border-default pt-2.5 text-[11px] text-dimmed">
              {{ t('leaderboard.endsIn', { days: format.number(data.leaderboard.window.endsInDays) }) }}
              · {{ t('leaderboard.participants', { count: format.number(data.leaderboard.participants) }) }}
            </p>
          </template>
        </CommonSectionCard>

        <CommonSectionCard
          :title="t('dashboard.recentRecognition')"
          icon="i-heroicons-heart"
        >
          <CommonEmptyState
            v-if="!data?.recognitions.length"
            icon="i-heroicons-heart"
            :title="t('dashboard.noRecognition')"
          />
          <ul
            v-else
            class="space-y-3"
          >
            <li
              v-for="item in data.recognitions"
              :key="item.id"
              class="rounded-lg bg-elevated/60 p-3"
            >
              <p class="text-sm leading-6 text-highlighted">
                «{{ item.message }}»
              </p>
              <p class="mt-1.5 text-[11px] text-dimmed">
                {{ item.fromUser.fullName }} · {{ format.relative(item.createdAt) }}
              </p>
            </li>
          </ul>
        </CommonSectionCard>
      </div>
    </div>
  </div>
</template>
