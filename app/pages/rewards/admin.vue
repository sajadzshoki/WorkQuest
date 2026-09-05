<script setup lang="ts">
import type {
  RedemptionListResponse,
  RedemptionSummary,
  RewardAdminItem,
  RewardAdminResponse,
} from '#shared/types/api'
import type { RedemptionAction } from '#shared/utils/marketplace'

import { CATALOG_STATUSES, REDEMPTION_STATUSES, REWARD_TYPES } from '#shared/utils/marketplace'
import { can } from '#shared/utils/permissions'

definePageMeta({ middleware: ['auth'] })

/**
 * Store administration — the shelf and the queue.
 *
 * Two halves of one job. The shelf is what the company offers and at what price;
 * the queue is what employees asked for and what happens next. Both are read from
 * the same endpoints the purchase path writes through, so the numbers an admin
 * sees here are the numbers the ledger holds.
 *
 * Disabling a reward never deletes it: past requests keep pointing at the row and
 * keep saying what was bought and for how much.
 */
const { t } = useI18n()
const format = useLocaleFormat()
const toast = useToast()
const { user } = useSession()
const { typeIcon, typeLabel, catalogTone, catalogStatusLabel, statusLabel } = useRewards()
const localePath = useLocalePath()

// The page re-checks the permission the API enforces; a hand-typed URL gets a
// 403 from the server either way, this only avoids rendering a broken screen.
if (!can(user.value?.role, 'reward:manage')) {
  await navigateTo(localePath('/rewards'))
}

// --- Shelf ------------------------------------------------------------------

// `''` is the select's "everything" option, and the query drops it so the URL
// stays clean and the server's optional enum is never handed an empty string.
const shelfStatus = ref<string>('')
const shelfType = ref<string>('')

const shelfQuery = computed(() => ({
  status: shelfStatus.value || undefined,
  type: shelfType.value || undefined,
}))

const { data: admin, refresh: refreshAdmin } = await useFetch<RewardAdminResponse>('/api/rewards/admin', {
  query: shelfQuery,
})

const shelf = computed<RewardAdminItem[]>(() => admin.value?.items ?? [])

const shelfStatusItems = computed(() => [
  { label: t('common.all'), value: '' },
  ...CATALOG_STATUSES.map(value => ({ label: catalogStatusLabel(value), value })),
])
const shelfTypeItems = computed(() => [
  { label: t('common.all'), value: '' },
  ...REWARD_TYPES.map(value => ({ label: typeLabel(value), value })),
])

const formOpen = ref(false)
const editing = ref<RewardAdminItem | null>(null)

function openCreate() {
  editing.value = null
  formOpen.value = true
}

function openEdit(reward: RewardAdminItem) {
  editing.value = reward
  formOpen.value = true
}

/** Pause / activate / archive are just status changes — one endpoint, one audit row. */
async function setStatus(reward: RewardAdminItem, status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED') {
  try {
    await $fetch(`/api/rewards/${reward.id}`, { method: 'PATCH', body: { status } })
    const messageKey = status === 'ACTIVE' ? 'activated' : status === 'PAUSED' ? 'paused' : 'archived'
    toast.add({
      title: t(`rewards.admin.actions.${messageKey}`),
      color: status === 'ACTIVE' ? 'success' : 'neutral',
      icon: status === 'ACTIVE' ? 'i-heroicons-check' : 'i-heroicons-pause',
    })
    await refreshAdmin()
  }
  catch {
    toast.add({ title: t('common.retry'), color: 'error' })
  }
}

// --- Queue ------------------------------------------------------------------

const queueStatus = ref<string>('PENDING')
const queuePage = ref(1)
const queuePageSize = 10

const queueQuery = computed(() => ({
  status: queueStatus.value || undefined,
  page: String(queuePage.value),
  pageSize: String(queuePageSize),
}))

const { data: queue, refresh: refreshQueue } = await useFetch<RedemptionListResponse>(
  '/api/rewards/admin/redemptions',
  { query: queueQuery },
)

const queueItems = computed<RedemptionSummary[]>(() => queue.value?.items ?? [])
const queueTotal = computed(() => queue.value?.total ?? 0)
const queuePages = computed(() => Math.max(1, Math.ceil(queueTotal.value / queuePageSize)))

const queueStatusItems = computed(() => [
  { label: t('common.all'), value: '' },
  ...REDEMPTION_STATUSES.map(value => ({ label: statusLabel(value), value })),
])

watch(queueStatus, () => (queuePage.value = 1))

/** The request whose decision dialog is open. */
const pendingAction = ref<RedemptionSummary | null>(null)

