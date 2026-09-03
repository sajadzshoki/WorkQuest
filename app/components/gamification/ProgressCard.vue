<script setup lang="ts">
/**
 * The employee's gamification home: level, XP progress, coin balance and the
 * most recent ledger rows, in one card.
 *
 * It renders server-computed values only. Every number here — the level, the
 * percentage, the balance — arrives from `/api/wallet` already decided; the
 * component's job is presentation. Recomputing any of it client-side would be
 * a second implementation of the economy that could disagree with the ledger.
 */

interface WalletTransaction {
  id: string
  amount: number
  type: string
  reason: string | null
  balanceAfter: number | null
  createdAt: string
}

interface WalletState {
  xp: number
  lifetimeXp: number
  level: { current: number, title: string | null, percent: number, currentXp: number, neededXp: number }
  coins: { balance: number, lifetimeEarned: number, lifetimeSpent: number }
  streak: { current: number, longest: number }
  recentTransactions: WalletTransaction[]
}

const props = withDefaults(defineProps<{ wallet?: WalletState | null, compact?: boolean }>(), {
  wallet: null,
  compact: false,
})

const { t } = useI18n()
const format = useLocaleFormat()

const wallet = computed(() => props.wallet)
const transactions = computed(() => wallet.value?.recentTransactions ?? [])

function amountClass(amount: number): string {
  return amount >= 0 ? 'text-success' : 'text-error'
}

/** Signed, in the reader's locale: «+۱۲۰» / «−۵۰». */
function signedAmount(amount: number): string {
  const sign = amount >= 0 ? '+' : '−'
  return `${sign}${format.number(Math.abs(amount))}`
}

function typeLabel(type: string): string {
  return t(`wallet.type.${type}`)
}

function typeIcon(type: string): string {
  switch (type) {
    case 'TASK_REWARD': return 'i-heroicons-clipboard-document-check'
    case 'RECOGNITION_REWARD': return 'i-heroicons-hand-thumb-up'
    case 'CHALLENGE_REWARD': return 'i-heroicons-flag'
    case 'REWARD_REDEMPTION': return 'i-heroicons-gift'
    default: return 'i-heroicons-adjustments-horizontal'
  }
}
</script>

<template>
  <section class="wq-panel overflow-hidden">
    <!-- Level & XP -->
    <div class="relative bg-gradient-to-bl from-primary/15 via-primary/5 to-transparent p-5">
      <div class="flex items-center gap-4">
        <GamificationXpProgress
          :level="wallet?.level.current ?? 1"
          :title="wallet?.level.title"
          :percent="wallet?.level.percent ?? 0"
          :current-xp="wallet?.level.currentXp"
          :needed-xp="wallet?.level.neededXp"
        />
      </div>

      <dl class="mt-5 grid grid-cols-3 gap-3 text-center">
        <div>
          <dt class="text-xs text-muted">
            {{ t('gamification.xp') }}
          </dt>
          <dd class="mt-1 text-lg font-black tabular-nums text-highlighted">
            {{ format.number(wallet?.xp ?? 0) }}
          </dd>
        </div>
        <div>
          <dt class="text-xs text-muted">
            {{ t('wallet.balance') }}
          </dt>
          <dd class="mt-1 text-lg font-black tabular-nums text-coin-600 dark:text-coin-300">
            {{ format.number(wallet?.coins.balance ?? 0) }}
          </dd>
        </div>
        <div>
          <dt class="text-xs text-muted">
            {{ t('gamification.currentStreak') }}
          </dt>
          <dd class="mt-1 text-lg font-black tabular-nums text-streak-600 dark:text-streak-400">
            {{ format.number(wallet?.streak.current ?? 0) }}
          </dd>
        </div>
      </dl>
    </div>

    <!-- Lifetime coin totals -->
    <div
      v-if="!props.compact"
      class="grid grid-cols-2 gap-px border-y border-default bg-default"
    >
      <div class="bg-elevated/40 p-4">
        <p class="text-xs text-muted">
          {{ t('wallet.lifetimeEarned') }}
        </p>
        <p class="mt-1 font-bold tabular-nums text-success">
          {{ format.number(wallet?.coins.lifetimeEarned ?? 0) }}
        </p>
      </div>
      <div class="bg-elevated/40 p-4">
        <p class="text-xs text-muted">
          {{ t('wallet.lifetimeSpent') }}
        </p>
        <p class="mt-1 font-bold tabular-nums text-muted">
          {{ format.number(wallet?.coins.lifetimeSpent ?? 0) }}
        </p>
      </div>
    </div>

    <!-- Recent ledger -->
    <div class="p-5">
      <div class="flex items-center justify-between gap-2">
        <h3 class="text-sm font-bold text-highlighted">
          {{ t('wallet.recentTransactions') }}
        </h3>
        <UButton
          to="/wallet"
          variant="link"
          size="xs"
          trailing-icon="i-heroicons-arrow-left"
        >
          {{ t('wallet.allTransactions') }}
        </UButton>
      </div>

      <p
        v-if="transactions.length === 0"
        class="mt-4 text-center text-sm text-muted"
      >
        {{ t('wallet.noTransactions') }}
      </p>

      <ul
        v-else
        class="mt-3 divide-y divide-default"
      >
        <li
          v-for="entry in transactions"
          :key="entry.id"
          class="flex items-center gap-3 py-2.5"
        >
          <span
            class="grid size-9 shrink-0 place-items-center rounded-lg bg-elevated text-muted"
          >
            <UIcon
              :name="typeIcon(entry.type)"
              class="size-4.5"
            />
          </span>

          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-highlighted">
              {{ entry.reason || typeLabel(entry.type) }}
            </p>
            <p class="truncate text-xs text-muted">
              {{ typeLabel(entry.type) }} · {{ format.relative(entry.createdAt) }}
            </p>
          </div>

          <span
            class="shrink-0 text-sm font-black tabular-nums"
            :class="amountClass(entry.amount)"
          >
            {{ signedAmount(entry.amount) }}
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>
