<script setup lang="ts">
const { t, locale, locales, setLocale } = useI18n()

interface LocaleItem {
  label: string
  code: string
  icon: string
}

const items = computed<LocaleItem[]>(() =>
  locales.value.map(entry => ({
    label: (entry.name as string | undefined) ?? entry.code,
    code: entry.code,
    icon: entry.code === 'fa' ? 'i-heroicons-language' : 'i-heroicons-globe-alt',
  })),
)

async function switchTo(code: string) {
  if (code === locale.value) return
  await setLocale(code as 'fa' | 'en')
}
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'end', sideOffset: 8 }"
    :aria-label="t('common.language')"
  >
    <template #default>
      <UButton
        square
        variant="ghost"
        color="neutral"
        icon="i-heroicons-language"
        :aria-label="t('common.language')"
      />
    </template>

    <template #item="{ item }">
      <button
        type="button"
        class="flex w-full items-center justify-between gap-4 px-2 py-1.5 text-sm"
        :class="item.code === locale ? 'font-bold text-primary' : 'text-default'"
        @click="switchTo(item.code)"
      >
        <span class="flex items-center gap-2">
          <UIcon
            :name="item.icon"
            class="size-4"
          />
          {{ item.label }}
        </span>
        <UIcon
          v-if="item.code === locale"
          name="i-heroicons-check"
          class="size-4 text-primary"
        />
      </button>
    </template>
  </UDropdownMenu>
</template>
