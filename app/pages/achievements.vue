<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

interface AchievementsResponse {
  streak: {
    current: number
    longest: number
    milestones: Array<{ days: number, reached: boolean }>
    next: number | null
  }
  achievements: Array<{
    id: string
    key: string
    title: string
    description: string | null
    type: string
    xpReward: number
    coinReward: number
    iconKey: string | null
    unlocked: boolean
    unlockedAt: string | null
    progress: { current: number, target: number } | null
  }>
  badges: Array<{
    id: string
    name: string
    description: string | null
    iconKey: string | null
    tone: string | null
    imageUrl: string | null
    awardedAt: string
  }>
  totals: { unlocked: number, available: number, badges: number }
}

const { t } = useI18n()
const format = useLocaleFormat()

const { data } = await useFetch<AchievementsResponse>('/api/achievements')
</script>

<template>
  <div>
    <CommonPageHeader
      :title="t('achievements.title')"
      :subtitle="t('achievements.subtitle')"
    />

    <div class="grid gap-4 sm:grid-cols-3">
      <GamificationStatTile
        :label="t('gamification.achievement')"
        :value="`${format.number(data?.totals.unlocked ?? 0)} / ${format.number(data?.totals.available ?? 0)}`"
        icon="i-heroicons-star"
        tone="primary"
      />
      <GamificationStatTile
        :label="t('gamification.badge')"
        :value="format.number(data?.totals.badges ?? 0)"
        icon="i-heroicons-shield-check"
        tone="success"
      />
      <GamificationStatTile
        :label="t('gamification.locked')"
        :value="format.number(Math.max(0, (data?.totals.available ?? 0) - (data?.totals.unlocked ?? 0)))"
        icon="i-heroicons-lock-closed"
        tone="neutral"
      />
    </div>

    <div class="mt-4 grid gap-4 lg:grid-cols-3">
      <GamificationStreakCard
        class="lg:col-span-1"
        :current="data?.streak.current ?? 0"
        :longest="data?.streak.longest ?? 0"
        :milestones="data?.streak.milestones ?? []"
        :next="data?.streak.next ?? null"
      />

      <div class="lg:col-span-2">
        <CommonEmptyState
          v-if="!data?.achievements.length"
          class="wq-panel"
          icon="i-heroicons-star"
          :title="t('gamification.noAchievements')"
        />

        <div
          v-else
          class="grid gap-3 sm:grid-cols-2"
        >
          <GamificationAchievementCard
            v-for="achievement in data?.achievements ?? []"
            :key="achievement.id"
            :title="achievement.title"
            :description="achievement.description"
            :icon-key="achievement.iconKey"
            :xp-reward="achievement.xpReward"
            :coin-reward="achievement.coinReward"
            :unlocked="achievement.unlocked"
            :unlocked-at="achievement.unlockedAt"
            :progress="achievement.progress"
          />
        </div>
      </div>
    </div>

    <template v-if="data?.badges.length">
      <h2 class="mt-8 text-lg font-bold text-highlighted">
        {{ t('gamification.badge') }}
      </h2>
      <div class="mt-3 flex flex-wrap gap-x-6 gap-y-4">
        <GamificationBadge
          v-for="badge in data.badges"
          :key="badge.id"
          :name="badge.name"
          :icon-key="badge.iconKey"
          :tone="badge.tone"
          :description="badge.description"
          :awarded-at="badge.awardedAt"
          size="lg"
        />
      </div>
    </template>
  </div>
</template>
