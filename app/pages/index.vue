<script setup lang="ts">
/**
 * WorkQuest is not useful before a session exists.
 * Send visitors straight into the app or the sign-in flow.
 *
 * This lives in setup, not an inline route middleware: `navigateTo` needs the
 * Nuxt instance, and inline page middleware loses it.
 */
const { isAuthenticated, ensureLoaded } = useSession()
const localePath = useLocalePath()

await ensureLoaded()

await navigateTo(localePath(isAuthenticated.value ? '/dashboard' : '/login'), {
  redirectCode: 302,
})
</script>

<template>
  <div />
</template>
