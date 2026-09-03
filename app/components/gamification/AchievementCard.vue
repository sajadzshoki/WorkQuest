<script setup lang="ts">
/**
 * One achievement in the catalogue grid. Presents the icon, title, reward and
 * — for locked achievements — how far the metric has come («۳ از ۱۰»), all
 * from server-provided values. No progress arithmetic happens here.
 */
const props = defineProps<{
  title: string
  description: string | null
  iconKey: string | null
  xpReward: number
  coinReward: number
  unlocked: boolean
  unlockedAt: string | null
  progress?: { current: number, target: number } | null
}>()

const { t } = useI18n()
const format = useLocaleFormat()

const percent = computed(() => {
  const progress = props.progress
  if (!progress || progress.target <= 0) return 0
  return Math.min(100, Math.round((progress.current / progress.target) * 100))
})
</script>

<template>
  <article
    class="wq-panel relative overflow-hidden p-5"
    :class="props.unlocked ? 'wq-anim-pop' : 'opacity-80'"
  >
    <div class="flex items-start gap-3">
      <span
        class="grid size-12 shrink-0 place-items-center rounded-xl"
        :class="props.unlocked ? 'bg-primary/12 text-primary' : 'bg-elevated text-dimmed'"
      >
        <UIcon
          :name="props.iconKey ?? 'i-heroicons-star'"
          class="size-6"
        />
      </span>

      <div class="min-w-0 flex-1">
        <h3 class="truncate text-sm font-bold text-highlighted">
          {{ props.title }}
        </h3>
        <p class="mt-1 text-xs leading-6 text-muted">
          {{ props.description }}
        </p>
      </div>
    </div>

    <!-- Locked: progress toward the metric. -->
    <div
      v-if="!props.unlocked && props.progress"
      class="mt-4"
    >
      <div class="flex items-center justify-between text-[11px]">
        <span class="text-muted">
          {{ t('gamification.progress', { current: format.number(props.progress.current), total: format.number(props.progress.target) }) }}
        </span>
        <span class="font-bold tabular-nums text-muted">
          {{ format.percent(percent) }}
        </span>
      </div>
      <UProgress
        :model-value="percent"
        size="sm"
        color="neutral"
        class="mt-1.5"
      />
    </div>

    <div class="mt-4 flex flex-wrap items-center gap-2 border-t border-default pt-3 text-[11px]">
      <UBadge
        color="primary"
        variant="subtle"
        size="sm"
      >
        +{{ format.number(props.xpReward) }} XP
      </UBadge>
      <UBadge
        color="warning"
        variant="subtle"
        size="sm"
      >
        +{{ format.number(props.coinReward) }}
      </UBadge>

      <span
        v-if="props.unlocked"
        class="ms-auto font-bold text-success"
      >
        {{ t('gamification.unlockedOn', { date: format.shortDate(props.unlockedAt ?? '') }) }}
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
</template>
