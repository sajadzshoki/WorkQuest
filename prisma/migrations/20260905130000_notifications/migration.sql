-- In-app notification system: the spec-shaped model.
--
-- Four moves, each with its reason:
--   1. The catalogue becomes the fourteen product types plus two internal
--      catch-alls. Old values are mapped, not dropped on the floor:
--      TASK_REVIEWED splits into TASK_APPROVED (reviews) and SYSTEM (the
--      "comment on your task" notices), CHALLENGE_UPDATE becomes
--      CHALLENGE_STARTED, REDEMPTION_UPDATE becomes REWARD_APPROVED, and the
--      two never-written values degrade to SYSTEM.
--   2. Column names match the product contract: `message` and `metadata`.
--   3. `status` goes away — `readAt` was always the real read state, and two
--      columns that can disagree will eventually disagree. Existing read rows
--      carry their state over before the column drops.
--   4. `dedupeKey` + a unique (companyId, userId, dedupeKey) index make
--      delivery at-most-once for events that can retry, exactly like the
--      reward ledgers' idempotency keys.

-- 1. The new catalogue -------------------------------------------------------

CREATE TYPE "NotificationType_new" AS ENUM (
  'TASK_ASSIGNED',
  'TASK_SUBMITTED',
  'TASK_APPROVED',
  'TASK_NEEDS_REVISION',
  'COINS_EARNED',
  'ACHIEVEMENT_UNLOCKED',
  'LEVEL_UP',
  'RECOGNITION_RECEIVED',
  'RECOGNITION_WINNER',
  'CHALLENGE_STARTED',
  'CHALLENGE_COMPLETED',
  'REWARD_REDEEMED',
  'REWARD_APPROVED',
  'REWARD_REJECTED',
  'INVITATION',
  'SYSTEM'
);

ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ((
  CASE "type"
    WHEN 'TASK_ASSIGNED'      THEN 'TASK_ASSIGNED'
    WHEN 'TASK_SUBMITTED'     THEN 'TASK_SUBMITTED'
    WHEN 'TASK_REVIEWED'      THEN CASE
                                     WHEN "title" = 'یادداشت جدید روی تسک' THEN 'SYSTEM'
                                     ELSE 'TASK_APPROVED'
                                   END
    WHEN 'ACHIEVEMENT_UNLOCKED' THEN 'ACHIEVEMENT_UNLOCKED'
    WHEN 'LEVEL_UP'           THEN 'LEVEL_UP'
    WHEN 'REWARD_AVAILABLE'   THEN 'SYSTEM'
    WHEN 'REDEMPTION_UPDATE'  THEN 'REWARD_APPROVED'
    WHEN 'RECOGNITION_RECEIVED' THEN 'RECOGNITION_RECEIVED'
    WHEN 'CHALLENGE_UPDATE'   THEN 'CHALLENGE_STARTED'
    WHEN 'INVITATION'         THEN 'INVITATION'
    WHEN 'TEAM_UPDATE'        THEN 'SYSTEM'
    WHEN 'SYSTEM'             THEN 'SYSTEM'
  END
)::text::"NotificationType_new");

DROP TYPE "NotificationType";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";

-- 2. The product contract's column names -------------------------------------

ALTER TABLE "Notification" RENAME COLUMN "body" TO "message";
ALTER TABLE "Notification" RENAME COLUMN "data" TO "metadata";

-- 3. One read state ----------------------------------------------------------
-- (The status index goes away with the column — PostgreSQL drops indexes
-- that depend on a dropped column.)

UPDATE "Notification" SET "readAt" = now() WHERE "status" IN ('READ', 'ARCHIVED') AND "readAt" IS NULL;
ALTER TABLE "Notification" DROP COLUMN "status";
DROP TYPE "NotificationStatus";

-- 4. At-most-once delivery ---------------------------------------------------

ALTER TABLE "Notification" ADD COLUMN "dedupeKey" VARCHAR(200);
CREATE UNIQUE INDEX "Notification_companyId_userId_dedupeKey_key"
  ON "Notification"("companyId", "userId", "dedupeKey");

CREATE INDEX "Notification_companyId_userId_readAt_idx"
  ON "Notification"("companyId", "userId", "readAt");
