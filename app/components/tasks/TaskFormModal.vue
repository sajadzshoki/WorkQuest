<script setup lang="ts">
import type { TaskMutationResponse, TaskSummary } from '#shared/types/api'
import type { TaskPriority } from '#shared/utils/task'

import { TASK_PRIORITIES } from '#shared/utils/task'

/**
 * Create / edit a task.
 *
 * A `UModal` on desktop and a full-height sheet on mobile — task creation is
 * something managers do from a phone between meetings, so every control is at
 * least 40px tall and the form scrolls independently of its sticky footer.
 *
 * Validation is intentionally *not* duplicated from Zod: the form does the
 * cheap required-field checks so the user gets instant feedback, and the server
 * remains the only authority. Field errors it returns are mapped back onto the
 * inputs.
 */
const props = withDefaults(
  defineProps<{
    /** Passing a task switches the modal to edit mode. */
    task?: TaskSummary | null
  }>(),
  { task: null },
)

const emit = defineEmits<{ saved: [task: TaskSummary] }>()
const open = defineModel<boolean>('open', { default: false })

const { t } = useI18n()
const toast = useToast()

interface Option { label: string, value: string }

/** Assignable people and teams. Loaded lazily — only managers open this. */
// NOTE: these endpoints key their collections as `members` / `teams`, not
// `items`. Keep these names in sync with server/api/{members,teams}/index.get.ts.
const { data: peopleData } = await useFetch<{ members: Array<{ id: string, fullName: string }> }>(
  '/api/members',
  { query: { scope: 'mine', pageSize: 100 }, default: () => ({ members: [] }) },
)
const { data: teamData } = await useFetch<{ teams: Array<{ id: string, name: string }> }>(
  '/api/teams',
  { default: () => ({ teams: [] }) },
)

const assigneeOptions = computed<Option[]>(() =>
  (peopleData.value?.members ?? []).map(person => ({ label: person.fullName, value: person.id })))
const teamOptions = computed<Option[]>(() =>
  (teamData.value?.teams ?? []).map(team => ({ label: team.name, value: team.id })))
const priorityOptions = computed<Option[]>(() =>
  TASK_PRIORITIES.map(value => ({ label: t(`priority.${value}`), value })))

interface FormState {
  title: string
  description: string
  assigneeId: string
  teamId: string
  priority: TaskPriority
  dueDate: string
  estimatedHours: string
  xpReward: string
  coinReward: string
}

function blank(): FormState {
  return {
    title: '',
    description: '',
    assigneeId: '',
    teamId: '',
    priority: 'MEDIUM',
    dueDate: '',
    estimatedHours: '',
    xpReward: '100',
    coinReward: '50',
  }
}

const form = reactive<FormState>(blank())
const errors = ref<Record<string, string>>({})
const submitting = ref(false)

const isEdit = computed(() => Boolean(props.task))

/**
 * `<input type="date">` speaks `YYYY-MM-DD` in the *Gregorian* calendar
 * regardless of locale, so the stored ISO instant is trimmed to that form on
 * the way in and sent back as a plain date on the way out.
 */
function toDateInput(iso: string | null): string {
  return iso ? new Date(iso).toISOString().slice(0, 10) : ''
}

watch(open, (isOpen) => {
  if (!isOpen) return
  errors.value = {}
  const task = props.task
  Object.assign(form, task
    ? {
        title: task.title,
        description: task.description ?? '',
        assigneeId: task.assignee?.id ?? '',
        teamId: task.team?.id ?? '',
        priority: task.priority,
        dueDate: toDateInput(task.dueDate),
        estimatedHours: task.estimatedHours != null ? String(task.estimatedHours) : '',
        xpReward: String(task.xpReward),
        coinReward: String(task.coinReward),
      }
    : blank())
}, { immediate: true })

function validate(): boolean {
  const next: Record<string, string> = {}
  if (form.title.trim().length < 3) next.title = t('tasks.form.title')
  if (!isEdit.value && !form.assigneeId) next.assigneeId = t('tasks.form.selectAssignee')
  errors.value = next
  return Object.keys(next).length === 0
}

