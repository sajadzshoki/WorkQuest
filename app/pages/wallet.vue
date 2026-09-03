<script setup lang="ts">
/**
 * The employee's wallet: progress card plus the full, paged coin statement.
 *
 * Every row here is a ledger entry — there is no "balance" field being shown
 * that is not the sum of what is listed, which is what makes the number
 * trustworthy to the person reading it.
 */

interface WalletTransaction {
  id: string
  amount: number
  type: string
  reason: string | null
  balanceAfter: number | null
  createdAt: string
}

const { t } = useI18n()
const format = useLocaleFormat()

definePageMeta({ middleware: 'auth' })

const TYPES = [
  'TASK_REWARD',
  'RECOGNITION_REWARD',
  'CHALLENGE_REWARD',
  'REWARD_REDEMPTION',
  'ADMIN_ADJUSTMENT',
] as const

type TransactionType = (typeof TYPES)[number]

const page = ref(1)
const pageSize = 20
const type = ref<TransactionType | undefined>(undefined)

const { data: wallet } = await useFetch('/api/wallet')

const { data: statement, pending } = await useFetch<{
  items: WalletTransaction[]
  total: number
}>('/api/wallet/transactions', {
  query: computed(() => ({
    page: page.value,
    pageSize,
    ...(type.value ? { type: type.value } : {}),
  })),
  default: () => ({ items: [], total: 0 }),
})

const typeOptions = computed(() => [
  { label: t('common.all'), value: undefined },
  ...TYPES.map(value => ({ label: t(`wallet.type.${value}`), value })),
])

function signedAmount(amount: number): string {
  const sign = amount >= 0 ? '+' : '−'
  return `${sign}${format.number(Math.abs(amount))}`
}

useHead({ title: t('wallet.title') })
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-xl font-black text-highlighted">
      {{ t('wallet.title') }}
    </h1>

    <div class="grid gap-6 lg:grid-cols-[minmax(0,22rem)_1fr]">
      <GamificationProgressCard :wallet="wallet" />

      <section class="wq-panel p-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 class="text-sm font-bold text-highlighted">
            {{ t('wallet.allTransactions') }}
          </h2>
          <USelectMenu
            v-model="type"
            :items="typeOptions"
            value-key="value"
            size="sm"
            class="w-48"
          />
        </div>

        <p
          v-if="!pending && statement.items.length === 0"
          class="mt-8 text-center text-sm text-muted"
        >
          {{ t('wallet.noTransactions') }}
        </p>

        <ul
          v-else
          class="mt-3 divide-y divide-default"
        >
          <li
            v-for="entry in statement.items"
            :key="entry.id"
            class="flex flex-wrap items-center gap-x-3 gap-y-1 py-3"
          >
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-highlighted">
                {{ entry.reason || t(`wallet.type.${entry.type}`) }}
              </p>
              <p class="truncate text-xs text-muted">
                {{ t(`wallet.type.${entry.type}`) }} · {{ format.date(entry.createdAt) }}
              </p>
            </div>

            <div class="text-end">
              <p
                class="text-sm font-black tabular-nums"
                :class="entry.amount >= 0 ? 'text-success' : 'text-error'"
              >
                {{ signedAmount(entry.amount) }}
              </p>
              <p
                v-if="entry.balanceAfter !== null"
                class="text-xs tabular-nums text-muted"
              >
                {{ format.number(entry.balanceAfter) }}
              </p>
            </div>
          </li>
        </ul>

        <div
          v-if="statement.total > pageSize"
          class="mt-4 flex justify-center"
        >
          <UPagination
            v-model:page="page"
            :total="statement.total"
            :items-per-page="pageSize"
          />
        </div>
      </section>
    </div>
  </div>
</template>
