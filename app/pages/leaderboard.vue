<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

interface LeaderboardResponse {
  range: 'week' | 'month' | 'all'
  items: Array<{
    rank: number
    xp: number
    coins: number
    currentStreak: number
    isMe: boolean
    user: { id: string, fullName: string, avatarUrl: string | null, jobTitle: string | null, role: string }
  }>
  me: { userId: string, rank: number, xp: number }
}

const { t } = useI18n()
const format = useLocaleFormat()

const range = ref<'week' | 'month' | 'all'>('month')
const query = computed(() => ({ range: range.value, limit: 20 }))

const { data } = await useFetch<LeaderboardResponse>(`/api/leaderboard`, { query, watch: [query] })

const ranges = ['week', 'month', 'all'] as const

function rankStyle(rank: number): string {
  if (rank === 1) return 'bg-coin-400 text-white'
  if (rank === 2) return 'bg-slate-300 text-slate-800'
  if (rank === 3) return 'bg-amber-700 text-white'
  return 'bg-elevated text-muted'
}
</script>

<template>
  <div>
    <CommonPageHeader
      :title="t('leaderboard.title')"
      :subtitle="t('leaderboard.subtitle')"
    >
      <template #actions>
        <UTabs
          :items="ranges.map((value) => ({ label: t(`leaderboard.range.${value}`), value }))"
          :content="false"
          :model-value="range"
          value-key="value"
          @update:model-value="range = ($event as 'week' | 'month' | 'all')"
        />
      </template>
    </CommonPageHeader>

    <div class="wq-panel mb-4 flex items-center justify-between gap-3 p-4">
      <div>
        <p class="text-xs text-muted">
          {{ t('leaderboard.yourPosition') }}
        </p>
        <p class="text-2xl font-black tabular-nums text-highlighted">
          {{ format.number(data?.me.rank ?? 0) }}
        </p>
      </div>
      <div class="text-end">
        <p class="text-xs text-muted">
          {{ t('gamification.xp') }}
        </p>
        <p class="text-2xl font-black tabular-nums text-primary">
          {{ format.number(data?.me.xp ?? 0) }}
        </p>
      </div>
    </div>

    <CommonEmptyState
      v-if="!data?.items.length"
      class="wq-panel"
      icon="i-heroicons-trophy"
      :title="t('leaderboard.noData')"
    />

    <ol
      v-else
      class="wq-panel divide-y divide-default"
    >
      <li
        v-for="entry in data.items"
        :key="entry.user.id"
        class="flex items-center gap-3 px-4 py-3.5"
        :class="entry.isMe ? 'bg-primary/8' : ''"
      >
        <span
          class="grid size-8 shrink-0 place-items-center rounded-lg text-sm font-black tabular-nums"
          :class="rankStyle(entry.rank)"
        >
          {{ format.number(entry.rank) }}
        </span>

        <UAvatar
          :src="entry.user.avatarUrl ?? undefined"
          :text="entry.user.fullName.charAt(0)"
          size="md"
        />

        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-bold text-highlighted">
            {{ entry.user.fullName }}
          </p>
          <p class="truncate text-xs text-muted">
            {{ entry.user.jobTitle ?? t(`roles.${entry.user.role}`) }}
          </p>
        </div>

        <GamificationStreakPill :value="entry.currentStreak" />

        <div class="w-20 text-end">
          <p class="text-sm font-black tabular-nums text-primary">
            {{ format.compact(entry.xp) }}
          </p>
          <p class="text-[11px] text-dimmed">
            {{ t('leaderboard.points') }}
          </p>
        </div>
      </li>
    </ol>
  </div>
</template>
