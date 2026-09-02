<script setup lang="ts">
import type { ApiErrorBody } from '#shared/types/api'

definePageMeta({ layout: 'auth', middleware: ['invitation'] })

const { t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const toast = useToast()
const { refresh } = useSession()
const { invitations, accept } = useInvitation()

const pendingId = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

// Normally one invitation; more than one means two companies want the same
// person, so the invitee chooses rather than us guessing.
const selectedId = ref<string | null>(null)
watch(
  invitations,
  (list) => {
    if (list?.length && !selectedId.value) selectedId.value = list[0]!.id
  },
  { immediate: true },
)

const selected = computed(
  () => invitations.value?.find(item => item.id === selectedId.value) ?? null,
)

async function submit() {
  if (!selectedId.value) return
  errorMessage.value = null
  pendingId.value = selectedId.value

  try {
    const result = await accept(selectedId.value)
    await refresh()

    toast.add({
      title: t('invitations.joinedTitle'),
      description: t('invitations.joinedDetail', { company: result.company.name }),
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })
    await router.push(localePath('/dashboard'))
  }
  catch (error) {
    const data = (error as { data?: ApiErrorBody }).data
    errorMessage.value = data?.message ?? t('invitations.errors.generic')
    pendingId.value = null
  }
}
</script>

<template>
  <div class="wq-panel-elevated p-6 sm:p-8">
    <AuthOnboardingStepper :step="1" />

    <h1 class="text-2xl font-black text-highlighted">
      {{ t('invitations.joinTitle') }}
    </h1>
    <p class="mt-2 text-sm leading-7 text-muted">
      {{ t('invitations.joinSubtitle') }}
    </p>

    <CommonEmptyState
      v-if="!invitations?.length"
      icon="i-heroicons-envelope"
      :title="t('invitations.nonePending')"
    />

    <form
      v-else
      class="mt-6 space-y-4"
      @submit.prevent="submit"
    >
      <UButton
        v-for="invitation in invitations"
        :key="invitation.id"
        type="button"
        color="neutral"
        variant="outline"
        block
        size="xl"
        class="!justify-start text-start"
        :class="selectedId === invitation.id && 'ring-2 ring-primary'"
        @click="selectedId = invitation.id"
      >
        <span class="flex w-full flex-col items-start gap-0.5">
          <span class="flex items-center gap-2 text-sm font-bold text-highlighted">
            <UIcon
              name="i-heroicons-building-office-2"
              class="size-4 text-primary"
            />
            {{ invitation.company.name }}
          </span>
          <span class="text-xs font-normal text-muted">
            {{ invitation.jobTitle ?? t('invitations.noJobTitle') }}
            · {{ t(`roles.${invitation.role}`) }}
            <template v-if="invitation.team">
              · {{ t('invitations.teamLabel') }}: {{ invitation.team.name }}
            </template>
          </span>
        </span>
      </UButton>

      <UAlert
        v-if="selected"
        color="info"
        variant="subtle"
        icon="i-heroicons-user-plus"
        :title="t('invitations.joinAs', { name: selected.fullName })"
        :description="t('invitations.joinAsDetail', { role: t(`roles.${selected.role}`) })"
      />

      <UAlert
        v-if="errorMessage"
        color="error"
        variant="subtle"
        icon="i-heroicons-exclamation-triangle"
        :title="errorMessage"
      />

      <UButton
        type="submit"
        size="xl"
        block
        :loading="pendingId !== null"
        :disabled="!selectedId"
        trailing-icon="i-heroicons-arrow-left"
      >
        {{ t('invitations.acceptButton') }}
      </UButton>
    </form>

    <div class="mt-6 flex items-start gap-2 border-t border-default pt-5 text-xs leading-6 text-dimmed">
      <UIcon
        name="i-heroicons-shield-check"
        class="mt-0.5 size-4 shrink-0 text-success"
      />
      <span>{{ t('invitations.acceptNotice') }}</span>
    </div>
  </div>
</template>
