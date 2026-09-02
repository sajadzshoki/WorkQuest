<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

interface AchievementsResponse {
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
  }>
  badges: Array<{ id: string, name: string, description: string | null, imageUrl: string | null, awardedAt: string }>
  totals: { unlocked: number, available: number, badges: number }
}

const { t } = useI18n()
const format = useLocaleFormat()

const { data } = await useFetch<AchievementsResponse>(`/api/achievements`)
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

    <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="achievement in data?.achievements ?? []"
        :key="achievement.id"
        class="wq-panel relative overflow-hidden p-5"
        :class="achievement.unlocked ? '' : 'opacity-70'"
      >
        <div class="flex items-start gap-3">
          <span
            class="grid size-12 shrink-0 place-items-center rounded-xl"
            :class="achievement.unlocked ? 'bg-primary/12 text-primary' : 'bg-elevated text-dimmed'"
          >
            <UIcon
              :name="achievement.iconKey ?? 'i-heroicons-star'"
              class="size-6"
            />
          </span>

          <div class="min-w-0">
            <h3 class="truncate text-sm font-bold text-highlighted">
              {{ achievement.title }}
            </h3>
            <p class="mt-1 text-xs leading-6 text-muted">
              {{ achievement.description }}
            </p>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-2 border-t border-default pt-3 text-[11px]">
          <UBadge
            color="primary"
            variant="subtle"
            size="sm"
          >
            +{{ format.number(achievement.xpReward) }} XP
          </UBadge>
          <UBadge
            color="warning"
            variant="subtle"
            size="sm"
          >
            +{{ format.number(achievement.coinReward) }}
          </UBadge>

          <span
            v-if="achievement.unlocked"
            class="ms-auto font-bold text-success"
          >
            {{ t('gamification.unlockedOn', { date: format.shortDate(achievement.unlockedAt ?? '') }) }}
          </span>
          <span
            v-else
            class="ms-auto flex items-center gap-1 font-semibold text-dimmed"
          >
            <UIcon
              name="i-heroicons-lock-closed"
              class="size-3.5"
            />
            {{ t('gamification.locked') }}
          </span>
        </div>
      </article>
    </div>

    <CommonEmptyState
      v-if="!data?.achievements.length"
      class="wq-panel mt-6"
      icon="i-heroicons-star"
      :title="t('gamification.noAchievements')"
    />

    <template v-if="data?.badges.length">
      <h2 class="mt-8 text-lg font-bold text-highlighted">
        {{ t('gamification.badge') }}
      </h2>
      <div class="mt-3 flex flex-wrap gap-3">
        <div
          v-for="badge in data.badges"
          :key="badge.id"
          class="wq-panel flex items-center gap-3 p-3"
        >
          <span class="grid size-10 place-items-center rounded-full bg-success/12 text-success">
            <UIcon
              name="i-heroicons-shield-check"
              class="size-5"
            />
          </span>
          <div>
            <p class="text-sm font-bold text-highlighted">
              {{ badge.name }}
            </p>
            <p class="text-[11px] text-dimmed">
              {{ t('gamification.unlockedOn', { date: format.shortDate(badge.awardedAt) }) }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
