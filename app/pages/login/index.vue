<script setup lang="ts">
import type { ApiErrorBody } from '#shared/types/api'

definePageMeta({ layout: 'auth', middleware: ['guest'] })

const { t } = useI18n()
const localePath = useLocalePath()
const toast = useToast()
const router = useRouter()

const phone = ref('')
const pending = ref(false)
const errorMessage = ref<string | null>(null)

async function submit() {
  errorMessage.value = null
  pending.value = true

  try {
    const result = await $fetch<{ phone: string, resendAfterSeconds: number }>('/api/auth/otp/request', {
      method: 'POST',
      body: { phone: phone.value },
    })

    toast.add({ title: t('auth.codeSent'), color: 'success', icon: 'i-heroicons-check-circle' })
    await router.push(
      localePath({
        path: '/login/verify',
        query: { phone: result.phone, resend: String(result.resendAfterSeconds) },
      }),
    )
  }
  catch (error) {
    const data = (error as { data?: ApiErrorBody }).data
    errorMessage.value = data?.message ?? t('auth.errors.generic')
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <div class="wq-panel-elevated p-6 sm:p-8">
    <h1 class="text-2xl font-black text-highlighted">
      {{ t('auth.loginTitle') }}
    </h1>
    <p class="mt-2 text-sm leading-7 text-muted">
      {{ t('auth.loginSubtitle') }}
    </p>

    <form
      class="mt-6 space-y-4"
      @submit.prevent="submit"
    >
      <UFormField
        :label="t('auth.phoneLabel')"
        required
      >
        <UInput
          v-model="phone"
          type="tel"
          dir="ltr"
          autocomplete="tel"
          size="xl"
          :placeholder="t('auth.phonePlaceholder')"
          icon="i-heroicons-device-phone-mobile"
          class="w-full text-start"
        />
      </UFormField>

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
        :loading="pending"
        :disabled="phone.length < 10"
      >
        {{ pending ? t('auth.sending') : t('auth.sendCode') }}
      </UButton>
    </form>
  </div>
</template>
