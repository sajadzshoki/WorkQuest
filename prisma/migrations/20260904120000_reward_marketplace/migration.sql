-- Company reward marketplace.
--
-- The catalogue (`Reward`) and the request (`RewardRedemption`) already existed
-- as tables, but nothing could be bought: there was no redemption path, no
-- price/stock governance and no rules per reward. This migration adds what the
-- marketplace needs, without adding a single coin of mutable state:
--
--   * `cost` becomes `coinCost` everywhere, so the column says what it holds —
--     company coins, not money — and cannot be confused with a task's coin
--     payout.
--   * the pending state is spelled `PENDING`, matching the vocabulary the
--     product uses for a request nobody has decided on yet;
--   * each reward carries its own **rules**: automatic approval for simple or
--     digital rewards, a per-employee cap, a minimum level, whether a note is
--     required, and an optional availability window. Pricing and rules stay
--     entirely company-controlled — no reward or price is built into the code;
--   * a redemption keeps the price it actually charged (a snapshot, so a later
--     repricing cannot rewrite history), the admin's decision note, who
--     fulfilled it and when, and an idempotency key so a double-clicked button
--     is one request;
--   * the unique `(companyId, idempotencyKey)` index is what makes a retried
--     redemption at-most-once. As elsewhere in this schema, the guarantee
--     belongs to the database rather than to application logic.
--
-- Balances are untouched: coins still move only through `CoinTransaction`, and
-- nothing here resets a wallet.

-- The pending state, renamed rather than added: existing rows keep their meaning.
ALTER TYPE "RedemptionStatus" RENAME VALUE 'REQUESTED' TO 'PENDING';

-- Catalogue vocabulary for the kinds of reward companies actually list.
ALTER TYPE "RewardType" ADD VALUE IF NOT EXISTS 'MEAL';
ALTER TYPE "RewardType" ADD VALUE IF NOT EXISTS 'TICKET';
ALTER TYPE "RewardType" ADD VALUE IF NOT EXISTS 'BONUS';

-- Reward: price renamed, rules added.
ALTER TABLE "Reward" RENAME COLUMN "cost" TO "coinCost";

ALTER TABLE "Reward"
  ADD COLUMN "autoApprove" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "maxPerUser" INTEGER,
  ADD COLUMN "minLevel" INTEGER,
  ADD COLUMN "requiresNote" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "availableFrom" TIMESTAMP(3),
  ADD COLUMN "availableUntil" TIMESTAMP(3);

-- RewardRedemption: price renamed, decision trail and idempotency added.
ALTER TABLE "RewardRedemption" RENAME COLUMN "cost" TO "coinCost";

ALTER TABLE "RewardRedemption"
  ADD COLUMN "decisionNote" TEXT,
  ADD COLUMN "fulfilledBy" TEXT,
  ADD COLUMN "fulfilledAt" TIMESTAMP(3),
  ADD COLUMN "idempotencyKey" VARCHAR(200);

-- A retried submission is the same request. NULL keys never collide, so the
-- ordinary path (no client key) is unaffected.
CREATE UNIQUE INDEX "RewardRedemption_companyId_idempotencyKey_key"
  ON "RewardRedemption"("companyId", "idempotencyKey");

-- "How many live redemptions does this employee already hold for this reward?"
-- is asked inside the purchase transaction, under a lock on the reward row.
CREATE INDEX "RewardRedemption_companyId_userId_rewardId_idx"
  ON "RewardRedemption"("companyId", "userId", "rewardId");

-- The admin queue is read by status, newest first.
CREATE INDEX "RewardRedemption_companyId_status_requestedAt_idx"
  ON "RewardRedemption"("companyId", "status", "requestedAt");

-- Catalogue browsing filters by type as well as status.
CREATE INDEX "Reward_companyId_type_status_idx"
  ON "Reward"("companyId", "type", "status");
