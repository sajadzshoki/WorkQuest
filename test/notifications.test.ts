import type { Prisma } from '#prisma/client'
import type { NotificationClient, NotificationDelivery } from '../server/utils/notifications'

import { afterEach, describe, expect, it } from 'vitest'

import {
  NOTIFICATION_TYPES,
  NOTIFICATION_TYPE_META,
  isNotificationType,
  levelUpDedupeKey,
} from '#shared/utils/notifications'
import {
  activeNotificationChannels,
  clearNotificationChannels,
  notify,
  notifyMany,
  notifyRoles,
  registerNotificationChannel,
} from '../server/utils/notifications'

/**
 * The notification service's rules — the same boundary every event site
 * trusts: self-suppression, at-most-once delivery, and the channel seam.
 * The database is faked structurally (the service only reads and writes
 * through `notification.*` and `user.findMany`), so these run without one,
 * exactly like the other rule suites.
 */

/** What the fake table stores — enough of a row for the service's eyes. */
interface FakeRow {
  companyId: string
  userId: string
  type: string
  title: string
  message: string | null
  metadata: Prisma.InputJsonValue
  dedupeKey: string | null
}

function fakeDb(holders: Array<{ id: string }> = []) {
  const rows: FakeRow[] = []
  const db = {
    notification: {
      findUnique: async ({ where }: { where: { companyId_userId_dedupeKey: { companyId: string, userId: string, dedupeKey: string } } }) => {
        const key = where.companyId_userId_dedupeKey
        return rows.find(row =>
          row.companyId === key.companyId
          && row.userId === key.userId
          && row.dedupeKey === key.dedupeKey,
        ) ?? null
      },
      findMany: async ({ where }: { where: { companyId: string, dedupeKey: string, userId: { in: string[] } } }) =>
        rows.filter(row =>
          row.companyId === where.companyId
          && row.dedupeKey === where.dedupeKey
          && where.userId.in.includes(row.userId),
        ),
      create: async ({ data }: { data: FakeRow }) => {
        rows.push(data)
        return { ...data, id: `row-${rows.length}` }
      },
      createMany: async ({ data }: { data: FakeRow[] }) => {
        rows.push(...data)
        return { count: data.length }
      },
    },
    user: {
      findMany: async () => holders,
    },
  }
  return { db: db as unknown as NotificationClient, rows }
}

const COMPANY = '11111111-1111-1111-1111-111111111111'
const ACTOR = '22222222-2222-2222-2222-222222222222'
const ALICE = '33333333-3333-3333-3333-333333333333'
const BOB = '44444444-4444-4444-4444-444444444444'

afterEach(() => {
  clearNotificationChannels()
})

describe('the notification catalogue', () => {
  it('gives every type an icon and a tone', () => {
    for (const type of NOTIFICATION_TYPES) {
      expect(NOTIFICATION_TYPE_META[type].icon, type).toMatch(/^i-heroicons-/)
      expect(['primary', 'success', 'warning', 'error', 'neutral'], type)
        .toContain(NOTIFICATION_TYPE_META[type].tone)
    }
  })

  it('flags exactly the fourteen product events', () => {
    const product = NOTIFICATION_TYPES.filter(type => NOTIFICATION_TYPE_META[type].product)
    expect(product).toHaveLength(14)
    expect(NOTIFICATION_TYPE_META.INVITATION.product).toBe(false)
    expect(NOTIFICATION_TYPE_META.SYSTEM.product).toBe(false)
  })

  it('narrows untrusted strings', () => {
    expect(isNotificationType('TASK_APPROVED')).toBe(true)
    expect(isNotificationType('TASK_REVIEWED')).toBe(false)
    expect(isNotificationType(42)).toBe(false)
  })
})

describe('notify', () => {
  it('writes one row with the mapped fields', async () => {
    const { db, rows } = fakeDb()

    const written = await notify(db, {
      companyId: COMPANY,
      userId: ALICE,
      type: 'TASK_APPROVED',
      title: 'تسک شما تأیید شد',
      message: 'بازطراحی صفحه ورود',
      metadata: { taskId: 't1' },
    })

    expect(written).toBe(true)
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      companyId: COMPANY,
      userId: ALICE,
      type: 'TASK_APPROVED',
      title: 'تسک شما تأیید شد',
      message: 'بازطراحی صفحه ورود',
      metadata: { taskId: 't1' },
      dedupeKey: null,
    })
  })

  it('never notifies the actor about their own action', async () => {
    const { db, rows } = fakeDb()

    const written = await notify(db, {
      companyId: COMPANY,
      userId: ACTOR,
      actorId: ACTOR,
      type: 'TASK_ASSIGNED',
      title: 'تسک جدیدی به شما محول شد',
    })

    expect(written).toBe(false)
    expect(rows).toHaveLength(0)
  })

  it('skips a duplicate dedupe key', async () => {
    const { db, rows } = fakeDb()
    const input = {
      companyId: COMPANY,
      userId: ALICE,
      type: 'CHALLENGE_COMPLETED' as const,
      title: 'چالش را کامل کردید',
      dedupeKey: 'challenge:c1:reward',
    }

    await notify(db, input)
    const second = await notify(db, input)

    expect(second).toBe(false)
    expect(rows).toHaveLength(1)
  })

  it('keeps the same key independent per user', async () => {
    const { db, rows } = fakeDb()
    const input = {
      companyId: COMPANY,
      type: 'CHALLENGE_STARTED' as const,
      title: 'چالش تازه‌ای آغاز شد',
      dedupeKey: 'challenge:c1:started',
    }

    await notify(db, { ...input, userId: ALICE })
    await notify(db, { ...input, userId: BOB })

    expect(rows.map(row => row.userId).sort()).toEqual([ALICE, BOB])
  })
})

