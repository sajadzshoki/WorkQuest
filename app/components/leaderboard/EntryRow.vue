<script setup lang="ts">
import type { LeaderboardEntry } from '#shared/types/api'

/**
 * One board row below the podium (ranks 4 and 5), and the caller's own row when
 * they are inside the visible list.
 *
 * The layout is deliberately identical to the podium's information set — rank,
 * avatar, name, level, XP, achievements — so moving between the two reads as one
 * list rather than two different things.
 */
const props = defineProps<{ entry: LeaderboardEntry }>()

const { t } = useI18n()
const format = useLocaleFormat()
</script>

<template>
  <li
    class="flex items-center gap-3 px-3 py-3 transition-colors sm:px-4"
    :class="props.entry.isMe ? 'bg-primary/8' : ''"
  >
    <LeaderboardRankMedal
      :rank="props.entry.rank"
      :tied="props.entry.tied"
    />

    <div class="relative shrink-0">
      <UAvatar
        :src="props.entry.user.avatarUrl ?? undefined"
        :text="props.entry.user.fullName.charAt(0)"
        size="md"
      />
      <span
        class="absolute -bottom-1 -end-1 grid size-4 place-items-center rounded-full bg-elevated text-[9px] font-black text-muted tabular-nums ring-1 ring-default"
        :title="t('leaderboard.levelLabel', { level: format.number(props.entry.level) })"
      >
        {{ format.number(props.entry.level) }}
      </span>
    </div>

    <div class="min-w-0 flex-1">
      <p class="flex items-center gap-1.5 truncate text-sm font-bold text-highlighted">
        <span class="truncate">{{ props.entry.user.fullName }}</span>
        <span
          v-if="props.entry.isMe"
          class="shrink-0 rounded-full bg-primary/12 px-1.5 py-0.5 text-[10px] font-bold text-primary"
        >
          {{ t('leaderboard.you') }}
        </span>
      </p>
      <p class="truncate text-[11px] text-muted">
        {{ props.entry.user.jobTitle ?? props.entry.levelTitle ?? t(`roles.${props.entry.user.role}`) }}
        <span class="text-dimmed"> · {{ t('leaderboard.totalXp') }} {{ format.compact(props.entry.totalXp) }}</span>
      </p>
    </div>

    <div class="hidden sm:block">
      <LeaderboardAchievementChips
        :achievements="props.entry.achievements"
        :total="props.entry.achievementsUnlocked"
      />
    </div>

    <GamificationStreakPill
      v-if="props.entry.currentStreak > 0"
      :value="props.entry.currentStreak"
      class="hidden md:inline-flex"
    />

    <div class="w-20 shrink-0 text-end">
      <p class="text-sm font-black tabular-nums text-primary">
        {{ format.number(props.entry.score) }}
      </p>
      <p class="text-[10px] text-dimmed">
        {{ t('leaderboard.points') }} · {{ format.compact(props.entry.periodXp) }} XP
      </p>
    </div>
  </li>
</template>
