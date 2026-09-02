/**
 * Locale-aware formatting helpers.
 *
 * Persian is the primary locale, so numbers default to Persian digits and dates
 * to the Persian calendar. Every helper takes an explicit BCP-47 tag so the same
 * code works once English is switched on.
 */

const DEFAULT_LOCALE = 'fa-IR'

export function numberLocale(locale?: string | null): string {
  if (!locale) return DEFAULT_LOCALE
  return locale.startsWith('fa') ? 'fa-IR' : locale
}

/** 1,234 -> ۱٬۲۳۴ in Persian, 1,234 in English. */
export function formatNumber(value: number, locale?: string | null, digits = 0): string {
  return new Intl.NumberFormat(numberLocale(locale), {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value)
}

/** Compact form for tight UI (leaderboards): ۱٫۲هزار / 1.2K. */
export function formatCompactNumber(value: number, locale?: string | null): string {
  return new Intl.NumberFormat(numberLocale(locale), { notation: 'compact' }).format(value)
}

export function formatPercent(value: number, locale?: string | null): string {
  return new Intl.NumberFormat(numberLocale(locale), {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(value / 100)
}

/**
 * Date formatting. Persian locale implies the Persian calendar (`fa-IR-u-ca-persian`)
 * which is what Iranian users expect on dashboards.
 */
export function calendarLocale(locale?: string | null): string {
  if (!locale) return 'fa-IR-u-ca-persian'
  return locale.startsWith('fa') ? 'fa-IR-u-ca-persian' : locale
}

export function formatDate(
  value: Date | string | number,
  locale?: string | null,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' },
): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(calendarLocale(locale), options).format(date)
}

export function formatRelativeDate(value: Date | string | number, locale?: string | null): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.RelativeTimeFormat(numberLocale(locale), { numeric: 'auto' }).format(
    Math.round((date.getTime() - Date.now()) / 86_400_000),
    'day',
  )
}

/** Iranian mobile numbers, E.164. Accepts 09xxxxxxxxx and normalises to +98. */
export function normalizeIranianPhone(input: string): string | null {
  const trimmed = input.replace(/[\s\-()]/g, '')
  const match = /^(?:(\+98)|0)(9\d{9})$/.exec(trimmed)
  if (!match) return /^\+989\d{9}$/.test(trimmed) ? trimmed : null
  return `+98${match[2]}`
}

/** +989121234567 -> ۰۹۱۲ ۱۲۳ ۴۵۶۷ for display. */
export function formatPhone(phone: string, locale?: string | null): string {
  const digits = phone.replace(/\D/g, '').replace(/^98/, '0')
  const grouped = digits.replace(/^(\d{4})(\d{3})(\d{4})$/, '$1 $2 $3')
  return locale?.startsWith('en')
    ? grouped
    : grouped.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)] ?? d)
}

/**
 * Persian/Arabic → Latin transliteration used for URL slugs.
 *
 * Company slugs appear in URLs, so they must be ASCII even though the name is
 * Persian. Persian script does not write short vowels, so this is an
 * approximation, not a transcription — which is exactly why the slug field in
 * the UI is editable and only *prefilled* with this suggestion.
 */
const TRANSLITERATION: Record<string, string> = {
  آ: 'a', أ: 'a', إ: 'e', ا: 'a', ب: 'b', پ: 'p', ت: 't', ث: 's', ج: 'j', چ: 'ch',
  ح: 'h', خ: 'kh', د: 'd', ذ: 'z', ر: 'r', ز: 'z', ژ: 'zh', س: 's', ش: 'sh',
  ص: 's', ض: 'z', ط: 't', ظ: 'z', ع: 'a', غ: 'gh', ف: 'f', ق: 'gh', ک: 'k',
  ك: 'k', گ: 'g', ل: 'l', م: 'm', ن: 'n', ه: 'h', ة: 'h',
}

const ZERO_WIDTH = /[\u200B-\u200D\uFEFF]/g
const LATIN_VOWELS = 'aeiou'
/** Digraphs produced by the table above; treated as one consonant unit. */
const DIGRAPHS = ['ch', 'sh', 'gh', 'kh', 'zh']

function toLatinDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
}

/** Split a Latin word into vowel / digit / consonant(-digraph) tokens. */
function tokenize(word: string): string[] {
  const tokens: string[] = []
  let index = 0
  while (index < word.length) {
    const digraph = word.slice(index, index + 2)
    if (DIGRAPHS.includes(digraph)) {
      tokens.push(digraph)
      index += 2
      continue
    }
    tokens.push(word[index] as string)
    index += 1
  }
  return tokens
}

/**
 * Persian omits short vowels, which leaves unreadable consonant clusters
 * ("shrkt" for «شرکت»). Insert an `a` inside every run of three or more
 * consonants so the suggested slug stays pronounceable. Digits and vowels end a
 * run; anything that is not a letter or digit has already been dropped.
 */
function breakUpClusters(word: string): string {
  const tokens = tokenize(word)
  const out: string[] = []
  let run: string[] = []

  const flush = () => {
    if (run.length >= 3) {
      run.forEach((token, position) => {
        out.push(token)
        if (position < run.length - 1) out.push('a')
      })
    }
    else {
      out.push(...run)
    }
    run = []
  }

  for (const token of tokens) {
    if (/[a-z]/.test(token) && !LATIN_VOWELS.includes(token)) {
      run.push(token)
      continue
    }
    flush()
    out.push(token)
  }
  flush()

  return out.join('').replace(/([aeiou])\1+/g, '$1')
}

/**
 * Build a URL-safe slug. Persian names are transliterated, Latin names are
 * lower-cased as-is. Returns `''` when nothing usable remains.
 */
export function slugify(input: string): string {
  const cleaned = toLatinDigits(input.replace(ZERO_WIDTH, ' ')).trim()

  const words = cleaned.split(/\s+/).map((word) => {
    const letters = [...word]
    const latin: string[] = []

    letters.forEach((char, position) => {
      const next = letters[position + 1]
      const previousLatin = latin.join('')
      const previousIsConsonant = previousLatin.length > 0 && !LATIN_VOWELS.includes(previousLatin.at(-1) as string)

      // و is a consonant ("v") when it starts a word or follows a vowel, and a
      // vowel ("o") when it sits between two consonants.
      if (char === 'و') {
        const nextIsConsonantLetter = next !== undefined && next !== 'ا' && next !== 'آ' && next !== 'ی' && next !== 'و'
        latin.push(previousIsConsonant && nextIsConsonantLetter ? 'o' : 'v')
        return
      }

      // ی reads as "i" between consonants or at the end of a word, "y" otherwise.
      if (char === 'ی' || char === 'ي' || char === 'ئ') {
        const atWordEnd = next === undefined
        const nextIsConsonantLetter = next !== undefined && !['ا', 'آ', 'و', 'ی'].includes(next)
        latin.push(previousIsConsonant && (atWordEnd || nextIsConsonantLetter) ? 'i' : 'y')
        return
      }

      if (char === 'ء') return
      if (char === 'ؤ') {
        latin.push('o')
        return
      }
      latin.push(TRANSLITERATION[char] ?? char)
    })

    // Only letters and digits can reach the slug, so punctuation must be
    // stripped *before* cluster breaking — otherwise "!!!" would read as a
    // consonant run and gain inserted vowels.
    return breakUpClusters(latin.join('').toLowerCase().replace(/[^a-z0-9]+/g, ' '))
  })

  return words
    .join(' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 60)
}
