<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

interface ProfileResponse {
  user: {
    id: string
    fullName: string
    jobTitle: string | null
    email: string | null
    phone: string | null
    avatarUrl: string | null
    role: string
  }
  level: {
    current: number
    title: string | null
    iconKey: string | null
    percent: number
    currentXp: number
    neededXp: number
    next: { level: number, title: string | null } | null
  }
  xp: { total: number, lifetimeXp: number }
  coins: { balance: number, lifetimeEarned: number, lifetimeSpent: number }
  streak: {
    current: number
    longest: number
    milestones: Array<{ days: number, reached: boolean }>
    next: number | null
  }
  badges: Array<{
    id: string
    name: string
    description: string | null
    iconKey: string | null
    tone: string | null
    imageUrl: string | null
    awardedAt: string
  }>
  achievements: Array<{
    id: string
    key: string
    title: string
    description: string | null
    iconKey: string | null
    xpReward: number
    coinReward: number
    unlocked: boolean
    unlockedAt: string | null
    progress: { current: number, target: number } | null
  }>
  totals: { unlocked: number, available: number, badges: number }
  recentActivity: Array<{
    id: string
    kind: string
    title: string | null
    xp: number
    at: string
  }>
}

const { t, te } = useI18n()
const format = useLocaleFormat()

const { data } = await useFetch<ProfileResponse>('/api/profile')

useHead({ title: t('profile.title') })

const unlockedBadges = computed(() => data.value?.badges ?? [])
const unlockedAchievements = computed(() =>
  (data.value?.achievements ?? []).filter(achievement => achievement.unlocked),
)

function activityIcon(kind: string): string {
  switch (kind) {
    case 'ACHIEVEMENT': return 'i-heroicons-star'
    case 'TASK_REVIEW': return 'i-heroicons-clipboard-document-check'
    case 'RECOGNITION': return 'i-heroicons-hand-thumb-up'
    case 'STREAK': return 'i-heroicons-fire'
    default: return 'i-heroicons-bolt'
  }
}

function activityLabel(kind: string): string {
  const key = `activity.${kind}`
  return te(key) ? t(key) : t('activity.default')
}
</script>

