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
    rank: number
    achievementsUnlocked: number
  }
  tasks: {
    open: Array<{
      id: string
      title: string
      status: string
      priority: string
      dueDate: string | null
      xpReward: number
      coinReward: number
    }>
    counts: Record<string, number>
  }
  leaderboard: Array<{
    rank: number
    xp: number
    user: { id: string, fullName: string, avatarUrl: string | null, jobTitle: string | null }
  }>
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

const stats = computed(() => {
  const counts = data.value?.tasks.counts ?? {}
  return [
    {
      label: t('dashboard.openTasks'),
      value: format.number(
        (counts.ASSIGNED ?? 0) + (counts.IN_PROGRESS ?? 0) + (counts.SUBMITTED ?? 0),
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

function dueLabel(dueDate: string | null): string {
  if (!dueDate) return t('tasks.noDueDate')
  const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / 86_400_000)
  if (days === 0) return t('tasks.dueToday')
  if (days > 0) return t('tasks.dueIn', { days: format.number(days) })
  return t('tasks.overdue', { days: format.number(Math.abs(days)) })
}

function isOverdue(dueDate: string | null): boolean {
  return Boolean(dueDate) && new Date(dueDate as string).getTime() < Date.now()
}

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
              <p class="text-lg font-black tabular-nums">
                {{ format.number(data?.gamification.rank ?? 0) }}
              </p>
            </div>
          </div>
        </CommonSectionCard>

        <CommonSectionCard
          :title="t('dashboard.myTasks')"
          icon="i-heroicons-clipboard-document-list"
          :to="localePath('/tasks')"
          :to-label="t('common.viewAll')"
        >
          <CommonEmptyState
            v-if="!data?.tasks.open.length"
            icon="i-heroicons-check-circle"
            :title="t('dashboard.noOpenTasks')"
          />

          <ul
            v-else
            class="divide-y divide-default"
          >
            <li
              v-for="task in data.tasks.open"
              :key="task.id"
              class="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
            >
              <span
                class="mt-1 grid size-8 shrink-0 place-items-center rounded-lg"
                :class="isOverdue(task.dueDate) ? 'bg-error/12 text-error' : 'bg-elevated text-muted'"
              >
                <UIcon
                  name="i-heroicons-clipboard-document"
                  class="size-4"
                />
              </span>

              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold text-highlighted">
                  {{ task.title }}
                </p>
                <div class="mt-1.5 flex flex-wrap items-center gap-2">
                  <GamificationTaskStatusBadge :status="task.status" />
                  <GamificationPriorityBadge :priority="task.priority" />
                  <span
                    class="text-[11px]"
                    :class="isOverdue(task.dueDate) ? 'font-bold text-error' : 'text-dimmed'"
                  >
                    {{ dueLabel(task.dueDate) }}
                  </span>
                </div>
              </div>

              <div class="hidden shrink-0 flex-col items-end gap-1 text-[11px] text-muted sm:flex">
                <span class="font-bold text-primary tabular-nums">
                  +{{ format.number(task.xpReward) }} XP
                </span>
                <span class="font-bold text-coin-600 dark:text-coin-300 tabular-nums">
                  +{{ format.number(task.coinReward) }}
                </span>
              </div>
            </li>
          </ul>
        </CommonSectionCard>
      </div>

      <div class="space-y-4">
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
          :to-label="t('common.viewAll')"
        >
          <CommonEmptyState
            v-if="!data?.leaderboard.length"
            icon="i-heroicons-trophy"
            :title="t('leaderboard.noData')"
          />
          <ol
            v-else
            class="space-y-2.5"
          >
            <li
              v-for="entry in data.leaderboard"
              :key="entry.user.id"
              class="flex items-center gap-3 rounded-lg px-2 py-1.5"
              :class="entry.user.id === user?.id ? 'bg-primary/8' : ''"
            >
              <span
                class="grid size-6 shrink-0 place-items-center rounded-md text-[11px] font-black tabular-nums"
                :class="entry.rank === 1 ? 'bg-coin-400 text-white' : 'bg-elevated text-muted'"
              >
                {{ format.number(entry.rank) }}
              </span>
              <UAvatar
                :src="entry.user.avatarUrl ?? undefined"
                :text="entry.user.fullName.charAt(0)"
                size="sm"
              />
              <span class="min-w-0 flex-1 truncate text-sm font-medium">{{ entry.user.fullName }}</span>
              <span class="text-xs font-bold text-muted tabular-nums">
                {{ format.compact(entry.xp) }}
              </span>
            </li>
          </ol>
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
