<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <div class="wq-hero-gradient flex min-h-dvh flex-col">
    <header class="flex items-center justify-between px-5 py-5 sm:px-8">
      <NuxtLink
        :to="localePath('/')"
        class="rounded-lg"
      >
        <LayoutAppLogo compact />
      </NuxtLink>

      <div class="flex items-center gap-1">
        <LayoutThemeToggle />
        <LayoutLocaleSwitcher />
      </div>
    </header>

    <main class="flex flex-1 items-center justify-center px-4 py-8">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </main>

    <footer class="px-6 pb-6 text-center text-xs text-dimmed">
      {{ $t('auth.devHint') }}
    </footer>
  </div>
</template>