function openDecision(redemption: RedemptionSummary, _action: RedemptionAction) {
  pendingAction.value = redemption
}

async function refreshAll() {
  await Promise.all([refreshAdmin(), refreshQueue()])
}

// --- Stats ------------------------------------------------------------------

const stats = computed(() => {
  const items = admin.value?.items ?? []
  return [
    { key: 'pending', value: admin.value?.queue.pending ?? 0, icon: 'i-heroicons-clock', tone: 'text-warning' },
    { key: 'approved', value: admin.value?.queue.approved ?? 0, icon: 'i-heroicons-check-badge', tone: 'text-info' },
    { key: 'fulfilled', value: items.reduce((sum, item) => sum + item.redemptions.fulfilled, 0), icon: 'i-heroicons-gift', tone: 'text-success' },
    { key: 'collected', value: items.reduce((sum, item) => sum + item.coinsCollected, 0), icon: 'i-heroicons-circle-stack', tone: 'text-coin-600 dark:text-coin-300' },
    { key: 'listed', value: items.filter(item => item.status === 'ACTIVE').length, icon: 'i-heroicons-building-storefront', tone: 'text-primary' },
  ]
})
</script>

<template>
  <div>
    <CommonPageHeader
      :title="t('rewards.admin.title')"
      :subtitle="t('rewards.admin.subtitle')"
    >
      <template #actions>
        <UButton
          color="neutral"
          variant="soft"
          icon="i-heroicons-gift"
          :to="localePath('/rewards')"
        >
          {{ t('rewards.title') }}
        </UButton>
        <UButton
          color="primary"
          icon="i-heroicons-plus"
          :label="t('rewards.admin.newReward')"
          @click="openCreate"
        />
      </template>
    </CommonPageHeader>

    <!-- Stats -->
    <div class="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <div
        v-for="stat in stats"
        :key="stat.key"
        class="wq-panel p-4"
      >
        <div class="flex items-center gap-2">
          <UIcon
            :name="stat.icon"
            class="size-4 shrink-0"
            :class="stat.tone"
          />
          <p class="truncate text-[11px] text-muted">
            {{ t(`rewards.admin.stats.${stat.key}`) }}
          </p>
        </div>
        <p class="mt-1 text-xl font-black tabular-nums text-highlighted">
          {{ format.compact(stat.value) }}
        </p>
      </div>
    </div>

    <!-- Queue -->
    <CommonSectionCard
      class="mb-6"
      :title="t('rewards.admin.queue')"
      icon="i-heroicons-queue-list"
      :description="t('rewards.admin.demand', { count: format.number(queueTotal) })"
    >
      <template #header-actions>
        <USelect
          v-model="queueStatus"
          :items="queueStatusItems"
          size="sm"
          :aria-label="t('rewards.admin.queueActions.filterStatus')"
          class="w-40"
        />
      </template>

      <RewardsRedemptionQueue
        :items="queueItems"
        :pending-action="pendingAction"
        @decide="openDecision"
        @close-decision="pendingAction = null"
        @changed="refreshAll"
      />

      <div
        v-if="queuePages > 1"
        class="mt-4 flex items-center justify-between border-t border-default pt-3"
      >
        <UButton
          size="xs"
          color="neutral"
          variant="ghost"
          icon="i-heroicons-arrow-right"
          :disabled="queuePage <= 1"
          :label="t('common.previous')"
          @click="queuePage -= 1"
        />
        <span class="text-[11px] tabular-nums text-muted">
          {{ format.number(queuePage) }} / {{ format.number(queuePages) }}
        </span>
        <UButton
          size="xs"
          color="neutral"
          variant="ghost"
          trailing-icon="i-heroicons-arrow-left"
          :disabled="queuePage >= queuePages"
          :label="t('common.next')"
          @click="queuePage += 1"
        />
      </div>
    </CommonSectionCard>

    <!-- Shelf -->
    <CommonSectionCard
      :title="t('rewards.admin.shelf')"
      icon="i-heroicons-building-storefront"
    >
      <template #header-actions>
        <div class="flex flex-wrap items-center gap-2">
          <USelect
            v-model="shelfStatus"
            :items="shelfStatusItems"
            size="sm"
            :aria-label="t('common.status')"
            class="w-32"
          />
          <USelect
            v-model="shelfType"
            :items="shelfTypeItems"
            size="sm"
            :aria-label="t('rewards.admin.form.type')"
            class="w-36"
          />
        </div>
      </template>

      <CommonEmptyState
        v-if="!shelf.length"
        icon="i-heroicons-building-storefront"
        :title="t('rewards.admin.emptyShelf')"
        :description="t('rewards.admin.emptyShelfHint')"
      >
        <UButton
          class="mt-2"
          color="primary"
          icon="i-heroicons-plus"
          :label="t('rewards.admin.newReward')"
          @click="openCreate"
        />
      </CommonEmptyState>

      <ul
        v-else
        class="divide-y divide-default"
      >
        <li
          v-for="reward in shelf"
          :key="reward.id"
          class="flex flex-wrap items-start gap-3 py-3.5 first:pt-0 last:pb-0"
        >
          <span class="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-elevated text-primary">
            <img
              v-if="reward.imageUrl"
              :src="reward.imageUrl"
              :alt="reward.title"
              class="size-full object-cover"
            >
            <UIcon
              v-else
              :name="typeIcon(reward.type)"
              class="size-5"
            />
          </span>

          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="truncate text-sm font-bold text-highlighted">
                {{ reward.title }}
              </p>
              <UBadge
                :color="catalogTone(reward.status)"
                variant="subtle"
                size="sm"
              >
                {{ catalogStatusLabel(reward.status) }}
              </UBadge>
              <UBadge
                v-if="reward.rules.autoApprove"
                color="success"
                variant="subtle"
                size="sm"
                icon="i-heroicons-bolt"
              >
                {{ t('rewards.autoApprove') }}
              </UBadge>
              <UBadge
                v-if="!reward.availability.available"
                color="warning"
                variant="subtle"
                size="sm"
              >
                {{ t(`rewards.block.${reward.availability.code}`) }}
              </UBadge>
            </div>

            <p
              v-if="reward.description"
              class="mt-0.5 line-clamp-1 text-[11px] text-muted"
            >
              {{ reward.description }}
            </p>

            <p class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-dimmed">
              <span class="font-semibold tabular-nums text-coin-600 dark:text-coin-300">
                {{ t('rewards.cost', { value: format.number(reward.coinCost) }) }}
              </span>
              <span aria-hidden="true">·</span>
              <span>{{ typeLabel(reward.type) }}</span>
              <span aria-hidden="true">·</span>
              <span>
                {{ reward.stock === null
                  ? t('rewards.unlimitedStock')
                  : t('rewards.stock', { count: format.number(reward.stock) }) }}
              </span>
              <span aria-hidden="true">·</span>
              <span class="tabular-nums">{{ t('rewards.admin.demand', { count: format.number(reward.redemptions.total) }) }}</span>
            </p>

            <!-- The rules, so an admin can see the policy without opening the form -->
            <p
              v-if="reward.rules.maxPerUser !== null || reward.rules.minLevel !== null || reward.rules.requiresNote"
              class="mt-1 flex flex-wrap gap-1.5 text-[10px] text-muted"
            >
              <span
                v-if="reward.rules.maxPerUser !== null"
                class="rounded-full bg-elevated/70 px-2 py-0.5"
              >
                {{ t('rewards.maxPerUser', { count: format.number(reward.rules.maxPerUser) }) }}
              </span>
              <span
                v-if="reward.rules.minLevel !== null"
                class="rounded-full bg-elevated/70 px-2 py-0.5"
              >
                {{ t('rewards.levelRequired', { level: format.number(reward.rules.minLevel) }) }}
              </span>
              <span
                v-if="reward.rules.requiresNote"
                class="rounded-full bg-elevated/70 px-2 py-0.5"
              >
                {{ t('rewards.requiresNote') }}
              </span>
            </p>
          </div>

          <div class="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
            <UButton
              size="xs"
              color="neutral"
              variant="soft"
              icon="i-heroicons-pencil"
              :label="t('rewards.admin.actions.edit')"
              @click="openEdit(reward)"
            />
            <UButton
              v-if="reward.status !== 'ACTIVE'"
              size="xs"
              color="success"
              variant="soft"
              icon="i-heroicons-check"
              :label="t('rewards.admin.actions.activate')"
              @click="setStatus(reward, 'ACTIVE')"
            />
            <UButton
              v-else
              size="xs"
              color="warning"
              variant="soft"
              icon="i-heroicons-pause"
              :label="t('rewards.admin.actions.pause')"
              @click="setStatus(reward, 'PAUSED')"
            />
            <UButton
              v-if="reward.status !== 'ARCHIVED'"
              size="xs"
              color="neutral"
              variant="ghost"
              icon="i-heroicons-archive-box"
              :aria-label="t('rewards.admin.actions.archive')"
              @click="setStatus(reward, 'ARCHIVED')"
            />
          </div>
        </li>
      </ul>
    </CommonSectionCard>

    <RewardsRewardFormModal
      v-model:open="formOpen"
      :reward="editing"
      @saved="refreshAll"
    />
  </div>
</template>
