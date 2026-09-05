<script setup lang="ts">
import type { ApiErrorBody, ChallengeMutationResponse, ChallengeSummary } from '#shared/types/api'
import type { ChallengeGoalKey, ChallengeType } from '#shared/utils/challenges'
import { CHALLENGE_PRESETS, CHALLENGE_TYPES, goalAllowedFor } from '#shared/utils/challenges'

/**
 * Create / edit a challenge.
 *
 * The six presets are the product's promise — three individual races, three
 * team pushes — but they only pre-fill the form; every number stays the
 * company's to set. Validation mirrors the server's rules (goal ↔ type
 * compatibility, a TEAM challenge needs a team, the window has to make
 * sense) so a form that submits is a form that succeeds.
 */
const props = defineProps<{
  /** Passing a challenge switches the modal to edit mode. */
  challenge?: ChallengeSummary | null
}>()

const emit = defineEmits<{ saved: [challenge: ChallengeSummary] }>()
const open = defineModel<boolean>('open', { default: false })

const { t } = useI18n()
const toast = useToast()
const { can } = useCan()
const { goalOptions, goalUnitLabel } = useChallenges()
const { user } = useSession()

const isEdit = computed(() => Boolean(props.challenge))

// --- options ---------------------------------------------------------------

interface Option { label: string, value: string }

/**
 * Teams the caller may address: everything for OWNER/ADMIN, led teams for a
 * manager. Fetched lazily — only a manager ever opens this form, so an
 * employee visiting the board pays nothing for it.
 */
const { data: teamData, refresh: refreshTeams } = await useFetch<{ teams: Array<{ id: string, name: string, lead: { id: string } | null }> }>(
  '/api/teams',
  { immediate: false, default: () => ({ teams: [] }) },
)

watch(open, (isOpen) => {
  // The page only opens this form for callers who may manage challenges;
  // an employee visiting the board never pays for the teams round trip.
  if (isOpen && teamData.value?.teams.length === 0) refreshTeams()
})

const mayAddressCompany = computed(() => can('team:manage'))

const teamOptions = computed<Option[]>(() => {
  const teams = teamData.value?.teams ?? []
  const addressable = mayAddressCompany.value
    ? teams
    : teams.filter(team => team.lead?.id === user.value?.id)
  return addressable.map(team => ({ label: team.name, value: team.id }))
})

/**
 * The team picker's options. "The whole company" exists only for callers who
 * may address it — a manager's races always belong to a team they lead.
 */
const teamSelectOptions = computed<Option[]>(() =>
  mayAddressCompany.value
    ? [{ label: t('challenges.form.wholeCompany'), value: '' }, ...teamOptions.value]
    : teamOptions.value)

const typeOptions = CHALLENGE_TYPES.map(value => ({ label: t(`challenges.type.${value}`), value }))

// --- form state ------------------------------------------------------------

interface FormState {
  title: string
  description: string
  type: ChallengeType
  teamId: string
  goalKey: ChallengeGoalKey
  goalValue: string
  xpReward: string
  coinReward: string
  startsAt: string
  endsAt: string
}

