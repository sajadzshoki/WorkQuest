<script setup lang="ts">
import type { ApiErrorBody } from '#shared/types/api'

definePageMeta({ middleware: ['auth'] })

interface BoardResponse {
  cycle: {
    id: string
    frequency: 'WEEKLY' | 'MONTHLY'
    title: string | null
    startsAt: string
    endsAt: string
    finalizedAt: string | null
  }
  categories: Array<{
    id: string
    name: string
    description: string | null
    iconKey: string | null
    tone: string | null
    myVote: { id: string, fullName: string, avatarUrl: string | null } | null
  }>
  coworkers: Array<{ id: string, fullName: string, avatarUrl: string | null, jobTitle: string | null }>
  results: Array<{
    id: string
    frequency: 'WEEKLY' | 'MONTHLY'
    title: string | null
    startsAt: string
    endsAt: string
    finalizedAt: string | null
    winners: Array<{
      id: string
      voteCount: number
      titleName: string | null
      xpReward: number
      coinReward: number
      user: { id: string, fullName: string, avatarUrl: string | null, jobTitle: string | null }
      category: { id: string, name: string, iconKey: string | null, tone: string | null }
    }>
  }>
}

const { t } = useI18n()
const format = useLocaleFormat()
const localePath = useLocalePath()
const toast = useToast()
const { can } = useCan()

const { data, refresh } = await useFetch<BoardResponse>('/api/recognition')

const pickerOpen = ref(false)
const activeCategory = ref<BoardResponse['categories'][number] | null>(null)
const voting = ref(false)

const cycleLabel = computed(() => t(`recognition.frequency.${data.value?.cycle.frequency ?? 'WEEKLY'}`))

const cycleRange = computed(() => {
  const cycle = data.value?.cycle
  if (!cycle) return ''
  const range = `${format.shortDate(cycle.startsAt)} — ${format.shortDate(cycle.endsAt)}`
  return cycle.title ? `${cycle.title} · ${range}` : range
})

const daysLeft = computed(() => {
  const endsAt = data.value?.cycle.endsAt
  if (!endsAt) return null
  return Math.max(0, Math.ceil((new Date(endsAt).getTime() - Date.now()) / 86_400_000))
})

function openPicker(category: BoardResponse['categories'][number]) {
  activeCategory.value = category
  pickerOpen.value = true
}

async function select(coworkerId: string) {
  const category = activeCategory.value
  if (!category || voting.value) return

  voting.value = true
  try {
    await $fetch('/api/recognition/vote', {
      method: 'POST',
      body: { categoryId: category.id, nomineeId: coworkerId },
    })

    toast.add({
      title: t('recognition.voteSuccess'),
      color: 'success',
      icon: 'i-heroicons-hand-thumb-up',
    })

    pickerOpen.value = false
    await refresh()
  }
  catch (error) {
    const body = (error as { data?: ApiErrorBody }).data
    toast.add({
      title: body?.message ?? t('recognition.duplicateVoteError'),
      color: 'error',
      icon: 'i-heroicons-exclamation-triangle',
    })
  }
  finally {
    voting.value = false
  }
}
</script>

<template>
  <div>
    <CommonPageHeader
      :title="t('recognition.title')"
      :subtitle="t('recognition.subtitle')"
    >
      <template #actions>
        <UButton
          v-if="can('recognition:manage')"
          icon="i-heroicons-cog-6-tooth"
          color="neutral"
          variant="soft"
          :to="localePath('/recognition/admin')"
        >
          {{ t('recognition.admin.title') }}
        </UButton>
      </template>
    </CommonPageHeader>

    <!-- Cycle banner -->
    <div class="wq-panel mb-4 flex flex-wrap items-center justify-between gap-3 p-4">
      <div class="flex items-center gap-3">
        <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
          <UIcon
            name="i-heroicons-calendar-days"
            class="size-5"
          />
        </span>
        <div>
          <p class="text-sm font-bold text-highlighted">
            {{ t('recognition.cycle') }} — {{ cycleLabel }}
          </p>
          <p class="text-xs text-muted">
            {{ cycleRange }}
          </p>
        </div>
      </div>

      <UBadge
        :color="daysLeft !== null && daysLeft > 0 ? 'primary' : 'warning'"
        variant="subtle"
        size="md"
      >
        <template v-if="daysLeft !== null && daysLeft > 0">
          {{ t('recognition.endsIn', { days: format.number(daysLeft) }) }}
        </template>
        <template v-else>
          {{ t('recognition.ended') }}
        </template>
      </UBadge>
    </div>

    <!-- Categories -->
    <CommonEmptyState
      v-if="!data?.categories.length"
      class="wq-panel"
      icon="i-heroicons-sparkles"
      :title="t('recognition.noResults')"
    />

    <div
      v-else
      class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      <RecognitionCategoryCard
        v-for="category in data.categories"
        :key="category.id"
        :name="category.name"
        :description="category.description"
        :icon-key="category.iconKey"
        :tone="category.tone"
        :my-vote="category.myVote"
        @pick="openPicker(category)"
      >
        <template #pick-label>
          {{ t('recognition.vote') }}
        </template>
        <template #your-vote-label>
          {{ t('recognition.yourVote') }}
        </template>
      </RecognitionCategoryCard>
    </div>

    <p class="mt-3 flex items-center gap-1.5 text-xs text-dimmed">
      <UIcon
        name="i-heroicons-lock-closed"
        class="size-3.5"
      />
      {{ t('recognition.privacyNote') }}
    </p>

    <!-- Results -->
    <h2 class="mt-8 flex items-center gap-2 text-lg font-bold text-highlighted">
      <UIcon
        name="i-heroicons-trophy"
        class="size-5 text-coin-500"
      />
      {{ t('recognition.results') }}
    </h2>

    <template v-if="data?.results.length">
      <div
        v-for="cycle in data.results"
        :key="cycle.id"
        class="mt-4"
      >
        <p class="mb-2 text-xs font-semibold text-muted">
          {{ cycle.title ?? `${t(`recognition.frequency.${cycle.frequency}`)} · ${format.shortDate(cycle.endsAt)}` }}
        </p>

        <CommonEmptyState
          v-if="!cycle.winners.length"
          class="wq-panel"
          icon="i-heroicons-user-group"
          :title="t('recognition.noWinners')"
        />

        <div
          v-else
          class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <RecognitionWinnerCard
            v-for="winner in cycle.winners"
            :key="winner.id"
            :winner="winner.user"
            :category-name="winner.category.name"
            :category-icon="winner.category.iconKey"
            :tone="winner.category.tone"
            :title-name="winner.titleName"
            :vote-count="winner.voteCount"
            :xp-reward="winner.xpReward"
            :coin-reward="winner.coinReward"
          />
        </div>
      </div>
    </template>

    <CommonEmptyState
      v-else
      class="wq-panel mt-4"
      icon="i-heroicons-trophy"
      :title="t('recognition.noResults')"
    />

    <RecognitionCoworkerPicker
      :open="pickerOpen"
      :category-name="activeCategory?.name ?? ''"
      :coworkers="data?.coworkers ?? []"
      :pending="voting"
      @update:open="pickerOpen = $event"
      @select="select"
    />
  </div>
</template>
