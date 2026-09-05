<script setup lang="ts">
import type { ApiErrorBody, RedeemRewardResponse, RewardCatalogueItem } from '#shared/types/api'
import type { RedeemBlockCode } from '#shared/utils/marketplace'

/**
 * The detail view and the purchase, in one dialog.
 *
 * Two things here are deliberate:
 *
 *  - **The price is never sent.** The dialog shows what the server already told
 *    it the reward costs and posts only the reward id, an optional note and an
 *    idempotency key. There is no field a caller could tamper with to pay less.
 *  - **One idempotency key per attempt.** It is generated when the dialog opens
 *    and reused for every retry of that attempt, so a double-clicked button or a
 *    request the network swallowed and resent cannot charge twice. A fresh key is
 *    minted the next time the dialog opens, because that is a new decision.
 */
const props = defineProps<{
  open: boolean
  reward: RewardCatalogueItem | null
  balance: number
  level: number
}>()

const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
  (event: 'redeemed', response: RedeemRewardResponse): void
}>()

const { t } = useI18n()
const format = useLocaleFormat()
const toast = useToast()
const { typeIcon, typeLabel, blockLabel, blockIcon } = useRewards()

const note = ref('')
const pending = ref(false)
const errorMessage = ref<string | null>(null)
const blockCode = ref<RedeemBlockCode | null>(null)
/** Minted per attempt; see the header comment. */
let idempotencyKey = ''

watch(
  () => props.open,
  (open) => {
    if (!open) return
    note.value = ''
    pending.value = false
    errorMessage.value = null
    blockCode.value = null
    idempotencyKey = crypto.randomUUID()
  },
)

function close() {
  emit('update:open', false)
}

const standing = computed(() => props.reward?.standing ?? null)
const requiresNote = computed(() => props.reward?.rules.requiresNote ?? false)

/**
 * Whether the confirm button may be pressed.
 *
 * A missing note is the one thing the dialog can fix on the spot, so it gates the
 * button here instead of spending a round trip to be told. Everything else is the
 * server's verdict, shown as-is.
 */
const canSubmit = computed(() => {
  if (!props.reward || pending.value) return false
  if (requiresNote.value && !note.value.trim()) return false
  return standing.value?.redeemable || standing.value?.code === 'NOTE_REQUIRED'
})

const balanceAfter = computed(() =>
  Math.max(0, props.balance - (props.reward?.coinCost ?? 0)),
)

const rulesList = computed(() => {
  const rules = props.reward?.rules
  if (!rules) return []
  const items: Array<{ icon: string, label: string }> = [
    rules.autoApprove
      ? { icon: 'i-heroicons-bolt', label: t('rewards.autoApproveHint') }
      : { icon: 'i-heroicons-queue-list', label: t('rewards.manualApprovalHint') },
  ]
  if (rules.maxPerUser !== null) items.push({ icon: 'i-heroicons-check-badge', label: t('rewards.maxPerUser', { count: format.number(rules.maxPerUser) }) })
  if (rules.minLevel !== null) items.push({ icon: 'i-heroicons-arrow-trending-up', label: t('rewards.levelRequired', { level: format.number(rules.minLevel) }) })
  if (rules.requiresNote) items.push({ icon: 'i-heroicons-pencil-square', label: t('rewards.requiresNote') })
  if (rules.availableFrom) items.push({ icon: 'i-heroicons-clock', label: t('rewards.availableFrom', { date: format.date(rules.availableFrom) }) })
  if (rules.availableUntil) items.push({ icon: 'i-heroicons-calendar-days', label: t('rewards.availableUntil', { date: format.date(rules.availableUntil) }) })
  return items
})

async function submit() {
  if (!props.reward || !canSubmit.value) return

  pending.value = true
  errorMessage.value = null
  blockCode.value = null

  try {
    const response = await $fetch<RedeemRewardResponse>(`/api/rewards/${props.reward.id}/redeem`, {
      method: 'POST',
      body: {
        note: note.value.trim() || undefined,
        // Reused across retries of this attempt; a new dialog mints a new one.
        idempotencyKey,
      },
    })

    const approved = response.redemption.status === 'APPROVED'
    toast.add({
      title: approved ? t('rewards.redeemDialog.successApproved') : t('rewards.redeemDialog.successPending'),
      description: response.charged
        ? t('rewards.cost', { value: format.number(props.reward.coinCost) })
        : undefined,
      color: 'success',
      icon: approved ? 'i-heroicons-bolt' : 'i-heroicons-check',
    })

    emit('redeemed', response)
    close()
  }
  catch (error) {
    const body = (error as { data?: ApiErrorBody }).data
    // The API's `code` is the same vocabulary the card used, so the copy shown
    // here is the copy the shelf already showed — one explanation, not two.
    const code = (body?.code ?? null) as RedeemBlockCode | null
    blockCode.value = code && code in BLOCK_CODES ? code : null
    errorMessage.value = blockCode.value
      ? blockLabel(blockCode.value)
      : body?.message ?? t('rewards.redeemDialog.failed')
  }
  finally {
    pending.value = false
  }
}

