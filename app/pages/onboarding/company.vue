<script setup lang="ts">
import type { ApiErrorBody } from '#shared/types/api'

import { SUPPORTED_TIMEZONES } from '#shared/constants'
import { slugify } from '#shared/utils/format'

definePageMeta({ layout: 'auth', middleware: ['onboarding'] })

const { t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const toast = useToast()
const format = useLocaleFormat()
const { refresh } = useSession()
const { draft, context, hydrateFromStorage, persist, checkSlug, complete } = useOnboarding()

const pending = ref(false)
const checkingSlug = ref(false)
const slugTaken = ref(false)
const errorMessage = ref<string | null>(null)
const slugEdited = ref(false)

hydrateFromStorage()

const formattedPhone = computed(() => (context.value ? format.phone(context.value.phone) : ''))
const companyNameValid = computed(() => draft.value.companyName.trim().length >= 2)

/** A slug typed by hand beats the generated one; otherwise keep them in sync. */
const suggestedSlug = computed(() => slugify(draft.value.companyName))

watch(suggestedSlug, (next) => {
  if (!slugEdited.value) draft.value.slug = next
})

const timezoneItems = SUPPORTED_TIMEZONES.map(zone => ({ label: zone, value: zone }))

let slugTimer: ReturnType<typeof setTimeout> | undefined
watch(
  () => draft.value.slug,
  (slug) => {
    if (!import.meta.client) return
    clearTimeout(slugTimer)
    if (!slug) {
      slugTaken.value = false
      return
    }
    slugTimer = setTimeout(async () => {
      checkingSlug.value = true
      try {
        const result = await checkSlug(slug)
        slugTaken.value = !result.available
      }
      catch {
        slugTaken.value = false
      }
      finally {
        checkingSlug.value = false
      }
    }, 350)
  },
)

onUnmounted(() => clearTimeout(slugTimer))

function useSuggestion() {
  slugEdited.value = false
  draft.value.slug = suggestedSlug.value
}

async function submit() {
  errorMessage.value = null

  if (!companyNameValid.value) {
    errorMessage.value = t('onboarding.errors.companyName')
    return
  }

  pending.value = true
  try {
    persist()
    await complete()
    await refresh()
    toast.add({
      title: t('onboarding.successTitle', { company: draft.value.companyName }),
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })
    await router.replace(localePath('/dashboard'))
  }
  catch (error) {
    const data = (error as { data?: ApiErrorBody }).data
    errorMessage.value = data?.message ?? t('onboarding.errors.generic')
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <div class="wq-panel-elevated p-6 sm:p-8">
    <AuthOnboardingStepper :step="3" />

    <h1 class="text-2xl font-black text-highlighted">
      {{ t('onboarding.companyTitle') }}
    </h1>
    <p class="mt-2 text-sm leading-7 text-muted">
      {{ t('onboarding.companySubtitle', { phone: formattedPhone }) }}
    </p>

    <form
      class="mt-6 space-y-4"
      @submit.prevent="submit"
    >
      <UFormField
        :label="t('onboarding.companyNameLabel')"
        required
      >
        <UInput
          v-model="draft.companyName"
          autocomplete="organization"
          size="xl"
          :placeholder="t('onboarding.companyNamePlaceholder')"
          icon="i-heroicons-building-office"
          class="w-full"
        />
      </UFormField>

      <UFormField
        :label="t('onboarding.slugLabel')"
        :hint="t('onboarding.slugHint')"
      >
        <UInput
          v-model="draft.slug"
          dir="ltr"
          size="xl"
          placeholder="company-name"
          class="w-full text-start"
          :loading="checkingSlug"
          :trailing-icon="
            checkingSlug
              ? undefined
              : slugTaken
                ? 'i-heroicons-x-circle'
                : draft.slug
                  ? 'i-heroicons-check-circle'
                  : undefined
          "
          :ui="{ trailingIcon: slugTaken ? 'text-error' : 'text-success' }"
          @update:model-value="slugEdited = true"
        />

        <p
          v-if="slugTaken"
          class="mt-1.5 flex flex-wrap items-center gap-1 text-xs text-error"
        >
          {{ t('onboarding.slugTaken') }}
          <UButton
            v-if="suggestedSlug"
            variant="link"
            size="xs"
            class="p-0"
            @click="useSuggestion"
          >
            {{ t('onboarding.slugUseSuggestion', { slug: suggestedSlug }) }}
          </UButton>
        </p>
      </UFormField>

      <UFormField
        :label="t('onboarding.industryLabel')"
        :hint="t('common.optional')"
      >
        <UInput
          v-model="draft.industry"
          size="xl"
          :placeholder="t('onboarding.industryPlaceholder')"
          icon="i-heroicons-briefcase"
          class="w-full"
        />
      </UFormField>

      <UFormField :label="t('onboarding.timezoneLabel')">
        <USelect
          v-model="draft.timezone"
          :items="timezoneItems"
          size="xl"
          class="w-full"
        />
      </UFormField>

      <UAccordion
        :items="[{ label: t('onboarding.advanced'), content: '' }]"
        variant="ghost"
        :ui="{ content: 'pt-3' }"
      >
        <template #content>
          <UFormField
            :label="t('onboarding.logoUrlLabel')"
            :hint="t('common.optional')"
          >
            <UInput
              v-model="draft.logoUrl"
              dir="ltr"
              type="url"
              size="lg"
              placeholder="https://"
              icon="i-heroicons-photo"
              class="w-full text-start"
            />
          </UFormField>
        </template>
      </UAccordion>

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
          color="primary"
          icon="i-heroicons-rocket-launch"
          :loading="pending"
          :disabled="!companyNameValid"
        >
          {{ pending ? t('onboarding.creating') : t('onboarding.createCompany') }}
        </UButton>

        <UButton
          :to="localePath('/onboarding/profile')"
          color="neutral"
          variant="ghost"
          size="xl"
          trailing-icon="i-heroicons-arrow-right"
          :disabled="pending"
        >
          {{ t('onboarding.back') }}
        </UButton>
      </div>
    </form>

    <UAlert
      v-if="pending"
      color="info"
      variant="subtle"
      icon="i-heroicons-arrow-path"
      class="mt-4"
      :title="t('onboarding.creatingDetail')"
    />
  </div>
</template>
