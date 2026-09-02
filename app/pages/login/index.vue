<script setup lang="ts">
import type { ApiErrorBody, RequestOtpResponse } from '#shared/types/api'

definePageMeta({ layout: 'auth', middleware: ['guest'] })

const { t } = useI18n()
const localePath = useLocalePath()
const toast = useToast()
const router = useRouter()

const phone = ref('')
const pending = ref<'LOGIN' | 'REGISTER' | null>(null)
const errorMessage = ref<string | null>(null)

/** Both buttons share one flow; only the purpose sent to the server differs. */
async function request(purpose: 'LOGIN' | 'REGISTER') {
  errorMessage.value = null
  pending.value = purpose

  try {
    const result = await $fetch<RequestOtpResponse>('/api/auth/otp/request', {
      method: 'POST',
      body: { phone: phone.value, purpose },
    })

    toast.add({
      title: t('auth.codeSent'),
      description: t('auth.codeSentDetail', { provider: result.provider }),
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })

    await router.push(
      localePath({
        path: '/login/verify',
        query: {
          phone: result.phone,
          resend: String(result.resendAfterSeconds),
          purpose: result.purpose,
        },
      }),
    )
  }
  catch (error) {
    const data = (error as { data?: ApiErrorBody }).data
    errorMessage.value = data?.message ?? t('auth.errors.generic')
  }
  finally {
    pending.value = null
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
      @submit.prevent="request('LOGIN')"
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
          inputmode="tel"
          size="xl"
          :placeholder="t('auth.phonePlaceholder')"
          icon="i-heroicons-device-phone-mobile"
          class="w-full text-start"
          :disabled="pending !== null"
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
        :loading="pending === 'LOGIN'"
        :disabled="phone.length < 10 || pending !== null"
      >
        {{ pending === 'LOGIN' ? t('auth.sending') : t('auth.sendCode') }}
      </UButton>
    </form>

    <div class="my-6 flex items-center gap-3 text-xs text-dimmed">
      <span class="h-px flex-1 bg-default" />
      {{ t('auth.orDivider') }}
      <span class="h-px flex-1 bg-default" />
    </div>

    <div class="rounded-2xl border border-dashed border-default p-4">
      <h2 class="text-sm font-bold text-highlighted">
        {{ t('auth.registerTitle') }}
      </h2>
      <p class="mt-1 text-xs leading-6 text-muted">
        {{ t('auth.registerSubtitle') }}
      </p>

      <UButton
        color="neutral"
        variant="outline"
        size="lg"
        block
        class="mt-3"
        icon="i-heroicons-building-office"
        :loading="pending === 'REGISTER'"
        :disabled="phone.length < 10 || pending !== null"
        @click="request('REGISTER')"
      >
        {{ pending === 'REGISTER' ? t('auth.sending') : t('auth.registerCompany') }}
      </UButton>
    </div>

    <p class="mt-5 flex items-start gap-2 text-xs leading-6 text-dimmed">
      <UIcon
        name="i-heroicons-shield-check"
        class="mt-0.5 size-4 shrink-0 text-success"
      />
      {{ t('auth.securityNote') }}
    </p>
  </div>
</template>
