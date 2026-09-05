<script setup lang="ts">
import type { RewardCatalogueItem } from '#shared/types/api'

/**
 * One item on the shelf.
 *
 * Everything the card says about whether it can be redeemed comes from
 * `reward.standing`, which the server computed with the same rules the purchase
 * endpoint enforces. So a card never invites a click that will be refused, and
 * when it does refuse it says why — «موجودی تمام شده» is a fact about the shelf,
 * «به سطح ۵ نیاز دارد» is a goal to work towards. Neither is a red mark.
 */
const props = defineProps<{
  reward: RewardCatalogueItem
  level: number
}>()

const emit = defineEmits<{
  (event: 'open', reward: RewardCatalogueItem): void
}>()

const { t } = useI18n()
const format = useLocaleFormat()
const { typeIcon, blockLabel, blockIcon, typeLabel, isItemLevelBlock } = useRewards()

/**
 * Whether the detail dialog can lead to a purchase.
 *
 * `NOTE_REQUIRED` counts as openable: the note is collected *in* the dialog, so
 * refusing to open it would make the rule impossible to satisfy.
 */
const canOpen = computed(() =>
  props.reward.standing.redeemable || props.reward.standing.code === 'NOTE_REQUIRED',
)

const priceLabel = computed(() => t('rewards.cost', { value: format.number(props.reward.coinCost) }))

const stockLabel = computed(() =>
  props.reward.stock === null
    ? t('rewards.unlimitedStock')
    : t('rewards.stock', { count: format.number(props.reward.stock) }),
)

/** Rule chips, in the order somebody would want to know them. */
const chips = computed(() => {
  const rules = props.reward.rules
  const items: Array<{ icon: string, label: string, tone: string }> = []

  items.push(
    rules.autoApprove
      ? { icon: 'i-heroicons-bolt', label: t('rewards.autoApprove'), tone: 'text-success' }
      : { icon: 'i-heroicons-queue-list', label: t('rewards.manualApproval'), tone: 'text-muted' },
  )

  if (rules.maxPerUser !== null) {
    items.push({ icon: 'i-heroicons-check-badge', label: t('rewards.maxPerUser', { count: format.number(rules.maxPerUser) }), tone: 'text-muted' })
  }
  if (rules.minLevel !== null) {
    const reached = props.level >= rules.minLevel
    items.push({
      icon: reached ? 'i-heroicons-check' : 'i-heroicons-arrow-trending-up',
      label: t('rewards.levelRequired', { level: format.number(rules.minLevel) }),
      tone: reached ? 'text-success' : 'text-warning',
    })
  }
  if (rules.requiresNote) {
    items.push({ icon: 'i-heroicons-pencil-square', label: t('rewards.requiresNote'), tone: 'text-muted' })
  }
  if (rules.availableUntil) {
    items.push({ icon: 'i-heroicons-calendar-days', label: t('rewards.availableUntil', { date: format.shortDate(rules.availableUntil) }), tone: 'text-muted' })
  }
  if (rules.availableFrom) {
    items.push({ icon: 'i-heroicons-clock', label: t('rewards.availableFrom', { date: format.shortDate(rules.availableFrom) }), tone: 'text-muted' })
  }

  return items
})

const buttonLabel = computed(() => {
  const standing = props.reward.standing
  if (standing.redeemable || standing.code === 'NOTE_REQUIRED') return t('rewards.redeem')
  if (standing.code === 'INSUFFICIENT_COINS') return t('rewards.notAffordable')
  if (standing.code === 'OUT_OF_STOCK') return t('rewards.outOfStock')
  return blockLabel(standing.code)
})
</script>

<template>
  <article
    class="wq-panel flex flex-col overflow-hidden transition-colors hover:border-primary/40"
    :class="{ 'opacity-95': !canOpen }"
  >
    <!-- Shelf image, or a tile standing in for one -->
    <div
      v-if="props.reward.imageUrl"
      class="relative h-32 w-full overflow-hidden bg-elevated"
    >
      <img
        :src="props.reward.imageUrl"
        :alt="props.reward.title"
        class="size-full object-cover"
        loading="lazy"
      >
      <span
        v-if="!props.reward.standing.available"
        class="absolute inset-0 grid place-items-center bg-default/70 text-xs font-bold text-highlighted"
      >
        {{ blockLabel(props.reward.standing.code) }}
      </span>
    </div>

    <div class="flex flex-1 flex-col gap-3 p-4 sm:p-5">
      <div class="flex items-start justify-between gap-2">
        <span
          class="grid size-10 shrink-0 place-items-center rounded-xl"
          :class="props.reward.standing.available ? 'bg-primary/10 text-primary' : 'bg-elevated text-muted'"
        >
          <UIcon
            :name="typeIcon(props.reward.type)"
            class="size-5"
          />
        </span>

        <div class="flex flex-col items-end gap-1">
          <UBadge
            color="neutral"
            variant="subtle"
            size="sm"
          >
            {{ typeLabel(props.reward.type) }}
          </UBadge>
          <UBadge
            v-if="props.reward.remainingAllowance === 0"
            color="warning"
            variant="subtle"
            size="sm"
          >
            {{ t('rewards.allowanceReached') }}
          </UBadge>
        </div>
      </div>

      <div class="min-w-0">
        <h3 class="truncate text-sm font-bold text-highlighted">
          {{ props.reward.title }}
        </h3>
        <p
          v-if="props.reward.description"
          class="mt-1 line-clamp-2 text-xs leading-6 text-muted"
        >
          {{ props.reward.description }}
        </p>
      </div>

      <ul class="flex flex-wrap gap-1.5">
        <li
          v-for="chip in chips"
          :key="chip.label"
          class="inline-flex items-center gap-1 rounded-full bg-elevated/70 px-2 py-1 text-[10px] font-semibold"
          :class="chip.tone"
        >
          <UIcon
            :name="chip.icon"
            class="size-3"
          />
          {{ chip.label }}
        </li>
      </ul>

      <!-- How much of their allowance is left, when the company set one -->
      <p
        v-if="props.reward.remainingAllowance !== null && props.reward.remainingAllowance > 0"
        class="text-[11px] text-dimmed"
      >
        {{ t('rewards.remainingAllowance', { count: format.number(props.reward.remainingAllowance) }) }}
      </p>

      <div class="mt-auto flex items-end justify-between gap-3 border-t border-default pt-3">
        <div class="min-w-0">
          <p class="text-lg font-black leading-tight tabular-nums text-coin-600 dark:text-coin-300">
            {{ priceLabel }}
          </p>
          <p
            class="mt-0.5 text-[11px]"
            :class="props.reward.stock === 0 ? 'text-error' : 'text-dimmed'"
          >
            {{ stockLabel }}
          </p>
        </div>

        <UButton
          size="sm"
          :color="canOpen ? 'primary' : 'neutral'"
          :variant="canOpen ? 'solid' : 'outline'"
          :disabled="!canOpen"
          :icon="canOpen ? 'i-heroicons-gift' : blockIcon(props.reward.standing.code!)"
          @click="emit('open', props.reward)"
        >
          {{ buttonLabel }}
        </UButton>
      </div>

      <!-- The reason, spelled out, for anything that is not a shelf problem -->
      <p
        v-if="!canOpen && !isItemLevelBlock(props.reward.standing.code)"
        class="text-[11px] text-muted"
      >
        {{ blockLabel(props.reward.standing.code) }}
      </p>
    </div>
  </article>
</template>
