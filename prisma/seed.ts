/**
 * Development seed.
 *
 *   npm run db:seed
 *
 * Creates two tenants so tenant isolation can actually be exercised, plus a
 * small but realistic slice of the employee loop: tasks, reviews, XP/coin
 * ledger entries, achievements, rewards and notifications.
 *
 * The owner of the first tenant uses NUXT_BOOTSTRAP_ADMIN_PHONE when set, so
 * `console` OTP login works straight after seeding (the code is printed in the
 * dev server log).
 */
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

import { DEFAULT_LEVELS } from '../shared/constants'
import { cycleWindow } from '../shared/utils/recognition'

import { PrismaClient } from './generated/prisma/client.ts'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  console.error('DATABASE_URL is not set — copy .env.example to .env first.')
  process.exit(1)
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) })

/** The default ladder every tenant starts with (shared with onboarding). */
const LEVELS = DEFAULT_LEVELS

const ACHIEVEMENTS = [
  {
    key: 'first_approved_task',
    title: 'نخستین گام',
    description: 'اولین تسک شما با موفقیت تأیید شد',
    type: 'MILESTONE',
    xpReward: 50,
    coinReward: 20,
    iconKey: 'i-heroicons-flag',
    criteria: { metric: 'tasks_approved', threshold: 1 },
  },
  {
    key: 'streak_7',
    title: 'هفت روز پیاپی',
    description: 'یک هفته کامل فعالیت بی‌وقفه',
    type: 'STREAK',
    xpReward: 150,
    coinReward: 60,
    iconKey: 'i-heroicons-fire',
    criteria: { metric: 'streak_days', threshold: 7 },
  },
  {
    key: 'ten_approved_tasks',
    title: 'ده تسک درخشان',
    description: 'ده تسک شما با امتیاز بالا تأیید شده است',
    type: 'MILESTONE',
    xpReward: 300,
    coinReward: 120,
    iconKey: 'i-heroicons-trophy',
    criteria: { metric: 'tasks_approved', threshold: 10 },
  },
  {
    key: 'team_player',
    title: 'هم‌تیمی واقعی',
    description: 'پنج تقدیر از هم‌تیمی‌ها دریافت کرده‌اید',
    type: 'TEAM',
    xpReward: 200,
    coinReward: 80,
    iconKey: 'i-heroicons-user-group',
    criteria: { metric: 'recognitions_received', threshold: 5 },
  },
  {
    key: 'reviewer_fast',
    title: 'بازبین چابک',
    description: 'ده بازبینی در کمتر از یک روز',
    type: 'SKILL',
    xpReward: 250,
    coinReward: 100,
    iconKey: 'i-heroicons-bolt',
    criteria: { metric: 'fast_reviews', threshold: 10 },
  },
]

/**
 * The seeded shelf.
 *
 * Every price here is a *company* choice written into the database, not a
 * constant in the product: nothing in `server/` or `shared/` knows that a day of
 * leave costs 1500 coins, and an admin can reprice any of these from the
 * marketplace screen. The rules vary on purpose so the demo tenant exercises
 * automatic approval, per-person caps, level gates, required notes, limited
 * stock and a closing date — one of each, rather than four identical rows.
 */
interface SeededReward {
  title: string
  description: string
  type: string
  coinCost: number
  stock: number | null
  imageUrl: string | null
  rules: {
    autoApprove: boolean
    maxPerUser: number | null
    minLevel: number | null
    requiresNote: boolean
    availableFrom?: Date | null
    availableUntil?: Date | null
  }
}

