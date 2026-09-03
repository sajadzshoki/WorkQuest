<script setup lang="ts">
import type { ApiErrorBody } from '#shared/types/api'

definePageMeta({ middleware: ['auth'] })

interface AdminResponse {
  cycle: { id: string, frequency: 'WEEKLY' | 'MONTHLY', startsAt: string, endsAt: string }
  categories: Array<{
    id: string
    name: string
    description: string | null
    iconKey: string | null
    tone: string | null
    sortOrder: number
    isActive: boolean
    xpReward: number
    coinReward: number
    title: { id: string, name: string } | null
    badge: { id: string, name: string } | null
    voteCount: number
  }>
  titles: Array<{ id: string, name: string, description: string | null, isSystem: boolean }>
  badges: Array<{ id: string, name: string, description: string | null, iconKey: string | null, tone: string | null }>
}

const { t } = useI18n()
const format = useLocaleFormat()
const toast = useToast()

const { data, refresh } = await useFetch<AdminResponse>('/api/recognition/admin')

const cycleRange = computed(() => {
  const cycle = data.value?.cycle
  if (!cycle) return ''
  return `${format.shortDate(cycle.startsAt)} — ${format.shortDate(cycle.endsAt)}`
})

const frequency = ref<'WEEKLY' | 'MONTHLY'>('WEEKLY')
watchEffect(() => {
  if (data.value?.cycle.frequency) frequency.value = data.value.cycle.frequency
})

const savingCycle = ref(false)
const finalizing = ref(false)

async function saveCycle() {
  savingCycle.value = true
  try {
    await $fetch('/api/recognition/cycle', { method: 'PUT', body: { frequency: frequency.value } })
    toast.add({ title: t('recognition.admin.saveCycle'), color: 'success' })
    await refresh()
  }
  catch (error) {
    toast.add({ title: (error as { data?: ApiErrorBody }).data?.message ?? t('common.retry'), color: 'error' })
  }
  finally {
    savingCycle.value = false
  }
}

async function finalizeNow() {
  finalizing.value = true
  try {
    await $fetch('/api/recognition/finalize', { method: 'POST' })
    toast.add({ title: t('recognition.admin.finalizeSuccess'), color: 'success' })
    await refresh()
  }
  catch (error) {
    toast.add({ title: (error as { data?: ApiErrorBody }).data?.message ?? t('common.retry'), color: 'error' })
  }
  finally {
    finalizing.value = false
  }
}

// --- Category form -----------------------------------------------------------

const toneOptions = [
  { label: 'بنفش', value: 'primary' },
  { label: 'طلایی', value: 'coin' },
  { label: 'آتشی', value: 'streak' },
  { label: 'سبز', value: 'success' },
  { label: 'آبی', value: 'info' },
  { label: 'کهربایی', value: 'warning' },
  { label: 'خاکستری', value: 'neutral' },
]

const titleOptions = computed(() =>
  (data.value?.titles ?? []).map(title => ({ label: title.name, value: title.id })),
)

const badgeOptions = computed(() => [
  { label: t('recognition.admin.badgePlaceholder'), value: '' },
  ...(data.value?.badges ?? []).map(badge => ({ label: badge.name, value: badge.id })),
])

interface CategoryForm {
  id: string | null
  name: string
  description: string
  iconKey: string
  tone: string
  xpReward: number
  coinReward: number
  titleId: string
  badgeId: string
}

const categoryModalOpen = ref(false)
const categoryPending = ref(false)
const categoryForm = reactive<CategoryForm>({
  id: null,
  name: '',
  description: '',
  iconKey: '',
  tone: 'primary',
  xpReward: 0,
  coinReward: 0,
  titleId: '',
  badgeId: '',
})

function openCreateCategory() {
  Object.assign(categoryForm, {
    id: null, name: '', description: '', iconKey: '', tone: 'primary',
    xpReward: 0, coinReward: 0, titleId: '', badgeId: '',
  })
  categoryModalOpen.value = true
}

function openEditCategory(category: AdminResponse['categories'][number]) {
  Object.assign(categoryForm, {
    id: category.id,
    name: category.name,
    description: category.description ?? '',
    iconKey: category.iconKey ?? '',
    tone: category.tone ?? 'primary',
    xpReward: category.xpReward,
    coinReward: category.coinReward,
    titleId: category.title?.id ?? '',
    badgeId: category.badge?.id ?? '',
  })
  categoryModalOpen.value = true
}

