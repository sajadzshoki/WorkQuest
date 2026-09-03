-- Gamification layer: achievement coin type + badge visual metadata.
--
-- * `ACHIEVEMENT_REWARD` gives achievement coin payouts their own, truthful
--   entry in the wallet statement instead of borrowing a task/recognition type.
-- * `Badge.iconKey` / `Badge.tone` let the reusable badge components render a
--   badge with an icon and a colour without a binary asset per badge.

ALTER TYPE "CoinTransactionType" ADD VALUE 'ACHIEVEMENT_REWARD';

ALTER TABLE "Badge"
  ADD COLUMN "iconKey" TEXT,
  ADD COLUMN "tone" TEXT;