<template>
  <div>
    <!-- Identity -->
    <CommonSectionCard
      class="mb-4"
      icon="i-heroicons-identification"
    >
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
        <UAvatar
          :src="data?.user.avatarUrl ?? undefined"
          :text="(data?.user.fullName ?? '').charAt(0)"
          size="2xl"
        />
        <div class="min-w-0 flex-1">
          <h1 class="text-xl font-black text-highlighted">
            {{ data?.user.fullName }}
          </h1>
          <p class="mt-0.5 text-sm text-muted">
            {{ data?.user.jobTitle ?? t(`roles.${data?.user.role}`) }}
          </p>
        </div>

        <dl class="grid grid-cols-3 gap-4 sm:gap-6">
          <div>
            <dt class="text-xs text-muted">
              {{ t('gamification.level') }}
            </dt>
            <dd class="mt-0.5 text-lg font-black tabular-nums text-primary">
              {{ format.number(data?.level.current ?? 1) }}
            </dd>
          </div>
          <div>
            <dt class="text-xs text-muted">
              {{ t('gamification.coins') }}
            </dt>
            <dd class="mt-0.5 text-lg font-black tabular-nums text-coin-600 dark:text-coin-300">
              {{ format.number(data?.coins.balance ?? 0) }}
            </dd>
          </div>
          <div>
            <dt class="text-xs text-muted">
              {{ t('gamification.streak') }}
            </dt>
            <dd class="mt-0.5 text-lg font-black tabular-nums text-streak-600 dark:text-streak-400">
              {{ format.number(data?.streak.current ?? 0) }}
            </dd>
          </div>
        </dl>
      </div>
    </CommonSectionCard>

    <div class="grid gap-4 lg:grid-cols-3">
      <!-- Level & XP progress -->
      <CommonSectionCard
        class="lg:col-span-2"
        :title="t('profile.levelProgress')"
        icon="i-heroicons-arrow-trending-up"
      >
        <GamificationXpProgress
          :level="data?.level.current ?? 1"
          :title="data?.level.title"
          :percent="data?.level.percent ?? 0"
          :current-xp="data?.level.currentXp ?? 0"
          :needed-xp="data?.level.neededXp ?? 0"
        />

        <div class="mt-5 grid grid-cols-3 gap-3 border-t border-default pt-4 text-center">
          <div>
            <p class="text-xs text-muted">
              {{ t('gamification.xp') }}
            </p>
            <p class="text-lg font-black tabular-nums">
              {{ format.number(data?.xp.total ?? 0) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-muted">
              {{ t('profile.lifetimeXp') }}
            </p>
            <p class="text-lg font-black tabular-nums">
              {{ format.number(data?.xp.lifetimeXp ?? 0) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-muted">
              {{ t('profile.nextLevel') }}
            </p>
            <p class="text-lg font-black tabular-nums text-muted">
              {{ data?.level.next ? format.number(data.level.next.level) : '—' }}
            </p>
          </div>
        </div>
      </CommonSectionCard>

      <!-- Streak -->
      <GamificationStreakCard
        :current="data?.streak.current ?? 0"
        :longest="data?.streak.longest ?? 0"
        :milestones="data?.streak.milestones ?? []"
        :next="data?.streak.next ?? null"
      />
    </div>

    <!-- Badges -->
    <CommonSectionCard
      class="mt-4"
      :title="t('gamification.badge')"
      icon="i-heroicons-shield-check"
    >
      <CommonEmptyState
        v-if="!unlockedBadges.length"
        icon="i-heroicons-shield-check"
        :title="t('profile.noBadges')"
      />

      <div
        v-else
        class="flex flex-wrap gap-x-6 gap-y-4"
      >
        <GamificationBadge
          v-for="badge in unlockedBadges"
          :key="badge.id"
          :name="badge.name"
          :icon-key="badge.iconKey"
          :tone="badge.tone"
          :description="badge.description"
          :awarded-at="badge.awardedAt"
          size="lg"
        />
      </div>
    </CommonSectionCard>

    <!-- Achievements -->
    <CommonSectionCard
      class="mt-4"
      :title="t('profile.achievements')"
      icon="i-heroicons-star"
    >
      <CommonEmptyState
        v-if="!unlockedAchievements.length"
        icon="i-heroicons-star"
        :title="t('profile.noAchievements')"
      />

      <div
        v-else
        class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
      >
        <GamificationAchievementCard
          v-for="achievement in unlockedAchievements"
          :key="achievement.id"
          :title="achievement.title"
          :description="achievement.description"
          :icon-key="achievement.iconKey"
          :xp-reward="achievement.xpReward"
          :coin-reward="achievement.coinReward"
          :unlocked="true"
          :unlocked-at="achievement.unlockedAt"
        />
      </div>
    </CommonSectionCard>

    <!-- Recent activity -->
    <CommonSectionCard
      class="mt-4"
      :title="t('profile.recentActivity')"
      icon="i-heroicons-clock"
    >
      <CommonEmptyState
        v-if="!data?.recentActivity.length"
        icon="i-heroicons-clock"
        :title="t('profile.noActivity')"
      />

      <ul
        v-else
        class="divide-y divide-default"
      >
        <li
          v-for="item in data?.recentActivity ?? []"
          :key="item.id"
          class="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
        >
          <span class="grid size-9 shrink-0 place-items-center rounded-lg bg-elevated text-muted">
            <UIcon
              :name="activityIcon(item.kind)"
              class="size-4.5"
            />
          </span>

          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-highlighted">
              {{ item.title ?? activityLabel(item.kind) }}
            </p>
            <p class="text-xs text-muted">
              {{ activityLabel(item.kind) }} · {{ format.relative(item.at) }}
            </p>
          </div>

          <span
            v-if="item.xp > 0"
            class="shrink-0 text-sm font-black tabular-nums text-primary"
          >
            +{{ format.number(item.xp) }}
          </span>
        </li>
      </ul>
    </CommonSectionCard>
  </div>
</template>
