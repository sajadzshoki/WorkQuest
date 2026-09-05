-- The challenge engine.
--
-- `Challenge` / `ChallengeParticipant` already existed as bare tables (a seeded
-- demo row and a placeholder), but nothing computed progress or paid rewards.
-- This migration turns them into a real engine's storage, and adds no mutable
-- gamification state that bypasses the ledgers:
--
--   * `type` — INDIVIDUAL (every participant races their own progress bar) or
--     TEAM (one shared bar filled by the team's collective work). The enum is
--     additive; existing rows default to INDIVIDUAL.
--   * `teamId` — the team a TEAM challenge measures, or the optional scope of
--     an INDIVIDUAL challenge (`null` = the whole company). `ON DELETE SET
--     NULL` keeps challenge history when a team is dissolved; the engine then
--     cancels the orphaned challenge on its next pass.
--   * `progress` — a denormalised live value the engine recomputes from real
--     application data (approved tasks, on-time tasks, team completion). It is
--     a read-model column, never an input: there is no endpoint that writes it.
--   * `ChallengeParticipant.rewardedAt` — when the reward was paid, the
--     row-level counterpart of the CLAIMED status.
--
-- Idempotent rewards need no new index here: they are guaranteed by the
-- existing unique `(companyId, idempotencyKey)` indexes on `XpTransaction` and
-- `CoinTransaction`, keyed `challenge:<id>:user:<userId>:{xp|coins}`.

-- CreateEnum
CREATE TYPE "ChallengeType" AS ENUM ('INDIVIDUAL', 'TEAM');

-- AlterTable
ALTER TABLE "Challenge"
  ADD COLUMN "type" "ChallengeType" NOT NULL DEFAULT 'INDIVIDUAL',
  ADD COLUMN "teamId" UUID,
  ADD COLUMN "progress" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "ChallengeParticipant"
  ADD COLUMN "rewardedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Challenge_teamId_idx" ON "Challenge"("teamId");
CREATE INDEX "Challenge_companyId_status_endsAt_idx" ON "Challenge"("companyId", "status", "endsAt");
CREATE INDEX "Challenge_companyId_teamId_idx" ON "Challenge"("companyId", "teamId");

-- AddForeignKey
ALTER TABLE "Challenge"
  ADD CONSTRAINT "Challenge_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
