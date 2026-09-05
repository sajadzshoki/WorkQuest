<script setup lang="ts">
import type { ApiErrorBody, ChallengeListResponse, ChallengeSummary } from '#shared/types/api'
import type { ChallengeStatus } from '#shared/utils/challenges'

definePageMeta({ middleware: ['auth'] })

/**
 * The challenge board.
 *
 * One screen with three jobs: show the races that are running (with the
 * caller's own bar for an individual challenge and the shared one for a team
 * push), show how they ended, and — for callers who may manage challenges —
 * publish, edit (before the start), cancel and inspect the roster.
 *
 * Every number on this page was computed by the server from real application
 * data; reading the page also refreshes it, so a challenge that just expired
 * or was just won is never shown stale.
 */
const { t } = useI18n()
const toast = useToast()
const { can } = useCan()
const { statusLabel } = useChallenges()

const { data, status, refresh } = await useFetch<ChallengeListResponse>('/api/challenges')

const items = computed(() => data.value?.items ?? [])
const counts = computed(() => data.value?.counts ?? {})

// --- filters -----------------------------------------------------------------

type Filter = 'all' | ChallengeStatus

const activeFilter = ref<Filter>('all')

const filters = computed<Array<{ key: Filter, label: string, count: number }>>(() => {
  const entries: Array<{ key: Filter, label: string, count: number }> = [
    { key: 'all', label: t('challenges.filter.all'), count: items.value.length },
  ]
  // Only the statuses the caller can actually see get a chip.
  for (const status of ['ACTIVE', 'DRAFT', 'COMPLETED', 'ENDED'] as const) {
    const count = counts.value[status] ?? 0
    if (count > 0) entries.push({ key: status, label: statusLabel(status), count })
  }
  return entries
})

const visible = computed(() =>
  activeFilter.value === 'all'
    ? items.value
    : items.value.filter(item => item.status === activeFilter.value))

const running = computed(() => visible.value.filter(item => item.status === 'ACTIVE'))
const rest = computed(() => visible.value.filter(item => item.status !== 'ACTIVE'))

// --- management ---------------------------------------------------------------

const canManage = computed(() => can('challenge:manage'))

const formOpen = ref(false)
const editing = ref<ChallengeSummary | null>(null)
const participantsOpen = ref(false)
const participantsOf = ref<ChallengeSummary | null>(null)
const cancelling = ref<ChallengeSummary | null>(null)
const cancelPending = ref(false)

function openCreate() {
  editing.value = null
  formOpen.value = true
}

function openEdit(challenge: ChallengeSummary) {
  editing.value = challenge
  formOpen.value = true
}

function openParticipants(challenge: ChallengeSummary) {
  participantsOf.value = challenge
  participantsOpen.value = true
}

function onSaved(_challenge: ChallengeSummary) {
  refresh()
}

async function confirmCancel() {
  const challenge = cancelling.value
  if (!challenge || cancelPending.value) return
  cancelPending.value = true

  try {
    await $fetch(`/api/challenges/${challenge.id}/cancel`, { method: 'POST' })
    toast.add({
      title: t('challenges.cancelled'),
      color: 'neutral',
      icon: 'i-heroicons-x-circle',
    })
    cancelling.value = null
    await refresh()
  }
  catch (error) {
    const body = (error as { data?: ApiErrorBody }).data
    toast.add({
      title: body?.message ?? t('errors.generic'),
      color: 'error',
      icon: 'i-heroicons-exclamation-triangle',
    })
  }
  finally {
    cancelPending.value = false
  }
}
</script>

<template>
  <div>
    <CommonPageHeader
      :title="t('challenges.title')"
      :subtitle="t('challenges.subtitle')"
    >
      <template #actions>
        <UButton
          v-if="canManage"
          icon="i-heroicons-plus"
          :label="t('challenges.createTitle')"
          @click="openCreate"
        />
      </template>
    </CommonPageHeader>

    <!-- Status chips: only the buckets that have something in them. -->
    <div
      v-if="filters.length > 2"
      class="mb-5 flex flex-wrap gap-1.5"
    >
      <button
        v-for="filter in filters"
        :key="filter.key"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors"
        :class="activeFilter === filter.key
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-default text-muted hover:border-primary/40 hover:text-highlighted'"
        @click="activeFilter = filter.key"
      >
        {{ filter.label }}
        <span class="tabular-nums opacity-70">{{ filter.count }}</span>
      </button>
    </div>

    <div
      v-if="status === 'pending'"
      class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <div
        v-for="row in 3"
        :key="row"
        class="wq-skeleton h-64 rounded-2xl"
      />
    </div>

    <template v-else>
      <!-- The live races. -->
      <div
        v-if="running.length > 0"
        class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        <ChallengesChallengeCard
          v-for="challenge in running"
          :key="challenge.id"
          :challenge="challenge"
          @edit="openEdit"
          @cancel="cancelling = $event"
          @participants="openParticipants"
        />
      </div>

      <!-- Everything else, clearly below the fold of "now". -->
      <div
        v-if="rest.length > 0"
        :class="running.length > 0 ? 'mt-8' : ''"
      >
        <h2
          v-if="running.length > 0"
          class="mb-4 text-sm font-black text-muted"
        >
          {{ t('challenges.history') }}
        </h2>
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ChallengesChallengeCard
            v-for="challenge in rest"
            :key="challenge.id"
            :challenge="challenge"
            @edit="openEdit"
            @cancel="cancelling = $event"
            @participants="openParticipants"
          />
        </div>
      </div>

      <CommonEmptyState
        v-if="items.length === 0"
        :title="t('challenges.empty')"
        :description="canManage ? t('challenges.emptyManageHint') : t('challenges.emptyHint')"
        icon="i-heroicons-flag"
      >
        <UButton
          v-if="canManage"
          icon="i-heroicons-plus"
          :label="t('challenges.createTitle')"
          @click="openCreate"
        />
      </CommonEmptyState>

      <CommonEmptyState
        v-else-if="visible.length === 0"
        :title="t('challenges.filterEmpty')"
        icon="i-heroicons-funnel"
      />
    </template>

    <!-- Create / edit -->
    <ChallengesChallengeFormModal
      v-model:open="formOpen"
      :challenge="editing"
      @saved="onSaved"
    />

    <!-- The roster, for callers who may manage the challenge -->
    <ChallengesChallengeParticipantsModal
      v-model:open="participantsOpen"
      :challenge="participantsOf"
    />

    <!-- Cancellation is a two-step action: it cannot be undone. -->
    <UModal
      :open="cancelling !== null"
      :title="t('challenges.cancelTitle')"
      :ui="{ content: 'max-w-md' }"
      @update:open="value => !value && (cancelling = null)"
    >
      <template #body>
        <p class="text-sm leading-7 text-muted">
          {{ t('challenges.cancelConfirm', { title: cancelling?.title ?? '' }) }}
        </p>
        <p class="mt-2 text-xs text-dimmed">
          {{ t('challenges.cancelNote') }}
        </p>
        <div class="mt-5 flex items-center justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            :label="t('shared.cancel')"
            @click="cancelling = null"
          />
          <UButton
            color="error"
            icon="i-heroicons-x-circle"
            :loading="cancelPending"
            :label="t('challenges.cancelConfirmAction')"
            @click="confirmCancel"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
