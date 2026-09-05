<script setup lang="ts">
import type { ApiErrorBody, MemberDetailResponse, TeamSummary } from '#shared/types/api'
import type { Role } from '#shared/utils/permissions'

definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()
const format = useLocaleFormat()
const toast = useToast()
const { can } = useCan()

const memberId = computed(() => String(route.params.id ?? ''))

const { data, error, refresh } = await useFetch<MemberDetailResponse>(
  () => `/api/members/${memberId.value}`,
)

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

const member = computed(() => data.value?.member ?? null)
const permissions = computed(() => member.value?.permissions ?? null)

const isAdmin = can('member:manage')

const editOpen = ref(false)
const saving = ref(false)
const errorMessage = ref<string | null>(null)

const edit = reactive({
  fullName: '',
  jobTitle: '',
  role: 'EMPLOYEE' as Role,
  status: 'ACTIVE' as 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED',
  teamId: '',
})

const roleItems = computed(() =>
  (['OWNER', 'ADMIN', 'MANAGER', 'EMPLOYEE'] as const).map(role => ({
    label: t(`roles.${role}`),
    value: role,
  })),
)

const statusItems = computed(() =>
  (['ACTIVE', 'SUSPENDED', 'DEACTIVATED'] as const).map(status => ({
    label: t(`status.user.${status}`),
    value: status,
  })),
)

const teamItems = computed(() => [
  { label: t('members.invite.noTeam'), value: '' },
  ...(teamsData.value?.teams ?? []).map(team => ({ label: team.name, value: team.id })),
])

function openEdit() {
  if (!member.value) return
  edit.fullName = member.value.fullName
  edit.jobTitle = member.value.jobTitle ?? ''
  edit.role = member.value.role
  edit.status = member.value.status
  edit.teamId = member.value.team?.id ?? ''
  errorMessage.value = null
  editOpen.value = true
}

async function save() {
  if (!member.value) return
  saving.value = true
  errorMessage.value = null

  const body: Record<string, unknown> = {
    fullName: edit.fullName,
    jobTitle: edit.jobTitle,
    teamId: edit.teamId,
  }
  // Only send what this caller may actually change — the server rejects the
  // rest, and sending it would turn a valid rename into a 403.
  if (isAdmin && permissions.value?.canChangeRole) body.role = edit.role
  if (isAdmin) body.status = edit.status

  try {
    await $fetch(`/api/members/${memberId.value}`, { method: 'PATCH', body })
    await refresh()
    editOpen.value = false
    toast.add({ title: t('members.edit.success'), color: 'success', icon: 'i-heroicons-check-circle' })
  }
  catch (err) {
    const payload = (err as { data?: ApiErrorBody }).data
    errorMessage.value = payload?.message ?? t('members.edit.errors.generic')
  }
  finally {
    saving.value = false
  }
}

const performance = computed(() => member.value?.performance ?? null)
const progress = computed(() => member.value?.progress ?? null)

/**
 * The deep performance profile — the same numbers the company dashboard
 * shows, for this one person: where the average comes from, whether deadlines
 * hold, and the shape of their recent work.
 */
const performanceProfile = computed(() => member.value?.performanceProfile ?? null)

const profileTiles = computed(() => {
  const profile = performanceProfile.value
  if (!profile) return []
  return [
    {
      label: t('analytics.profile.avgScore'),
      value: profile.averageScore === null ? '—' : format.number(profile.averageScore),
      icon: 'i-heroicons-chart-bar',
      tone: 'primary' as const,
    },
    {
      label: t('analytics.profile.onTimeRate'),
      value: profile.onTimeRate === null ? '—' : format.percent(profile.onTimeRate),
      icon: 'i-heroicons-clock',
      tone: 'success' as const,
    },
    {
      label: t('analytics.profile.coinsEarned'),
      value: format.number(profile.coinsEarned),
      icon: 'i-heroicons-circle-stack-solid',
      tone: 'coin' as const,
    },
    {
      label: t('analytics.profile.coinsSpent'),
      value: format.number(profile.coinsSpent),
      icon: 'i-heroicons-gift',
      tone: 'neutral' as const,
    },
    {
      label: t('analytics.profile.achievements'),
      value: format.number(profile.achievements),
      icon: 'i-heroicons-star',
      tone: 'streak' as const,
    },
    {
      label: t('analytics.profile.recognition'),
      value: format.number(profile.recognition),
      icon: 'i-heroicons-hand-thumb-up',
      tone: 'primary' as const,
    },
  ]
})

