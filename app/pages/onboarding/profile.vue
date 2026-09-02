<script setup lang="ts">
definePageMeta({ layout: 'auth', middleware: ['onboarding'] })

const { t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const format = useLocaleFormat()
const { draft, context, hydrateFromStorage, persist } = useOnboarding()

const errorMessage = ref<string | null>(null)

hydrateFromStorage()

const formattedPhone = computed(() => (context.value ? format.phone(context.value.phone) : ''))
const fullNameValid = computed(() => draft.value.fullName.trim().length >= 3)

function next() {
  errorMessage.value = null
  if (!fullNameValid.value) {
    errorMessage.value = t('onboarding.errors.fullName')
    return
  }

  persist()
  void router.push(localePath('/onboarding/company'))
}
</script>

<template>
  <div class="wq-panel-elevated p-6 sm:p-8">
    <AuthOnboardingStepper :step="2" />

    <h1 class="text-2xl font-black text-highlighted">
      {{ t('onboarding.profileTitle') }}
    </h1>
    <p class="mt-2 text-sm leading-7 text-muted">
      {{ t('onboarding.profileSubtitle', { phone: formattedPhone }) }}
    </p>

    <form
      class="mt-6 space-y-4"
      @submit.prevent="next"
    >
      <UFormField
        :label="t('onboarding.fullNameLabel')"
        required
        :hint="t('onboarding.fullNameHint')"
      >
        <UInput
          v-model="draft.fullName"
          autocomplete="name"
          size="xl"
          :placeholder="t('onboarding.fullNamePlaceholder')"
          icon="i-heroicons-user-circle"
          class="w-full"
          :aria-invalid="!fullNameValid && draft.fullName.length > 0"
        />
      </UFormField>

      <UFormField
        :label="t('onboarding.jobTitleLabel')"
        :hint="t('common.optional')"
      >
        <UInput
          v-model="draft.jobTitle"
          autocomplete="organization-title"
          size="xl"
          :placeholder="t('onboarding.jobTitlePlaceholder')"
          icon="i-heroicons-identification"
          class="w-full"
        />
      </UFormField>

      <UAlert
        v-if="errorMessage"
        color="error"
        variant="subtle"
        icon="i-heroicons-exclamation-triangle"
        :title="errorMessage"
      />

      <div class="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:items-center">
        <UButton
          type="submit"
          size="xl"
          block
          trailing-icon="i-heroicons-arrow-left"
          :disabled="!fullNameValid"
        >
          {{ t('onboarding.continue') }}
        </UButton>
      </div>
    </form>

    <div class="mt-6 flex items-start gap-2 border-t border-default pt-5 text-xs leading-6 text-dimmed">
      <UIcon
        name="i-heroicons-shield-check"
        class="mt-0.5 size-4 shrink-0 text-success"
      />
      <span>{{ t('onboarding.ticketNotice', { seconds: format.number(context?.expiresIn ?? 0) }) }}</span>
    </div>
  </div>
</template>
