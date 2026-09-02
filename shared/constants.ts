/**
 * Values shared by the server and the seed so a freshly registered company and
 * the demo tenant start from exactly the same gamification baseline.
 */

export interface DefaultLevel {
  level: number
  minXp: number
  title: string
  iconKey: string
}

/**
 * The level ladder every new company is created with. Owners can rename or
 * extend it later; the app only requires that `minXp` is ascending and starts
 * at 0 so that a brand-new employee resolves to level 1.
 */
export const DEFAULT_LEVELS: DefaultLevel[] = [
  { level: 1, minXp: 0, title: 'جوانه', iconKey: 'i-heroicons-sparkles' },
  { level: 2, minXp: 500, title: 'کاوشگر', iconKey: 'i-heroicons-bolt' },
  { level: 3, minXp: 1500, title: 'سازنده', iconKey: 'i-heroicons-wrench-screwdriver' },
  { level: 4, minXp: 3000, title: 'راهبر', iconKey: 'i-heroicons-rocket-launch' },
  { level: 5, minXp: 5000, title: 'استاد', iconKey: 'i-heroicons-academic-cap' },
  { level: 6, minXp: 8000, title: 'پیشرو', iconKey: 'i-heroicons-star' },
]

/** Timezones offered during onboarding. Asia/Tehran is the default tenant zone. */
export const SUPPORTED_TIMEZONES = ['Asia/Tehran', 'Asia/Dubai', 'Europe/Berlin', 'UTC'] as const
export type SupportedTimezone = (typeof SUPPORTED_TIMEZONES)[number]

/** Locales offered during onboarding. Persian is the product's primary locale. */
export const SUPPORTED_LOCALES = ['fa', 'en'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]
