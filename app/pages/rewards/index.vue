<script setup lang="ts">
import type { RedemptionListResponse, RewardCatalogueItem, RewardCatalogueResponse } from '#shared/types/api'

import { REWARD_TYPES } from '#shared/utils/marketplace'

definePageMeta({ middleware: ['auth'] })

/**
 * The reward marketplace.
 *
 * One screen with three jobs: show what the company is offering, show what it
 * costs against what you have, and show what you have already asked for. The
 * arithmetic and the eligibility are the server's — this page renders
 * `standing` rather than deciding anything itself, which is why a disabled button
 * here and a refusal from the API always say the same thing.
 */
const { t } = useI18n()
const format = useLocaleFormat()
const { can } = useCan()
const { typeLabel } = useRewards()
const localePath = useLocalePath()

/** Type filter; `null` is the whole shelf. */
const activeType = ref<string | null>(null)

const query = computed(() => ({ type: activeType.value ?? undefined }))

const { data, status, refresh } = await useFetch<RewardCatalogueResponse>('/api/rewards', { query })

/** Only the types actually on the shelf get a filter chip. */
const typeFilters = computed(() => {
  const present = new Set((data.value?.items ?? []).map(item => item.type))
  return REWARD_TYPES.filter(type => present.has(type))
})

const items = computed(() => data.value?.items ?? [])
const balance = computed(() => data.value?.balance ?? 0)
const level = computed(() => data.value?.level ?? 1)

// --- Detail & redemption ----------------------------------------------------

const dialogOpen = ref(false)
const selected = ref<RewardCatalogueItem | null>(null)

function openReward(reward: RewardCatalogueItem) {
  selected.value = reward
  dialogOpen.value = true
}

/** The dialog holds a snapshot; keep it pointing at the refreshed row. */
function onRedeemed() {
  refresh()
  refreshHistory()
}

// --- History ---------------------------------------------------------------

const showAllHistory = ref(false)
const historyPage = ref(1)

const { data: history, refresh: refreshHistory } = await useFetch<RedemptionListResponse>(
  '/api/rewards/redemptions',
  { query: computed(() => ({ page: String(historyPage.value), pageSize: showAllHistory.value ? '20' : '5' })) },
)

const historyItems = computed(() => history.value?.items ?? [])
const hasMoreHistory = computed(() => (history.value?.total ?? 0) > historyItems.value.length)

function toggleHistory() {
  showAllHistory.value = !showAllHistory.value
  historyPage.value = 1
}

const counts = computed(() => data.value?.counts ?? {})
const liveCount = computed(() => (counts.value.PENDING ?? 0) + (counts.value.APPROVED ?? 0))
</script>

<template>
  <div>
    <CommonPageHeader
      :title="t('rewards.title')"
      :subtitle="t('rewards.subtitle')"
    >
      <template #actions>
        <UButton
          v-if="can('reward:manage')"
          icon="i-heroicons-building-storefront"
          color="neutral"
          variant="soft"
          :to="localePath('/rewards/admin')"
        >
          {{ t('rewards.admin.title') }}
        </UButton>
      </template>
    </CommonPageHeader>

    <!-- Balance -->
    <div class="wq-panel mb-5 flex flex-wrap items-center justify-between gap-4 bg-coin-500/8 p-5 dark:bg-coin-500/10">
      <div class="flex items-center gap-3">
        <span class="grid size-12 shrink-0 place-items-center rounded-2xl bg-coin-500/15 text-coin-600 dark:text-coin-300">
          <UIcon
            name="i-heroicons-circle-stack"
            class="size-6"
          />
        </span>
        <div>
          <p class="text-xs text-muted">
            {{ t('rewards.balance') }}
          </p>
          <p class="text-3xl font-black leading-tight tabular-nums text-coin-600 dark:text-coin-300">
            {{ format.number(balance) }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="text-center">
          <p class="text-[11px] text-muted">
            {{ t('rewards.yourLevel') }}
          </p>
          <p class="text-lg font-black tabular-nums text-highlighted">
            {{ format.number(level) }}
          </p>
        </div>
        <div
          v-if="liveCount > 0"
          class="text-center"
        >
          <p class="text-[11px] text-muted">
            {{ t('rewards.myRedemptions') }}
          </p>
          <p class="text-lg font-black tabular-nums text-highlighted">
            {{ format.number(liveCount) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Coins never reset -->
    <p class="mb-5 flex items-start gap-2 text-[11px] text-muted">
      <UIcon
        name="i-heroicons-information-circle"
        class="mt-0.5 size-4 shrink-0 text-primary"
      />
      <span>{{ t('rewards.coinsArePermanent') }}</span>
    </p>

    <!-- Type filter -->
    <div
      v-if="typeFilters.length > 1"
      class="mb-5 flex flex-wrap gap-2"
    >
      <UButton
        size="sm"
        :color="activeType === null ? 'primary' : 'neutral'"
        :variant="activeType === null ? 'solid' : 'soft'"
        :label="t('rewards.browseAll')"
        @click="activeType = null"
      />
      <UButton
        v-for="type in typeFilters"
        :key="type"
        size="sm"
        :color="activeType === type ? 'primary' : 'neutral'"
        :variant="activeType === type ? 'solid' : 'soft'"
        :label="typeLabel(type)"
        @click="activeType = type"
      />
    </div>

    <!-- The shelf -->
    <div
      v-if="status === 'pending'"
      class="wq-panel grid place-items-center p-12 text-sm text-muted"
    >
      {{ t('common.loading') }}
    </div>

    <CommonEmptyState
      v-else-if="!items.length"
      class="wq-panel"
      icon="i-heroicons-gift"
      :title="t('rewards.noRewards')"
      :description="t('rewards.noRewardsHint')"
    />

    <div
      v-else
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <RewardsRewardCard
        v-for="reward in items"
        :key="reward.id"
        :reward="reward"
        :level="level"
        @open="openReward"
      />
    </div>

    <!-- My requests -->
    <CommonSectionCard
      class="mt-8"
      :title="t('rewards.myRedemptions')"
      icon="i-heroicons-receipt-percent"
    >
      <RewardsRedemptionList
        :items="historyItems"
        @changed="() => { refresh(); refreshHistory() }"
      />

      <div
        v-if="hasMoreHistory || showAllHistory"
        class="mt-4 flex justify-center border-t border-default pt-3"
      >
        <UButton
          size="xs"
          color="neutral"
          variant="ghost"
          :icon="showAllHistory ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
          :label="showAllHistory ? t('common.close') : t('rewards.viewAll')"
          @click="toggleHistory"
        />
      </div>
    </CommonSectionCard>

    <!-- Detail & purchase -->
    <RewardsRewardDialog
      v-model:open="dialogOpen"
      :reward="selected"
      :balance="balance"
      :level="level"
      @redeemed="onRedeemed"
    />
  </div>
</template>
