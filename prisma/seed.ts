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

const REWARDS = [
  { title: 'یک روز مرخصی تشویقی', description: 'یک روز مرخصی با حقوق به انتخاب شما', type: 'TIME_OFF', cost: 1200, stock: 12 },
  { title: 'کارت هدیه خرید کتاب', description: 'کارت هدیه ۵۰۰ هزار تومانی کتاب', type: 'VOUCHER', cost: 600, stock: 30 },
  { title: 'هدفون بی‌سیم', description: 'هدفون بی‌سیم برای تمرکز بیشتر', type: 'PHYSICAL', cost: 4500, stock: 3 },
  { title: 'کمک به خیریه به نام شما', description: 'اهدا به خیریه همکار، به نام شما', type: 'DONATION', cost: 800, stock: null },
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

  const badges = [
    { name: 'نشان شروع', description: 'برای اولین تسک تأیید شده' },
    { name: 'نشان پایداری', description: 'برای هفت روز فعالیت پیاپی' },
  ]
  const createdBadges = []
  for (const badge of badges) {
    createdBadges.push(await prisma.badge.create({ data: { companyId: company.id, ...badge } }))
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

  // Progress + ledger for the two people with approved work, plus a couple of
  // achievements/badges so the gamification UI has something to render.
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

    await prisma.xpTransaction.create({
      data: { companyId: company.id, userId: user.id, amount: row.xp, source: 'TASK_REVIEW', reason: 'مجموع تسک‌های تأیید شده' },
    })
    await prisma.coinTransaction.create({
      data: { companyId: company.id, userId: user.id, amount: row.coins, source: 'TASK_REVIEW', reason: 'مجموع پاداش تسک‌ها' },
    })

    for (const index of row.achievements) {
      const achievement = achievements[index]
      if (!achievement) continue
      await prisma.userAchievement.create({ data: { companyId: company.id, userId: user.id, achievementId: achievement.id } })
    }
    for (const index of row.badges) {
      const badge = createdBadges[index]
      if (!badge) continue
      await prisma.userBadge.create({ data: { companyId: company.id, userId: user.id, badgeId: badge.id } })
    }
  }

  for (const reward of REWARDS) {
    await prisma.reward.create({ data: { companyId: company.id, ...reward, status: 'ACTIVE' } })
  }

  const challenge = await prisma.challenge.create({
    data: {
      companyId: company.id,
      title: 'چالش هفته بدون تأخیر',
      description: 'هر تسکی که قبل از سررسید تحویل شود یک امتیاز می‌گیرد.',
      goalKey: 'tasks_on_time',
      goalValue: 5,
      xpReward: 400,
      coinReward: 200,
      startsAt: new Date(Date.now() - 2 * 86_400_000),
      endsAt: new Date(Date.now() + 5 * 86_400_000),
      status: 'ACTIVE',
    },
  })

  for (const name of ['الناز کریمی', 'پویا محمدی', 'نگار احمدی']) {
    await prisma.challengeParticipant.create({
      data: { companyId: company.id, challengeId: challenge.id, userId: users[name]!.id, progress: 2, status: 'IN_PROGRESS' },
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

  // --- Tenant B (proves isolation: none of the above is visible here) --------
  const other = await prisma.company.create({
    data: { name: 'داده‌کاوان آریا', slug: 'dadegavan-aria', industry: 'تحلیل داده', locale: 'fa', timezone: 'Asia/Tehran' },
  })

  for (const level of LEVELS) {
    await prisma.level.create({ data: { companyId: other.id, ...level } })
  }

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