async function submit() {
  if (!validate()) return
  submitting.value = true
  errors.value = {}

  const body: Record<string, unknown> = {
    title: form.title.trim(),
    description: form.description.trim(),
    priority: form.priority,
    teamId: form.teamId,
    // Midday UTC keeps the date on the intended calendar day in Tehran (UTC+3:30)
    // instead of slipping backwards for anyone west of the server.
    dueDate: form.dueDate ? `${form.dueDate}T12:00:00.000Z` : undefined,
    xpReward: Number(form.xpReward || 0),
    coinReward: Number(form.coinReward || 0),
  }
  if (form.assigneeId) body.assigneeId = form.assigneeId
  if (form.estimatedHours) body.estimatedHours = Number(form.estimatedHours)

  try {
    const response = await $fetch<TaskMutationResponse>(
      isEdit.value ? `/api/tasks/${props.task?.id}` : '/api/tasks',
      { method: isEdit.value ? 'PATCH' : 'POST', body },
    )
    toast.add({
      title: t(isEdit.value ? 'tasks.updated' : 'tasks.created'),
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })
    emit('saved', response.task)
    open.value = false
  }
  catch (error) {
    const data = (error as { data?: { message?: string, issues?: Array<{ path: string, message: string }> } }).data
    if (data?.issues) {
      errors.value = Object.fromEntries(data.issues.map(issue => [issue.path, issue.message]))
    }
    toast.add({
      title: data?.message ?? t('errors.generic'),
      color: 'error',
      icon: 'i-heroicons-exclamation-triangle',
    })
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="t(isEdit ? 'tasks.edit' : 'tasks.createTitle')"
    :ui="{ content: 'max-w-lg' }"
  >
    <template #body>
      <form
        class="grid gap-4"
        @submit.prevent="submit"
      >
        <UFormField
          :label="t('tasks.form.title')"
          :error="errors.title"
          required
        >
          <UInput
            v-model="form.title"
            :placeholder="t('tasks.form.titlePlaceholder')"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UFormField
          :label="t('tasks.form.description')"
          :error="errors.description"
        >
          <UTextarea
            v-model="form.description"
            :placeholder="t('tasks.form.descriptionPlaceholder')"
            :rows="4"
            class="w-full"
          />
        </UFormField>

        <UFormField
          :label="t('tasks.form.assignee')"
          :error="errors.assigneeId"
          :required="!isEdit"
        >
          <USelectMenu
            v-model="form.assigneeId"
            :items="assigneeOptions"
            value-key="value"
            label-key="label"
            :placeholder="t('tasks.form.selectAssignee')"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField
            :label="t('tasks.form.team')"
            :error="errors.teamId"
          >
            <USelectMenu
              v-model="form.teamId"
              :items="teamOptions"
              value-key="value"
              label-key="label"
              :placeholder="t('tasks.form.selectTeam')"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="t('tasks.form.priority')"
            :error="errors.priority"
          >
            <USelect
              v-model="form.priority"
              :items="priorityOptions"
              value-key="value"
              label-key="label"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="t('tasks.form.dueDate')"
            :error="errors.dueDate"
          >
            <UInput
              v-model="form.dueDate"
              type="date"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="t('tasks.form.estimatedHours')"
            :error="errors.estimatedHours"
          >
            <UInput
              v-model="form.estimatedHours"
              type="number"
              min="0.25"
              step="0.25"
              inputmode="decimal"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="t('tasks.form.xpReward')"
            :error="errors.xpReward"
          >
            <UInput
              v-model="form.xpReward"
              type="number"
              min="0"
              inputmode="numeric"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="t('tasks.form.coinReward')"
            :error="errors.coinReward"
          >
            <UInput
              v-model="form.coinReward"
              type="number"
              min="0"
              inputmode="numeric"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>
      </form>
    </template>

    <template #footer>
      <div class="flex w-full items-center justify-end gap-2">
        <UButton
          color="neutral"
          variant="ghost"
          @click="open = false"
        >
          {{ t('common.cancel') }}
        </UButton>
        <UButton
          color="primary"
          :loading="submitting"
          icon="i-heroicons-check"
          @click="submit"
        >
          {{ t(isEdit ? 'tasks.save' : 'tasks.form.submit') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
