<script setup lang="ts">
import type { ApiErrorBody } from '#shared/types/api'

definePageMeta({ middleware: ['auth'] })

interface TeamResponse {
  teams: Array<{
    id: string
    name: string
    slug: string
    description: string | null
    lead: { id: string, fullName: string, avatarUrl: string | null } | null
    taskCount: number
    memberCount: number
    members: Array<{
      id: string
      fullName: string
      avatarUrl: string | null
      jobTitle: string | null
      role: string
      teamRole: string
      managerName: string | null
      joinedAt: string
    }>
  }>
  managedUserIds: string[] | null
}

const { t } = useI18n()
const localePath = useLocalePath()
const format = useLocaleFormat()
const toast = useToast()
const { user } = useSession()
const { can } = useCan()

const { data, refresh } = await useFetch<TeamResponse>(`/api/teams`)

// Creating a team is `team:manage` — OWNER/ADMIN. A manager leads teams but
// does not get to found new ones (see `server/api/teams/index.post.ts`).
const canCreate = can('team:manage')

const createOpen = ref(false)
const creating = ref(false)
const createError = ref<string | null>(null)
const newTeam = reactive({ name: '', description: '' })

async function create() {
  creating.value = true
  createError.value = null
  try {
    const result = await $fetch<{ team: { id: string } }>('/api/teams', {
      method: 'POST',
      body: { name: newTeam.name, description: newTeam.description },
    })
    await refresh()
    createOpen.value = false
    newTeam.name = ''
    newTeam.description = ''
    toast.add({ title: t('team.createSuccess'), color: 'success', icon: 'i-heroicons-check-circle' })
    await navigateTo(localePath(`/team/${result.team.id}`))
  }
  catch (error) {
    const payload = (error as { data?: ApiErrorBody }).data
    createError.value = payload?.message ?? t('team.errors.generic')
  }
  finally {
    creating.value = false
  }
}
</script>

<template>
  <div>
    <CommonPageHeader
      :title="t('team.title')"
      :subtitle="t('team.subtitle')"
    >
      <template #actions>
        <UButton
          v-if="canCreate"
          icon="i-heroicons-plus"
          size="lg"
          @click="createOpen = true"
        >
          {{ t('team.create') }}
        </UButton>
      </template>
    </CommonPageHeader>

    <CommonEmptyState
      v-if="!data?.teams.length"
      class="wq-panel"
      icon="i-heroicons-user-group"
      :title="t('team.noTeams')"
    />

    <div
      v-else
      class="grid gap-4 lg:grid-cols-2"
    >
      <CommonSectionCard
        v-for="team in data.teams"
        :key="team.id"
        :title="team.name"
        :description="team.description ?? undefined"
        icon="i-heroicons-user-group"
        :to="localePath(`/team/${team.id}`)"
        :to-label="t('team.openTeam')"
      >
        <div class="mb-4 flex flex-wrap gap-2">
          <UBadge
            color="neutral"
            variant="subtle"
            icon="i-heroicons-users"
          >
            {{ t('team.memberCount', { count: format.number(team.memberCount) }) }}
          </UBadge>
          <UBadge
            color="primary"
            variant="subtle"
            icon="i-heroicons-clipboard-document"
          >
            {{ t('team.taskCount', { count: format.number(team.taskCount) }) }}
          </UBadge>
        </div>

        <ul class="divide-y divide-default">
          <li
            v-for="member in team.members"
            :key="member.id"
            class="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <UAvatar
              :src="member.avatarUrl ?? undefined"
              :text="member.fullName.charAt(0)"
              size="md"
            />

            <div class="min-w-0 flex-1">
              <p class="flex items-center gap-2 truncate text-sm font-semibold text-highlighted">
                {{ member.fullName }}
                <UBadge
                  v-if="member.teamRole === 'LEAD'"
                  color="primary"
                  variant="subtle"
                  size="sm"
                >
                  {{ t('team.lead') }}
                </UBadge>
              </p>
              <p class="truncate text-xs text-muted">
                {{ member.jobTitle ?? t(`roles.${member.role}`) }}
                <span v-if="member.managerName"> · {{ t('team.manager') }}: {{ member.managerName }}</span>
              </p>
            </div>

            <UBadge
              v-if="member.id === user?.id"
              color="success"
              variant="subtle"
              size="sm"
            >
              {{ t('tasks.scope.mine') }}
            </UBadge>
          </li>
        </ul>
      </CommonSectionCard>
    </div>

    <UModal
      v-model:open="createOpen"
      :title="t('team.createTitle')"
      :description="t('team.createSubtitle')"
    >
      <template #body>
        <form
          class="space-y-4"
          @submit.prevent="create"
        >
          <UFormField
            :label="t('team.nameLabel')"
            required
          >
            <UInput
              v-model="newTeam.name"
              size="lg"
              :placeholder="t('team.namePlaceholder')"
              icon="i-heroicons-user-group"
              class="w-full"
            />
          </UFormField>

          <UFormField :label="t('team.descriptionLabel')">
            <UTextarea
              v-model="newTeam.description"
              :rows="3"
              :placeholder="t('team.descriptionPlaceholder')"
              class="w-full"
            />
          </UFormField>

          <UAlert
            v-if="createError"
            color="error"
            variant="subtle"
            icon="i-heroicons-exclamation-triangle"
            :title="createError"
          />
        </form>
      </template>

      <template #footer>
        <div class="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <UButton
            color="neutral"
            variant="ghost"
            size="lg"
            @click="createOpen = false"
          >
            {{ t('common.cancel') }}
          </UButton>
          <UButton
            type="submit"
            size="lg"
            :loading="creating"
            :disabled="newTeam.name.trim().length < 2"
            @click="create"
          >
            {{ t('team.create') }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
