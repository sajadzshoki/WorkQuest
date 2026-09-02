<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const { t } = useI18n()
const localePath = useLocalePath()

const title = computed(() => {
  switch (props.error.statusCode) {
    case 404:
      return t('errors.notFound')
    case 403:
      return t('errors.forbidden')
    case 401:
      return t('errors.unauthorized')
    default:
      return t('errors.serverError')
  }
})

const hint = computed(() =>
  props.error.statusCode === 404 ? t('errors.notFoundHint') : (props.error.message || ''),
)

async function reset() {
  await clearError({ redirect: localePath('/dashboard') })
}
</script>

<template>
  <div class="wq-hero-gradient flex min-h-dvh flex-col items-center justify-center px-4 py-16 text-center">
    <div class="wq-panel-elevated w-full max-w-md p-8">
      <p class="text-6xl font-black text-primary tabular-nums">
        {{ props.error.statusCode || 500 }}
      </p>
      <h1 class="mt-4 text-2xl font-bold">
        {{ title }}
      </h1>
      <p
        v-if="hint"
        class="mt-2 text-sm text-muted"
      >
        {{ hint }}
      </p>

      <div class="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <UButton
          size="lg"
          icon="i-heroicons-home"
          :to="localePath('/')"
        >
          {{ t('errors.backHome') }}
        </UButton>
        <UButton
          size="lg"
          color="neutral"
          variant="soft"
          icon="i-heroicons-arrow-path"
          @click="reset"
        >
          {{ t('common.retry') }}
        </UButton>
      </div>
    </div>
  </div>
</template>
