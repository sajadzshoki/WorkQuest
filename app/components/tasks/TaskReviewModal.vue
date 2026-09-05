<script setup lang="ts">
import type { RewardBreakdown } from '#shared/utils/rewards'

/**
 * The manager's review surface: quality, timeliness, an overall score, and a
 * live preview of exactly what approving will pay.
 *
 * The preview comes from `POST /api/rewards/preview`, which runs the same
 * `calculateReward` the approval will run. This component performs **no**
 * reward arithmetic of its own — that is the whole point. If the economy
 * changes, this screen follows automatically, and it can never quote a number
 * the ledger then disagrees with.
 */

const props = defineProps<{
  taskId: string
  taskTitle: string
}>()

const emit = defineEmits<{ reviewed: [] }>()

const open = defineModel<boolean>('open', { default: false })

const { t } = useI18n()
const format = useLocaleFormat()
const toast = useToast()
const { celebrate } = useCelebration()

const score = ref(85)
const quality = ref(4)
const timeliness = ref(4)
const note = ref('')
const submitting = ref(false)

const preview = ref<(RewardBreakdown & { ruleVersion: number }) | null>(null)
const previewing = ref(false)

/** Shape of `POST /api/tasks/:id/transition` for the celebration triggers. */
interface TransitionResult {
  payout: { applied: boolean, xp: number, coins: number, balance: number, level: number, levelUp: boolean } | null
  gamification: {
    streak: { current: number, longest: number, changed: boolean }
    achievements: Array<{ key: string, title: string }>
    badges: Array<{ id: string, name: string }>
  } | null
  /** Challenges this approval pushed over the line (paid to the assignee). */
  challengeCompletions: Array<{ challengeId: string, title: string, xp: number, coins: number }> | null
}

/** 1-5 pickers render as buttons rather than a select: faster on mobile. */
const RATINGS = [1, 2, 3, 4, 5] as const

/**
 * Ask the server what this score is worth.
 *
 * Debounced because the score is a slider — without it, dragging would fire a
 * request per pixel.
 */
let timer: ReturnType<typeof setTimeout> | undefined
function schedulePreview(): void {
  clearTimeout(timer)
  timer = setTimeout(refreshPreview, 250)
}

async function refreshPreview(): Promise<void> {
  previewing.value = true
  try {
    const result = await $fetch<{ reward: RewardBreakdown & { ruleVersion: number } }>(
      '/api/rewards/preview',
      {
        method: 'POST',
        body: { taskId: props.taskId, score: score.value, qualityScore: quality.value },
      },
    )
    preview.value = result.reward
  }
  catch {
    // A failed preview must not block the review; the payout is authoritative
    // either way, so we simply show nothing rather than a stale number.
    preview.value = null
  }
  finally {
    previewing.value = false
  }
}

watch([score, quality], schedulePreview)
watch(open, (isOpen) => {
  if (isOpen) refreshPreview()
})

onUnmounted(() => clearTimeout(timer))

async function submit(action: 'approve' | 'request_revision'): Promise<void> {
  if (action === 'request_revision' && !note.value.trim()) {
    toast.add({ title: t('review.revisionNoteRequired'), color: 'warning' })
    return
  }

  submitting.value = true
  try {
    const result = await $fetch<TransitionResult>(`/api/tasks/${props.taskId}/transition`, {
      method: 'POST',
      body: {
        action,
        note: note.value.trim() || undefined,
        ...(action === 'approve'
          ? { score: score.value, qualityScore: quality.value, timelinessScore: timeliness.value }
          : {}),
      },
    })

    toast.add({
      title: action === 'approve' ? t('review.approved') : t('review.revisionRequested'),
      color: 'success',
    })

    // Subtle unlock celebrations — the numbers come straight from the server's
    // payout + gamification pass, never recomputed here.
    if (action === 'approve') {
      const payout = result.payout
      if (payout && payout.coins > 0) {
        celebrate({
          type: 'coins',
          title: t('celebration.coinsEarned', { amount: format.number(payout.coins) }),
          detail: props.taskTitle,
        })
      }
      if (payout?.levelUp) {
        celebrate({
          type: 'level',
          title: t('celebration.levelUp', { level: format.number(payout.level) }),
        })
      }
      for (const unlocked of result.gamification?.achievements ?? []) {
        celebrate({
          type: 'achievement',
          title: unlocked.title,
          detail: t('celebration.achievementUnlocked'),
        })
      }
      for (const badge of result.gamification?.badges ?? []) {
        celebrate({
          type: 'badge',
          title: badge.name,
          detail: t('celebration.badgeUnlocked'),
        })
      }

      // A goal this approval pushed over the line is already paid — say so,
      // in the reviewer's own language, without claiming whose bar it was.
      for (const completion of result.challengeCompletions ?? []) {
        toast.add({
          title: t('review.challengeCompleted', { title: completion.title }),
          color: 'success',
          icon: 'i-heroicons-flag',
        })
      }
    }

    open.value = false
    emit('reviewed')
  }
  catch (error) {
    const message = (error as { data?: { message?: string } })?.data?.message
    toast.add({ title: message || t('errors.generic'), color: 'error' })
  }
  finally {
    submitting.value = false
  }
}