/** Local-time datetime strings for `<input type="datetime-local">`. */
function nowPlusHours(hours: number): string {
  const date = new Date(Date.now() + hours * 3_600_000)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function toDatetimeInput(iso: string | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function fromPreset(presetIndex: number): FormState {
  const preset = CHALLENGE_PRESETS[presetIndex]
  if (!preset) return blank()
  return {
    ...blank(),
    title: t(`challenges.presets.${preset.key}.title`),
    description: t(`challenges.presets.${preset.key}.description`),
    type: preset.type,
    goalKey: preset.goalKey,
    goalValue: String(preset.goalValue),
  }
}

function blank(): FormState {
  return {
    title: '',
    description: '',
    type: 'INDIVIDUAL',
    teamId: '',
    goalKey: 'tasks_completed',
    goalValue: '10',
    xpReward: '200',
    coinReward: '100',
    startsAt: nowPlusHours(1),
    endsAt: nowPlusHours(24 * 7 + 1),
  }
}

const form = reactive<FormState>(blank())
const errors = ref<Record<string, string>>({})
const submitting = ref(false)

/** The preset chips, marked by how well the form currently matches one. */
const presets = computed(() =>
  CHALLENGE_PRESETS.map((preset, index) => ({
    index,
    key: preset.key,
    type: preset.type,
    label: t(`challenges.presets.${preset.key}.title`),
    matches: form.type === preset.type
      && form.goalKey === preset.goalKey
      && form.goalValue === String(preset.goalValue),
  })))

/** A type change must keep the goal legal. */
watch(() => form.type, (type) => {
  if (!goalAllowedFor(type, form.goalKey)) {
    form.goalKey = type === 'TEAM' ? 'team_completion_rate' : 'tasks_completed'
  }
})

watch(open, (isOpen) => {
  if (!isOpen) return
  errors.value = {}
  const challenge = props.challenge
  Object.assign(form, challenge
    ? {
        title: challenge.title,
        description: challenge.description ?? '',
        type: challenge.type,
        teamId: challenge.team?.id ?? '',
        goalKey: challenge.goalKey,
        goalValue: String(challenge.goalValue),
        xpReward: String(challenge.xpReward),
        coinReward: String(challenge.coinReward),
        startsAt: toDatetimeInput(challenge.startsAt),
        endsAt: toDatetimeInput(challenge.endsAt),
      }
    : blank())
}, { immediate: true })

function validate(): boolean {
  const next: Record<string, string> = {}
  if (form.title.trim().length < 2) next.title = t('challenges.form.titleRequired')
  if (form.type === 'TEAM' && !form.teamId) next.teamId = t('challenges.form.teamRequired')
  if (!goalAllowedFor(form.type, form.goalKey)) next.goalKey = t('challenges.form.goalMismatch')
  const value = Number(form.goalValue)
  if (!Number.isInteger(value) || value < 1 || (form.goalKey !== 'tasks_completed' && value > 100) || value > 100_000) {
    next.goalValue = t('challenges.form.goalValueInvalid')
  }
  if (!form.startsAt || !form.endsAt) next.endsAt = t('challenges.form.windowRequired')
  else if (new Date(form.startsAt).getTime() >= new Date(form.endsAt).getTime()) next.endsAt = t('challenges.form.windowOrder')
  else if (new Date(form.endsAt).getTime() <= Date.now() && !isEdit.value) next.endsAt = t('challenges.form.windowPast')
  errors.value = next
  return Object.keys(next).length === 0
}

async function submit() {
  if (!validate() || submitting.value) return
  submitting.value = true
  try {
    const body = {
      title: form.title.trim(),
      description: form.description.trim(),
      type: form.type,
      teamId: form.teamId,
      goalKey: form.goalKey,
      goalValue: Number(form.goalValue),
      xpReward: Number(form.xpReward || 0),
      coinReward: Number(form.coinReward || 0),
      startsAt: new Date(form.startsAt).toISOString(),
      endsAt: new Date(form.endsAt).toISOString(),
    }

    const response = await $fetch<ChallengeMutationResponse>(
      isEdit.value ? `/api/challenges/${props.challenge?.id}` : '/api/challenges',
      { method: isEdit.value ? 'PATCH' : 'POST', body },
    )

    toast.add({
      title: t(isEdit.value ? 'challenges.updated' : 'challenges.created'),
      color: 'success',
      icon: 'i-heroicons-flag',
    })

    emit('saved', response.challenge)
    open.value = false
  }
  catch (error) {
    const data = (error as { data?: ApiErrorBody }).data
    if (data?.issues) {
      errors.value = Object.fromEntries(data.issues.map(issue => [issue.path, issue.message]))
    }
    toast.add({
      title: data?.message ?? t('challenges.form.error'),
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
    :title="t(isEdit ? 'challenges.editTitle' : 'challenges.createTitle')"
    :ui="{ content: 'max-w-xl' }"
  >
    <template #body>
      <form
        class="grid gap-4"
        @submit.prevent="submit"
      >
        <!-- Presets: the six shapes the product promises, create mode only. -->
        <div v-if="!isEdit">
          <p class="mb-1.5 text-xs font-semibold text-muted">
            {{ t('challenges.form.presets') }}
          </p>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="preset in presets"
              :key="preset.key"
              type="button"
              class="rounded-full border px-3 py-1.5 text-[11px] font-bold transition-colors"
              :class="preset.matches
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-default text-muted hover:border-primary/40 hover:text-highlighted'"
              @click="Object.assign(form, fromPreset(preset.index))"
            >
              {{ preset.label }}
            </button>
          </div>
        </div>

        <UFormField
          :label="t('challenges.form.title')"
          :error="errors.title"
          required
        >
          <UInput
            v-model="form.title"
            :placeholder="t('challenges.form.titlePlaceholder')"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UFormField
          :label="t('challenges.form.description')"
          :error="errors.description"
        >
          <UTextarea
            v-model="form.description"
            :placeholder="t('challenges.form.descriptionPlaceholder')"
            :rows="2"
            class="w-full"
          />
        </UFormField>

        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField
            :label="t('challenges.form.type')"
            :error="errors.type"
          >
            <USelect
              v-model="form.type"
              :items="typeOptions"
              value-key="value"
              label-key="label"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="t('challenges.form.team')"
            :error="errors.teamId"
            :required="form.type === 'TEAM'"
            :help="form.type === 'INDIVIDUAL' && mayAddressCompany ? t('challenges.form.teamScopeHint') : undefined"
          >
            <USelectMenu
              v-model="form.teamId"
              :items="teamSelectOptions"
              value-key="value"
              label-key="label"
              :placeholder="t('challenges.form.selectTeam')"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="t('challenges.form.goal')"
            :error="errors.goalKey"
          >
            <USelectMenu
              v-model="form.goalKey"
              :items="goalOptions(form.type)"
              value-key="value"
              label-key="label"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="t('challenges.form.goalValue')"
            :error="errors.goalValue"
          >
            <UInput
              v-model="form.goalValue"
              type="number"
              min="1"
              size="lg"
              class="w-full"
            >
              <template #trailing>
                <span class="text-xs text-dimmed">{{ goalUnitLabel(form.goalKey) }}</span>
              </template>
            </UInput>
          </UFormField>

          <UFormField
            :label="t('challenges.form.startsAt')"
            :error="errors.startsAt"
            required
          >
            <UInput
              v-model="form.startsAt"
              type="datetime-local"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="t('challenges.form.endsAt')"
            :error="errors.endsAt"
            required
          >
            <UInput
              v-model="form.endsAt"
              type="datetime-local"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="t('challenges.form.xpReward')"
            :error="errors.xpReward"
          >
            <UInput
              v-model="form.xpReward"
              type="number"
              min="0"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="t('challenges.form.coinReward')"
            :error="errors.coinReward"
          >
            <UInput
              v-model="form.coinReward"
              type="number"
              min="0"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>

        <p class="text-[11px] leading-5 text-dimmed">
          {{ t('challenges.form.progressNote') }}
        </p>

        <div class="flex items-center justify-end gap-2 border-t border-default pt-4">
          <UButton
            type="button"
            color="neutral"
            variant="ghost"
            :label="t('shared.cancel')"
            @click="open = false"
          />
          <UButton
            type="submit"
            :loading="submitting"
            :label="t(isEdit ? 'challenges.form.save' : 'challenges.form.create')"
            icon="i-heroicons-flag"
          />
        </div>
      </form>
    </template>
  </UModal>
</template>
