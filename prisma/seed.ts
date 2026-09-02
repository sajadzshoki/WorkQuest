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

import { PrismaClient } from './generated/prisma/client.ts'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  console.error('DATABASE_URL is not set — copy .env.example to .env first.')
  process.exit(1)
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) })

const LEVELS = [
  { level: 1, minXp: 0, title: 'جوانه', iconKey: 'i-heroicons-sparkles' },
  { level: 2, minXp: 500, title: 'کاوشگر', iconKey: 'i-heroicons-bolt' },
  { level: 3, minXp: 1500, title: 'سازنده', iconKey: 'i-heroicons-wrench-screwdriver' },
  { level: 4, minXp: 3000, title: 'راهبر', iconKey: 'i-heroicons-rocket-launch' },
  { level: 5, minXp: 5000, title: 'استاد', iconKey: 'i-heroicons-academic-cap' },
  { level: 6, minXp: 8000, title: 'پیشرو', iconKey: 'i-heroicons-star' },
]

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

  const tasks = [
    { title: 'بازطراحی صفحه ورود', assignee: 'نگار احمدی', team: 'product', status: 'IN_PROGRESS', priority: 'HIGH', xp: 120, coins: 60, dueInDays: 3, reviewer: 'مریم نوروزی' },
    { title: 'پیاده‌سازی سرویس اعلان‌ها', assignee: 'پویا محمدی', team: 'engineering', status: 'SUBMITTED', priority: 'URGENT', xp: 220, coins: 110, dueInDays: 1, reviewer: 'امیر شریفی' },
    { title: 'تحلیل داده‌های ریزش کاربر', assignee: 'الناز کریمی', team: 'engineering', status: 'APPROVED', priority: 'MEDIUM', xp: 180, coins: 90, dueInDays: -2, reviewer: 'امیر شریفی', score: 92 },
    { title: 'پروتوتایپ داشبورد مدیران', assignee: 'ترانه موسوی', team: 'product', status: 'APPROVED', priority: 'HIGH', xp: 160, coins: 80, dueInDays: -5, reviewer: 'مریم نوروزی', score: 88 },
    { title: 'بهینه‌سازی کوئری‌های گزارش‌گیری', assignee: 'سینا فرهادی', team: 'engineering', status: 'ASSIGNED', priority: 'LOW', xp: 90, coins: 45, dueInDays: 7, reviewer: 'امیر شریفی' },
    { title: 'مستندسازی راهنمای طراحی', assignee: 'نگار احمدی', team: 'product', status: 'CHANGES_REQUESTED', priority: 'MEDIUM', xp: 100, coins: 50, dueInDays: 2, reviewer: 'مریم نوروزی' },
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
    const created = await prisma.task.create({
      data: {
        companyId: company.id,
        title: task.title,
        description: `شرح تسک «${task.title}» — خروجی مورد انتظار و معیار پذیرش در این بخش ثبت می‌شود.`,
        status: task.status,
        priority: task.priority,
        assigneeId: assignee.id,
        assignerId: users[task.reviewer]!.id,
        teamId: (await prisma.team.findFirst({ where: { companyId: company.id, slug: task.team } }))?.id,
        xpReward: task.xp,
        coinReward: task.coins,
        dueDate: new Date(Date.now() + task.dueInDays * 86_400_000),
        assignedAt: new Date(Date.now() - 5 * 86_400_000),
        submittedAt: ['SUBMITTED', 'APPROVED', 'CHANGES_REQUESTED'].includes(task.status) ? new Date(Date.now() - 86_400_000) : null,
        completedAt: task.status === 'APPROVED' ? new Date(Date.now() - 86_400_000) : null,
      },
    })

    if ('score' in task && task.status === 'APPROVED') {
      await prisma.taskReview.create({
        data: {
          companyId: company.id,
          taskId: created.id,
          reviewerId: users[task.reviewer]!.id,
          decision: 'APPROVED',
          score: task.score,
          feedback: 'کیفیت خروجی عالی بود؛ مستندسازی هم کامل است.',
          xpAwarded: task.xp,
          coinsAwarded: task.coins,
        },
      })

      await prisma.xpTransaction.create({
        data: { companyId: company.id, userId: assignee.id, amount: task.xp, source: 'TASK_REVIEW', reason: task.title, referenceType: 'Task', referenceId: created.id },
      })
      await prisma.coinTransaction.create({
        data: { companyId: company.id, userId: assignee.id, amount: task.coins, source: 'TASK_REVIEW', reason: task.title, referenceType: 'Task', referenceId: created.id },
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
      status: 'ASSIGNED',
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
