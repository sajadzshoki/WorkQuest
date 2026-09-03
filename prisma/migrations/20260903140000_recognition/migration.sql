-- Recognition system: recurring cycles, categories, votes, sealed results and
-- winner titles. Rewards for winners reuse the existing RECOGNITION /
-- RECOGNITION_REWARD ledger enums, so no enum changes are needed here.

-- CreateEnum
CREATE TYPE "RecognitionFrequency" AS ENUM ('WEEKLY', 'MONTHLY');
CREATE TYPE "RecognitionCycleStatus" AS ENUM ('ACTIVE', 'FINALIZED', 'CANCELLED');

-- CreateTable: RecognitionTitle (must precede the tables that reference it)
CREATE TABLE "RecognitionTitle" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecognitionTitle_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "RecognitionTitle_companyId_idx" ON "RecognitionTitle"("companyId");

ALTER TABLE "RecognitionTitle" ADD CONSTRAINT "RecognitionTitle_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: RecognitionCycle
CREATE TABLE "RecognitionCycle" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "frequency" "RecognitionFrequency" NOT NULL,
    "status" "RecognitionCycleStatus" NOT NULL DEFAULT 'ACTIVE',
    "title" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "finalizedAt" TIMESTAMP(3),
    "createdBy" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecognitionCycle_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RecognitionCycle_companyId_frequency_startsAt_key"
  ON "RecognitionCycle"("companyId", "frequency", "startsAt");
CREATE INDEX "RecognitionCycle_companyId_status_idx" ON "RecognitionCycle"("companyId", "status");
CREATE INDEX "RecognitionCycle_companyId_endsAt_idx" ON "RecognitionCycle"("companyId", "endsAt");

ALTER TABLE "RecognitionCycle" ADD CONSTRAINT "RecognitionCycle_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: RecognitionCategory
CREATE TABLE "RecognitionCategory" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "iconKey" TEXT,
    "tone" TEXT DEFAULT 'primary',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "xpReward" INTEGER NOT NULL DEFAULT 0,
    "coinReward" INTEGER NOT NULL DEFAULT 0,
    "titleId" UUID,
    "badgeId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecognitionCategory_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "RecognitionCategory_companyId_isActive_idx" ON "RecognitionCategory"("companyId", "isActive");
CREATE INDEX "RecognitionCategory_companyId_sortOrder_idx" ON "RecognitionCategory"("companyId", "sortOrder");

ALTER TABLE "RecognitionCategory" ADD CONSTRAINT "RecognitionCategory_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RecognitionCategory" ADD CONSTRAINT "RecognitionCategory_titleId_fkey"
  FOREIGN KEY ("titleId") REFERENCES "RecognitionTitle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "RecognitionCategory" ADD CONSTRAINT "RecognitionCategory_badgeId_fkey"
  FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable: RecognitionVote
CREATE TABLE "RecognitionVote" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "cycleId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "voterId" UUID NOT NULL,
    "nomineeId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecognitionVote_pkey" PRIMARY KEY ("id")
);

-- The duplicate-vote guard: one choice per (cycle, category, voter).
CREATE UNIQUE INDEX "RecognitionVote_cycleId_categoryId_voterId_key"
  ON "RecognitionVote"("cycleId", "categoryId", "voterId");
CREATE INDEX "RecognitionVote_cycleId_nomineeId_idx" ON "RecognitionVote"("cycleId", "nomineeId");
CREATE INDEX "RecognitionVote_companyId_voterId_createdAt_idx" ON "RecognitionVote"("companyId", "voterId", "createdAt");

ALTER TABLE "RecognitionVote" ADD CONSTRAINT "RecognitionVote_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RecognitionVote" ADD CONSTRAINT "RecognitionVote_cycleId_fkey"
  FOREIGN KEY ("cycleId") REFERENCES "RecognitionCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RecognitionVote" ADD CONSTRAINT "RecognitionVote_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "RecognitionCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RecognitionVote" ADD CONSTRAINT "RecognitionVote_voterId_fkey"
  FOREIGN KEY ("voterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RecognitionVote" ADD CONSTRAINT "RecognitionVote_nomineeId_fkey"
  FOREIGN KEY ("nomineeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: RecognitionResult
CREATE TABLE "RecognitionResult" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "cycleId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "winnerId" UUID NOT NULL,
    "voteCount" INTEGER NOT NULL DEFAULT 0,
    "titleId" UUID,
    "titleName" TEXT,
    "xpReward" INTEGER NOT NULL DEFAULT 0,
    "coinReward" INTEGER NOT NULL DEFAULT 0,
    "rewardedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecognitionResult_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RecognitionResult_cycleId_categoryId_key"
  ON "RecognitionResult"("cycleId", "categoryId");
CREATE INDEX "RecognitionResult_companyId_winnerId_createdAt_idx"
  ON "RecognitionResult"("companyId", "winnerId", "createdAt");

ALTER TABLE "RecognitionResult" ADD CONSTRAINT "RecognitionResult_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RecognitionResult" ADD CONSTRAINT "RecognitionResult_cycleId_fkey"
  FOREIGN KEY ("cycleId") REFERENCES "RecognitionCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RecognitionResult" ADD CONSTRAINT "RecognitionResult_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "RecognitionCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RecognitionResult" ADD CONSTRAINT "RecognitionResult_winnerId_fkey"
  FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RecognitionResult" ADD CONSTRAINT "RecognitionResult_titleId_fkey"
  FOREIGN KEY ("titleId") REFERENCES "RecognitionTitle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
