<script setup lang="ts">
import type {
  ApiErrorBody,
  RedemptionDecisionResponse,
  RedemptionSummary,
} from '#shared/types/api'
import { REDEMPTION_ACTIONS, type RedemptionAction } from '#shared/utils/marketplace'

/**
 * The admin's queue of requests, and the decisions on them.
 *
 * `availableActions` comes from the server, which takes it from the same status
 * machine that enforces the move — so this component cannot offer a decision that
 * will be refused, and a request that has been settled simply stops showing
 * buttons.
 *
 * A rejection asks for a reason. It is not enforced by the schema (an admin may
 * have a reason they would rather give in person), but the form says out loud why
 * it matters: an unexplained "no" is the demotivating kind, and the note is what
 * the employee sees.
 */
const props = defineProps<{
  items: RedemptionSummary[]
  pendingAction: RedemptionSummary | null
}>()

const emit = defineEmits<{
  (event: 'decide', redemption: RedemptionSummary, action: RedemptionAction): void
  (event: 'close-decision' | 'changed'): void
}>()

const { t } = useI18n()
const format = useLocaleFormat()
const toast = useToast()
const { typeIcon, redemptionTone, statusLabel } = useRewards()

const note = ref('')
const submitting = ref(false)
const errorMessage = ref<string | null>(null)

// Every time a different request is opened, the note starts empty: carrying one
// request's explanation over to another would send the wrong words to the wrong
// employee.
watch(
  () => props.pendingAction,
  () => {
    note.value = ''
    errorMessage.value = null
    submitting.value = false
  },
)

const ACTION_META: Record<RedemptionAction, { icon: string, color: 'primary' | 'error' | 'success' | 'neutral' }> = {
  APPROVE: { icon: 'i-heroicons-check', color: 'primary' },
  REJECT: { icon: 'i-heroicons-x-mark', color: 'error' },
  FULFIL: { icon: 'i-heroicons-gift', color: 'success' },
  CANCEL: { icon: 'i-heroicons-arrow-uturn-right', color: 'neutral' },
}

/**
 * The server's `availableActions` cross the wire as strings. Narrowing them here
 * means an unknown action is dropped rather than rendered as a button with no
 * icon and no label — the machine on the server is the only source of moves.
 */
function knownActions(actions: string[]): RedemptionAction[] {
  return actions.filter((action): action is RedemptionAction =>
    (REDEMPTION_ACTIONS as readonly string[]).includes(action))
}

function actionLabel(action: RedemptionAction): string {
  return t(`rewards.admin.queueActions.${action.toLowerCase()}`)
}

const decisionTitle = computed(() =>
  props.pendingAction
    ? t('rewards.admin.queueActions.decideTitle', { title: props.pendingAction.reward.title })
    : '',
)

/** Rejections and cancellations put coins back; say so before the click. */
const refunds = computed(() =>
  props.pendingAction !== null
  && (props.pendingAction.status === 'PENDING' || props.pendingAction.status === 'APPROVED'),
)

