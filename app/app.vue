<script setup lang="ts">
const { locale } = useI18n()
const { ensureLoaded } = useSession()

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
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <GamificationCelebration />
  </UApp>
</template>
