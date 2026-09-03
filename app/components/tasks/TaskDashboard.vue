<script setup lang="ts">
import type { TaskDashboardResponse, TaskSummary } from '#shared/types/api'
import type { TaskAction } from '#shared/utils/task'

/**
 * Both task dashboards, from a single endpoint.
 *
 * The employee view is always shown — a manager has their own work too — and
 * the manager view appears above it for anyone who can review, because
 * unblocking other people is the more time-critical job.
 *
 * Everything is one `useFetch`: the dashboard is the first screen after login
 * and five parallel requests on a phone is a visibly worse experience than one
 * slightly larger payload.
 */
const { t } = useI18n()
const format = useLocaleFormat()
const localePath = useLocalePath()
const toast = useToast()
const { transition } = useTaskActions()

const { data, status, refresh } = await useFetch<TaskDashboardResponse>('/api/tasks/dashboard')

const employee = computed(() => data.value?.employee ?? null)
const manager = computed(() => data.value?.manager ?? null)

const busyId = ref<string | null>(null)

/** Employee columns, in the order the spec lists them. */
const employeeColumns = computed(() => {
  const source = employee.value
  if (!source) return []
  return [
    {
      key: 'today',
      title: t('dashboard.todaysTasks'),
      icon: 'i-heroicons-sun',
      items: source.today,
      empty: t('dashboard.noTasksToday'),
    },
    {
      key: 'active',
      title: t('dashboard.activeTasks'),
      icon: 'i-heroicons-play-circle',
      items: source.active,
      empty: t('dashboard.noActiveTasks'),
    },
    {
      key: 'pending',
      title: t('dashboard.pendingSubmissions'),
      icon: 'i-heroicons-paper-airplane',
      items: source.pendingSubmissions,
      empty: t('dashboard.noSubmissions'),
    },
    {
      key: 'upcoming',
      title: t('dashboard.upcomingDeadlines'),
      icon: 'i-heroicons-calendar-days',
      items: source.upcomingDeadlines,
      empty: t('dashboard.noUpcoming'),
    },
    {
      key: 'completed',
      title: t('dashboard.completedTasksTitle'),
      icon: 'i-heroicons-check-circle',
      items: source.completed,
      empty: t('dashboard.noCompleted'),
    },
  ]
})

const managerColumns = computed(() => {
  const source = manager.value
  if (!source) return []
  return [
    {
      key: 'reviews',
      title: t('dashboard.pendingReviews'),
      icon: 'i-heroicons-clipboard-document-check',
      items: source.pendingReviews,
      empty: t('dashboard.noPendingReviews'),
    },
    {
      key: 'overdue',
      title: t('dashboard.overdueTasks'),
      icon: 'i-heroicons-exclamation-triangle',
      items: source.overdue,
      empty: t('dashboard.noOverdue'),
    },
    {
      key: 'active',
      title: t('dashboard.activeTasks'),
      icon: 'i-heroicons-play-circle',
      items: source.active,
      empty: t('dashboard.noActiveTasks'),
    },
  ]
})

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
    const payload = (error as { data?: { message?: string } }).data
    toast.add({
      title: payload?.message ?? t('errors.generic'),
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
  <div class="grid gap-4">
    <div
      v-if="status === 'pending' && !data"
      class="grid gap-3 sm:grid-cols-2"
    >
      <div
        v-for="index in 4"
        :key="index"
        class="wq-skeleton h-48 rounded-xl"
      />
    </div>

    <template v-else>
      <!-- ------------------------------------------------------------------ -->
      <!-- Manager                                                             -->
      <!-- ------------------------------------------------------------------ -->
      <template v-if="manager">
        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <GamificationStatTile
            :label="t('dashboard.activeTasks')"
            :value="format.number(manager.counts.active)"
            icon="i-heroicons-play-circle"
            tone="primary"
          />
          <GamificationStatTile
            :label="t('dashboard.pendingReviews')"
            :value="format.number(manager.counts.pendingReviews)"
            icon="i-heroicons-clipboard-document-check"
            tone="coin"
          />
          <GamificationStatTile
            :label="t('dashboard.overdueTasks')"
            :value="format.number(manager.counts.overdue)"
            icon="i-heroicons-exclamation-triangle"
            tone="streak"
          />
          <GamificationStatTile
            :label="t('dashboard.completionRate')"
            :value="format.percent(manager.counts.completionRate)"
            icon="i-heroicons-chart-pie"
            tone="success"
          />
        </div>

        <div class="grid gap-4 lg:grid-cols-3">
          <CommonSectionCard
            v-for="column in managerColumns"
            :key="column.key"
            :title="column.title"
            :icon="column.icon"
          >
            <div class="grid gap-3 p-3">
              <p
                v-if="!column.items.length"
                class="py-6 text-center text-xs text-dimmed"
              >
                {{ column.empty }}
              </p>
              <TasksTaskCard
                v-for="task in column.items.slice(0, 5)"
                :key="task.id"
                :task="task"
                compact
                :busy="busyId === task.id"
                @action="onAction"
              />
            </div>
          </CommonSectionCard>
        </div>

        <!-- Team completion -->
        <CommonSectionCard
          :title="t('dashboard.teamCompletion')"
          icon="i-heroicons-user-group"
        >
          <div class="grid gap-3 p-4">
            <p
              v-if="!manager.teamCompletion.length"
              class="py-4 text-center text-xs text-dimmed"
            >
              {{ t('dashboard.noTeams') }}
            </p>
            <div
              v-for="row in manager.teamCompletion"
              :key="row.teamId"
              class="grid gap-1.5"
            >
              <div class="flex items-center justify-between gap-2 text-xs">
                <span class="truncate font-bold text-highlighted">{{ row.teamName }}</span>
                <span class="shrink-0 text-muted tabular-nums">
                  {{ format.number(row.approved) }} / {{ format.number(row.total) }}
                  · {{ format.percent(row.rate) }}
                </span>
              </div>
              <UProgress
                :model-value="row.rate"
                :color="row.rate >= 70 ? 'success' : row.rate >= 40 ? 'warning' : 'error'"
                size="sm"
              />
            </div>
          </div>
        </CommonSectionCard>
      </template>

      <!-- ------------------------------------------------------------------ -->
      <!-- Employee                                                            -->
      <!-- ------------------------------------------------------------------ -->
      <div
        v-if="employee"
        class="grid gap-4"
      >
        <div class="flex items-center justify-between gap-2">
          <h2 class="text-sm font-black text-highlighted">
            {{ t('dashboard.employeeView') }}
          </h2>
          <UButton
            :to="localePath('/tasks')"
            color="neutral"
            variant="ghost"
            size="xs"
            trailing-icon="i-heroicons-arrow-left"
          >
            {{ t('dashboard.viewAll') }}
          </UButton>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <CommonSectionCard
            v-for="column in employeeColumns"
            :key="column.key"
            :title="column.title"
            :icon="column.icon"
          >
            <div class="grid gap-3 p-3">
              <p
                v-if="!column.items.length"
                class="py-6 text-center text-xs text-dimmed"
              >
                {{ column.empty }}
              </p>
              <TasksTaskCard
                v-for="task in column.items.slice(0, 5)"
                :key="task.id"
                :task="task"
                compact
                hide-assignee
                :busy="busyId === task.id"
                @action="onAction"
              />
            </div>
          </CommonSectionCard>
        </div>
      </div>
    </template>
  </div>
</template>
