<script setup lang="ts">
import type { ApiErrorBody } from '#shared/types/api'

definePageMeta({ layout: 'auth', middleware: ['guest'] })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const toast = useToast()
const { refresh } = useSession()
const format = useLocaleFormat()

const phone = computed(() => String(route.query.phone ?? ''))
const code = ref('')
const pending = ref(false)
const errorMessage = ref<string | null>(null)
const resendAfter = ref(Number(route.query.resend ?? 90))

const formattedPhone = computed(() => (phone.value ? format.phone(phone.value) : ''))

// Cooldown timer for the resend action.
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  if (!phone.value) {
    void router.replace(localePath('/login'))
    return
  }
  timer = setInterval(() => {
    resendAfter.value = Math.max(0, resendAfter.value - 1)
    if (resendAfter.value === 0 && timer) clearInterval(timer)
  }, 1000)
})
onUnmounted(() => timer && clearInterval(timer))

async function submit() {
  errorMessage.value = null
  pending.value = true

  try {
    await $fetch('/api/auth/otp/verify', {
      method: 'POST',
      body: { phone: phone.value, code: code.value },
    })
    await refresh()
    await router.push(localePath('/dashboard'))
  }
  catch (error) {
    const data = (error as { data?: ApiErrorBody }).data
    errorMessage.value = data?.message ?? t('auth.errors.generic')
  }
  finally {
    pending.value = false
  }
}

async function resend() {
  if (resendAfter.value > 0) return
  errorMessage.value = null

  try {
    const result = await $fetch<{ resendAfterSeconds: number }>('/api/auth/otp/request', {
      method: 'POST',
      body: { phone: phone.value },
    })
    resendAfter.value = result.resendAfterSeconds
    code.value = ''
    toast.add({ title: t('auth.codeSent'), color: 'success', icon: 'i-heroicons-check-circle' })
  }
  catch (error) {
    const data = (error as { data?: ApiErrorBody }).data
    errorMessage.value = data?.message ?? t('auth.errors.generic')
  }
}
</script>

<template>
  <div class="wq-panel-elevated p-6 sm:p-8">
    <h1 class="text-2xl font-black text-highlighted">
      {{ t('auth.codeTitle') }}
    </h1>
    <p class="mt-2 text-sm leading-7 text-muted">
      {{ t('auth.codeSubtitle', { length: 6, phone: formattedPhone }) }}
    </p>

    <form
      class="mt-6 space-y-4"
      @submit.prevent="submit"
    >
      <AuthOtpCodeInput
        v-model="code"
        :length="6"
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
        :loading="pending"
        :disabled="code.length < 6"
      >
        {{ pending ? t('auth.verifying') : t('auth.verifyCode') }}
      </UButton>
    </form>

    <div class="mt-6 flex flex-col items-center gap-3 border-t border-default pt-5 text-sm sm:flex-row sm:justify-between">
      <NuxtLink
        :to="localePath('/login')"
        class="text-xs font-semibold text-muted hover:text-primary"
      >
        {{ t('auth.changePhone') }}
      </NuxtLink>

      <button
        type="button"
        class="text-xs font-semibold"
        :class="resendAfter > 0 ? 'cursor-not-allowed text-dimmed' : 'text-primary hover:underline'"
        :disabled="resendAfter > 0"
        @click="resend"
      >
        {{ resendAfter > 0 ? t('auth.resendIn', { seconds: format.number(resendAfter) }) : t('auth.resendCode') }}
      </button>
    </div>
  </div>
</template>
