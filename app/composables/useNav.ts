/**
 * Sidebar / mobile navigation model in one place so both surfaces stay in sync
 * and permission changes only need to be made once.
 */
export interface NavItem {
  key: string
  label: string
  to: string
  icon: string
  /**
   * Hides the entry from users who cannot use the page.
   *
   * Purely cosmetic: every one of these pages re-checks the same permission
   * server-side, so a hand-edited URL gets a 403 rather than another
   * company's data.
   */
  permission?: Parameters<ReturnType<typeof useCan>['can']>[0]
}

export function useNavItems() {
  const { t } = useI18n()
  const localePath = useLocalePath()
  const { can } = useCan()

  const items: NavItem[] = [
    { key: 'dashboard', label: t('nav.dashboard'), to: localePath('/dashboard'), icon: 'i-heroicons-squares-2x2' },
    { key: 'profile', label: t('nav.profile'), to: localePath('/profile'), icon: 'i-heroicons-user-circle' },
    { key: 'tasks', label: t('nav.tasks'), to: localePath('/tasks'), icon: 'i-heroicons-clipboard-document-list' },
    { key: 'team', label: t('nav.team'), to: localePath('/team'), icon: 'i-heroicons-user-group' },
    // People management: an EMPLOYEE has nobody to manage, so the entry would
    // only ever show them a one-row list of themselves.
    { key: 'members', label: t('nav.members'), to: localePath('/members'), icon: 'i-heroicons-users', permission: 'member:read' },
    { key: 'invitations', label: t('nav.invitations'), to: localePath('/invitations'), icon: 'i-heroicons-envelope', permission: 'member:invite' },
    { key: 'leaderboard', label: t('nav.leaderboard'), to: localePath('/leaderboard'), icon: 'i-heroicons-trophy' },
    { key: 'recognition', label: t('nav.recognition'), to: localePath('/recognition'), icon: 'i-heroicons-hand-thumb-up' },
    { key: 'achievements', label: t('nav.achievements'), to: localePath('/achievements'), icon: 'i-heroicons-star' },
    { key: 'wallet', label: t('wallet.title'), to: localePath('/wallet'), icon: 'i-heroicons-wallet' },
    { key: 'rewards', label: t('nav.rewards'), to: localePath('/rewards'), icon: 'i-heroicons-gift' },
    { key: 'notifications', label: t('nav.notifications'), to: localePath('/notifications'), icon: 'i-heroicons-bell' },
    { key: 'settings', label: t('nav.settings'), to: localePath('/settings'), icon: 'i-heroicons-cog-6-tooth' },
  ]

  return computed<NavItem[]>(() => items.filter(item => !item.permission || can(item.permission)))
}

/** The five most important destinations for the mobile tab bar. */
export function useMobileNavItems() {
  const items = useNavItems()
  const picked = ['dashboard', 'tasks', 'leaderboard', 'rewards', 'settings']
  return computed(() => picked
    .map(key => items.value.find(item => item.key === key))
    .filter((item): item is NavItem => Boolean(item)))
}
