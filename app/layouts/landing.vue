<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { isAuthenticated } = useSession()
const runtime = useRuntimeConfig()
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-default">
    <header class="wq-hero-gradient border-b border-default">
      <div class="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <LayoutAppLogo />

        <div class="flex items-center gap-1">
          <LayoutThemeToggle />
          <LayoutLocaleSwitcher />
          <UButton
            :to="localePath(isAuthenticated ? '/dashboard' : '/login')"
            size="sm"
            class="ms-2"
          >
            {{ isAuthenticated ? t('nav.dashboard') : t('landing.hero.cta') }}
          </UButton>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-default">
      <div
        class="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted sm:flex-row sm:px-6"
      >
        <span>{{ runtime.public.appName }} · {{ t('landing.footer') }}</span>
        <span>{{ runtime.public.supportEmail }}</span>
      </div>
    </footer>
  </div>
</template>
