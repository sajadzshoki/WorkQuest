<script setup lang="ts">
import type { ChallengeSummary } from '#shared/types/api'
import { challengePercent, daysRemaining } from '#shared/utils/challenges'

/**
 * One challenge on the board.
 *
 * Everything the card claims — the progress, the remaining time, who has
 * finished — comes from `challenge`, which the server computed from real
 * application data. The card draws a bar; it never decides a number.
 *
 * Whose bar it shows is the one honest choice this component makes: for an
 * INDIVIDUAL challenge, the caller's own; for a TEAM challenge, the shared
 * team number. A company-wide race is personal, a team push is collective.
 */
const props = defineProps<{
  challenge: ChallengeSummary
}>()

const emit = defineEmits<{
  (event: 'edit' | 'cancel' | 'participants', challenge: ChallengeSummary): void
}>()

const { t } = useI18n()
const format = useLocaleFormat()
const { typeIcon, typeLabel, goalIcon, statusTone, statusLabel } = useChallenges()

/** The number this user's bar tracks. */
const myProgress = computed(() => {
  if (props.challenge.type === 'TEAM') return props.challenge.progress
  return props.challenge.myParticipation?.progress ?? 0
})

const percent = computed(() => challengePercent(myProgress.value, props.challenge.goalValue))

const isPercentGoal = computed(() => props.challenge.goalKey !== 'tasks_completed')

/** «۳ از ۱۰ تسک» — the raw truth beside the clamped bar. */
const progressLabel = computed(() => {
  const value = format.number(myProgress.value)
  const goal = format.number(props.challenge.goalValue)
  return isPercentGoal.value
    ? t('challenges.progressPercent', { value, goal })
    : t('challenges.progressCount', { value, goal })
})

const remaining = computed(() => daysRemaining(new Date(props.challenge.endsAt), new Date()))

/** The remaining-time chip, in the tone the situation deserves. */
const time = computed(() => {
  if (props.challenge.status === 'DRAFT') {
    const days = daysRemaining(new Date(props.challenge.startsAt), new Date())
    return {
      icon: 'i-heroicons-calendar-days',
      tone: 'text-muted',
      label: t('challenges.startsIn', { days: format.number(Math.max(0, days)) }),
    }
  }
  if (props.challenge.status !== 'ACTIVE') {
    return { icon: 'i-heroicons-flag', tone: 'text-muted', label: t('challenges.finished') }
  }
  if (remaining.value < 0) {
    return { icon: 'i-heroicons-clock', tone: 'text-muted', label: t('challenges.finished') }
  }
  if (remaining.value === 0) {
    return { icon: 'i-heroicons-fire', tone: 'text-error', label: t('challenges.lastDay') }
  }
  if (remaining.value <= 3) {
    return { icon: 'i-heroicons-clock', tone: 'text-warning', label: t('challenges.endsIn', { days: format.number(remaining.value) }) }
  }
  return { icon: 'i-heroicons-clock', tone: 'text-muted', label: t('challenges.endsIn', { days: format.number(remaining.value) }) }
})

const participantsLabel = computed(() =>
  t('challenges.participantsCount', { count: format.number(props.challenge.participantsCount) }))

const completersLabel = computed(() =>
  props.challenge.completersCount > 0
    ? t('challenges.completersCount', { count: format.number(props.challenge.completersCount) })
    : '')

const isRunning = computed(() => props.challenge.status === 'ACTIVE')
const isWon = computed(() =>
  props.challenge.status === 'COMPLETED'
  || props.challenge.myParticipation?.status === 'CLAIMED'
  || props.challenge.myParticipation?.status === 'COMPLETED')

/** Accent colour of the hero strip, by status. */
const heroClass = computed(() => {
  if (props.challenge.status === 'COMPLETED') return 'from-success-500/20 to-success-500/5 text-success'
  if (props.challenge.status === 'ACTIVE') return 'from-primary-500/20 to-primary-500/5 text-primary'
  if (props.challenge.status === 'ENDED') return 'from-elevated to-transparent text-dimmed'
  if (props.challenge.status === 'CANCELLED') return 'from-error-500/15 to-error-500/5 text-error'
  return 'from-elevated to-transparent text-muted'
})

/** The bar colour follows the story, not just the status. */
const barColor = computed(() => {
  if (isWon.value) return 'success'
  if (props.challenge.status === 'ACTIVE') return 'primary'
  return 'neutral'
})
</script>