async function saveCategory() {
  categoryPending.value = true
  try {
    const body = {
      name: categoryForm.name,
      description: categoryForm.description || undefined,
      iconKey: categoryForm.iconKey || undefined,
      tone: categoryForm.tone,
      xpReward: categoryForm.xpReward,
      coinReward: categoryForm.coinReward,
      titleId: categoryForm.titleId || null,
      badgeId: categoryForm.badgeId || null,
    }
    if (categoryForm.id) {
      await $fetch(`/api/recognition/categories/${categoryForm.id}`, { method: 'PATCH', body })
    }
    else {
      await $fetch('/api/recognition/categories', { method: 'POST', body })
    }
    toast.add({ title: t('recognition.admin.save'), color: 'success' })
    categoryModalOpen.value = false
    await refresh()
  }
  catch (error) {
    toast.add({ title: (error as { data?: ApiErrorBody }).data?.message ?? t('common.retry'), color: 'error' })
  }
  finally {
    categoryPending.value = false
  }
}

async function toggleCategory(category: AdminResponse['categories'][number]) {
  try {
    await $fetch(`/api/recognition/categories/${category.id}`, {
      method: 'PATCH',
      body: { isActive: !category.isActive },
    })
    await refresh()
  }
  catch (error) {
    toast.add({ title: (error as { data?: ApiErrorBody }).data?.message ?? t('common.retry'), color: 'error' })
  }
}

// --- Title form --------------------------------------------------------------

const titleModalOpen = ref(false)
const titlePending = ref(false)
const titleForm = reactive({ name: '', description: '' })

function openNewTitle() {
  titleForm.name = ''
  titleForm.description = ''
  titleModalOpen.value = true
}

async function saveTitle() {
  titlePending.value = true
  try {
    await $fetch('/api/recognition/titles', {
      method: 'POST',
      body: { name: titleForm.name, description: titleForm.description || undefined },
    })
    toast.add({ title: t('recognition.admin.save'), color: 'success' })
    titleModalOpen.value = false
    await refresh()
  }
  catch (error) {
    toast.add({ title: (error as { data?: ApiErrorBody }).data?.message ?? t('common.retry'), color: 'error' })
  }
  finally {
    titlePending.value = false
  }
}
</script>

