/**
 * Sidebar / mobile navigation model in one place so both surfaces stay in sync
 * and permission changes only need to be made once.
 */
export interface NavItem {
  key: string
  label: string
  to: string
  icon: string
  permission?: Parameters<ReturnType<typeof useCan>['can']>[0]
}

export function useNavItems() {
  const { t } = useI18n()
  const localePath = useLocalePath()

  return computed<NavItem[]>(() => [
    { key: 'dashboard', label: t('nav.dashboard'), to: localePath('/dashboard'), icon: 'i-heroicons-squares-2x2' },
    { key: 'tasks', label: t('nav.tasks'), to: localePath('/tasks'), icon: 'i-heroicons-clipboard-document-list' },
    { key: 'team', label: t('nav.team'), to: localePath('/team'), icon: 'i-heroicons-user-group' },
    { key: 'leaderboard', label: t('nav.leaderboard'), to: localePath('/leaderboard'), icon: 'i-heroicons-trophy' },
    { key: 'achievements', label: t('nav.achievements'), to: localePath('/achievements'), icon: 'i-heroicons-star' },
    { key: 'rewards', label: t('nav.rewards'), to: localePath('/rewards'), icon: 'i-heroicons-gift' },
    { key: 'notifications', label: t('nav.notifications'), to: localePath('/notifications'), icon: 'i-heroicons-bell' },
    { key: 'settings', label: t('nav.settings'), to: localePath('/settings'), icon: 'i-heroicons-cog-6-tooth' },
  ])
}

/** The five most important destinations for the mobile tab bar. */
export function useMobileNavItems() {
  const items = useNavItems()
  const picked = ['dashboard', 'tasks', 'leaderboard', 'rewards', 'settings']
  return computed(() => picked
    .map(key => items.value.find(item => item.key === key))
    .filter((item): item is NavItem => Boolean(item)))
}
