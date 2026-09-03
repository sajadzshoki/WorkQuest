/**
 * Level ladder maths.
 *
 * Levels are stored per company (`Level` rows) so a tenant can tune the curve,
 * but every screen needs the same "how far to the next level" arithmetic, so the
 * pure functions live here and are shared by client and server.
 */

export interface LevelBoundary {
  level: number
  minXp: number
  title?: string | null
  iconKey?: string | null
}

/**
 * XP required to *reach* a given level on the default curve.
 *
 * The curve is quadratic-ish rather than linear so that early levels arrive
 * quickly (a new employee sees progress in their first week) while later ones
 * demand sustained output. Concretely:
 *
 *   L1 → 0, L2 → 500, L3 → 1200, L4 → 2100, L5 → 3200 …
 *
 * i.e. each level costs 200 XP more than the previous one, starting at 500:
 * `minXp(n) = 500·(n-1) + 100·(n-1)·(n-2)`.
 *
 * This is the single definition of the ladder. Companies may override it with
 * explicit `Level` rows; when they do, those rows win and this is unused.
 * Changing the shape of the economy therefore means editing one function.
 */
export function defaultMinXp(level: number): number {
  const n = Math.max(1, Math.floor(level)) - 1
  return LEVEL_STEP_XP * n + LEVEL_GROWTH_XP * n * (n - 1)
}

/** XP width of the first level step. */
export const LEVEL_STEP_XP = 500
/** How much wider each subsequent level is than the last, halved (see formula). */
export const LEVEL_GROWTH_XP = 100

/**
 * Invert `defaultMinXp`: the level a raw XP total reaches on the default curve.
 * Used when a company has defined no ladder of its own.
 */
export function defaultLevelForXp(xp: number): number {
  if (xp <= 0) return 1
  let level = 1
  while (defaultMinXp(level + 1) <= xp && level < 1000) level += 1
  return level
}

/**
 * Generate the first `count` rungs of the default ladder — used to seed a new
 * company so every tenant starts with an explicit, editable ladder rather than
 * an implicit one.
 */
export function defaultLadder(count: number): LevelBoundary[] {
  return Array.from({ length: Math.max(0, count) }, (_, index) => ({
    level: index + 1,
    minXp: defaultMinXp(index + 1),
  }))
}

/**
 * Resolve the level a given XP total falls into.
 * `boundaries` must be sorted ascending by `minXp`.
 */
export function resolveLevel(xp: number, boundaries: readonly LevelBoundary[]): number {
  if (boundaries.length === 0) return defaultLevelForXp(xp)
  let current = boundaries[0]
  for (const boundary of boundaries) {
    if (xp >= boundary.minXp) current = boundary
    else break
  }
  return current?.level ?? 1
}

export interface LevelProgress {
  level: number
  /** XP inside the current level. */
  currentXp: number
  /** XP span of the current level. */
  neededXp: number
  /** 0-100, safe for a progress bar. */
  percent: number
  title: string | null
}

/** Compute progress between `boundaries`; falls back to the default curve. */
export function computeLevelProgress(
  xp: number,
  boundaries: readonly LevelBoundary[],
): LevelProgress {
  const sorted = [...boundaries].sort((a, b) => a.minXp - b.minXp)
  const level = resolveLevel(xp, sorted)

  const current = sorted.find(b => b.level === level)
  const next = sorted.find(b => b.level === level + 1)

  const floor = current?.minXp ?? defaultMinXp(level)
  const ceiling = next?.minXp ?? defaultMinXp(level + 1)
  const span = Math.max(1, ceiling - floor)
  const into = Math.max(0, xp - floor)

  return {
    level,
    currentXp: Math.min(into, span),
    neededXp: span,
    percent: Math.min(100, Math.round((into / span) * 100)),
    title: current?.title ?? null,
  }
}

/** Percentage used by streak widgets; caps at 100. */
export function streakProgressPercent(current: number, target: number): number {
  if (target <= 0) return 0
  return Math.min(100, Math.round((current / target) * 100))
}