const REWARDS: SeededReward[] = [
  {
    title: 'یک روز مرخصی تشویقی',
    description: 'یک روز مرخصی با حقوق، هر روزی که با مدیرتان هماهنگ کنید',
    type: 'TIME_OFF',
    coinCost: 1500,
    stock: null,
    imageUrl: null,
    // Somebody has to agree the day, so it is not automatic — and the note says
    // which day. Two a year is the company's own limit.
    rules: { autoApprove: false, maxPerUser: 2, minLevel: 2, requiresNote: true },
  },
  {
    title: 'کارت هدیه خرید کتاب',
    description: 'کارت هدیهٔ ۵۰۰ هزار تومانی کتاب، کدش همان لحظه صادر می‌شود',
    type: 'VOUCHER',
    coinCost: 800,
    stock: 30,
    imageUrl: null,
    // A digital code: the company already decided to give it, so it approves
    // itself and never waits in a queue.
    rules: { autoApprove: true, maxPerUser: 3, minLevel: null, requiresNote: false },
  },
  {
    title: 'هدفون بی‌سیم',
    description: 'هدفون بی‌سیم برای تمرکز بیشتر؛ تحویل در دفتر',
    type: 'PHYSICAL',
    coinCost: 4500,
    stock: 3,
    imageUrl: null,
    // Three on the shelf, one per person, and only for people who have been
    // around long enough to reach level 5.
    rules: { autoApprove: false, maxPerUser: 1, minLevel: 5, requiresNote: false },
  },
  {
    title: 'کمک به خیریه به نام شما',
    description: 'اهدا به خیریهٔ همکار، به نام شما',
    type: 'DONATION',
    coinCost: 500,
    stock: null,
    imageUrl: null,
    // Unlimited stock and no cap; the note says which cause to support.
    rules: { autoApprove: false, maxPerUser: null, minLevel: null, requiresNote: true },
  },
  {
    title: 'قهوهٔ ویژهٔ کافهٔ دفتر',
    description: 'یک فنجان قهوه از کافهٔ طبقهٔ همکف، همین امروز',
    type: 'MEAL',
    coinCost: 120,
    stock: null,
    imageUrl: null,
    // Cheap, digital-ish and unlimited: the smallest reward in the shop, so a
    // newcomer can afford something in their first week.
    rules: { autoApprove: true, maxPerUser: null, minLevel: null, requiresNote: false },
  },
  {
    title: 'ناهار با تیم',
    description: 'ناهار تیمی در رستوران همکار، با هماهنگی دفتر',
    type: 'MEAL',
    coinCost: 300,
    stock: 20,
    imageUrl: null,
    rules: { autoApprove: true, maxPerUser: 4, minLevel: null, requiresNote: false },
  },
  {
    title: 'بلیت سینما',
    description: 'دو بلیت سینما برای آخر هفته',
    type: 'TICKET',
    coinCost: 450,
    stock: 15,
    imageUrl: null,
    rules: { autoApprove: false, maxPerUser: 2, minLevel: null, requiresNote: false },
  },
  {
    title: 'بلیت رویداد فصل',
    description: 'بلیت رویداد تخصصی فصل، ظرفیت محدود',
    type: 'TICKET',
    coinCost: 1200,
    // Six seats and a closing date 45 days out, computed from the moment the
    // seed runs so the demo never goes stale.
    stock: 6,
    imageUrl: null,
    rules: {
      autoApprove: false,
      maxPerUser: 1,
      minLevel: 3,
      requiresNote: false,
      availableUntil: new Date(Date.now() + 45 * 86_400_000),
    },
  },
  {
    title: 'ماگ شرکتی',
    description: 'ماگ سرامیکی با نشان تیم، از فروشگاه شرکت',
    type: 'PHYSICAL',
    coinCost: 250,
    stock: 40,
    imageUrl: null,
    rules: { autoApprove: false, maxPerUser: null, minLevel: null, requiresNote: false },
  },
  {
    title: 'پاداش نقدی پایان فصل',
    description: 'پاداش نقدی به مناسبت پایان فصل، با تأیید مدیرعامل',
    type: 'BONUS',
    coinCost: 3000,
    stock: null,
    imageUrl: null,
    // The biggest prize on the shelf: level-gated and once per person, and an
    // owner has to approve it by hand.
    rules: { autoApprove: false, maxPerUser: 1, minLevel: 4, requiresNote: false },
  },
]

/**
 * 23:59:59 of the given instant's calendar day in `timeZone`, as a UTC Date.
 * The offset is read back out of `Intl` so the result is correct across DST.
 */
function endOfDay(date: Date, timeZone: string): Date {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date)

  const get = (type: string) => Number(parts.find(part => part.type === type)?.value ?? '0')
  const wallClock = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour') % 24, get('minute'), get('second'))
  const offsetMs = wallClock - Math.floor(date.getTime() / 1000) * 1000

  return new Date(Date.UTC(get('year'), get('month') - 1, get('day')) - offsetMs + 86_400_000 - 1000)
}

