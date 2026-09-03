<script setup lang="ts">
import type { TaskSummary } from '#shared/types/api'
import type { TaskAction } from '#shared/utils/task'

/**
 * The task card — the primary unit of the whole product surface.
 *
 * Layout notes for RTL: the card is built entirely from logical properties
 * (`ps-*`, `pe-*`, `text-start`, `border-s`) rather than left/right ones, so it
 * mirrors correctly without a single direction-specific override. The status
 * stripe sits on the inline-start edge, which is the *right* edge in Persian.
 *
 * On mobile the action row becomes full-width buttons; the card never relies
 * on hover to reveal an affordance.
 */
const props = withDefaults(
  defineProps<{
    task: TaskSummary
    /** Hide the assignee chip on boards that are already one person's list. */
    hideAssignee?: boolean
    /** Compact mode for dense dashboard columns. */
    compact?: boolean
    busy?: boolean
  }>(),
  { hideAssignee: false, compact: false, busy: false },
)

const emit = defineEmits<{
  action: [action: TaskAction, task: TaskSummary]
}>()

const { t } = useI18n()
const format = useLocaleFormat()
const localePath = useLocalePath()
const { actionsFor } = useTaskActions()
const due = useDueLabel()

const actions = computed(() => actionsFor(props.task))

/**
 * One primary action per card. Reviewing is a two-field decision (score,
 * feedback) so it opens the detail page instead of firing inline — a one-tap
 * "approve" from a list is exactly how work gets rubber-stamped.
 */
const primaryAction = computed<TaskAction | null>(() => {
  if (actions.value.includes('start')) return 'start'
  if (actions.value.includes('submit')) return 'submit'
  return null
})

const needsReview = computed(() => actions.value.includes('approve'))

/** The inline-start stripe colour mirrors the status badge. */
const stripe = computed(() => ({
  TODO: 'bg-muted',
  IN_PROGRESS: 'bg-primary',
  SUBMITTED: 'bg-info',
  NEEDS_REVISION: 'bg-warning',
  APPROVED: 'bg-success',
}[props.task.status] ?? 'bg-muted'))

const progressColor = computed(() => (props.task.status === 'APPROVED' ? 'success' : 'primary'))
</script>

