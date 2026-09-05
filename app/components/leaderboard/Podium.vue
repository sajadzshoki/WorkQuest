<script setup lang="ts">
import type { LeaderboardEntry } from '#shared/types/api'

/**
 * The podium — the top three, and only the top three.
 *
 * Rendered second / first / third in the DOM so that in RTL the leader stands in
 * the middle with the runner-up on the right, and the block heights read as a
 * podium in either direction. Styling follows the *position* in the list rather
 * than the rank number, so a tie at the top (two people sharing rank 1) still
 * renders three balanced steps instead of two gold ones and a gap.
 *
 * Every step carries the same information as a row below it: rank, avatar, name,
 * level, the XP earned inside the period and the achievements unlocked in it.
 */
const props = defineProps<{ entries: LeaderboardEntry[] }>()

const { t } = useI18n()
const format = useLocaleFormat()

/** Visual order: runner-up, leader, third. */
const steps = computed(() => {
  const [first, second, third] = props.entries
  return [second, first, third].filter((entry): entry is LeaderboardEntry => Boolean(entry))
})

/** Which visual step an entry sits on — the centre one is the tallest. */
function positionOf(entry: LeaderboardEntry): number {
  return steps.value.findIndex(step => step.user.id === entry.user.id)
}

const heights = ['h-16 sm:h-20', 'h-24 sm:h-28', 'h-12 sm:h-14']
const tones = [
  'from-slate-400/20 to-slate-400/5 text-slate-600 dark:text-slate-300',
  'from-coin-400/25 to-coin-500/5 text-coin-600 dark:text-coin-300',
  'from-amber-700/20 to-amber-700/5 text-amber-700 dark:text-amber-400',
]
const rings = ['ring-slate-300', 'ring-coin-400', 'ring-amber-700/70']
</script>

<template>
  <div class="flex items-end justify-center gap-2.5 sm:gap-5">
    <div
      v-for="entry in steps"
      :key="entry.user.id"
      class="flex w-28 shrink-0 flex-col items-center gap-2 sm:w-40"
    >
      <div class="flex w-full flex-col items-center gap-1.5 text-center">
        <div class="relative">
          <UAvatar
            :src="entry.user.avatarUrl ?? undefined"
            :text="entry.user.fullName.charAt(0)"
            :size="positionOf(entry) === 1 ? 'xl' : 'lg'"
            class="ring-2 ring-offset-2 ring-offset-transparent"
            :class="rings[positionOf(entry)] ?? 'ring-transparent'"
          />
          <span
            class="absolute -bottom-1 -end-1 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-black text-inverted tabular-nums"
            :title="t('leaderboard.levelLabel', { level: format.number(entry.level) })"
          >
            {{ format.number(entry.level) }}
          </span>
        </div>

        <p
          class="w-full truncate text-xs font-bold sm:text-sm"
          :class="entry.isMe ? 'text-primary' : 'text-highlighted'"
        >
          {{ entry.isMe ? `${entry.user.fullName} · ${t('leaderboard.you')}` : entry.user.fullName }}
        </p>
        <p class="w-full truncate text-[10px] text-muted sm:text-[11px]">
          {{ entry.user.jobTitle ?? entry.levelTitle ?? t(`roles.${entry.user.role}`) }}
        </p>

        <LeaderboardAchievementChips
          :achievements="entry.achievements"
          :total="entry.achievementsUnlocked"
        />
      </div>

      <div
        class="relative flex w-full flex-col items-center gap-0.5 overflow-hidden rounded-t-xl bg-gradient-to-b pt-2"
        :class="[tones[positionOf(entry)] ?? 'from-primary/10 to-transparent text-primary', heights[positionOf(entry)] ?? 'h-12']"
      >
        <span class="text-lg font-black tabular-nums sm:text-2xl">
          {{ format.number(entry.rank) }}
        </span>
        <span
          v-if="entry.tied"
          class="text-[9px] font-bold opacity-80"
        >
          {{ t('leaderboard.tied') }}
        </span>
        <span class="mt-auto mb-1.5 text-[11px] font-black tabular-nums text-highlighted sm:text-xs">
          {{ format.number(entry.score) }} {{ t('leaderboard.points') }}
        </span>

        <UIcon
          v-if="positionOf(entry) === 1"
          name="i-heroicons-trophy-solid"
          class="pointer-events-none absolute -bottom-4 size-16 opacity-10"
        />
      </div>
    </div>
  </div>
</template>
