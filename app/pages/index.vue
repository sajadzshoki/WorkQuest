<script setup lang="ts">
definePageMeta({ layout: 'landing' })

const { t } = useI18n()
const localePath = useLocalePath()
const { isAuthenticated } = useSession()

const features = [
  { key: 'tasks', icon: 'i-heroicons-clipboard-document-check' },
  { key: 'xp', icon: 'i-heroicons-arrow-trending-up' },
  { key: 'rewards', icon: 'i-heroicons-gift' },
  { key: 'teams', icon: 'i-heroicons-shield-check' },
] as const
</script>

<template>
  <div>
    <section class="wq-hero-gradient">
      <div class="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div class="max-w-2xl">
          <UBadge
            color="primary"
            variant="subtle"
            icon="i-heroicons-sparkles"
            size="lg"
          >
            {{ t('landing.hero.badge') }}
          </UBadge>

          <h1 class="mt-5 text-4xl font-black leading-tight tracking-tight text-highlighted sm:text-5xl">
            {{ t('landing.hero.title') }}
          </h1>

          <p class="mt-4 text-base leading-8 text-muted sm:text-lg">
            {{ t('landing.hero.subtitle') }}
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <UButton
              size="xl"
              :to="localePath(isAuthenticated ? '/dashboard' : '/login')"
              trailing-icon="i-heroicons-arrow-left"
              class="justify-center"
            >
              {{ t('landing.hero.cta') }}
            </UButton>
            <UButton
              size="xl"
              color="neutral"
              variant="outline"
              to="#features"
              class="justify-center"
            >
              {{ t('landing.hero.secondary') }}
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <section
      id="features"
      class="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6"
    >
      <h2 class="text-2xl font-black text-highlighted sm:text-3xl">
        {{ t('landing.features.title') }}
      </h2>

      <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="feature in features"
          :key="feature.key"
          class="wq-panel p-5"
        >
          <span class="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
            <UIcon
              :name="feature.icon"
              class="size-5.5"
            />
          </span>
          <h3 class="mt-4 text-base font-bold text-highlighted">
            {{ t(`landing.features.${feature.key}.title`) }}
          </h3>
          <p class="mt-2 text-sm leading-7 text-muted">
            {{ t(`landing.features.${feature.key}.body`) }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
