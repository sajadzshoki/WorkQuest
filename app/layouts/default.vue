<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="min-h-dvh bg-muted/40">
    <LayoutAppSidebar />

    <div class="flex min-h-dvh flex-col lg:ps-64">
      <LayoutAppTopbar />

      <main class="flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12">
        <div class="mx-auto w-full max-w-7xl">
          <slot />
        </div>
      </main>

      <footer class="hidden px-8 pb-6 text-xs text-dimmed lg:block">
        {{ t('app.name') }} · {{ t('landing.footer') }}
      </footer>
    </div>

    <LayoutAppMobileNav />

    <!-- The single confirmation dialog every destructive action shares. -->
    <CommonConfirmDialog />
  </div>
</template>
