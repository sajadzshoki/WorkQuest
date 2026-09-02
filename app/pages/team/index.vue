<script setup lang="ts">
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
const format = useLocaleFormat()
const { user } = useSession()

const { data } = await useFetch<TeamResponse>(`/api/teams`)
</script>

<template>
  <div>
    <CommonPageHeader
      :title="t('team.title')"
      :subtitle="t('team.subtitle')"
    />

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
  </div>
</template>
