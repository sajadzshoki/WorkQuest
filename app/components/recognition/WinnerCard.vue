<script setup lang="ts">
/**
 * One sealed winner. Aggregated by design: winner + category + count, and never
 * the underlying votes.
 */
const props = defineProps<{
  winner: { fullName: string, avatarUrl: string | null, jobTitle: string | null }
  categoryName: string
  categoryIcon: string | null
  tone: string | null
  titleName: string | null
  voteCount: number
  xpReward: number
  coinReward: number
}>()

const { t } = useI18n()
const format = useLocaleFormat()

type Tone = 'primary' | 'coin' | 'streak' | 'success' | 'info' | 'warning' | 'neutral'

const tones: Record<Tone, string> = {
  primary: 'bg-primary/12 text-primary',
  coin: 'bg-coin-500/12 text-coin-600 dark:text-coin-300',
  streak: 'bg-streak-500/12 text-streak-600 dark:text-streak-400',
  success: 'bg-success/12 text-success',
  info: 'bg-info/12 text-info',
  warning: 'bg-warning/12 text-warning',
  neutral: 'bg-elevated text-muted',
}

const tileClass = computed(() => {
  const tone = props.tone
  return tone && tone in tones ? tones[tone as Tone] : tones.primary
})
</script>

<template>
  <article class="wq-panel wq-anim-pop flex flex-col items-center gap-2 p-5 text-center">
    <span
      class="grid size-8 place-items-center rounded-lg text-[10px] font-black text-muted"
      :class="tileClass"
    >
      <UIcon
        :name="props.categoryIcon ?? 'i-heroicons-sparkles'"
        class="size-4.5"
      />
    </span>

    <UAvatar
      :src="props.winner.avatarUrl ?? undefined"
      :text="props.winner.fullName.charAt(0)"
      size="lg"
    />

    <div>
      <p class="truncate text-sm font-bold text-highlighted">
        {{ props.winner.fullName }}
      </p>
      <p class="truncate text-[11px] text-muted">
        {{ props.categoryName }}
      </p>
    </div>

    <UBadge
      v-if="props.titleName"
      color="neutral"
      variant="soft"
      size="sm"
    >
      {{ props.titleName }}
    </UBadge>

    <div class="flex items-center gap-1.5 text-[11px] text-dimmed">
      <UIcon
        name="i-heroicons-user-group"
        class="size-3.5"
      />
      <span class="font-bold tabular-nums text-highlighted">
        {{ format.number(props.voteCount) }}
      </span>
      <span>{{ t('recognition.votes', { count: format.number(props.voteCount) }) }}</span>
    </div>

    <div
      v-if="props.xpReward > 0 || props.coinReward > 0"
      class="flex items-center gap-1.5"
    >
      <span
        v-if="props.xpReward > 0"
        class="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-primary"
      >
        +{{ format.number(props.xpReward) }} XP
      </span>
      <span
        v-if="props.coinReward > 0"
        class="rounded-md bg-coin-500/12 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-coin-600 dark:text-coin-300"
      >
        +{{ format.number(props.coinReward) }}
      </span>
    </div>
  </article>
</template>
