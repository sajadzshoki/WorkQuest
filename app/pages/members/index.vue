<script setup lang="ts">
import type { MemberListResponse, TeamSummary } from '#shared/types/api'

definePageMeta({ middleware: ['auth'] })

const { t } = useI18n()
const localePath = useLocalePath()
const format = useLocaleFormat()
const { can } = useCan()
const { user } = useSession()

/**
 * `scope` is what the *client* asks for; the server may answer with a narrower
 * list and says so in `response.scope`. The UI follows the response, never the
 * request, so a MANAGER cannot widen the view from the address bar.
 */
const search = ref('')
const teamFilter = ref('')
const roleFilter = ref<'' | 'OWNER' | 'ADMIN' | 'MANAGER' | 'EMPLOYEE'>('')

const canInvite = can('member:invite')
const wantsCompanyWide = can('member:manage')

const query = computed(() => ({
  search: search.value || undefined,
  teamId: teamFilter.value || undefined,
  role: roleFilter.value || undefined,
  scope: wantsCompanyWide ? 'all' : 'mine',
  pageSize: 100,
}))

const { data, pending, refresh } = await useFetch<MemberListResponse>('/api/members', {
  query,
  // Debounce-ish: only re-run once the user pauses typing.
  watch: [search, teamFilter, roleFilter],
})

const { data: teamsData } = await useFetch<{ teams: TeamSummary[] }>('/api/teams', {
  transform: response => ({
    teams: response.teams.map(team => ({
      id: team.id,
      name: team.name,
      slug: team.slug,
      description: team.description,
      memberCount: team.memberCount,
      lead: team.lead,
      createdAt: '',
    })),
  }),
})

const inviteOpen = ref(false)

const teamItems = computed(() => [
  { label: t('common.all'), value: '' },
  ...(teamsData.value?.teams ?? []).map(team => ({ label: team.name, value: team.id })),
])

const roleItems = computed(() => [
  { label: t('common.all'), value: '' as const },
  ...(['OWNER', 'ADMIN', 'MANAGER', 'EMPLOYEE'] as const).map(role => ({
    label: t(`roles.${role}`),
    value: role,
  })),
])

/** Group the flat list by team so the roster reads as an org, not a table dump. */
const grouped = computed(() => {
  const buckets = new Map<string, { name: string | null, members: MemberListResponse['members'] }>()
  for (const member of data.value?.members ?? []) {
    const key = member.team?.id ?? 'none'
    const bucket = buckets.get(key) ?? { name: member.team?.name ?? null, members: [] }
    bucket.members.push(member)
    buckets.set(key, bucket)
  }
  return [...buckets.entries()]
    .sort((a, b) => (a[1].name ?? '\uFFFF').localeCompare(b[1].name ?? '\uFFFF', 'fa'))
    .map(([, value]) => value)
})

async function removeMember(id: string, fullName: string) {
  if (!window.confirm(t('members.removeConfirm', { name: fullName }))) return

  try {
    await $fetch(`/api/members/${id}`, { method: 'DELETE' })
    await refresh()
  }
  catch {
    // The row-level state is authoritative; a failed delete simply persists.
    await refresh()
  }
}
</script>