<template>
  <article
    class="wq-panel relative overflow-hidden ps-4 transition-shadow hover:shadow-lifted"
    :class="props.compact ? 'p-3 ps-4' : 'p-4 ps-5'"
  >
    <!-- Status stripe on the inline-start edge (right in RTL). -->
    <span
      class="absolute inset-y-0 start-0 w-1"
      :class="stripe"
      aria-hidden="true"
    />

    <div class="flex flex-col gap-3">
      <!-- Badges -->
      <div class="flex flex-wrap items-center gap-2">
        <GamificationTaskStatusBadge :status="props.task.status" />
        <GamificationPriorityBadge :priority="props.task.priority" />
        <span
          v-if="props.task.team"
          class="truncate rounded-md bg-elevated px-2 py-0.5 text-[11px] text-muted"
        >{{ props.task.team.name }}</span>
        <span
          v-if="props.task.revisionCount > 0"
          class="inline-flex items-center gap-1 rounded-md bg-warning/12 px-2 py-0.5 text-[11px] font-bold text-warning"
        >
          <UIcon
            name="i-heroicons-arrow-path"
            class="size-3"
          />
          {{ format.number(props.task.revisionCount) }}
        </span>
      </div>

      <!-- Title + description -->
      <div class="min-w-0">
        <NuxtLink
          :to="localePath(`/tasks/${props.task.id}`)"
          class="block text-start text-base font-bold text-highlighted transition-colors hover:text-primary"
        >
          {{ props.task.title }}
        </NuxtLink>
        <p
          v-if="props.task.description && !props.compact"
          class="mt-1 line-clamp-2 text-xs leading-6 text-muted"
        >
          {{ props.task.description }}
        </p>
      </div>

      <!-- Progress, while the work is in flight -->
      <div
        v-if="props.task.status === 'IN_PROGRESS' || props.task.status === 'NEEDS_REVISION'"
        class="flex items-center gap-2"
      >
        <UProgress
          :model-value="props.task.progress"
          :color="progressColor"
          size="sm"
          class="min-w-0 flex-1"
        />
        <span class="shrink-0 text-[11px] font-bold text-muted tabular-nums">
          {{ t('tasks.progressValue', { value: format.number(props.task.progress) }) }}
        </span>
      </div>

      <!-- Meta row -->
      <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-dimmed">
        <span
          v-if="props.task.assignee && !props.hideAssignee"
          class="flex min-w-0 items-center gap-1.5"
        >
          <UAvatar
            :src="props.task.assignee.avatarUrl ?? undefined"
            :text="props.task.assignee.fullName.charAt(0)"
            size="3xs"
          />
          <span class="truncate">{{ props.task.assignee.fullName }}</span>
        </span>

        <span
          class="flex items-center gap-1"
          :class="props.task.isOverdue ? 'font-bold text-error' : ''"
          :title="due.exact(props.task.dueDate)"
        >
          <UIcon
            :name="props.task.isOverdue ? 'i-heroicons-exclamation-circle' : 'i-heroicons-calendar-days'"
            class="size-3.5"
          />
          {{ due.label(props.task.dueDate) }}
        </span>

        <span
          v-if="props.task.estimatedHours"
          class="flex items-center gap-1"
        >
          <UIcon
            name="i-heroicons-clock"
            class="size-3.5"
          />
          {{ t('tasks.estimateHours', { hours: format.number(props.task.estimatedHours, 2) }) }}
        </span>

        <span
          v-if="props.task.commentCount > 0"
          class="flex items-center gap-1"
        >
          <UIcon
            name="i-heroicons-chat-bubble-left-ellipsis"
            class="size-3.5"
          />
          {{ format.number(props.task.commentCount) }}
        </span>

        <span
          v-if="props.task.attachmentCount > 0"
          class="flex items-center gap-1"
        >
          <UIcon
            name="i-heroicons-paper-clip"
            class="size-3.5"
          />
          {{ format.number(props.task.attachmentCount) }}
        </span>
      </div>

      <!-- Rewards + actions -->
      <div class="flex flex-wrap items-center justify-between gap-2 border-t border-default pt-3">
        <div class="flex items-center gap-1.5">
          <span class="rounded-lg bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary tabular-nums">
            +{{ format.number(props.task.xpReward) }} XP
          </span>
          <span
            class="rounded-lg bg-coin-500/12 px-2 py-1 text-[11px] font-bold text-coin-600 tabular-nums dark:text-coin-300"
          >
            +{{ format.number(props.task.coinReward) }}
          </span>
        </div>

        <div class="flex w-full items-center gap-2 sm:w-auto">
          <UButton
            v-if="needsReview"
            :to="localePath(`/tasks/${props.task.id}`)"
            color="primary"
            variant="solid"
            size="xs"
            icon="i-heroicons-clipboard-document-check"
            class="flex-1 justify-center sm:flex-none"
          >
            {{ t('tasks.review.title') }}
          </UButton>

          <UButton
            v-else-if="primaryAction"
            color="primary"
            :variant="primaryAction === 'submit' ? 'solid' : 'soft'"
            size="xs"
            :loading="props.busy"
            :icon="primaryAction === 'start' ? 'i-heroicons-play' : 'i-heroicons-paper-airplane'"
            class="flex-1 justify-center sm:flex-none"
            @click="emit('action', primaryAction, props.task)"
          >
            {{ t(`tasks.actions.${primaryAction}`) }}
          </UButton>

          <UButton
            :to="localePath(`/tasks/${props.task.id}`)"
            color="neutral"
            variant="ghost"
            size="xs"
            icon="i-heroicons-arrow-left-circle"
            square
            :aria-label="t('tasks.detailTitle')"
          />
        </div>
      </div>
    </div>
  </article>
</template>