<template>
  <div>
    <CommonPageHeader
      :title="t('recognition.admin.title')"
      :subtitle="t('recognition.admin.subtitle')"
    />

    <div class="grid gap-4 lg:grid-cols-3">
      <!-- Cycle configuration -->
      <CommonSectionCard
        :title="t('recognition.admin.cycle')"
        icon="i-heroicons-calendar-days"
      >
        <div class="space-y-3">
          <div>
            <p class="mb-1 text-xs text-muted">
              {{ t('recognition.admin.frequencyLabel') }}
            </p>
            <USelect
              v-model="frequency"
              :items="[
                { label: t('recognition.frequency.WEEKLY'), value: 'WEEKLY' },
                { label: t('recognition.frequency.MONTHLY'), value: 'MONTHLY' },
              ]"
              value-key="value"
            />
          </div>

          <p class="text-xs text-dimmed">
            {{ cycleRange }}
          </p>

          <UButton
            color="primary"
            :loading="savingCycle"
            block
            @click="saveCycle"
          >
            {{ t('recognition.admin.saveCycle') }}
          </UButton>

          <UButton
            color="neutral"
            variant="soft"
            :loading="finalizing"
            block
            @click="finalizeNow"
          >
            {{ t('recognition.admin.finalizeNow') }}
          </UButton>
        </div>
      </CommonSectionCard>

      <!-- Titles -->
      <CommonSectionCard
        :title="t('recognition.titles')"
        icon="i-heroicons-tag"
      >
        <template #header-actions>
          <UButton
            size="xs"
            color="primary"
            variant="soft"
            icon="i-heroicons-plus"
            @click="openNewTitle"
          >
            {{ t('recognition.admin.newTitle') }}
          </UButton>
        </template>

        <ul class="divide-y divide-default">
          <li
            v-for="title in data?.titles ?? []"
            :key="title.id"
            class="flex items-center gap-2 py-2.5 first:pt-0 last:pb-0"
          >
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-highlighted">
                {{ title.name }}
              </p>
              <p class="truncate text-[11px] text-muted">
                {{ title.description }}
              </p>
            </div>
            <UBadge
              :color="title.isSystem ? 'neutral' : 'primary'"
              variant="subtle"
              size="xs"
            >
              {{ title.isSystem ? t('recognition.admin.system') : t('recognition.admin.custom') }}
            </UBadge>
          </li>
        </ul>
      </CommonSectionCard>

      <!-- Categories -->
      <CommonSectionCard
        :title="t('recognition.categories')"
        icon="i-heroicons-squares-plus"
      >
        <template #header-actions>
          <UButton
            size="xs"
            color="primary"
            variant="soft"
            icon="i-heroicons-plus"
            @click="openCreateCategory"
          >
            {{ t('recognition.admin.newCategory') }}
          </UButton>
        </template>

        <ul class="divide-y divide-default">
          <li
            v-for="category in data?.categories ?? []"
            :key="category.id"
            class="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
          >
            <span
              class="grid size-8 shrink-0 place-items-center rounded-lg bg-elevated text-muted"
            >
              <UIcon
                :name="category.iconKey ?? 'i-heroicons-sparkles'"
                class="size-4"
              />
            </span>

            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-highlighted">
                {{ category.name }}
              </p>
              <p class="truncate text-[11px] text-muted">
                {{ t('recognition.admin.votesCount', { count: format.number(category.voteCount) }) }}
                <template v-if="category.title">
                  · {{ category.title.name }}
                </template>
              </p>
            </div>

            <UBadge
              v-if="!category.isActive"
              color="warning"
              variant="subtle"
              size="xs"
            >
              {{ t('recognition.admin.disabled') }}
            </UBadge>

            <UToggle
              :model-value="category.isActive"
              color="success"
              @update:model-value="toggleCategory(category)"
            />

            <UButton
              color="neutral"
              variant="ghost"
              size="xs"
              icon="i-heroicons-pencil-square"
              aria-label="edit"
              @click="openEditCategory(category)"
            />
          </li>
        </ul>
      </CommonSectionCard>
    </div>

    <!-- Category editor -->
    <UModal
      :model-value="categoryModalOpen"
      @update:model-value="categoryModalOpen = $event"
    >
      <UCard>
        <template #header>
          <div class="flex items-center justify-between gap-3">
            <p class="text-sm font-bold text-highlighted">
              {{ categoryForm.id ? t('recognition.admin.editCategory') : t('recognition.admin.newCategory') }}
            </p>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark"
              aria-label="close"
              @click="categoryModalOpen = false"
            />
          </div>
        </template>

        <div class="grid gap-3 sm:grid-cols-2">
          <UFormGroup
            class="sm:col-span-2"
            :label="t('recognition.admin.name')"
            required
          >
            <UInput
              v-model="categoryForm.name"
              :placeholder="t('recognition.admin.namePlaceholder')"
            />
          </UFormGroup>

          <UFormGroup
            class="sm:col-span-2"
            :label="t('recognition.admin.description')"
          >
            <UTextarea
              v-model="categoryForm.description"
              :placeholder="t('recognition.admin.descriptionPlaceholder')"
              :rows="2"
            />
          </UFormGroup>

          <UFormGroup :label="t('recognition.admin.icon')">
            <UInput
              v-model="categoryForm.iconKey"
              :placeholder="t('recognition.admin.iconPlaceholder')"
            />
          </UFormGroup>

          <UFormGroup :label="t('recognition.admin.tone')">
            <USelect
              v-model="categoryForm.tone"
              :items="toneOptions"
              value-key="value"
            />
          </UFormGroup>

          <UFormGroup :label="t('recognition.admin.xpReward')">
            <UInput
              v-model.number="categoryForm.xpReward"
              type="number"
              min="0"
            />
          </UFormGroup>

          <UFormGroup :label="t('recognition.admin.coinReward')">
            <UInput
              v-model.number="categoryForm.coinReward"
              type="number"
              min="0"
            />
          </UFormGroup>

          <UFormGroup :label="t('recognition.admin.title')">
            <USelect
              v-model="categoryForm.titleId"
              :items="titleOptions"
              value-key="value"
              :placeholder="t('recognition.admin.titlePlaceholder')"
            />
          </UFormGroup>

          <UFormGroup :label="t('recognition.admin.badge')">
            <USelect
              v-model="categoryForm.badgeId"
              :items="badgeOptions"
              value-key="value"
            />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="neutral"
              variant="ghost"
              @click="categoryModalOpen = false"
            >
              {{ t('recognition.admin.cancel') }}
            </UButton>
            <UButton
              color="primary"
              :loading="categoryPending"
              :disabled="!categoryForm.name.trim()"
              @click="saveCategory"
            >
              {{ t('recognition.admin.save') }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Title editor -->
    <UModal
      :model-value="titleModalOpen"
      @update:model-value="titleModalOpen = $event"
    >
      <UCard>
        <template #header>
          <div class="flex items-center justify-between gap-3">
            <p class="text-sm font-bold text-highlighted">
              {{ t('recognition.admin.newTitle') }}
            </p>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark"
              aria-label="close"
              @click="titleModalOpen = false"
            />
          </div>
        </template>

        <div class="space-y-3">
          <UFormGroup
            :label="t('recognition.admin.titleName')"
            required
          >
            <UInput
              v-model="titleForm.name"
              :placeholder="t('recognition.admin.titleNamePlaceholder')"
            />
          </UFormGroup>
          <UFormGroup :label="t('recognition.admin.titleDescription')">
            <UTextarea
              v-model="titleForm.description"
              :rows="2"
            />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="neutral"
              variant="ghost"
              @click="titleModalOpen = false"
            >
              {{ t('recognition.admin.cancel') }}
            </UButton>
            <UButton
              color="primary"
              :loading="titlePending"
              :disabled="!titleForm.name.trim()"
              @click="saveTitle"
            >
              {{ t('recognition.admin.create') }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