<template>
  <div>
    <CommonPageHeader
      :title="t('members.title')"
      :subtitle="t('members.subtitle')"
    >
      <template #actions>
        <UButton
          v-if="canInvite"
          icon="i-heroicons-user-plus"
          size="lg"
          @click="inviteOpen = true"
        >
          {{ t('members.invite.cta') }}
        </UButton>
      </template>
    </CommonPageHeader>

    <div class="wq-panel mb-4 flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
      <UInput
        v-model="search"
        :placeholder="t('members.searchPlaceholder')"
        icon="i-heroicons-magnifying-glass"
        class="w-full sm:max-w-xs"
      />

      <USelect
        v-model="teamFilter"
        :items="teamItems"
        :placeholder="t('members.filters.team')"
        class="w-full sm:w-48"
      />

      <USelect
        v-model="roleFilter"
        :items="roleItems"
        :placeholder="t('members.filters.role')"
        class="w-full sm:w-44"
      />

      <p
        v-if="data"
        class="shrink-0 text-xs text-muted sm:ms-auto"
      >
        {{ t('members.total', { count: format.number(data.total) }) }}
      </p>
    </div>

    <CommonEmptyState
      v-if="!pending && !data?.members.length"
      class="wq-panel"
      icon="i-heroicons-user-group"
      :title="t('members.empty.title')"
      :description="canInvite ? t('members.empty.description') : t('members.empty.descriptionReadOnly')"
    >
      <UButton
        v-if="canInvite"
        class="mt-3"
        icon="i-heroicons-user-plus"
        @click="inviteOpen = true"
      >
        {{ t('members.invite.cta') }}
      </UButton>
    </CommonEmptyState>

    <div
      v-else
      class="space-y-4"
    >
      <CommonSectionCard
        v-for="(group, index) in grouped"
        :key="index"
        :title="group.name ?? t('members.noTeam')"
        :description="t('members.memberCount', { count: format.number(group.members.length) })"
        icon="i-heroicons-user-group"
      >
        <ul class="divide-y divide-default">
          <li
            v-for="member in group.members"
            :key="member.id"
            class="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <UAvatar
              :src="member.avatarUrl ?? undefined"
              :text="member.fullName.charAt(0)"
              size="lg"
            />

            <div class="min-w-0 flex-1">
              <NuxtLink
                :to="localePath(`/members/${member.id}`)"
                class="flex items-center gap-2 truncate text-sm font-bold text-highlighted hover:text-primary"
              >
                {{ member.fullName }}
                <UBadge
                  v-if="member.id === user?.id"
                  color="success"
                  variant="subtle"
                  size="sm"
                >
                  {{ t('members.you') }}
                </UBadge>
                <UBadge
                  v-if="member.teamRole === 'LEAD'"
                  color="primary"
                  variant="subtle"
                  size="sm"
                >
                  {{ t('team.lead') }}
                </UBadge>
              </NuxtLink>

              <p class="truncate text-xs text-muted">
                {{ member.jobTitle ?? t('members.noJobTitle') }}
                <span
                  dir="ltr"
                  class="text-dimmed"
                > · {{ format.phone(member.phone) }}</span>
                <span v-if="member.manager"> · {{ t('team.manager') }}: {{ member.manager.fullName }}</span>
              </p>
            </div>

            <div class="flex shrink-0 items-center gap-2">
              <UBadge
                v-if="member.subordinateCount > 0"
                color="neutral"
                variant="outline"
                size="sm"
                icon="i-heroicons-users"
              >
                {{ format.number(member.subordinateCount) }}
              </UBadge>
              <MembersRoleBadge :role="member.role" />
              <MembersStatusBadge
                v-if="member.status !== 'ACTIVE'"
                :status="member.status"
              />
            </div>

            <UDropdownMenu
              v-if="data?.canManageRoles && member.id !== user?.id"
              :items="[[{
                label: t('members.actions.view'),
                icon: 'i-heroicons-eye',
                to: localePath(`/members/${member.id}`),
              }, {
                label: t('members.actions.remove'),
                icon: 'i-heroicons-user-minus',
                color: 'error' as const,
                onSelect: () => removeMember(member.id, member.fullName),
              }]]"
              :content="{ align: 'end' }"
            >
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-heroicons-ellipsis-horizontal"
                :aria-label="t('common.actions')"
              />
            </UDropdownMenu>
          </li>
        </ul>
      </CommonSectionCard>
    </div>

    <MembersInviteModal
      v-if="canInvite"
      v-model:open="inviteOpen"
      :teams="teamsData?.teams ?? []"
      @invited="refresh()"
    />
  </div>
</template>
