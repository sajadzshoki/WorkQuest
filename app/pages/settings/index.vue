<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const { t, locale, locales, setLocale } = useI18n()
const colorMode = useColorMode()
const { user, company } = useSession()
const format = useLocaleFormat()
const toast = useToast()

const localeItems = computed(() =>
  locales.value.map(entry => ({
    label: (entry.name as string | undefined) ?? entry.code,
    value: entry.code,
  })),
)

const themeItems = computed(() => [
  { label: t('common.light'), value: 'light' },
  { label: t('common.dark'), value: 'dark' },
  { label: t('common.system'), value: 'system' },
])

const preferredLocale = ref(locale.value)
const preferredTheme = ref(colorMode.preference)

watch(locale, (value) => {
  preferredLocale.value = value
})

async function save() {
  if (preferredLocale.value !== locale.value) {
    await setLocale(preferredLocale.value as 'fa' | 'en')
  }
  colorMode.preference = preferredTheme.value as 'light' | 'dark' | 'system'
  toast.add({ title: t('settings.saved'), color: 'success', icon: 'i-heroicons-check' })
}

const profileFields = computed(() => [
  { label: t('settings.fullName'), value: user.value?.fullName ?? '—' },
  { label: t('settings.phone'), value: user.value?.phone ? format.phone(user.value.phone) : '—' },
  { label: t('settings.email'), value: user.value?.email ?? '—' },
  { label: t('settings.role'), value: t(`roles.${user.value?.role ?? 'EMPLOYEE'}`) },
])
</script>

<template>
  <div>
    <CommonPageHeader
      :title="t('settings.title')"
      :subtitle="t('settings.subtitle')"
    />

    <div class="grid gap-4 lg:grid-cols-2">
      <CommonSectionCard
        :title="t('settings.profile')"
        icon="i-heroicons-user-circle"
      >
        <div class="flex items-center gap-4">
          <UAvatar
            :src="user?.avatarUrl ?? undefined"
            :text="user?.fullName?.charAt(0)"
            size="2xl"
          />
          <div class="min-w-0">
            <p class="truncate text-base font-bold text-highlighted">
              {{ user?.fullName }}
            </p>
            <p class="truncate text-xs text-muted">
              {{ company?.name }}
            </p>
            <UBadge
              class="mt-2"
              color="primary"
              variant="subtle"
              size="sm"
            >
              {{ t(`roles.${user?.role ?? 'EMPLOYEE'}`) }}
            </UBadge>
          </div>
        </div>

        <dl class="mt-5 divide-y divide-default border-t border-default">
          <div
            v-for="field in profileFields"
            :key="field.label"
            class="flex items-center justify-between gap-4 py-2.5"
          >
            <dt class="text-xs text-muted">
              {{ field.label }}
            </dt>
            <dd
              class="truncate text-sm font-semibold text-highlighted"
              dir="auto"
            >
              {{ field.value }}
            </dd>
          </div>
        </dl>
      </CommonSectionCard>

      <div class="space-y-4">
        <CommonSectionCard
          :title="t('settings.preferences')"
          icon="i-heroicons-adjustments-horizontal"
        >
          <form
            class="space-y-4"
            @submit.prevent="save"
          >
            <UFormField :label="t('settings.languageLabel')">
              <USelect
                v-model="preferredLocale"
                :items="localeItems"
                value-key="value"
                label-key="label"
                class="w-full"
              />
            </UFormField>

            <UFormField :label="t('settings.themeLabel')">
              <USelect
                v-model="preferredTheme"
                :items="themeItems"
                value-key="value"
                label-key="label"
                class="w-full"
              />
            </UFormField>

            <UButton
              type="submit"
              icon="i-heroicons-check"
            >
              {{ t('common.save') }}
            </UButton>
          </form>
        </CommonSectionCard>

        <CommonSectionCard
          :title="t('settings.companyInfo')"
          icon="i-heroicons-building-office"
        >
          <dl class="divide-y divide-default">
            <div class="flex items-center justify-between gap-4 py-2.5">
              <dt class="text-xs text-muted">
                {{ t('settings.company') }}
              </dt>
              <dd class="truncate text-sm font-semibold text-highlighted">
                {{ company?.name }}
              </dd>
            </div>
            <div class="flex items-center justify-between gap-4 py-2.5">
              <dt class="text-xs text-muted">
                {{ t('settings.timezone') }}
              </dt>
              <dd
                class="truncate text-sm font-semibold text-highlighted"
                dir="ltr"
              >
                {{ company?.timezone }}
              </dd>
            </div>
            <div class="flex items-center justify-between gap-4 py-2.5">
              <dt class="text-xs text-muted">
                {{ t('common.language') }}
              </dt>
              <dd
                class="truncate text-sm font-semibold text-highlighted"
                dir="ltr"
              >
                {{ company?.locale }}
              </dd>
            </div>
          </dl>
        </CommonSectionCard>
      </div>
    </div>
  </div>
</template>