async function submit(action: RedemptionAction) {
  const target = props.pendingAction
  if (!target) return

  submitting.value = true
  errorMessage.value = null

  try {
    const response = await $fetch<RedemptionDecisionResponse>(
      `/api/rewards/admin/redemptions/${target.id}/decision`,
      { method: 'POST', body: { action, note: note.value.trim() || undefined } },
    )
    toast.add({
      title: t('rewards.admin.queueActions.decided'),
      description: response.refunded > 0
        ? t('rewards.refunded', { value: format.number(response.refunded) })
        : undefined,
      color: 'success',
      icon: ACTION_META[action].icon,
    })
    emit('changed')
    emit('close-decision')
  }
  catch (error) {
    const body = (error as { data?: ApiErrorBody }).data
    errorMessage.value = body?.message ?? t('rewards.admin.queueActions.failed')
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <CommonEmptyState
      v-if="!props.items.length"
      icon="i-heroicons-queue-list"
      :title="t('rewards.admin.emptyQueue')"
      :description="t('rewards.admin.emptyQueueHint')"
    />

    <ul
      v-else
      class="divide-y divide-default"
    >
      <li
        v-for="item in props.items"
        :key="item.id"
        class="flex flex-wrap items-start gap-3 py-3.5 first:pt-0 last:pb-0"
      >
        <span class="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-elevated text-primary">
          <img
            v-if="item.user?.avatarUrl"
            :src="item.user.avatarUrl"
            :alt="item.user.fullName"
            class="size-full object-cover"
            loading="lazy"
            decoding="async"
          >
          <UIcon
            v-else
            name="i-heroicons-user-circle"
            class="size-6 text-muted"
          />
        </span>

        <div class="min-w-0 flex-1">
          <p class="text-sm font-bold text-highlighted">
            {{ item.user?.fullName }}
            <span class="text-[11px] font-medium text-dimmed">{{ item.user?.jobTitle }}</span>
          </p>

          <p class="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted">
            <span class="inline-flex items-center gap-1 font-semibold text-highlighted">
              <UIcon
                :name="typeIcon(item.reward.type)"
                class="size-3.5 text-primary"
              />
              {{ item.reward.title }}
            </span>
            <span aria-hidden="true">·</span>
            <span class="tabular-nums text-coin-600 dark:text-coin-300">
              {{ t('rewards.cost', { value: format.number(item.coinCost) }) }}
            </span>
            <span aria-hidden="true">·</span>
            <span class="tabular-nums">{{ format.relative(item.requestedAt) }}</span>
          </p>

          <p
            v-if="item.note"
            class="mt-1.5 rounded-lg bg-elevated/70 px-2 py-1 text-[11px] text-muted"
          >
            <span class="font-semibold">{{ t('rewards.admin.queueActions.askedFor') }}:</span>
            {{ item.note }}
          </p>

          <p
            v-if="item.decisionNote"
            class="mt-1 text-[11px] text-dimmed"
          >
            <span class="font-semibold">{{ t('rewards.decisionNote') }}:</span>
            {{ item.decisionNote }}
          </p>
        </div>

        <div class="flex shrink-0 flex-col items-end gap-2">
          <UBadge
            :color="redemptionTone(item.status)"
            variant="subtle"
            size="sm"
          >
            {{ statusLabel(item.status) }}
          </UBadge>

          <div
            v-if="item.availableActions.length"
            class="flex flex-wrap justify-end gap-1.5"
          >
            <UButton
              v-for="action in knownActions(item.availableActions)"
              :key="action"
              size="xs"
              :color="ACTION_META[action].color"
              :variant="action === 'APPROVE' ? 'solid' : 'soft'"
              :icon="ACTION_META[action].icon"
              :label="actionLabel(action)"
              @click="emit('decide', item, action)"
            />
          </div>
        </div>
      </li>
    </ul>

    <!-- The decision, with the note the employee will read -->
    <UModal
      :open="props.pendingAction !== null"
      :title="decisionTitle"
      @update:open="emit('close-decision')"
    >
      <template #body>
        <div
          v-if="props.pendingAction"
          class="space-y-4"
        >
          <div class="rounded-xl bg-elevated/60 p-3 text-xs">
            <p class="font-bold text-highlighted">
              {{ props.pendingAction.reward.title }}
            </p>
            <p class="mt-1 text-muted">
              {{ t('rewards.admin.queueActions.requestedBy') }}:
              {{ props.pendingAction.user?.fullName }}
              <span aria-hidden="true">·</span>
              <span class="tabular-nums text-coin-600 dark:text-coin-300">
                {{ t('rewards.cost', { value: format.number(props.pendingAction.coinCost) }) }}
              </span>
            </p>
            <p
              v-if="props.pendingAction.note"
              class="mt-2 border-t border-default pt-2 text-muted"
            >
              {{ props.pendingAction.note }}
            </p>
          </div>

          <UFormField
            :label="t('rewards.admin.queueActions.noteLabel')"
            :hint="t('common.optional')"
            :help="t('rewards.admin.queueActions.noteRequiredForReject')"
          >
            <UTextarea
              v-model="note"
              :rows="3"
              :maxlength="500"
              :placeholder="t('rewards.admin.queueActions.notePlaceholder')"
              class="w-full"
            />
          </UFormField>

          <p
            v-if="refunds"
            class="flex items-start gap-2 rounded-xl bg-warning/10 p-3 text-[11px] font-semibold text-warning"
          >
            <UIcon
              name="i-heroicons-arrow-uturn-right"
              class="mt-0.5 size-4 shrink-0"
            />
            <span>
              {{ t('rewards.admin.queueActions.refundNote', { value: format.number(props.pendingAction.coinCost) }) }}
            </span>
          </p>

          <p
            v-if="errorMessage"
            class="rounded-xl bg-error/10 p-3 text-xs font-semibold text-error"
            role="alert"
          >
            {{ errorMessage }}
          </p>
        </div>
      </template>

      <template #footer>
        <div class="flex w-full flex-wrap items-center justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            :label="t('common.cancel')"
            @click="emit('close-decision')"
          />
          <UButton
            v-if="props.pendingAction?.availableActions.includes('REJECT')"
            color="error"
            variant="soft"
            icon="i-heroicons-x-mark"
            :loading="submitting"
            :label="t('rewards.admin.queueActions.reject')"
            @click="submit('REJECT')"
          />
          <UButton
            v-if="props.pendingAction?.availableActions.includes('APPROVE')"
            color="primary"
            icon="i-heroicons-check"
            :loading="submitting"
            :label="t('rewards.admin.queueActions.approve')"
            @click="submit('APPROVE')"
          />
          <UButton
            v-if="props.pendingAction?.availableActions.includes('FULFIL')"
            color="success"
            icon="i-heroicons-gift"
            :loading="submitting"
            :label="t('rewards.admin.queueActions.fulfil')"
            @click="submit('FULFIL')"
          />
          <UButton
            v-if="props.pendingAction?.availableActions.includes('CANCEL')"
            color="neutral"
            icon="i-heroicons-arrow-uturn-right"
            :loading="submitting"
            :label="t('rewards.admin.queueActions.cancel')"
            @click="submit('CANCEL')"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