/** The refusal codes the API can return, for narrowing an unknown string. */
const BLOCK_CODES: Record<RedeemBlockCode, true> = {
  INACTIVE_ACCOUNT: true,
  NOT_LISTED: true,
  NOT_AVAILABLE_YET: true,
  EXPIRED: true,
  OUT_OF_STOCK: true,
  LIMIT_REACHED: true,
  LEVEL_REQUIRED: true,
  NOTE_REQUIRED: true,
  INSUFFICIENT_COINS: true,
}
</script>

<template>
  <UModal
    :open="props.open"
    :title="props.reward ? t('rewards.redeemDialog.title', { title: props.reward.title }) : ''"
    :ui="{ content: 'max-w-lg' }"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <div
        v-if="props.reward"
        class="space-y-4"
      >
        <!-- The reward -->
        <div class="flex items-start gap-3">
          <span class="grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-primary/10 text-primary">
            <img
              v-if="props.reward.imageUrl"
              :src="props.reward.imageUrl"
              :alt="props.reward.title"
              class="size-full object-cover"
              loading="lazy"
              decoding="async"
            >
            <UIcon
              v-else
              :name="typeIcon(props.reward.type)"
              class="size-7"
            />
          </span>

          <div class="min-w-0">
            <p class="text-sm font-black text-highlighted">
              {{ props.reward.title }}
            </p>
            <p
              v-if="props.reward.description"
              class="mt-1 text-xs leading-6 text-muted"
            >
              {{ props.reward.description }}
            </p>
            <UBadge
              class="mt-2"
              color="neutral"
              variant="subtle"
              size="sm"
            >
              {{ typeLabel(props.reward.type) }}
            </UBadge>
          </div>
        </div>

        <!-- Rules -->
        <div class="rounded-xl bg-elevated/60 p-3">
          <p class="text-[11px] font-bold text-muted">
            {{ t('rewards.detail.rulesTitle') }}
          </p>
          <ul class="mt-2 space-y-1.5">
            <li
              v-for="rule in rulesList"
              :key="rule.label"
              class="flex items-start gap-2 text-[11px] text-muted"
            >
              <UIcon
                :name="rule.icon"
                class="mt-0.5 size-3.5 shrink-0 text-primary"
              />
              <span>{{ rule.label }}</span>
            </li>
          </ul>
        </div>

        <!-- What it costs, before and after -->
        <dl class="grid grid-cols-3 gap-2 text-center">
          <div class="rounded-xl bg-elevated/60 px-2 py-2.5">
            <dt class="text-[10px] text-muted">
              {{ t('rewards.detail.price') }}
            </dt>
            <dd class="mt-0.5 text-sm font-black tabular-nums text-coin-600 dark:text-coin-300">
              {{ format.number(props.reward.coinCost) }}
            </dd>
          </div>
          <div class="rounded-xl bg-elevated/60 px-2 py-2.5">
            <dt class="text-[10px] text-muted">
              {{ t('rewards.redeemDialog.balanceBefore') }}
            </dt>
            <dd class="mt-0.5 text-sm font-black tabular-nums text-highlighted">
              {{ format.number(props.balance) }}
            </dd>
          </div>
          <div class="rounded-xl bg-elevated/60 px-2 py-2.5">
            <dt class="text-[10px] text-muted">
              {{ t('rewards.redeemDialog.balanceAfter') }}
            </dt>
            <dd class="mt-0.5 text-sm font-black tabular-nums text-highlighted">
              {{ format.number(balanceAfter) }}
            </dd>
          </div>
        </dl>

        <!-- The note -->
        <UFormField
          :label="t('rewards.redeemDialog.noteLabel')"
          :required="requiresNote"
          :hint="requiresNote ? t('common.required') : t('common.optional')"
          :help="requiresNote ? t('rewards.redeemDialog.noteHint') : t('rewards.redeemDialog.noteOptional')"
        >
          <UTextarea
            v-model="note"
            :rows="3"
            :maxlength="500"
            :placeholder="t('rewards.redeemDialog.notePlaceholder')"
            class="w-full"
          />
        </UFormField>

        <!-- A refusal, in the same words the shelf used -->
        <div
          v-if="errorMessage"
          class="flex items-start gap-2 rounded-xl bg-error/10 p-3 text-xs font-semibold text-error"
          role="alert"
        >
          <UIcon
            :name="blockCode ? blockIcon(blockCode) : 'i-heroicons-exclamation-triangle'"
            class="mt-0.5 size-4 shrink-0"
          />
          <span>{{ errorMessage }}</span>
        </div>

        <p
          v-else-if="standing && !standing.redeemable && standing.code"
          class="flex items-start gap-2 rounded-xl bg-elevated/60 p-3 text-xs text-muted"
        >
          <UIcon
            :name="blockIcon(standing.code)"
            class="mt-0.5 size-4 shrink-0 text-warning"
          />
          <span>{{ blockLabel(standing.code) }}</span>
        </p>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full items-center justify-between gap-2">
        <UButton
          color="neutral"
          variant="ghost"
          :label="t('common.close')"
          @click="close"
        />
        <UButton
          color="primary"
          icon="i-heroicons-gift"
          :loading="pending"
          :disabled="!canSubmit"
          :label="pending ? t('common.loading') : t('rewards.redeemDialog.confirm')"
          @click="submit"
        />
      </div>
    </template>
  </UModal>
</template>