<template>
  <article
    class="wq-panel group flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg"
    :class="{ 'opacity-90': !isRunning && challenge.status !== 'COMPLETED' }"
  >
    <!-- Hero strip: the challenge's identity, coloured by how it stands. -->
    <div
      class="flex items-start justify-between gap-3 bg-gradient-to-l p-4 sm:p-5"
      :class="heroClass"
    >
      <div class="flex min-w-0 items-center gap-3">
        <span class="grid size-11 shrink-0 place-items-center rounded-2xl bg-default/60 backdrop-blur">
          <UIcon
            :name="typeIcon(challenge.type)"
            class="size-6"
          />
        </span>
        <div class="min-w-0">
          <h3 class="truncate text-sm font-black text-highlighted">
            {{ challenge.title }}
          </h3>
          <p class="mt-0.5 flex items-center gap-1 text-[11px] text-muted">
            <UIcon
              :name="goalIcon(challenge.goalKey)"
              class="size-3.5"
            />
            {{ typeLabel(challenge.type) }}
            <template v-if="challenge.team">
              · {{ challenge.team.name }}
            </template>
          </p>
        </div>
      </div>

      <UBadge
        :color="statusTone(challenge.status)"
        variant="subtle"
        size="sm"
        class="shrink-0"
      >
        {{ statusLabel(challenge.status) }}
      </UBadge>
    </div>

    <div class="flex flex-1 flex-col gap-3 p-4 sm:p-5">
      <p
        v-if="challenge.description"
        class="line-clamp-2 text-xs leading-6 text-muted"
      >
        {{ challenge.description }}
      </p>

      <!-- The bar this user is actually racing. -->
      <div>
        <div class="mb-1.5 flex items-baseline justify-between gap-2">
          <span class="text-[11px] font-semibold text-muted">
            {{ challenge.type === 'TEAM' ? t('challenges.teamProgress') : t('challenges.myProgress') }}
          </span>
          <span class="text-[11px] font-bold tabular-nums text-highlighted">
            {{ progressLabel }}
          </span>
        </div>
        <UProgress
          :model-value="percent"
          :color="barColor"
          size="md"
        />
      </div>

      <!-- Meta row: time, participants, finishers. -->
      <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px]">
        <span
          class="inline-flex items-center gap-1 font-semibold"
          :class="time.tone"
        >
          <UIcon
            :name="time.icon"
            class="size-3.5"
          />
          {{ time.label }}
        </span>

        <span class="inline-flex items-center gap-1 text-muted">
          <UIcon
            name="i-heroicons-users"
            class="size-3.5"
          />
          {{ participantsLabel }}
        </span>

        <span
          v-if="completersLabel"
          class="inline-flex items-center gap-1 font-semibold text-success"
        >
          <UIcon
            name="i-heroicons-trophy"
            class="size-3.5"
          />
          {{ completersLabel }}
        </span>
      </div>

      <!-- The prize line. -->
      <div class="mt-auto flex items-center justify-between gap-3 border-t border-default pt-3">
        <div class="flex items-center gap-1.5">
          <span
            v-if="challenge.xpReward > 0"
            class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[11px] font-black tabular-nums text-primary"
          >
            <UIcon
              name="i-heroicons-bolt"
              class="size-3.5"
            />
            +{{ format.number(challenge.xpReward) }} XP
          </span>
          <span
            v-if="challenge.coinReward > 0"
            class="inline-flex items-center gap-1 rounded-full bg-coin-500/10 px-2 py-1 text-[11px] font-black tabular-nums text-coin-600 dark:text-coin-300"
          >
            <UIcon
              name="i-heroicons-circle-stack"
              class="size-3.5"
            />
            +{{ format.number(challenge.coinReward) }}
          </span>
          <span
            v-if="challenge.xpReward === 0 && challenge.coinReward === 0"
            class="text-[11px] text-dimmed"
          >
            {{ t('challenges.noReward') }}
          </span>
        </div>

        <!-- Manager actions: the roster, the edit (before start), the way out. -->
        <div
          v-if="challenge.canManage"
          class="flex items-center gap-1"
        >
          <UTooltip :text="t('challenges.viewParticipants')">
            <UButton
              icon="i-heroicons-users"
              size="xs"
              color="neutral"
              variant="ghost"
              @click="emit('participants', challenge)"
            />
          </UTooltip>
          <UTooltip :text="t('challenges.edit')">
            <UButton
              v-if="challenge.editable"
              icon="i-heroicons-pencil-square"
              size="xs"
              color="neutral"
              variant="ghost"
              @click="emit('edit', challenge)"
            />
          </UTooltip>
          <UTooltip :text="t('challenges.cancel')">
            <UButton
              v-if="challenge.cancellable"
              icon="i-heroicons-x-circle"
              size="xs"
              color="neutral"
              variant="ghost"
              @click="emit('cancel', challenge)"
            />
          </UTooltip>
        </div>

        <!-- The quiet mark of a race already won. -->
        <span
          v-else-if="isWon"
          class="inline-flex items-center gap-1 text-[11px] font-bold text-success"
        >
          <UIcon
            name="i-heroicons-check-badge"
            class="size-4"
          />
          {{ t('challenges.won') }}
        </span>
      </div>
    </div>
  </article>
</template>