describe('notifyMany', () => {
  it('fans out to every listed user in one write, minus the actor', async () => {
    const { db, rows } = fakeDb()

    const written = await notifyMany(db, {
      companyId: COMPANY,
      userIds: [ALICE, BOB, ACTOR],
      actorId: ACTOR,
      type: 'CHALLENGE_STARTED',
      title: 'چالش تازه‌ای آغاز شد',
      metadata: { challengeId: 'c1' },
    })

    expect(written).toBe(2)
    expect(rows.map(row => row.userId).sort()).toEqual([ALICE, BOB])
  })

  it('writes only the users a dedupe key has not reached yet', async () => {
    const { db, rows } = fakeDb()
    const key = 'challenge:c1:started'
    rows.push({
      companyId: COMPANY,
      userId: ALICE,
      type: 'CHALLENGE_STARTED',
      title: 'چالش تازه‌ای آغاز شد',
      message: null,
      metadata: {},
      dedupeKey: key,
    })

    const written = await notifyMany(db, {
      companyId: COMPANY,
      userIds: [ALICE, BOB],
      type: 'CHALLENGE_STARTED',
      title: 'چالش تازه‌ای آغاز شد',
      dedupeKey: key,
    })

    expect(written).toBe(1)
    expect(rows.filter(row => row.dedupeKey === key).map(row => row.userId)).toEqual([ALICE, BOB])
  })
})

describe('notifyRoles', () => {
  it('reaches every ACTIVE holder of the role except the actor', async () => {
    const { db, rows } = fakeDb([{ id: ACTOR }, { id: ALICE }])

    const written = await notifyRoles(db, {
      companyId: COMPANY,
      roles: ['OWNER', 'ADMIN'],
      actorId: ALICE,
      type: 'REWARD_REDEEMED',
      title: 'درخواست پاداش تازه',
    })

    expect(written).toBe(1)
    expect(rows.map(row => row.userId)).toEqual([ACTOR])
  })
})

describe('the channel seam', () => {
  it('hands a persisted notification to every configured channel', async () => {
    const deliveries: NotificationDelivery[] = []
    registerNotificationChannel({
      key: 'fake',
      isConfigured: () => true,
      async deliver(delivery) {
        deliveries.push(delivery)
      },
    })
    registerNotificationChannel({
      key: 'off',
      isConfigured: () => false,
      async deliver() {
        throw new Error('must not be called')
      },
    })

    const { db } = fakeDb()
    await notify(db, {
      companyId: COMPANY,
      userId: ALICE,
      type: 'LEVEL_UP',
      title: 'به سطح ۳ رسیدید',
      metadata: { level: 3 },
      dedupeKey: levelUpDedupeKey(ALICE, 3),
    })

    // deliver is fire-and-forget; let the microtask queue drain.
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(activeNotificationChannels().map(channel => channel.key)).toEqual(['fake'])
    expect(deliveries).toHaveLength(1)
    expect(deliveries[0]).toMatchObject({
      companyId: COMPANY,
      userId: ALICE,
      type: 'LEVEL_UP',
      title: 'به سطح ۳ رسیدید',
    })
  })

  it('keeps a failing channel from breaking the write', async () => {
    registerNotificationChannel({
      key: 'broken',
      isConfigured: () => true,
      async deliver() {
        throw new Error('provider down')
      },
    })

    const { db, rows } = fakeDb()
    const written = await notify(db, {
      companyId: COMPANY,
      userId: ALICE,
      type: 'COINS_EARNED',
      title: 'سکه به کیف پول شما اضافه شد',
    })
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(written).toBe(true)
    expect(rows).toHaveLength(1)
  })

  it('starts and stays empty until something registers', () => {
    clearNotificationChannels()
    expect(activeNotificationChannels()).toEqual([])
  })
})
