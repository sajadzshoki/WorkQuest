import type { RedeemBlockCode } from '#shared/utils/marketplace'

/**
 * Presentation vocabulary for the reward store.
 *
 * The *decisions* — what is available, who is eligible, what happens next — come
 * from the API, which gets them from `shared/utils/marketplace.ts`. What lives
 * here is only how to draw them: which icon a reward type gets, which colour a
 * status wears, and which sentence explains a refusal. Keeping the copy in one
 * place means a blocking code can never reach the screen untranslated.
 */

/** Icon per reward type. All names verified against the installed collection. */
const TYPE_ICONS: Record<string, string> = {
  PHYSICAL: 'i-heroicons-cube',
  VOUCHER: 'i-heroicons-gift',
  TIME_OFF: 'i-heroicons-sun',
  DONATION: 'i-heroicons-heart',
  MEAL: 'i-heroicons-cake',
  TICKET: 'i-heroicons-ticket',
  BONUS: 'i-heroicons-banknotes',
  CUSTOM: 'i-heroicons-sparkles',
}

/** Tone per redemption status — a settled request is calm, not alarming. */
const REDEMPTION_TONES: Record<string, 'primary' | 'success' | 'warning' | 'error' | 'neutral' | 'info'> = {
  PENDING: 'warning',
  APPROVED: 'info',
  REJECTED: 'error',
  FULFILLED: 'success',
  CANCELLED: 'neutral',
}

const CATALOG_TONES: Record<string, 'primary' | 'success' | 'warning' | 'error' | 'neutral'> = {
  DRAFT: 'neutral',
  ACTIVE: 'success',
  PAUSED: 'warning',
  ARCHIVED: 'neutral',
}

/**
 * How each refusal reads.
 *
 * Motivating, not humiliating: every one of these says what to do next where
 * there is something to do («سطح بالاتر», «سکه بیشتر»), and states a fact about
 * the shelf where the problem is the shelf («موجودی تمام شده») rather than
 * implying the employee did something wrong.
 */
const BLOCK_ICONS: Record<RedeemBlockCode, string> = {
  INACTIVE_ACCOUNT: 'i-heroicons-no-symbol',
  NOT_LISTED: 'i-heroicons-eye-slash',
  NOT_AVAILABLE_YET: 'i-heroicons-clock',
  EXPIRED: 'i-heroicons-calendar-days',
  OUT_OF_STOCK: 'i-heroicons-archive-box',
  LIMIT_REACHED: 'i-heroicons-check-badge',
  LEVEL_REQUIRED: 'i-heroicons-arrow-trending-up',
  NOTE_REQUIRED: 'i-heroicons-pencil-square',
  INSUFFICIENT_COINS: 'i-heroicons-circle-stack',
}

/** Refusals that are about the shelf rather than the person. */
const ITEM_LEVEL_CODES: ReadonlySet<string> = new Set([
  'NOT_LISTED',
  'NOT_AVAILABLE_YET',
  'EXPIRED',
  'OUT_OF_STOCK',
])

export function useRewards() {
  const { t } = useI18n()

  return {
    typeIcon: (type: string) => TYPE_ICONS[type] ?? 'i-heroicons-gift',
    redemptionTone: (status: string) => REDEMPTION_TONES[status] ?? 'neutral',
    catalogTone: (status: string) => CATALOG_TONES[status] ?? 'neutral',
    blockIcon: (code: RedeemBlockCode) => BLOCK_ICONS[code] ?? 'i-heroicons-information-circle',
    blockLabel: (code: RedeemBlockCode | null) => (code ? t(`rewards.block.${code}`) : ''),
    isItemLevelBlock: (code: RedeemBlockCode | null) => Boolean(code && ITEM_LEVEL_CODES.has(code)),
    statusLabel: (status: string) => t(`status.redemption.${status}`),
    catalogStatusLabel: (status: string) => t(`status.catalog.${status}`),
    typeLabel: (type: string) => t(`rewards.type.${type}`),
  }
}
