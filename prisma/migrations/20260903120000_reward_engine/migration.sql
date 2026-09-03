-- Reward engine: wallets, versioned reward rules, typed + idempotent ledgers.

-- CreateEnum
CREATE TYPE "CoinTransactionType" AS ENUM (
  'TASK_REWARD',
  'RECOGNITION_REWARD',
  'CHALLENGE_REWARD',
  'REWARD_REDEMPTION',
  'ADMIN_ADJUSTMENT'
);

-- CreateTable: Wallet
CREATE TABLE "Wallet" (
  "id"             UUID NOT NULL,
  "companyId"      UUID NOT NULL,
  "userId"         UUID NOT NULL,
  "balance"        INTEGER NOT NULL DEFAULT 0,
  "lifetimeEarned" INTEGER NOT NULL DEFAULT 0,
  "lifetimeSpent"  INTEGER NOT NULL DEFAULT 0,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");
CREATE INDEX "Wallet_companyId_balance_idx" ON "Wallet"("companyId", "balance");

ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: RewardRule
CREATE TABLE "RewardRule" (
  "id"                   UUID NOT NULL,
  "companyId"            UUID NOT NULL,
  "version"              INTEGER NOT NULL,
  "isActive"             BOOLEAN NOT NULL DEFAULT false,
  "baseXp"               INTEGER NOT NULL DEFAULT 100,
  "baseCoins"            INTEGER NOT NULL DEFAULT 50,
  "lowPriorityBp"        INTEGER NOT NULL DEFAULT 8000,
  "mediumPriorityBp"     INTEGER NOT NULL DEFAULT 10000,
  "highPriorityBp"       INTEGER NOT NULL DEFAULT 13000,
  "excellentBp"          INTEGER NOT NULL DEFAULT 10000,
  "goodBp"               INTEGER NOT NULL DEFAULT 8000,
  "fairBp"               INTEGER NOT NULL DEFAULT 6000,
  "poorBp"               INTEGER NOT NULL DEFAULT 3000,
  "onTimeBonusBp"        INTEGER NOT NULL DEFAULT 1000,
  "earlyBonusBp"         INTEGER NOT NULL DEFAULT 2000,
  "highQualityBonusBp"   INTEGER NOT NULL DEFAULT 1500,
  "overduePenaltyBp"     INTEGER NOT NULL DEFAULT 2500,
  "revisionPenaltyBp"    INTEGER NOT NULL DEFAULT 1000,
  "maxRevisionPenaltyBp" INTEGER NOT NULL DEFAULT 5000,
  "minMultiplierBp"      INTEGER NOT NULL DEFAULT 0,
  "maxMultiplierBp"      INTEGER NOT NULL DEFAULT 20000,
  "earlyDays"            INTEGER NOT NULL DEFAULT 1,
  "highQualityThreshold" INTEGER NOT NULL DEFAULT 5,
  "createdAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdBy"            UUID,
  CONSTRAINT "RewardRule_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RewardRule_companyId_version_key" ON "RewardRule"("companyId", "version");
CREATE INDEX "RewardRule_companyId_isActive_idx" ON "RewardRule"("companyId", "isActive");

ALTER TABLE "RewardRule" ADD CONSTRAINT "RewardRule_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: CoinTransaction gains wallet link, type, running balance, idempotency
ALTER TABLE "CoinTransaction"
  ADD COLUMN "walletId"       UUID,
  ADD COLUMN "type"           "CoinTransactionType" NOT NULL DEFAULT 'ADMIN_ADJUSTMENT',
  ADD COLUMN "balanceAfter"   INTEGER,
  ADD COLUMN "idempotencyKey" VARCHAR(200);

ALTER TABLE "CoinTransaction" ADD CONSTRAINT "CoinTransaction_walletId_fkey"
  FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "CoinTransaction_companyId_idempotencyKey_key"
  ON "CoinTransaction"("companyId", "idempotencyKey");
CREATE INDEX "CoinTransaction_companyId_type_createdAt_idx"
  ON "CoinTransaction"("companyId", "type", "createdAt");
CREATE INDEX "CoinTransaction_walletId_createdAt_idx"
  ON "CoinTransaction"("walletId", "createdAt");

-- AlterTable: XpTransaction gains the same idempotency guarantee
ALTER TABLE "XpTransaction" ADD COLUMN "idempotencyKey" VARCHAR(200);
CREATE UNIQUE INDEX "XpTransaction_companyId_idempotencyKey_key"
  ON "XpTransaction"("companyId", "idempotencyKey");

-- AlterTable: TaskReview gains sub-scores and a frozen breakdown
ALTER TABLE "TaskReview"
  ADD COLUMN "qualityScore"    INTEGER,
  ADD COLUMN "timelinessScore" INTEGER,
  ADD COLUMN "rewardBreakdown" JSONB;

-- Backfill: one wallet per existing user, seeded from the UserProgress cache
-- so nobody's balance appears to reset when the wallet becomes authoritative.
INSERT INTO "Wallet" ("id", "companyId", "userId", "balance", "lifetimeEarned", "lifetimeSpent", "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  u."companyId",
  u."id",
  COALESCE(p."coins", 0),
  GREATEST(COALESCE(p."coins", 0), 0),
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "User" u
LEFT JOIN "UserProgress" p ON p."userId" = u."id"
ON CONFLICT ("userId") DO NOTHING;

-- Attach historical coin rows to their wallet and classify them.
UPDATE "CoinTransaction" c
SET "walletId" = w."id"
FROM "Wallet" w
WHERE w."userId" = c."userId" AND c."walletId" IS NULL;

UPDATE "CoinTransaction"
SET "type" = CASE "source"
  WHEN 'TASK_REVIEW'       THEN 'TASK_REWARD'::"CoinTransactionType"
  WHEN 'RECOGNITION'       THEN 'RECOGNITION_REWARD'::"CoinTransactionType"
  WHEN 'CHALLENGE'         THEN 'CHALLENGE_REWARD'::"CoinTransactionType"
  WHEN 'REWARD_REDEMPTION' THEN 'REWARD_REDEMPTION'::"CoinTransactionType"
  ELSE 'ADMIN_ADJUSTMENT'::"CoinTransactionType"
END;

-- Seed a v1 active rule set for every existing company.
INSERT INTO "RewardRule" ("id", "companyId", "version", "isActive", "createdAt")
SELECT gen_random_uuid(), c."id", 1, true, CURRENT_TIMESTAMP
FROM "Company" c
ON CONFLICT ("companyId", "version") DO NOTHING;
