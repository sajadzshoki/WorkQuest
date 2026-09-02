import { existsSync, readFileSync } from 'node:fs'

/**
 * Integration harness.
 *
 * The suite drives a real dev server over HTTP, so the tests exercise the actual
 * Nitro handlers, the tenant client extension, the cookie handling and the
 * Prisma queries — not a mock of them.
 *
 * `scripts/run-integration.sh` starts that server (and points
 * `WORKQUEST_TEST_URL` / `WORKQUEST_TEST_LOG` at it) before Vitest runs. The
 * server is *not* spawned from inside the test process: a `npx nuxt dev` child
 * answers HTTP but its stdout does not reliably reach a Node worker here, and
 * the suite needs that output to read the codes the `console` OTP provider
 * prints.
 */

export interface ApiResult<T = unknown> {
  status: number
  body: T
  headers: Headers
}

function requiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `${name} is not set. Start the suite with \`npm run test:integration\`, which boots a server and exports it.`,
    )
  }
  return value
}

/** Minimal cookie jar — enough for a session cookie and an onboarding ticket. */
export class ApiClient {
  private readonly cookies = new Map<string, string>()

  get cookieNames(): string[] {
    return [...this.cookies.keys()]
  }

  cookie(name: string): string | undefined {
    return this.cookies.get(name)
  }

  async request<T = unknown>(
    path: string,
    init: { method?: string, body?: unknown, query?: Record<string, string> } = {},
  ): Promise<ApiResult<T>> {
    const url = new URL(path, requiredEnv('WORKQUEST_TEST_URL'))
    for (const [key, value] of Object.entries(init.query ?? {})) {
      url.searchParams.set(key, value)
    }

    const response = await fetch(url, {
      method: init.method ?? 'GET',
      headers: {
        ...(init.body ? { 'content-type': 'application/json' } : {}),
        ...(this.cookies.size > 0 ? { cookie: this.cookieHeader() } : {}),
      },
      body: init.body ? JSON.stringify(init.body) : undefined,
      redirect: 'manual',
    })

    for (const raw of response.headers.getSetCookie()) {
      const [pair] = raw.split(';')
      if (!pair) continue
      const index = pair.indexOf('=')
      const name = pair.slice(0, index).trim()
      const value = pair.slice(index + 1).trim()
      if (value === '' || value === 'deleted') this.cookies.delete(name)
      else this.cookies.set(name, value)
    }

    const text = await response.text()
    let body: T
    try {
      body = (text ? JSON.parse(text) : undefined) as T
    }
    catch {
      body = text as unknown as T
    }

    return { status: response.status, body, headers: response.headers }
  }

  private cookieHeader(): string {
    return [...this.cookies.entries()].map(([name, value]) => `${name}=${value}`).join('; ')
  }
}

// ---------------------------------------------------------------------------
// Reading the OTP codes the server printed
// ---------------------------------------------------------------------------

const CODE_LINE = /code for (\+\d+) is (\d+)/g
// Built from a char code so the source stays free of a literal control
// character (which `no-control-regex` rightly rejects).
const ANSI = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, 'g')

/** Character offset in the server log that the next code lookup starts from. */
let mark = 0

function readLog(): string {
  const file = process.env.WORKQUEST_TEST_LOG
  if (!file || !existsSync(file)) return ''
  return readFileSync(file, 'utf8').replace(ANSI, '')
}

/**
 * The most recently printed OTP for a phone, as delivered by the provider.
 *
 * Polls: the HTTP response can reach the client a moment before the log line is
 * flushed. Only the part of the log written after the last `forgetCode` is
 * searched, so a code from an earlier step is never mistaken for a new one.
 */
export async function latestCode(phone: string): Promise<string> {
  const deadline = Date.now() + 30_000
  while (Date.now() < deadline) {
    const matches = [...readLog().slice(mark).matchAll(CODE_LINE)]
      .filter(match => match[1] === phone)
    const last = matches.at(-1)
    if (last) return last[2] as string
    await sleep(100)
  }

  throw new Error(
    `No OTP code was printed for ${phone}.\n--- server log tail ---\n${readLog().slice(-1500)}`,
  )
}

/** Ignore everything printed so far, so the next read only sees a new code. */
export function forgetCode(): void {
  mark = readLog().length
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** A phone number that is not in the seed and has not been used this run. */
let sequence = 0
export function freshPhone(): string {
  sequence += 1
  const tail = String(Date.now() % 1_000_000).padStart(6, '0')
  return `+9899${tail.slice(0, 4)}${String(sequence).padStart(4, '0')}`
}

/** Fail fast with a readable message when the runner was bypassed. */
export function assertHarnessReady(): void {
  requiredEnv('WORKQUEST_TEST_URL')
}
