<script setup lang="ts">
import type { ApiErrorBody, RedemptionDecisionResponse, RedemptionSummary } from '#shared/types/api'

/**
 * The employee's own requests.
 *
 * A settled request keeps saying what happened and why: the admin's note is
 * rendered next to the status, and a refund is shown as coins returned rather
 * than as a bare "cancelled". Somebody whose request was turned down should be
 * able to see the reason without chasing anyone for it.
 */
const props = defineProps<{
  items: RedemptionSummary[]
}>()

const emit = defineEmits<{
  (event: 'changed'): void
}>()

const { t } = useI18n()
const format = useLocaleFormat()
const toast = useToast()
const { typeIcon, redemptionTone, statusLabel } = useRewards()

const cancellingId = ref<string | null>(null)
/** The request whose cancellation is being confirmed. */
const confirmTarget = ref<RedemptionSummary | null>(null)

async function cancel() {
  const target = confirmTarget.value
  if (!target) return

  cancellingId.value = target.id
  try {
    const response = await $fetch<RedemptionDecisionResponse>(
      `/api/rewards/redemptions/${target.id}/cancel`,
      { method: 'POST' },
    )
    toast.add({
      title: t('rewards.cancelled', { value: format.number(response.refunded) }),
      color: 'success',
      icon: 'i-heroicons-arrow-uturn-right',
    })
    confirmTarget.value = null
    emit('changed')
  }
  catch (error) {
    const body = (error as { data?: ApiErrorBody }).data
    toast.add({ title: body?.message ?? t('common.retry'), color: 'error' })
  }
  finally {
    cancellingId.value = null
  }
}
</script>

<template>
  <div>
    <CommonEmptyState
      v-if="!props.items.length"
      icon="i-heroicons-receipt-percent"
      :title="t('rewards.noRedemptions')"
    />

    <ul
      v-else
      class="divide-y divide-default"
    >
      <li
        v-for="item in props.items"
        :key="item.id"
        class="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0"
      >
        <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-elevated text-primary">
          <UIcon
            :name="typeIcon(item.reward.type)"
            class="size-5"
          />
        </span>

        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-bold text-highlighted">
            {{ item.reward.title }}
          </p>
          <p class="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-dimmed">
            <span class="tabular-nums">{{ format.date(item.requestedAt) }}</span>
            <span aria-hidden="true">·</span>
            <span class="font-semibold tabular-nums text-coin-600 dark:text-coin-300">
              {{ t('rewards.cost', { value: format.number(item.coinCost) }) }}
            </span>
            <template v-if="item.refunded">
              <span aria-hidden="true">·</span>
              <span class="inline-flex items-center gap-1 text-success">
                <UIcon
                  name="i-heroicons-arrow-uturn-right"
                  class="size-3"
                />
                {{ t('rewards.refunded', { value: format.number(item.coinCost) }) }}
              </span>
            </template>
          </p>

          <p
            v-if="item.note"
            class="mt-1 truncate text-[11px] text-muted"
          >
            {{ t('rewards.yourNote') }}: {{ item.note }}
          </p>

          <!-- The admin's reason, when they gave one -->
          <p
            v-if="item.decisionNote"
            class="mt-1 rounded-lg bg-elevated/70 px-2 py-1 text-[11px] text-muted"
          >
            <span class="font-semibold">{{ t('rewards.decisionNote') }}:</span>
            {{ item.decisionNote }}
          </p>
        </div>

        <div class="flex shrink-0 items-center gap-2">
          <UBadge
            :color="redemptionTone(item.status)"
            variant="subtle"
            size="sm"
          >
            {{ statusLabel(item.status) }}
          </UBadge>

          <UButton
            v-if="item.cancellable"
            size="xs"
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
            :loading="cancellingId === item.id"
            :label="t('rewards.cancelRequest')"
            @click="confirmTarget = item"
          />
        </div>
      </li>
    </ul>

    <!-- Confirm before giving up a place in the queue -->
    <UModal
      :open="confirmTarget !== null"
      :title="t('rewards.cancelRequest')"
      :description="confirmTarget ? t('rewards.cancelConfirm', { value: format.number(confirmTarget.coinCost) }) : ''"
      @update:open="confirmTarget = null"
    >
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            :label="t('common.cancel')"
            @click="confirmTarget = null"
          />
          <UButton
            color="error"
            icon="i-heroicons-x-mark"
            :loading="cancellingId !== null"
            :label="t('rewards.cancelRequest')"
            @click="cancel"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
