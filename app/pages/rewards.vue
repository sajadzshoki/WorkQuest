<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

interface RewardsResponse {
  balance: number
  rewards: Array<{
    id: string
    title: string
    description: string | null
    type: string
    cost: number
    stock: number | null
    imageUrl: string | null
    affordable: boolean
    available: boolean
  }>
  redemptions: Array<{
    id: string
    status: string
    cost: number
    note: string | null
    requestedAt: string
    decidedAt: string | null
    reward: { id: string, title: string, type: string, imageUrl: string | null }
  }>
}

const { t } = useI18n()
const format = useLocaleFormat()

const { data } = await useFetch<RewardsResponse>(`/api/rewards`)

const statusTones: Record<string, 'primary' | 'success' | 'warning' | 'error' | 'neutral'> = {
  REQUESTED: 'warning',
  APPROVED: 'primary',
  REJECTED: 'error',
  FULFILLED: 'success',
  CANCELLED: 'neutral',
}
</script>

<template>
  <div>
    <CommonPageHeader
      :title="t('rewards.title')"
      :subtitle="t('rewards.subtitle')"
    />

    <div class="wq-panel mb-6 flex items-center justify-between gap-4 bg-coin-500/8 p-5 dark:bg-coin-500/10">
      <div>
        <p class="text-xs text-muted">
          {{ t('rewards.balance') }}
        </p>
        <p class="text-3xl font-black tabular-nums text-coin-600 dark:text-coin-300">
          {{ format.number(data?.balance ?? 0) }}
        </p>
      </div>
      <UIcon
        name="i-heroicons-circle-stack-solid"
        class="size-12 text-coin-500/70"
      />
    </div>

    <CommonEmptyState
      v-if="!data?.rewards.length"
      class="wq-panel"
      icon="i-heroicons-gift"
      :title="t('rewards.noRewards')"
    />

    <div
      v-else
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <article
        v-for="reward in data.rewards"
        :key="reward.id"
        class="wq-panel flex flex-col p-5"
      >
        <div class="flex items-start justify-between gap-3">
          <span class="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
            <UIcon
              name="i-heroicons-gift"
              class="size-5.5"
            />
          </span>
          <UBadge
            color="neutral"
            variant="subtle"
            size="sm"
          >
            {{ t(`rewards.type.${reward.type}`) }}
          </UBadge>
        </div>

        <h3 class="mt-4 text-base font-bold text-highlighted">
          {{ reward.title }}
        </h3>
        <p class="mt-1 flex-1 text-xs leading-6 text-muted">
          {{ reward.description }}
        </p>

        <div class="mt-4 flex items-center justify-between border-t border-default pt-4">
          <div>
            <p class="text-lg font-black tabular-nums text-coin-600 dark:text-coin-300">
              {{ format.number(reward.cost) }}
            </p>
            <p class="text-[11px] text-dimmed">
              {{ reward.stock === null ? t('gamification.unlocked') : t('rewards.stock', { count: format.number(reward.stock) }) }}
            </p>
          </div>

          <UButton
            size="sm"
            :disabled="!reward.affordable || !reward.available"
          >
            {{ reward.available ? (reward.affordable ? t('rewards.redeem') : t('rewards.notAffordable')) : t('rewards.outOfStock') }}
          </UButton>
        </div>
      </article>
    </div>

    <CommonSectionCard
      v-if="data?.redemptions.length"
      class="mt-8"
      :title="t('rewards.myRedemptions')"
      icon="i-heroicons-receipt-percent"
    >
      <ul class="divide-y divide-default">
        <li
          v-for="redemption in data.redemptions"
          :key="redemption.id"
          class="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
        >
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold text-highlighted">
              {{ redemption.reward.title }}
            </p>
            <p class="text-[11px] text-dimmed">
              {{ format.date(redemption.requestedAt) }}
            </p>
          </div>

          <UBadge
            :color="statusTones[redemption.status] ?? 'neutral'"
            variant="subtle"
            size="sm"
          >
            {{ t(`status.redemption.${redemption.status}`) }}
          </UBadge>
        </li>
      </ul>
    </CommonSectionCard>
  </div>
</template>