const scoreTrendSeries = computed(() => [
  {
    name: t('analytics.profile.avgScore'),
    points: performanceProfile.value?.scoreTrend ?? [],
    colorClass: 'text-primary',
  },
])
</script>

<template>
  <div>
    <NuxtLink
      :to="localePath('/members')"
      class="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary"
    >
      <UIcon
        name="i-heroicons-arrow-right"
        class="size-4"
      />
      {{ t('members.backToList') }}
    </NuxtLink>

    <CommonEmptyState
      v-if="error || !member"
      class="wq-panel"
      icon="i-heroicons-user-circle"
      :title="t('members.notFound')"
    />

    <template v-else>
      <CommonPageHeader
        :title="member.fullName"
        :subtitle="member.jobTitle ?? t('members.noJobTitle')"
      >
        <template #actions>
          <UButton
            v-if="permissions?.canEdit"
            color="neutral"
            variant="outline"
            icon="i-heroicons-pencil-square"
            size="lg"
            @click="openEdit"
          >
            {{ t('common.edit') }}
          </UButton>
        </template>
      </CommonPageHeader>

      <div class="grid gap-4 lg:grid-cols-3">
        <CommonSectionCard
          :title="t('members.detail.profile')"
          icon="i-heroicons-identification"
          class="lg:col-span-1"
        >
          <div class="flex items-center gap-3">
            <UAvatar
              :src="member.avatarUrl ?? undefined"
              :text="member.fullName.charAt(0)"
              size="2xl"
            />
            <div class="min-w-0">
              <p class="truncate text-base font-bold text-highlighted">
                {{ member.fullName }}
              </p>
              <p
                dir="ltr"
                class="text-start text-xs text-muted"
              >
                {{ format.phone(member.phone) }}
              </p>
            </div>
          </div>

          <dl class="mt-4 space-y-3 text-sm">
            <div class="flex items-center justify-between gap-3">
              <dt class="text-muted">
                {{ t('members.detail.role') }}
              </dt>
              <dd><MembersRoleBadge :role="member.role" /></dd>
            </div>
            <div class="flex items-center justify-between gap-3">
              <dt class="text-muted">
                {{ t('members.detail.status') }}
              </dt>
              <dd><MembersStatusBadge :status="member.status" /></dd>
            </div>
            <div class="flex items-center justify-between gap-3">
              <dt class="text-muted">
                {{ t('members.detail.team') }}
              </dt>
              <dd class="truncate font-semibold text-highlighted">
                <NuxtLink
                  v-if="member.team"
                  :to="localePath(`/team/${member.team.id}`)"
                  class="hover:text-primary"
                >
                  {{ member.team.name }}
                </NuxtLink>
                <span
                  v-else
                  class="text-dimmed"
                >{{ t('members.noTeam') }}</span>
              </dd>
            </div>
            <div class="flex items-center justify-between gap-3">
              <dt class="text-muted">
                {{ t('team.manager') }}
              </dt>
              <dd class="truncate font-semibold text-highlighted">
                {{ member.manager?.fullName ?? '—' }}
              </dd>
            </div>
            <div class="flex items-center justify-between gap-3">
              <dt class="text-muted">
                {{ t('members.detail.lastLogin') }}
              </dt>
              <dd class="text-highlighted">
                {{ member.lastLoginAt ? format.date(member.lastLoginAt, { year: 'numeric', month: 'short', day: 'numeric' }) : t('members.detail.neverLoggedIn') }}
              </dd>
            </div>
            <div
              v-if="member.subordinateCount > 0"
              class="flex items-center justify-between gap-3"
            >
              <dt class="text-muted">
                {{ t('members.detail.subordinates') }}
              </dt>
              <dd class="font-semibold text-highlighted">
                {{ format.number(member.subordinateCount) }}
              </dd>
            </div>
          </dl>
        </CommonSectionCard>

        <CommonSectionCard
          :title="t('members.detail.gamification')"
          icon="i-heroicons-sparkles"
          class="lg:col-span-2"
        >
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <GamificationStatTile
              :label="t('gamification.level')"
              :value="progress?.level?.name ?? '—'"
              icon="i-heroicons-trophy"
            />
            <GamificationStatTile
              :label="t('gamification.xp')"
              :value="format.number(progress?.xp ?? 0)"
              icon="i-heroicons-bolt"
            />
            <GamificationStatTile
              :label="t('gamification.coins')"
              :value="format.number(progress?.coins ?? 0)"
              icon="i-heroicons-currency-dollar"
            />
            <GamificationStatTile
              :label="t('gamification.streak')"
              :value="format.number(progress?.longestStreak ?? 0)"
              icon="i-heroicons-fire"
            />
          </div>

          <div class="mt-5">
            <h3 class="mb-2 text-xs font-bold text-muted">
              {{ t('members.detail.performance') }}
            </h3>
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <GamificationStatTile
                :label="t('status.task.TODO')"
                :value="format.number(performance?.assigned ?? 0)"
                icon="i-heroicons-clipboard-document-list"
                tone="primary"
              />
              <GamificationStatTile
                :label="t('status.task.SUBMITTED')"
                :value="format.number(performance?.inReview ?? 0)"
                icon="i-heroicons-paper-airplane"
                tone="coin"
              />
              <GamificationStatTile
                :label="t('status.task.APPROVED')"
                :value="format.number(performance?.completed ?? 0)"
                icon="i-heroicons-check-circle"
                tone="success"
              />
              <GamificationStatTile
                :label="t('members.detail.overdue')"
                :value="format.number(performance?.overdue ?? 0)"
                icon="i-heroicons-clock"
                tone="streak"
              />
            </div>
          </div>
        </CommonSectionCard>

        <CommonSectionCard
          :title="t('members.detail.achievements')"
          icon="i-heroicons-star"
          class="lg:col-span-3"
        >
          <!-- Badge shelf -->
          <div
            v-if="member.badges.length"
            class="mb-4 flex flex-wrap gap-x-6 gap-y-4 rounded-xl bg-elevated/40 p-4"
          >
            <GamificationBadge
              v-for="badge in member.badges"
              :key="badge.id"
              :name="badge.name"
              :icon-key="badge.iconKey"
              :tone="badge.tone"
              :description="badge.description"
              :awarded-at="badge.awardedAt"
              size="md"
            />
          </div>

          <CommonEmptyState
            v-if="!member.achievements.length && !member.badges.length"
            icon="i-heroicons-star"
            :title="t('members.detail.noAchievements')"
          />

          <ul
            v-else
            class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            <li
              v-for="achievement in member.achievements"
              :key="achievement.unlockedAt"
              class="flex items-start gap-3 rounded-xl bg-elevated p-3"
            >
              <span class="grid size-9 shrink-0 place-items-center rounded-lg bg-warning/15 text-warning">
                <UIcon
                  :name="achievement.iconKey || 'i-heroicons-star'"
                  class="size-5"
                />
              </span>
              <div class="min-w-0">
                <p class="truncate text-sm font-bold text-highlighted">
                  {{ achievement.name }}
                </p>
                <p class="truncate text-xs text-muted">
                  {{ format.date(achievement.unlockedAt, { year: 'numeric', month: 'short', day: 'numeric' }) }}
                </p>
              </div>
            </li>
          </ul>
        </CommonSectionCard>
      </div>

      <!-- The performance profile: not a database record — a review
           conversation. Headline numbers first, then the trend they came
           from, then the work itself. -->
      <CommonSectionCard
        :title="t('analytics.profile.title')"
        icon="i-heroicons-chart-bar-square"
        class="mt-4"
      >
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <GamificationStatTile
            v-for="tile in profileTiles"
            :key="tile.label"
            :label="tile.label"
            :value="tile.value"
            :icon="tile.icon"
            :tone="tile.tone"
          />
        </div>

        <div class="mt-5 grid gap-5 lg:grid-cols-2">
          <div>
            <h3 class="mb-2 text-xs font-bold text-muted">
              {{ t('analytics.profile.scoreTrend') }}
            </h3>
            <AnalyticsLineChart
              :series="scoreTrendSeries"
              :max="100"
              :format-value="format.number"
            />
          </div>

          <div>
            <h3 class="mb-2 text-xs font-bold text-muted">
              {{ t('analytics.profile.recentTasks') }}
            </h3>
            <CommonEmptyState
              v-if="!performanceProfile?.recentTasks.length"
              icon="i-heroicons-clipboard-document-check"
              :title="t('analytics.profile.noRecentTasks')"
            />
            <ul
              v-else
              class="divide-y divide-default"
            >
              <li
                v-for="task in performanceProfile.recentTasks"
                :key="task.id"
                class="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <NuxtLink
                  :to="localePath(`/tasks/${task.id}`)"
                  class="min-w-0 flex-1 truncate text-sm text-highlighted hover:text-primary"
                >
                  {{ task.title }}
                </NuxtLink>
                <span class="shrink-0 text-xs text-dimmed">
                  {{ format.relative(task.completedAt) }}
                </span>
                <UBadge
                  :color="task.score === null ? 'neutral' : task.score >= 70 ? 'success' : task.score >= 40 ? 'warning' : 'error'"
                  variant="subtle"
                  size="sm"
                  class="shrink-0 tabular-nums"
                >
                  {{ task.score === null ? '—' : format.number(task.score) }}
                </UBadge>
              </li>
            </ul>
          </div>
        </div>
      </CommonSectionCard>
    </template>

    <UModal
      v-model:open="editOpen"
      :title="t('members.edit.title')"
      :description="member?.fullName"
    >
      <template #body>
        <form
          class="space-y-4"
          @submit.prevent="save"
        >
          <UFormField :label="t('members.invite.nameLabel')">
            <UInput
              v-model="edit.fullName"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField :label="t('members.invite.jobTitleLabel')">
            <UInput
              v-model="edit.jobTitle"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField :label="t('members.invite.teamLabel')">
            <USelect
              v-model="edit.teamId"
              :items="teamItems"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            v-if="isAdmin && permissions?.canChangeRole"
            :label="t('members.invite.roleLabel')"
          >
            <USelect
              v-model="edit.role"
              :items="roleItems"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            v-if="isAdmin"
            :label="t('members.detail.status')"
          >
            <USelect
              v-model="edit.status"
              :items="statusItems"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UAlert
            v-if="!isAdmin"
            color="info"
            variant="subtle"
            icon="i-heroicons-information-circle"
            :title="t('members.edit.managerNotice')"
          />

          <UAlert
            v-if="errorMessage"
            color="error"
            variant="subtle"
            icon="i-heroicons-exclamation-triangle"
            :title="errorMessage"
          />
        </form>
      </template>

      <template #footer>
        <div class="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <UButton
            color="neutral"
            variant="ghost"
            size="lg"
            @click="editOpen = false"
          >
            {{ t('common.cancel') }}
          </UButton>
          <UButton
            type="submit"
            size="lg"
            :loading="saving"
            @click="save"
          >
            {{ t('common.save') }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