/** Basis points → a readable multiplier, e.g. «۱٫۳۵×». */
function asMultiplier(bp: number): string {
  return `${format.number(bp / 10_000, 2)}×`
}

function signedBp(bp: number): string {
  const sign = bp >= 0 ? '+' : '−'
  return `${sign}${format.number(Math.abs(bp) / 100, 0)}٪`
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="t('review.title')"
    :description="props.taskTitle"
  >
    <template #body>
      <div class="space-y-6">
        <!-- Quality -->
        <div>
          <p class="mb-2 text-sm font-medium text-highlighted">
            {{ t('review.quality') }}
          </p>
          <div class="flex gap-2">
            <UButton
              v-for="value in RATINGS"
              :key="`q-${value}`"
              :variant="quality === value ? 'solid' : 'outline'"
              :color="quality === value ? 'primary' : 'neutral'"
              size="lg"
              class="flex-1 justify-center tabular-nums"
              @click="quality = value"
            >
              {{ format.number(value) }}
            </UButton>
          </div>
        </div>

        <!-- Timeliness -->
        <div>
          <p class="mb-2 text-sm font-medium text-highlighted">
            {{ t('review.timeliness') }}
          </p>
          <div class="flex gap-2">
            <UButton
              v-for="value in RATINGS"
              :key="`t-${value}`"
              :variant="timeliness === value ? 'solid' : 'outline'"
              :color="timeliness === value ? 'primary' : 'neutral'"
              size="lg"
              class="flex-1 justify-center tabular-nums"
              @click="timeliness = value"
            >
              {{ format.number(value) }}
            </UButton>
          </div>
        </div>

        <!-- Overall score -->
        <div>
          <div class="mb-2 flex items-baseline justify-between">
            <p class="text-sm font-medium text-highlighted">
              {{ t('review.overall') }}
            </p>
            <p class="text-lg font-black tabular-nums text-primary">
              {{ format.number(score) }}
            </p>
          </div>
          <USlider
            v-model="score"
            :min="0"
            :max="100"
            :step="1"
          />
        </div>

        <!-- Reward preview -->
        <div class="wq-panel bg-elevated/40 p-4">
          <div class="flex items-center justify-between gap-2">
            <p class="text-sm font-bold text-highlighted">
              {{ t('review.rewardPreview') }}
            </p>
            <UBadge
              v-if="preview"
              variant="subtle"
              color="neutral"
            >
              {{ t(`review.band.${preview.band}`) }}
            </UBadge>
          </div>

          <div class="mt-3 grid grid-cols-3 gap-3 text-center">
            <div>
              <p class="text-xs text-muted">
                {{ t('review.xpEarned') }}
              </p>
              <p class="mt-1 text-xl font-black tabular-nums text-primary">
                {{ format.number(preview?.xp ?? 0) }}
              </p>
            </div>
            <div>
              <p class="text-xs text-muted">
                {{ t('review.coinsEarned') }}
              </p>
              <p class="mt-1 text-xl font-black tabular-nums text-coin-600 dark:text-coin-300">
                {{ format.number(preview?.coins ?? 0) }}
              </p>
            </div>
            <div>
              <p class="text-xs text-muted">
                {{ t('review.multiplier') }}
              </p>
              <p class="mt-1 text-xl font-black tabular-nums text-highlighted">
                {{ preview ? asMultiplier(preview.multiplierBp) : '—' }}
              </p>
            </div>
          </div>

          <!-- Why that number -->
          <ul
            v-if="preview && preview.factors.length > 0"
            class="mt-4 space-y-1.5 border-t border-default pt-3"
          >
            <li
              v-for="factor in preview.factors"
              :key="factor.key"
              class="flex items-center justify-between gap-2 text-xs"
            >
              <span class="truncate text-muted">
                {{ t(`review.factor.${factor.key}`, factor.key) }}
              </span>
              <span
                class="shrink-0 font-bold tabular-nums"
                :class="factor.kind === 'penalty' ? 'text-error' : 'text-success'"
              >
                {{ signedBp(factor.bp) }}
              </span>
            </li>
          </ul>

          <p
            v-if="previewing"
            class="mt-3 text-xs text-muted"
          >
            …
          </p>
        </div>

        <!-- Comment -->
        <UFormField :label="t('review.comment')">
          <UTextarea
            v-model="note"
            :rows="3"
            :placeholder="t('review.commentPlaceholder')"
            class="w-full"
          />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full flex-col gap-2 sm:flex-row-reverse">
        <UButton
          color="success"
          size="lg"
          icon="i-heroicons-check-circle"
          :loading="submitting"
          class="justify-center sm:flex-1"
          @click="submit('approve')"
        >
          {{ t('review.approve') }}
        </UButton>
        <UButton
          color="warning"
          variant="soft"
          size="lg"
          icon="i-heroicons-arrow-uturn-left"
          :loading="submitting"
          class="justify-center sm:flex-1"
          @click="submit('request_revision')"
        >
          {{ t('review.requestRevision') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
