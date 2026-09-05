<script setup lang="ts">
import type { ChallengeDetailResponse, ChallengeSummary } from '#shared/types/api'
import { challengePercent } from '#shared/utils/challenges'

/**
 * The managers' view of one challenge: the roster with each person's live
 * progress, in the order a manager cares about — finishers first, then the
 * closest to the goal. The data is the server's; this component only sorts
 * and draws it.
 */
const props = defineProps<{
  challenge: ChallengeSummary | null
}>()

const open = defineModel<boolean>('open', { default: false })

const { t } = useI18n()
const format = useLocaleFormat()
const { participantLabel, participantTone, statusLabel, statusTone, goalLabel } = useChallenges()

const { data, status, refresh } = await useFetch<ChallengeDetailResponse>(
  () => (props.challenge ? `/api/challenges/${props.challenge.id}` : '/api/challenges'),
  { immediate: false },
)

// Fetch only while the modal is open; the roster is a deliberate look, not a
// side effect of every list render.
watch(open, (isOpen) => {
  if (isOpen && props.challenge) refresh()
})

/** Finishers first, then whoever is closest to the goal, then by name. */
const rows = computed(() => {
  const rank: Record<string, number> = { CLAIMED: 0, COMPLETED: 0, IN_PROGRESS: 1, NOT_STARTED: 2 }
  return [...(data.value?.participants ?? [])].sort((a, b) =>
    (rank[a.status] ?? 3) - (rank[b.status] ?? 3)
    || b.progress - a.progress
    || a.user.fullName.localeCompare(b.user.fullName, 'fa'),
  )
})
</script>

<template>
  <UModal
    v-model:open="open"
    :title="challenge?.title ?? t('challenges.participantsTitle')"
    :ui="{ content: 'max-w-lg' }"
  >
    <template #body>
      <div
        v-if="challenge"
        class="mb-4 flex flex-wrap items-center gap-2"
      >
        <UBadge
          :color="statusTone(challenge.status)"
          variant="subtle"
          size="sm"
        >
          {{ statusLabel(challenge.status) }}
        </UBadge>
        <span class="text-xs font-semibold text-muted">
          {{ goalLabel(challenge.goalKey, format.number(challenge.goalValue)) }}
        </span>
        <span class="ms-auto text-xs text-dimmed">
          {{ t('challenges.completersCount', { count: format.number(challenge.completersCount) }) }}
        </span>
      </div>

      <div
        v-if="status === 'pending'"
        class="grid gap-2"
      >
        <div
          v-for="row in 4"
          :key="row"
          class="wq-skeleton h-12 rounded-xl"
        />
      </div>

      <ul
        v-else-if="rows.length > 0"
        class="grid max-h-[60vh] gap-2 overflow-y-auto"
      >
        <li
          v-for="participant in rows"
          :key="participant.id"
          class="flex items-center gap-3 rounded-xl bg-elevated/60 p-3"
        >
          <UAvatar
            :src="participant.user.avatarUrl ?? undefined"
            :alt="participant.user.fullName"
            size="sm"
          />

          <div class="min-w-0 flex-1">
            <div class="flex items-baseline justify-between gap-2">
              <p class="truncate text-xs font-bold text-highlighted">
                {{ participant.user.fullName }}
              </p>
              <span class="shrink-0 text-[11px] font-bold tabular-nums text-muted">
                {{ format.number(participant.progress) }}
              </span>
            </div>
            <UProgress
              :model-value="challengePercent(participant.progress, challenge?.goalValue ?? 1)"
              :color="participant.status === 'CLAIMED' || participant.status === 'COMPLETED' ? 'success' : 'primary'"
              size="sm"
              class="mt-1.5"
            />
          </div>

          <UBadge
            :color="participantTone(participant.status)"
            variant="subtle"
            size="sm"
            class="shrink-0"
          >
            {{ participantLabel(participant.status) }}
          </UBadge>
        </li>
      </ul>

      <CommonEmptyState
        v-else
        :title="t('challenges.noParticipants')"
        :description="t('challenges.noParticipantsHint')"
        icon="i-heroicons-users"
      />
    </template>
  </UModal>
</template>
