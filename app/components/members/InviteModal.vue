<script setup lang="ts">
import type { ApiErrorBody, InvitationSummary, TeamSummary } from '#shared/types/api'
import type { Role } from '#shared/utils/permissions'

import { normalizeIranianPhone } from '#shared/utils/format'
import { can } from '#shared/utils/permissions'

const props = defineProps<{
  open: boolean
  teams: TeamSummary[]
}>()

const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
  (event: 'invited', invitation: InvitationSummary): void
}>()

const { t } = useI18n()
const toast = useToast()
const { user } = useSession()

/**
 * The role list is filtered by the caller's own rank.
 *
 * A MANAGER must never see ADMIN in this dropdown: the server rejects it
 * anyway, but offering a choice that always fails is worse than not offering
 * it. `can(role, 'member:manage')` is the same test the server uses to decide
 * whether a role change is allowed at all.
 */
const isAdmin = computed(() => can(user.value?.role, 'member:manage'))

const roleItems = computed(() => {
  const roles: Role[] = isAdmin.value ? ['ADMIN', 'MANAGER', 'EMPLOYEE'] : ['EMPLOYEE']
  return roles.map(role => ({ label: t(`roles.${role}`), value: role }))
})

const teamItems = computed(() => [
  { label: t('invitations.noTeam'), value: '' },
  ...props.teams.map(team => ({ label: team.name, value: team.id })),
])

const expiryItems = computed(() =>
  [3, 7, 14, 30].map(days => ({
    label: t('members.invite.expiryOption', { count: days.toLocaleString('fa-IR') }),
    value: days,
  })),
)

const form = reactive({
  phone: '',
  fullName: '',
  jobTitle: '',
  teamId: '',
  role: 'EMPLOYEE' as Role,
  expiresInDays: 7,
})

const pending = ref(false)
const errorMessage = ref<string | null>(null)

const phoneValid = computed(() => normalizeIranianPhone(form.phone) !== null)
const nameValid = computed(() => form.fullName.trim().length >= 3)
const canSubmit = computed(() => phoneValid.value && nameValid.value && !pending.value)

// A manager who leads exactly one team almost always means that team.
watch(
  () => props.open,
  (open) => {
    if (!open) return
    errorMessage.value = null
    if (!form.teamId && props.teams.length === 1) form.teamId = props.teams[0]!.id
  },
)

function close() {
  emit('update:open', false)
}

function reset() {
  form.phone = ''
  form.fullName = ''
  form.jobTitle = ''
  form.teamId = props.teams.length === 1 ? props.teams[0]!.id : ''
  form.role = 'EMPLOYEE'
  form.expiresInDays = 7
  errorMessage.value = null
}

async function submit() {
  if (!canSubmit.value) return
  errorMessage.value = null
  pending.value = true

  try {
    const result = await $fetch<{ invitation: InvitationSummary }>('/api/members/invite', {
      method: 'POST',
      body: {
        phone: form.phone,
        fullName: form.fullName,
        jobTitle: form.jobTitle,
        teamId: form.teamId,
        role: form.role,
        expiresInDays: form.expiresInDays,
      },
    })

    toast.add({
      title: t('members.invite.successTitle'),
      description: t('members.invite.successDetail', { name: result.invitation.fullName }),
      color: 'success',
      icon: 'i-heroicons-paper-airplane',
    })

    emit('invited', result.invitation)
    reset()
    close()
  }
  catch (error) {
    const data = (error as { data?: ApiErrorBody }).data
    errorMessage.value = data?.message ?? t('members.invite.errors.generic')
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <UModal
    :open="props.open"
    :title="t('members.invite.title')"
    :description="t('members.invite.subtitle')"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <form
        class="space-y-4"
        @submit.prevent="submit"
      >
        <UFormField
          :label="t('members.invite.phoneLabel')"
          required
          :hint="t('members.invite.phoneHint')"
        >
          <UInput
            v-model="form.phone"
            type="tel"
            dir="ltr"
            inputmode="numeric"
            autocomplete="tel"
            size="lg"
            placeholder="+989121234567"
            icon="i-heroicons-device-phone-mobile"
            class="w-full"
            :aria-invalid="!phoneValid && form.phone.length > 0"
          />
        </UFormField>

        <UFormField
          :label="t('members.invite.nameLabel')"
          required
        >
          <UInput
            v-model="form.fullName"
            autocomplete="name"
            size="lg"
            :placeholder="t('members.invite.namePlaceholder')"
            icon="i-heroicons-user-circle"
            class="w-full"
            :aria-invalid="!nameValid && form.fullName.length > 0"
          />
        </UFormField>

        <UFormField
          :label="t('members.invite.jobTitleLabel')"
          :hint="t('common.optional')"
        >
          <UInput
            v-model="form.jobTitle"
            size="lg"
            :placeholder="t('members.invite.jobTitlePlaceholder')"
            icon="i-heroicons-identification"
            class="w-full"
          />
        </UFormField>

        <UFormField
          :label="t('members.invite.teamLabel')"
          :hint="t('common.optional')"
        >
          <USelect
            v-model="form.teamId"
            :items="teamItems"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField :label="t('members.invite.roleLabel')">
            <USelect
              v-model="form.role"
              :items="roleItems"
              size="lg"
              class="w-full"
              :disabled="!isAdmin"
            />
          </UFormField>

          <UFormField :label="t('members.invite.expiryLabel')">
            <USelect
              v-model="form.expiresInDays"
              :items="expiryItems"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>

        <UAlert
          color="info"
          variant="subtle"
          icon="i-heroicons-information-circle"
          :title="t('members.invite.noticeTitle')"
          :description="t('members.invite.noticeDetail')"
        />

        <UAlert
          v-if="errorMessage"
          color="error"
          variant="subtle"
          icon="i-heroicons-exclamation-triangle"
          :title="errorMessage"
        />
      </form>
    </template>

    <template #footer>
      <div class="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <UButton
          color="neutral"
          variant="ghost"
          size="lg"
          @click="close"
        >
          {{ t('common.cancel') }}
        </UButton>
        <UButton
          type="submit"
          size="lg"
          icon="i-heroicons-paper-airplane"
          :loading="pending"
          :disabled="!canSubmit"
          @click="submit"
        >
          {{ pending ? t('members.invite.sending') : t('members.invite.submit') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
