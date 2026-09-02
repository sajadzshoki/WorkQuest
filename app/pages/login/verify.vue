<script setup lang="ts">
import type { ApiErrorBody, RequestOtpResponse, VerifyOtpResponse } from '#shared/types/api'

definePageMeta({ layout: 'auth', middleware: ['guest'] })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const toast = useToast()
const { refresh } = useSession()
const format = useLocaleFormat()

const phone = computed(() => String(route.query.phone ?? ''))
const purpose = computed<'LOGIN' | 'REGISTER'>(() =>
  route.query.purpose === 'REGISTER' ? 'REGISTER' : 'LOGIN',
)

const code = ref('')
const pending = ref(false)
const errorMessage = ref<string | null>(null)
const errorIcon = ref('i-heroicons-exclamation-triangle')
const resendAfter = ref(Number(route.query.resend ?? 90))

const formattedPhone = computed(() => (phone.value ? format.phone(phone.value) : ''))
const headline = computed(() =>
  purpose.value === 'REGISTER' ? t('auth.codeTitleRegister') : t('auth.codeTitle'),
)

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
    const result = await $fetch<VerifyOtpResponse>('/api/auth/otp/verify', {
      method: 'POST',
      body: { phone: phone.value, code: code.value },
    })

    if (result.status === 'onboarding_required') {
      toast.add({
        title: t('onboarding.verifySuccess'),
        description: t('onboarding.verifySuccessDetail'),
        color: 'success',
        icon: 'i-heroicons-check-circle',
      })
      await router.push(localePath('/onboarding/profile'))
      return
    }

    if (result.status === 'invitation_pending') {
      // A company is waiting on this phone — joining takes priority over
      // self-service registration, because the invitation carries the role.
      toast.add({
        title: t('invitations.verifySuccess'),
        description: t('invitations.verifySuccessDetail'),
        color: 'success',
        icon: 'i-heroicons-envelope-open',
      })
      await router.push(localePath('/invitations/join'))
      return
    }

    await refresh()
    toast.add({
      title: t('auth.welcomeBack', { name: result.user.fullName }),
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })
    await router.push(localePath('/dashboard'))
  }
  catch (error) {
    const data = (error as { data?: ApiErrorBody }).data
    errorMessage.value = data?.message ?? t('auth.errors.generic')
    // An expired or burned code is a "resend" situation, not a typo.
    errorIcon.value
      = data?.code === 'AUTH_CODE_EXPIRED'
        ? 'i-heroicons-clock'
        : 'i-heroicons-exclamation-triangle'
    if (data?.code === 'AUTH_CODE_EXPIRED') code.value = ''
  }
  finally {
    pending.value = false
  }
}

async function resend() {
  if (resendAfter.value > 0) return
  errorMessage.value = null

  try {
    const result = await $fetch<RequestOtpResponse>('/api/auth/otp/request', {
      method: 'POST',
      body: { phone: phone.value, purpose: purpose.value },
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
    <AuthOnboardingStepper
      :step="1"
      class="-mt-1"
    />

    <h1 class="text-2xl font-black text-highlighted">
      {{ headline }}
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
        :icon="errorIcon"
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

    <p class="mt-5 flex items-start gap-2 text-xs leading-6 text-dimmed">
      <UIcon
        name="i-heroicons-lock-closed"
        class="mt-0.5 size-4 shrink-0 text-muted"
      />
      {{ t('auth.otpSecurityNote') }}
    </p>
  </div>
</template>
