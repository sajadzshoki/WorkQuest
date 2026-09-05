<script setup lang="ts">
import type { LeaderboardMe } from '#shared/types/api'
import type { LeaderboardPeriod } from '#shared/utils/leaderboard'

/**
 * "Your position" — the one row everybody always gets.
 *
 * It is the privacy half of the design: the board shows a handful of names, and
 * your own place is always spelled out for you, with the distance to the rank
 * above (a number with no identity attached) instead of the rows around it.
 *
 * Being unranked is written as an invitation, never as a last place.
 */
const props = defineProps<{
  me: LeaderboardMe
  period: LeaderboardPeriod
  participants: number
}>()

const { t } = useI18n()
const format = useLocaleFormat()

const ranked = computed(() => props.me.rank !== null)

/** How far along the gap to the next rank already is, for the hint bar. */
const gapPercent = computed(() => {
  const gap = props.me.pointsToNextRank
  if (!gap || gap <= 0) return 100
  return Math.max(4, Math.min(96, Math.round((props.me.score / (props.me.score + gap)) * 100)))
})
</script>

<template>
  <section class="wq-panel overflow-hidden">
    <div class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
      <div
        class="grid size-16 shrink-0 place-items-center rounded-2xl text-center"
        :class="ranked ? 'bg-primary/10 text-primary' : 'bg-elevated text-muted'"
      >
        <template v-if="ranked">
          <span class="text-2xl font-black tabular-nums leading-none">
            {{ format.number(props.me.rank ?? 0) }}
          </span>
          <span class="mt-0.5 text-[9px] font-semibold opacity-80">
            {{ t('gamification.rank') }}
          </span>
        </template>
        <UIcon
          v-else
          name="i-heroicons-sparkles"
          class="size-7"
        />
      </div>

      <div class="min-w-0 flex-1">
        <p class="text-xs font-semibold text-muted">
          {{ props.me.inScope ? t('leaderboard.yourPosition') : t('leaderboard.yourTeam') }}
        </p>

        <p
          v-if="ranked"
          class="mt-0.5 text-lg font-black text-highlighted"
        >
          {{ t('leaderboard.rankOf', { rank: format.number(props.me.rank ?? 0), total: format.number(props.participants) }) }}
          <span
            v-if="props.me.rank === 1"
            class="ms-1 align-middle text-sm text-coin-500"
          >
            {{ t('leaderboard.onTop') }}
          </span>
        </p>
        <p
          v-else
          class="mt-0.5 text-sm font-bold text-highlighted"
        >
          {{ t('leaderboard.notScored') }}
        </p>

        <!--
          The hint is written for the situation the caller is actually in: an
          invitation when they have not scored, encouragement when they have,
          and a nudge towards joining a team when the board is not theirs to be
          on. Telling somebody in first place how to get on the board would be
          nonsense, so rank 1 gets no hint line at all.
        -->
        <p
          v-if="!props.me.inScope"
          class="mt-1 text-xs text-muted"
        >
          {{ t('leaderboard.noTeamHint') }}
        </p>
        <p
          v-else-if="!ranked"
          class="mt-1 text-xs text-muted"
        >
          {{ t('leaderboard.notScoredHint') }}
        </p>
        <p
          v-else-if="props.me.rank !== 1"
          class="mt-1 text-xs text-muted"
        >
          {{ t('leaderboard.rankedHint') }}
        </p>

        <div
          v-if="ranked && props.me.pointsToNextRank !== null"
          class="mt-3"
        >
          <div class="flex items-center justify-between gap-2 text-[11px]">
            <span class="font-semibold text-muted">
              {{ t('leaderboard.toNextRank', { points: format.number(props.me.pointsToNextRank ?? 0) }) }}
            </span>
            <span class="font-bold text-primary tabular-nums">{{ format.percent(gapPercent) }}</span>
          </div>
          <UProgress
            :model-value="gapPercent"
            size="sm"
            color="primary"
            class="mt-1.5"
          />
        </div>
      </div>

      <dl class="grid shrink-0 grid-cols-3 gap-2 sm:gap-3">
        <div class="rounded-xl bg-elevated/70 px-3 py-2 text-center">
          <dt class="text-[10px] text-muted">
            {{ t('leaderboard.score') }}
          </dt>
          <dd class="mt-0.5 text-base font-black tabular-nums text-highlighted">
            {{ format.number(props.me.score) }}
          </dd>
        </div>
        <div class="rounded-xl bg-elevated/70 px-3 py-2 text-center">
          <dt class="text-[10px] text-muted">
            {{ t('gamification.xp') }}
          </dt>
          <dd class="mt-0.5 text-base font-black tabular-nums text-primary">
            {{ format.compact(props.me.periodXp) }}
          </dd>
        </div>
        <div class="rounded-xl bg-elevated/70 px-3 py-2 text-center">
          <dt class="text-[10px] text-muted">
            {{ t('gamification.achievement') }}
          </dt>
          <dd class="mt-0.5 text-base font-black tabular-nums text-coin-600 dark:text-coin-300">
            {{ format.number(props.me.achievementsUnlocked) }}
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>
