<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

interface TaskListResponse {
  items: Array<{
    id: string
    title: string
    description: string | null
    status: string
    priority: string
    dueDate: string | null
    xpReward: number
    coinReward: number
    assignee: { id: string, fullName: string, avatarUrl: string | null } | null
    team: { id: string, name: string } | null
  }>
  total: number
  page: number
  pageSize: number
}

const { t } = useI18n()
const format = useLocaleFormat()
const { can } = useCan()

const scope = ref<'mine' | 'team' | 'all'>('mine')
const statusFilter = ref<string | undefined>(undefined)

const scopes = computed(() => {
  const available: Array<{ value: 'mine' | 'team' | 'all', label: string }> = [
    { value: 'mine', label: t('tasks.scope.mine') },
  ]
  if (can('task:read:team')) available.push({ value: 'team', label: t('tasks.scope.team') })
  if (can('task:read:all')) available.push({ value: 'all', label: t('tasks.scope.all') })
  return available
})

const statuses = [
  'ASSIGNED',
  'IN_PROGRESS',
  'SUBMITTED',
  'APPROVED',
  'CHANGES_REQUESTED',
  'REJECTED',
]

const query = computed(() => ({
  scope: scope.value,
  ...(statusFilter.value ? { status: statusFilter.value } : {}),
}))

const { data, status } = await useFetch<TaskListResponse>(`/api/tasks`, {
  query,
  watch: [query],
})

function dueLabel(dueDate: string | null): string {
  if (!dueDate) return t('tasks.noDueDate')
  const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / 86_400_000)
  if (days === 0) return t('tasks.dueToday')
  if (days > 0) return t('tasks.dueIn', { days: format.number(days) })
  return t('tasks.overdue', { days: format.number(Math.abs(days)) })
}

function isOverdue(dueDate: string | null): boolean {
  return Boolean(dueDate) && new Date(dueDate as string).getTime() < Date.now()
}
</script>

<template>
  <div>
    <CommonPageHeader
      :title="t('tasks.title')"
      :subtitle="t('tasks.subtitle')"
    >
      <template #actions>
        <USelect
          v-model="statusFilter"
          :items="statuses.map((value) => ({ label: t(`status.task.${value}`), value }))"
          :placeholder="t('common.all')"
          value-key="value"
          label-key="label"
          class="w-44"
        />
      </template>
    </CommonPageHeader>

    <UTabs
      :items="scopes.map((entry) => ({ label: entry.label, value: entry.value }))"
      :content="false"
      :model-value="scope"
      value-key="value"
      @update:model-value="scope = ($event as 'mine' | 'team' | 'all')"
    />

    <div
      v-if="status === 'pending' && !data"
      class="mt-4 space-y-3"
    >
      <div
        v-for="index in 4"
        :key="index"
        class="wq-skeleton h-24 rounded-xl"
      />
    </div>

    <CommonEmptyState
      v-else-if="!data?.items.length"
      icon="i-heroicons-inbox"
      :title="t('tasks.empty')"
      class="wq-panel mt-4"
    />

    <div
      v-else
      class="mt-4 grid gap-3"
    >
      <article
        v-for="task in data.items"
        :key="task.id"
        class="wq-panel p-4 transition-shadow hover:shadow-lifted"
      >
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <GamificationTaskStatusBadge :status="task.status" />
              <GamificationPriorityBadge :priority="task.priority" />
              <span
                v-if="task.team"
                class="text-[11px] text-dimmed"
              >{{ task.team.name }}</span>
            </div>

            <h3 class="mt-2 text-base font-bold text-highlighted">
              {{ task.title }}
            </h3>
            <p
              v-if="task.description"
              class="mt-1 line-clamp-2 text-xs leading-6 text-muted"
            >
              {{ task.description }}
            </p>

            <div class="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-dimmed">
              <span
                v-if="task.assignee"
                class="flex items-center gap-1.5"
              >
                <UAvatar
                  :src="task.assignee.avatarUrl ?? undefined"
                  :text="task.assignee.fullName.charAt(0)"
                  size="xs"
                />
                {{ task.assignee.fullName }}
              </span>
              <span :class="isOverdue(task.dueDate) ? 'font-bold text-error' : ''">
                {{ dueLabel(task.dueDate) }}
              </span>
            </div>
          </div>

          <div class="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
            <span class="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary tabular-nums">
              +{{ format.number(task.xpReward) }} XP
            </span>
            <span
              class="rounded-lg bg-coin-500/12 px-2.5 py-1 text-xs font-bold text-coin-600 tabular-nums dark:text-coin-300"
            >
              +{{ format.number(task.coinReward) }}
            </span>
          </div>
        </div>
      </article>

      <p class="pt-2 text-center text-xs text-dimmed">
        {{ t('tasks.total', { count: format.number(data.total) }) }}
      </p>
    </div>
  </div>
</template>
