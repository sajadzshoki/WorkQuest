/**
 * Values shared by the server and the seed so a freshly registered company and
 * the demo tenant start from exactly the same gamification baseline.
 */

import { defaultMinXp } from './utils/xp'

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
 *
 * The thresholds come from `defaultMinXp` rather than being written out by
 * hand: the curve is defined in exactly one place, so seeded companies and the
 * no-ladder fallback can never disagree about what level 3 costs.
 * Yields 0 / 500 / 1200 / 2100 / 3200 / 4500.
 */
const LEVEL_TITLES = [
  { title: 'جوانه', iconKey: 'i-heroicons-sparkles' },
  { title: 'کاوشگر', iconKey: 'i-heroicons-bolt' },
  { title: 'سازنده', iconKey: 'i-heroicons-wrench-screwdriver' },
  { title: 'راهبر', iconKey: 'i-heroicons-rocket-launch' },
  { title: 'استاد', iconKey: 'i-heroicons-academic-cap' },
  { title: 'پیشرو', iconKey: 'i-heroicons-star' },
]

export const DEFAULT_LEVELS: DefaultLevel[] = LEVEL_TITLES.map((meta, index) => ({
  level: index + 1,
  minXp: defaultMinXp(index + 1),
  ...meta,
}))

/** Timezones offered during onboarding. Asia/Tehran is the default tenant zone. */
export const SUPPORTED_TIMEZONES = ['Asia/Tehran', 'Asia/Dubai', 'Europe/Berlin', 'UTC'] as const
export type SupportedTimezone = (typeof SUPPORTED_TIMEZONES)[number]

/** Locales offered during onboarding. Persian is the product's primary locale. */
export const SUPPORTED_LOCALES = ['fa', 'en'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]
