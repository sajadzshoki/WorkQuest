<script setup lang="ts">
const { locale } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const { ensureLoaded, refresh, isAuthenticated } = useSession()

// i18n already flips `lang`/`dir`; this keeps them correct on the very first
// paint and when the locale changes at runtime.
useHead({
  htmlAttrs: {
    lang: () => (locale.value === 'fa' ? 'fa' : 'en'),
    dir: () => (locale.value === 'fa' ? 'rtl' : 'ltr'),
  },
})

// Warm the session cache before any page or middleware needs it.
await ensureLoaded()

function routeRequiresAuth(): boolean {
  const middleware = route.meta.middleware
  if (!middleware) return false
  const entries = (Array.isArray(middleware) ? middleware : [middleware]) as unknown[]
  return entries.includes('auth')
}

onMounted(() => {
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return
    void refresh().then(() => {
      if (!isAuthenticated.value && routeRequiresAuth()) {
        void navigateTo(localePath('/login'))
      }
    })
  })
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <GamificationCelebration />
  </UApp>
</template>