async function main() {
  console.log('› clearing existing data')
  await prisma.otpCode.deleteMany()
  await prisma.company.deleteMany()

  const adminPhone = process.env.NUXT_BOOTSTRAP_ADMIN_PHONE?.trim() || '+989120000001'

  // --- Tenant A -------------------------------------------------------------
  const company = await prisma.company.create({
    data: {
      name: 'نواندیشان پایا',
      slug: 'navandishan',
      industry: 'فناوری اطلاعات',
      locale: 'fa',
      timezone: 'Asia/Tehran',
    },
  })

  for (const level of LEVELS) {
    await prisma.level.create({ data: { companyId: company.id, ...level } })
  }

  // Every company starts with an explicit, editable v1 economy rather than
  // relying on the code defaults.
  await prisma.rewardRule.create({
    data: { companyId: company.id, version: 1, isActive: true },
  })

  const achievements = []
  for (const achievement of ACHIEVEMENTS) {
    achievements.push(await prisma.achievement.create({ data: { companyId: company.id, ...achievement } }))
  }

  const people = [
    { fullName: 'ساینا رستمی', phone: adminPhone, role: 'OWNER', jobTitle: 'هم‌بنیان‌گذار' },
    { fullName: 'بهنام کاویانی', phone: '+989120000002', role: 'ADMIN', jobTitle: 'مدیر منابع انسانی' },
    { fullName: 'مریم نوروزی', phone: '+989120000003', role: 'MANAGER', jobTitle: 'مدیر محصول' },
    { fullName: 'امیر شریفی', phone: '+989120000004', role: 'MANAGER', jobTitle: 'مدیر مهندسی' },
    { fullName: 'نگار احمدی', phone: '+989120000005', role: 'EMPLOYEE', jobTitle: 'طراح محصول' },
    { fullName: 'پویا محمدی', phone: '+989120000006', role: 'EMPLOYEE', jobTitle: 'توسعه‌دهنده ارشد' },
    { fullName: 'الناز کریمی', phone: '+989120000007', role: 'EMPLOYEE', jobTitle: 'تحلیل‌گر داده' },
    { fullName: 'سینا فرهادی', phone: '+989120000008', role: 'EMPLOYEE', jobTitle: 'توسعه‌دهنده' },
    { fullName: 'ترانه موسوی', phone: '+989120000009', role: 'EMPLOYEE', jobTitle: 'پژوهشگر تجربه کاربری' },
  ] as const

  const users: Record<string, { id: string, fullName: string }> = {}
  for (const person of people) {
    const user = await prisma.user.create({
      data: {
        companyId: company.id,
        fullName: person.fullName,
        phone: person.phone,
        email: `${person.phone.slice(-10)}@navandishan.local`,
        role: person.role,
        jobTitle: person.jobTitle,
      },
    })
    users[person.fullName] = { id: user.id, fullName: user.fullName }
  }

  const teams = [
    { name: 'محصول', slug: 'product', lead: users['مریم نوروزی']!.id, members: ['نگار احمدی', 'ترانه موسوی'] },
    { name: 'مهندسی', slug: 'engineering', lead: users['امیر شریفی']!.id, members: ['پویا محمدی', 'سینا فرهادی', 'الناز کریمی'] },
  ]

  const teamIds = new Map<string, string>()
  for (const team of teams) {
    const created = await prisma.team.create({
      data: {
        companyId: company.id,
        name: team.name,
        slug: team.slug,
        leadId: team.lead,
        description: `تیم ${team.name} شرکت نواندیشان پایا`,
      },
    })
    teamIds.set(team.slug, created.id)

    await prisma.teamMember.create({
      data: { companyId: company.id, teamId: created.id, userId: team.lead, role: 'LEAD', managerId: users['ساینا رستمی']!.id },
    })

    for (const memberName of team.members) {
      await prisma.teamMember.create({
        data: { companyId: company.id, teamId: created.id, userId: users[memberName]!.id, role: 'MEMBER', managerId: team.lead },
      })
    }
  }

  /**
   * Task fixtures covering every point of the lifecycle, so the dashboards,
   * the review queue and the overdue surfaces all have something real to show
   * on a fresh database.
   */
  const tasks = [
    { title: 'بازطراحی صفحه ورود', assignee: 'نگار احمدی', team: 'product', status: 'IN_PROGRESS', priority: 'HIGH', xp: 120, coins: 60, dueInDays: 3, hours: 12, progress: 45, reviewer: 'مریم نوروزی' },
    { title: 'پیاده‌سازی سرویس اعلان‌ها', assignee: 'پویا محمدی', team: 'engineering', status: 'SUBMITTED', priority: 'HIGH', xp: 220, coins: 110, dueInDays: 1, hours: 24, progress: 100, reviewer: 'امیر شریفی' },
    { title: 'تحلیل داده‌های ریزش کاربر', assignee: 'الناز کریمی', team: 'engineering', status: 'APPROVED', priority: 'MEDIUM', xp: 180, coins: 90, dueInDays: -2, hours: 16, progress: 100, reviewer: 'امیر شریفی', score: 92 },
    { title: 'پروتوتایپ داشبورد مدیران', assignee: 'ترانه موسوی', team: 'product', status: 'APPROVED', priority: 'HIGH', xp: 160, coins: 80, dueInDays: -5, hours: 20, progress: 100, reviewer: 'مریم نوروزی', score: 88 },
    { title: 'بهینه‌سازی کوئری‌های گزارش‌گیری', assignee: 'سینا فرهادی', team: 'engineering', status: 'TODO', priority: 'LOW', xp: 90, coins: 45, dueInDays: 7, hours: 8, progress: 0, reviewer: 'امیر شریفی' },
    { title: 'مستندسازی راهنمای طراحی', assignee: 'نگار احمدی', team: 'product', status: 'NEEDS_REVISION', priority: 'MEDIUM', xp: 100, coins: 50, dueInDays: 2, hours: 6, progress: 70, reviewer: 'مریم نوروزی', revisions: 1 },
    // Deliberately late and unfinished — the manager dashboard needs an overdue row.
    { title: 'مهاجرت پایگاه داده به نسخه ۱۷', assignee: 'سینا فرهادی', team: 'engineering', status: 'IN_PROGRESS', priority: 'HIGH', xp: 260, coins: 130, dueInDays: -3, hours: 32, progress: 60, reviewer: 'امیر شریفی' },
    // Due today, so «تسک‌های امروز» is never empty on a fresh seed.
    { title: 'آماده‌سازی جلسهٔ بازبینی سبد محصول', assignee: 'ترانه موسوی', team: 'product', status: 'TODO', priority: 'MEDIUM', xp: 70, coins: 35, dueInDays: 0, hours: 3, progress: 0, reviewer: 'مریم نوروزی' },
    { title: 'بررسی بازخوردهای پشتیبانی', assignee: 'پویا محمدی', team: 'engineering', status: 'SUBMITTED', priority: 'MEDIUM', xp: 110, coins: 55, dueInDays: 4, hours: 5, progress: 100, reviewer: 'امیر شریفی' },
  ] as const

  // Badges are the visual face of achievements, so each is linked to the
  // achievement that awards it — `runGamification` hands a badge out the moment
  // its achievement unlocks. `achievementIndex` maps onto `ACHIEVEMENTS` order.
  const badges = [
    { name: 'نشان شروع', description: 'برای اولین تسک تأیید شده', achievementIndex: 0, iconKey: 'i-heroicons-flag', tone: 'primary' },
    { name: 'نشان پایداری', description: 'برای هفت روز فعالیت پیاپی', achievementIndex: 1, iconKey: 'i-heroicons-fire', tone: 'streak' },
  ]
  const createdBadges = []
  for (const badge of badges) {
    const { achievementIndex, ...data } = badge
    createdBadges.push(await prisma.badge.create({
      data: { companyId: company.id, ...data, achievementId: achievements[achievementIndex]!.id },
    }))
  }

  for (const task of tasks) {
    const assignee = users[task.assignee]!
    const reviewer = users[task.reviewer]!
    // End of the target day, in the company's timezone: a deadline is "by the
    // end of Tuesday", not "by the exact second this seed ran". Without this a
    // task due today would already read as overdue.
    const dueDate = endOfDay(new Date(Date.now() + task.dueInDays * 86_400_000), company.timezone)
    const assignedAt = new Date(Date.now() - 5 * 86_400_000)
    const started = task.status !== 'TODO'
    const submitted = ['SUBMITTED', 'APPROVED'].includes(task.status)

    const created = await prisma.task.create({
      data: {
        companyId: company.id,
        title: task.title,
        description: `شرح تسک «${task.title}» — خروجی مورد انتظار و معیار پذیرش در این بخش ثبت می‌شود.`,
        status: task.status,
        priority: task.priority,
        assigneeId: assignee.id,
        assignerId: reviewer.id,
        teamId: (await prisma.team.findFirst({ where: { companyId: company.id, slug: task.team } }))?.id,
        xpReward: task.xp,
        coinReward: task.coins,
        estimatedHours: task.hours,
        progress: task.progress,
        revisionCount: 'revisions' in task ? task.revisions : 0,
        dueDate,
        assignedAt,
        startedAt: started ? new Date(Date.now() - 4 * 86_400_000) : null,
        submittedAt: submitted || task.status === 'NEEDS_REVISION' ? new Date(Date.now() - 86_400_000) : null,
        completedAt: task.status === 'APPROVED' ? new Date(Date.now() - 86_400_000) : null,
      },
    })

    // Lifecycle trail, so the task page has a truthful history from the start.
    await prisma.taskEvent.create({
      data: { companyId: company.id, taskId: created.id, actorId: reviewer.id, action: 'task.created', toStatus: 'TODO' },
    })
    if (started) {
      await prisma.taskEvent.create({
        data: { companyId: company.id, taskId: created.id, actorId: assignee.id, action: 'task.start', fromStatus: 'TODO', toStatus: 'IN_PROGRESS' },
      })
    }

    if (task.status === 'NEEDS_REVISION') {
      await prisma.taskReview.create({
        data: {
          companyId: company.id,
          taskId: created.id,
          reviewerId: reviewer.id,
          decision: 'CHANGES_REQUESTED',
          score: null,
          feedback: 'ساختار کلی خوب است، اما بخش نمونه‌کدها و معیارهای دسترس‌پذیری باید کامل شود.',
        },
      })
      await prisma.taskEvent.create({
        data: { companyId: company.id, taskId: created.id, actorId: reviewer.id, action: 'task.request_revision', fromStatus: 'SUBMITTED', toStatus: 'NEEDS_REVISION' },
      })
    }

    if ('score' in task && task.status === 'APPROVED') {
      await prisma.taskReview.create({
        data: {
          companyId: company.id,
          taskId: created.id,
          reviewerId: reviewer.id,
          decision: 'APPROVED',
          score: task.score,
          feedback: 'کیفیت خروجی عالی بود؛ مستندسازی هم کامل است.',
          xpAwarded: task.xp,
          coinsAwarded: task.coins,
        },
      })
      await prisma.taskEvent.create({
        data: { companyId: company.id, taskId: created.id, actorId: reviewer.id, action: 'task.approve', fromStatus: 'SUBMITTED', toStatus: 'APPROVED' },
      })

      await prisma.xpTransaction.create({
        data: { companyId: company.id, userId: assignee.id, amount: task.xp, source: 'TASK_REVIEW', reason: task.title, referenceType: 'Task', referenceId: created.id },
      })
      await prisma.coinTransaction.create({
        data: { companyId: company.id, userId: assignee.id, amount: task.coins, source: 'TASK_REVIEW', reason: task.title, referenceType: 'Task', referenceId: created.id },
      })
    }

    // A little conversation on the in-flight work.
    if (task.status === 'IN_PROGRESS' || task.status === 'NEEDS_REVISION') {
      await prisma.taskComment.create({
        data: { companyId: company.id, taskId: created.id, authorId: assignee.id, body: 'شروع کردم؛ اگر نکتهٔ خاصی مدنظرتان است بفرمایید.' },
      })
      await prisma.taskComment.create({
        data: { companyId: company.id, taskId: created.id, authorId: reviewer.id, body: 'ممنون. لطفاً معیارهای پذیرش را هم در توضیحات لحاظ کنید.' },
      })
    }
  }

  // Progress + ledger for the people with approved work, plus a couple of
  // achievements/badges so the gamification UI has something to render.
  //
  // The XP ledger is spread over recent weeks instead of landing in one row
  // stamped "now": the leaderboards rank a *period*, so a flat seed would show
  // an identical weekly and monthly board and an empty personal-progress
  // history. Shares are rounded with the remainder on the oldest slice, so the
  // ledger still sums exactly to `UserProgress.xp` — the invariant the reward
  // engine and the integration suite both assert.
  const XP_HISTORY = [
    { daysAgo: 0, share: 0.18 },
    { daysAgo: 2, share: 0.22 },
    { daysAgo: 9, share: 0.25 },
    { daysAgo: 23, share: 0.35 },
  ]

  /** When each seeded achievement was unlocked, oldest index last. */
  const ACHIEVEMENT_HISTORY_DAYS = [1, 11, 26]

  const progressSeed = [
    { name: 'الناز کریمی', xp: 1840, coins: 920, streak: 7, longest: 12, achievements: [0, 1], badges: [0, 1] },
    { name: 'ترانه موسوی', xp: 1220, coins: 640, streak: 3, longest: 9, achievements: [0], badges: [0] },
    { name: 'پویا محمدی', xp: 860, coins: 410, streak: 2, longest: 5, achievements: [0], badges: [0] },
    { name: 'نگار احمدی', xp: 540, coins: 260, streak: 1, longest: 4, achievements: [0], badges: [0] },
    { name: 'سینا فرهادی', xp: 210, coins: 90, streak: 0, longest: 2, achievements: [], badges: [] },
  ]

  const levelRows = await prisma.level.findMany({ where: { companyId: company.id }, orderBy: { level: 'asc' } })

  for (const row of progressSeed) {
    const user = users[row.name]!
    const level = [...levelRows].reverse().find(candidate => row.xp >= candidate.minXp) ?? levelRows[0]

    await prisma.userProgress.create({
      data: {
        companyId: company.id,
        userId: user.id,
        xp: row.xp,
        coins: row.coins,
        currentStreak: row.streak,
        longestStreak: row.longest,
        levelId: level?.id ?? null,
        lastActiveDate: new Date(),
      },
    })

    let unallocatedXp = row.xp
    for (const [index, slice] of XP_HISTORY.entries()) {
      const isLast = index === XP_HISTORY.length - 1
      const amount = isLast ? unallocatedXp : Math.round(row.xp * slice.share)
      unallocatedXp -= amount

      await prisma.xpTransaction.create({
        data: {
          companyId: company.id,
          userId: user.id,
          amount,
          source: 'TASK_REVIEW',
          reason: 'مجموع تسک‌های تأیید شده',
          createdAt: new Date(Date.now() - slice.daysAgo * 86_400_000),
          idempotencyKey: `seed:xp:${user.id}:${index}`,
        },
      })
    }

    // Wallet first, then the ledger row that explains its balance — the same
    // order the runtime uses, so seeded data is indistinguishable from earned.
    const wallet = await prisma.wallet.create({
      data: {
        companyId: company.id,
        userId: user.id,
        balance: row.coins,
        lifetimeEarned: row.coins,
      },
    })

    await prisma.coinTransaction.create({
      data: {
        companyId: company.id,
        userId: user.id,
        walletId: wallet.id,
        amount: row.coins,
        type: 'TASK_REWARD',
        source: 'TASK_REVIEW',
        reason: 'مجموع پاداش تسک‌ها',
        balanceAfter: row.coins,
        idempotencyKey: `seed:coins:${user.id}`,
      },
    })

    for (const [position, index] of row.achievements.entries()) {
      const achievement = achievements[index]
      if (!achievement) continue
      const daysAgo = ACHIEVEMENT_HISTORY_DAYS[position] ?? 30
      await prisma.userAchievement.create({
        data: {
          companyId: company.id,
          userId: user.id,
          achievementId: achievement.id,
          unlockedAt: new Date(Date.now() - daysAgo * 86_400_000),
        },
      })
    }
    for (const index of row.badges) {
      const badge = createdBadges[index]
      if (!badge) continue
      await prisma.userBadge.create({ data: { companyId: company.id, userId: user.id, badgeId: badge.id } })
    }
  }

  for (const reward of REWARDS) {
    const { rules, ...item } = reward
    await prisma.reward.create({
      data: {
        companyId: company.id,
        ...item,
        status: 'ACTIVE',
        autoApprove: rules.autoApprove,
        maxPerUser: rules.maxPerUser,
        minLevel: rules.minLevel,
        requiresNote: rules.requiresNote,
        availableFrom: rules.availableFrom ?? null,
        availableUntil: rules.availableUntil ?? null,
      },
    })
  }

  // --- Challenges ------------------------------------------------------------
  //
  // Seeded as DRAFT rows whose window is mostly already open: the challenge
  // engine activates them on the first surface anybody loads, enrols today's
  // members, and computes progress from the seeded tasks above. No number is
  // faked here — there is no `progress` and no participant row in this seed,
  // because both belong to the engine, not to fixtures.

  const challengeBadge = await prisma.badge.create({
    data: {
      companyId: company.id,
      name: 'نشان چالش‌باز',
      description: 'برای کامل کردن چالش شرکت',
      iconKey: 'i-heroicons-flag',
      tone: 'warning',
    },
  })

  const CHALLENGES = [
    {
      title: 'ده تسک بی‌نقص',
      description: 'تا پایان مهلت، ۱۰ تسک تأییدشده داشته باشید.',
      type: 'INDIVIDUAL',
      teamSlug: null,
      goalKey: 'tasks_completed',
      goalValue: 10,
      xpReward: 300,
      coinReward: 150,
      startsInDays: -7,
      endsInDays: 7,
    },
    {
      title: 'وقت‌شناس طلایی',
      description: '۹۰ درصد تسک‌های این دوره را موعد خودش تحویل دهید.',
      type: 'INDIVIDUAL',
      teamSlug: null,
      goalKey: 'on_time_rate',
      goalValue: 90,
      xpReward: 250,
      coinReward: 120,
      startsInDays: -7,
      endsInDays: 14,
    },
    {
      title: 'میل‌استون محصول',
      description: 'تیم محصول تا پایان مهلت همهٔ کارهای این دوره را کامل می‌کند.',
      type: 'TEAM',
      teamSlug: 'product',
      goalKey: 'team_completion_rate',
      goalValue: 100,
      xpReward: 200,
      coinReward: 100,
      startsInDays: -7,
      endsInDays: 10,
    },
    {
      title: 'هجوم مهندسی',
      description: 'تیم مهندسی تا پایان مهلت ۶ تسک تأییدشده تحویل می‌دهد.',
      type: 'TEAM',
      teamSlug: 'engineering',
      goalKey: 'tasks_completed',
      goalValue: 6,
      xpReward: 180,
      coinReward: 90,
      startsInDays: -3,
      endsInDays: 12,
    },
    {
      // A scheduled one, to show the "starting soon" state honestly.
      title: 'بیست‌تایی فصل آینده',
      description: 'چالش فصل آینده: ۲۰ تسک تأییدشده برای هر نفر.',
      type: 'INDIVIDUAL',
      teamSlug: null,
      goalKey: 'tasks_completed',
      goalValue: 20,
      xpReward: 500,
      coinReward: 250,
      startsInDays: 5,
      endsInDays: 35,
    },
  ]

  for (const challenge of CHALLENGES) {
    await prisma.challenge.create({
      data: {
        companyId: company.id,
        title: challenge.title,
        description: challenge.description,
        type: challenge.type,
        teamId: challenge.teamSlug ? teamIds.get(challenge.teamSlug)! : null,
        goalKey: challenge.goalKey,
        goalValue: challenge.goalValue,
        xpReward: challenge.xpReward,
        coinReward: challenge.coinReward,
        badgeId: challengeBadge.id,
        startsAt: new Date(Date.now() + challenge.startsInDays * 86_400_000),
        endsAt: new Date(Date.now() + challenge.endsInDays * 86_400_000),
        status: 'DRAFT',
      },
    })
  }

  await prisma.recognition.create({
    data: {
      companyId: company.id,
      fromUserId: users['مریم نوروزی']!.id,
      toUserId: users['نگار احمدی']!.id,
      type: 'MANAGER',
      message: 'طراحی صفحه ورود فوق‌العاده تمیز و کاربرپسند بود. ممنون از دقتت!',
      xpAwarded: 40,
    },
  })

  const notifications = [
    { userId: users['نگار احمدی']!.id, type: 'TASK_ASSIGNED', title: 'تسک جدید به شما محول شد', body: 'بازطراحی صفحه ورود — سررسید ۳ روز دیگر' },
    { userId: users['الناز کریمی']!.id, type: 'ACHIEVEMENT_UNLOCKED', title: 'دستاورد تازه باز شد', body: '«هفت روز پیاپی» را کسب کردید' },
    { userId: users['پویا محمدی']!.id, type: 'TASK_REVIEWED', title: 'بازبینی تسک شما انجام شد', body: 'تسک «پیاده‌سازی سرویس اعلان‌ها» در انتظار بررسی نهایی است' },
    { userId: users['الناز کریمی']!.id, type: 'LEVEL_UP', title: 'به سطح ۳ رسیدید', body: 'سطح تازه: سازنده' },
  ] as const

  for (const notification of notifications) {
    await prisma.notification.create({ data: { companyId: company.id, ...notification } })
  }

  // --- Recognition: categories, titles, cadence and one sealed cycle ---------
  const RECOGNITION_TITLES = [
    { name: 'افسانه مسئولیت‌پذیری', description: 'کسی که همیشه می‌توان روی حرفش حساب کرد' },
    { name: 'قهرمان وقت‌شناسی', description: 'همیشه سر وقت، همیشه قابل اتکا' },
    { name: 'هم‌تیمی طلایی', description: 'کسی که تیم را جلو می‌برد' },
    { name: 'خلاق ماه', description: 'ایده‌های تازه و غیرمنتظره' },
    { name: 'طنزپرداز دفتر', description: 'حال‌خوب‌کن تیم' },
    { name: 'مهربان‌ترین', description: 'همیشه کنار هم‌تیمی‌ها' },
    { name: 'پر انرژی‌ترین', description: 'موتور محرک تیم' },
    { name: 'مغز هفته', description: 'هر بن‌بستی را باز می‌کند' },
    { name: 'ستاره در حال ظهور', description: 'رشد چشمگیر نسبت به قبل' },
  ]

  const recognitionTitles = new Map<string, string>()
  for (const title of RECOGNITION_TITLES) {
    const created = await prisma.recognitionTitle.create({
      data: { companyId: company.id, name: title.name, description: title.description, isSystem: true },
    })
    recognitionTitles.set(title.name, created.id)
  }

  const appreciationBadge = await prisma.badge.create({
    data: {
      companyId: company.id,
      name: 'نشان قدردانی همکاران',
      description: 'برای برنده شدن در قدردانی همکاران',
      iconKey: 'i-heroicons-hand-thumb-up',
      tone: 'coin',
    },
  })

  const RECOGNITION_CATEGORIES = [
    { name: 'مسئول‌ترین همکار', description: 'کسی که همیشه می‌توان روی حرفش حساب کرد', iconKey: 'i-heroicons-shield-check', tone: 'primary', xpReward: 120, coinReward: 60, title: 'افسانه مسئولیت‌پذیری', badge: true },
    { name: 'وقت‌شناس‌ترین', description: 'همیشه سر وقت، همیشه قابل اتکا', iconKey: 'i-heroicons-clock', tone: 'info', xpReward: 80, coinReward: 40, title: 'قهرمان وقت‌شناسی', badge: false },
    { name: 'بهترین هم‌تیمی', description: 'کسی که تیم را جلو می‌برد', iconKey: 'i-heroicons-user-group', tone: 'success', xpReward: 100, coinReward: 50, title: 'هم‌تیمی طلایی', badge: false },
    { name: 'خلاق‌ترین', description: 'ایده‌های تازه و غیرمنتظره', iconKey: 'i-heroicons-light-bulb', tone: 'warning', xpReward: 100, coinReward: 50, title: 'خلاق ماه', badge: false },
    { name: 'طنزپرداز دفتر', description: 'حال‌خوب‌کن تیم', iconKey: 'i-heroicons-face-smile', tone: 'coin', xpReward: 60, coinReward: 30, title: 'طنزپرداز دفتر', badge: false },
    { name: 'مهربان‌ترین', description: 'همیشه کنار هم‌تیمی‌ها', iconKey: 'i-heroicons-heart', tone: 'info', xpReward: 80, coinReward: 40, title: 'مهربان‌ترین', badge: false },
    { name: 'پر انرژی‌ترین', description: 'موتور محرک تیم', iconKey: 'i-heroicons-bolt', tone: 'streak', xpReward: 80, coinReward: 40, title: 'پر انرژی‌ترین', badge: false },
    { name: 'حل‌ّال مسائل', description: 'هر بن‌بستی را باز می‌کند', iconKey: 'i-heroicons-puzzle-piece', tone: 'primary', xpReward: 120, coinReward: 60, title: 'مغز هفته', badge: false },
    { name: 'بیشترین پیشرفت', description: 'رشد چشمگیر نسبت به قبل', iconKey: 'i-heroicons-arrow-trending-up', tone: 'success', xpReward: 100, coinReward: 50, title: 'ستاره در حال ظهور', badge: false },
  ] as const

  const recognitionCategories: Record<string, string> = {}
  for (const [index, category] of RECOGNITION_CATEGORIES.entries()) {
    const created = await prisma.recognitionCategory.create({
      data: {
        companyId: company.id,
        name: category.name,
        description: category.description,
        iconKey: category.iconKey,
        tone: category.tone,
        sortOrder: index,
        xpReward: category.xpReward,
        coinReward: category.coinReward,
        titleId: recognitionTitles.get(category.title) ?? null,
        badgeId: category.badge ? appreciationBadge.id : null,
      },
    })
    recognitionCategories[category.name] = created.id
  }

  const DAY_MS = 86_400_000
  const now = new Date()

  // A cycle that ended last week, left ACTIVE with votes so the very first
  // visit to the board finalizes it through the real engine (winners + rewards).
  const previousWindow = cycleWindow('WEEKLY', new Date(now.getTime() - 7 * DAY_MS), company.timezone)
  const previousCycle = await prisma.recognitionCycle.create({
    data: {
      companyId: company.id,
      frequency: 'WEEKLY',
      status: 'ACTIVE',
      title: 'هفته گذشته',
      startsAt: previousWindow.startsAt,
      endsAt: previousWindow.endsAt,
    },
  })

  const previousVotes: Array<{ category: string, voter: string, nominee: string }> = [
    { category: 'مسئول‌ترین همکار', voter: 'مریم نوروزی', nominee: 'نگار احمدی' },
    { category: 'مسئول‌ترین همکار', voter: 'پویا محمدی', nominee: 'نگار احمدی' },
    { category: 'مسئول‌ترین همکار', voter: 'ترانه موسوی', nominee: 'نگار احمدی' },
    { category: 'مسئول‌ترین همکار', voter: 'سینا فرهادی', nominee: 'نگار احمدی' },
    { category: 'بهترین هم‌تیمی', voter: 'مریم نوروزی', nominee: 'پویا محمدی' },
    { category: 'بهترین هم‌تیمی', voter: 'نگار احمدی', nominee: 'پویا محمدی' },
    { category: 'بهترین هم‌تیمی', voter: 'الناز کریمی', nominee: 'پویا محمدی' },
    { category: 'طنزپرداز دفتر', voter: 'نگار احمدی', nominee: 'سینا فرهادی' },
    { category: 'طنزپرداز دفتر', voter: 'الناز کریمی', nominee: 'سینا فرهادی' },
  ]

  for (const vote of previousVotes) {
    await prisma.recognitionVote.create({
      data: {
        companyId: company.id,
        cycleId: previousCycle.id,
        categoryId: recognitionCategories[vote.category]!,
        voterId: users[vote.voter]!.id,
        nomineeId: users[vote.nominee]!.id,
      },
    })
  }

  // The cycle employees vote in today.
  const activeWindow = cycleWindow('WEEKLY', now, company.timezone)
  await prisma.recognitionCycle.create({
    data: {
      companyId: company.id,
      frequency: 'WEEKLY',
      status: 'ACTIVE',
      startsAt: activeWindow.startsAt,
      endsAt: activeWindow.endsAt,
    },
  })

  // --- Tenant B (proves isolation: none of the above is visible here) --------
  const other = await prisma.company.create({
    data: { name: 'داده‌کاوان آریا', slug: 'dadegavan-aria', industry: 'تحلیل داده', locale: 'fa', timezone: 'Asia/Tehran' },
  })

  for (const level of LEVELS) {
    await prisma.level.create({ data: { companyId: other.id, ...level } })
  }

  await prisma.rewardRule.create({
    data: { companyId: other.id, version: 1, isActive: true },
  })

  const otherOwner = await prisma.user.create({
    data: {
      companyId: other.id,
      fullName: 'هومن طاهری',
      phone: '+989130000001',
      email: 'homen@dadegavan.local',
      role: 'OWNER',
      jobTitle: 'مدیرعامل',
    },
  })

  await prisma.user.create({
    data: {
      companyId: other.id,
      fullName: 'رویا سلطانی',
      phone: '+989130000002',
      email: 'roya@dadegavan.local',
      role: 'EMPLOYEE',
      jobTitle: 'دانشمند داده',
    },
  })

  await prisma.userProgress.create({
    data: { companyId: other.id, userId: otherOwner.id, xp: 320, coins: 120, currentStreak: 1, longestStreak: 3 },
  })

  await prisma.task.create({
    data: {
      companyId: other.id,
      title: 'گزارش ماهانه عملکرد',
      status: 'TODO',
      priority: 'MEDIUM',
      assigneeId: otherOwner.id,
      xpReward: 80,
      coinReward: 40,
      dueDate: new Date(Date.now() + 4 * 86_400_000),
    },
  })

  console.log('✔ seeded 2 companies')
  console.log(`  login as OWNER of «نواندیشان پایا» with phone ${adminPhone}`)
  console.log('  (the OTP code is printed in the dev server log)')
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
