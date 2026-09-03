<script setup lang="ts">
import type { TaskListResponse, TaskSummary } from '#shared/types/api'
import type { TaskAction, TaskPriority, TaskStatus } from '#shared/utils/task'

import { TASK_PRIORITIES, TASK_STATUSES } from '#shared/utils/task'

definePageMeta({ middleware: ['auth'] })

const { t } = useI18n()
const format = useLocaleFormat()
const { can } = useCan()
const toast = useToast()
const { transition } = useTaskActions()

const scope = ref<'mine' | 'team' | 'all'>('mine')
const statusFilter = ref<TaskStatus | undefined>()
const priorityFilter = ref<TaskPriority | undefined>()
const overdueOnly = ref(false)
const search = ref('')
const sort = ref<'dueDate' | 'priority' | 'createdAt' | 'status'>('dueDate')
const page = ref(1)

const createOpen = ref(false)
const busyId = ref<string | null>(null)

const canCreate = computed(() => can('task:assign'))

const scopes = computed(() => {
  const available: Array<{ label: string, value: 'mine' | 'team' | 'all' }> = [
    { label: t('tasks.scope.mine'), value: 'mine' },
  ]
  if (can('task:read:team')) available.push({ label: t('tasks.scope.team'), value: 'team' })
  if (can('task:read:all')) available.push({ label: t('tasks.scope.all'), value: 'all' })
  return available
})

const statusOptions = computed(() => [
  { label: t('common.all'), value: '' },
  ...TASK_STATUSES.map(value => ({ label: t(`status.task.${value}`), value })),
])
const priorityOptions = computed(() => [
  { label: t('common.all'), value: '' },
  ...TASK_PRIORITIES.map(value => ({ label: t(`priority.${value}`), value })),
])
const sortOptions = computed(() =>
  (['dueDate', 'priority', 'createdAt', 'status'] as const).map(value => ({
    label: t(`tasks.sortBy.${value}`),
    value,
  })))

/**
 * Debounced so typing does not fire a request per keystroke.
 *
 * Hand-rolled rather than pulled from a utility library: it is six lines, and
 * the timer has to be cleared on unmount so a pending update cannot touch a
 * disposed component.
 */
const debouncedSearch = ref('')
let searchTimer: ReturnType<typeof setTimeout> | undefined
watch(search, (value) => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    debouncedSearch.value = value
  }, 300)
})
onUnmounted(() => clearTimeout(searchTimer))

const query = computed(() => ({
  scope: scope.value,
  page: page.value,
  pageSize: 20,
  sort: sort.value,
  ...(statusFilter.value ? { status: statusFilter.value } : {}),
  ...(priorityFilter.value ? { priority: priorityFilter.value } : {}),
  ...(overdueOnly.value ? { overdue: 'true' } : {}),
  ...(debouncedSearch.value.trim() ? { search: debouncedSearch.value.trim() } : {}),
}))

const { data, status, refresh } = await useFetch<TaskListResponse>('/api/tasks', {
  query,
  watch: [query],
})

// Any filter change puts the user back on page 1 — page 4 of a new filter set
// is almost always empty and reads as "no results".
watch([scope, statusFilter, priorityFilter, overdueOnly, debouncedSearch, sort], () => {
  page.value = 1
})

const totalPages = computed(() => Math.max(1, Math.ceil((data.value?.total ?? 0) / 20)))

async function onAction(action: TaskAction, task: TaskSummary) {
  busyId.value = task.id
  try {
    await transition(task.id, action)
    toast.add({
      title: t(`tasks.actionDone.${action}`),
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })
    await refresh()
  }
  catch (error) {
    const data = (error as { data?: { message?: string } }).data
    toast.add({
      title: data?.message ?? t('errors.generic'),
      color: 'error',
      icon: 'i-heroicons-exclamation-triangle',
    })
  }
  finally {
    busyId.value = null
  }
}
</script>

<template>
  <div>
    <CommonPageHeader
      :title="t('tasks.title')"
      :subtitle="t('tasks.subtitle')"
    >
      <template #actions>
        <UButton
          v-if="canCreate"
          color="primary"
          icon="i-heroicons-plus"
          size="md"
          @click="createOpen = true"
        >
          {{ t('tasks.create') }}
        </UButton>
      </template>
    </CommonPageHeader>

    <UTabs
      v-if="scopes.length > 1"
      :items="scopes"
      :content="false"
      :model-value="scope"
      value-key="value"
      class="mb-4"
      @update:model-value="scope = ($event as 'mine' | 'team' | 'all')"
    />

    <!-- Filters. Stacks to one column on mobile so nothing is cramped. -->
    <div class="wq-panel mb-4 grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-5">
      <UInput
        v-model="search"
        icon="i-heroicons-magnifying-glass"
        :placeholder="t('tasks.search')"
        size="md"
        class="lg:col-span-2"
      />
      <USelect
        :model-value="statusFilter ?? ''"
        :items="statusOptions"
        value-key="value"
        label-key="label"
        :placeholder="t('common.status')"
        size="md"
        @update:model-value="statusFilter = ($event as TaskStatus) || undefined"
      />
      <USelect
        :model-value="priorityFilter ?? ''"
        :items="priorityOptions"
        value-key="value"
        label-key="label"
        :placeholder="t('tasks.form.priority')"
        size="md"
        @update:model-value="priorityFilter = ($event as TaskPriority) || undefined"
      />
      <USelect
        v-model="sort"
        :items="sortOptions"
        value-key="value"
        label-key="label"
        size="md"
      />

      <div class="sm:col-span-2 lg:col-span-5">
        <USwitch
          v-model="overdueOnly"
          :label="t('tasks.onlyOverdue')"
        />
      </div>
    </div>

    <div
      v-if="status === 'pending' && !data"
      class="grid gap-3"
    >
      <div
        v-for="index in 4"
        :key="index"
        class="wq-skeleton h-40 rounded-xl"
      />
    </div>

    <CommonEmptyState
      v-else-if="!data?.items.length"
      icon="i-heroicons-inbox"
      :title="t('tasks.empty')"
      class="wq-panel"
    />

    <div
      v-else
      class="grid gap-3"
    >
      <TasksTaskCard
        v-for="task in data.items"
        :key="task.id"
        :task="task"
        :hide-assignee="scope === 'mine'"
        :busy="busyId === task.id"
        @action="onAction"
      />

      <div class="flex flex-col items-center gap-3 pt-2">
        <UPagination
          v-if="totalPages > 1"
          v-model:page="page"
          :total="data.total"
          :items-per-page="20"
        />
        <p class="text-center text-xs text-dimmed">
          {{ t('tasks.total', { count: format.number(data.total) }) }}
        </p>
      </div>
    </div>

    <TasksTaskFormModal
      v-if="canCreate"
      v-model:open="createOpen"
      @saved="refresh()"
    />
  </div>
</template>
