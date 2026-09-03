-- ---------------------------------------------------------------------------
-- WorkQuest — real task management
--
-- * `TaskStatus` is reduced to the five states of the actual lifecycle
--   (TODO → IN_PROGRESS → SUBMITTED → APPROVED, with NEEDS_REVISION as the
--   rework loop). The old draft/assigned/rejected/cancelled states are mapped
--   onto their nearest live equivalent rather than dropped, so existing rows
--   survive the migration.
-- * `TaskPriority` loses URGENT — the product spec defines three levels.
--   URGENT rows collapse to HIGH.
-- * `ReviewDecision` keeps only the two outcomes a reviewer can actually pick.
-- * `Task` gains estimated effort, self-reported progress, a start timestamp
--   and a revision counter.
-- * New: `TaskComment`, `TaskAttachment`, `TaskEvent`.
-- * Indexes cover the four query shapes the dashboards need: by company+status,
--   company+assignee, company+team and company+due date.
--
-- Enum values cannot be removed in place in PostgreSQL, so each affected enum
-- is rebuilt: create the new type, rewrite the columns with an explicit value
-- mapping, drop the old type, rename.
-- ---------------------------------------------------------------------------

-- AlterEnum: NotificationType gains TASK_SUBMITTED (additive, no rebuild)
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'TASK_SUBMITTED';

-- ---------------------------------------------------------------------------
-- TaskStatus
-- ---------------------------------------------------------------------------
CREATE TYPE "TaskStatus_new" AS ENUM ('TODO', 'IN_PROGRESS', 'SUBMITTED', 'NEEDS_REVISION', 'APPROVED');

ALTER TABLE "Task" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Task"
  ALTER COLUMN "status" TYPE "TaskStatus_new"
  USING (
    CASE "status"::text
      WHEN 'DRAFT' THEN 'TODO'
      WHEN 'ASSIGNED' THEN 'TODO'
      WHEN 'IN_PROGRESS' THEN 'IN_PROGRESS'
      WHEN 'SUBMITTED' THEN 'SUBMITTED'
      WHEN 'APPROVED' THEN 'APPROVED'
      WHEN 'CHANGES_REQUESTED' THEN 'NEEDS_REVISION'
      WHEN 'REJECTED' THEN 'NEEDS_REVISION'
      WHEN 'CANCELLED' THEN 'TODO'
      ELSE 'TODO'
    END
  )::"TaskStatus_new";
ALTER TABLE "Task" ALTER COLUMN "status" SET DEFAULT 'TODO';

DROP TYPE "TaskStatus";
ALTER TYPE "TaskStatus_new" RENAME TO "TaskStatus";

-- ---------------------------------------------------------------------------
-- TaskPriority
-- ---------------------------------------------------------------------------
CREATE TYPE "TaskPriority_new" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

ALTER TABLE "Task" ALTER COLUMN "priority" DROP DEFAULT;
ALTER TABLE "Task"
  ALTER COLUMN "priority" TYPE "TaskPriority_new"
  USING (
    CASE "priority"::text
      WHEN 'URGENT' THEN 'HIGH'
      ELSE "priority"::text
    END
  )::"TaskPriority_new";
ALTER TABLE "Task" ALTER COLUMN "priority" SET DEFAULT 'MEDIUM';

DROP TYPE "TaskPriority";
ALTER TYPE "TaskPriority_new" RENAME TO "TaskPriority";

-- ---------------------------------------------------------------------------
-- ReviewDecision
-- ---------------------------------------------------------------------------
CREATE TYPE "ReviewDecision_new" AS ENUM ('APPROVED', 'CHANGES_REQUESTED');

ALTER TABLE "TaskReview"
  ALTER COLUMN "decision" TYPE "ReviewDecision_new"
  USING (
    CASE "decision"::text
      WHEN 'APPROVED_WITH_NOTES' THEN 'APPROVED'
      WHEN 'REJECTED' THEN 'CHANGES_REQUESTED'
      ELSE "decision"::text
    END
  )::"ReviewDecision_new";

DROP TYPE "ReviewDecision";
ALTER TYPE "ReviewDecision_new" RENAME TO "ReviewDecision";

-- A reviewer who sends work back does not have to grade it.
ALTER TABLE "TaskReview" ALTER COLUMN "score" DROP NOT NULL;

-- ---------------------------------------------------------------------------
-- Task columns
-- ---------------------------------------------------------------------------
ALTER TABLE "Task" ADD COLUMN     "estimatedHours" DECIMAL(6,2);
ALTER TABLE "Task" ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Task" ADD COLUMN     "startedAt" TIMESTAMP(3);
ALTER TABLE "Task" ADD COLUMN     "revisionCount" INTEGER NOT NULL DEFAULT 0;

-- ---------------------------------------------------------------------------
-- New tables
-- ---------------------------------------------------------------------------
CREATE TABLE "TaskComment" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "taskId" UUID NOT NULL,
    "authorId" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskComment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TaskAttachment" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "taskId" UUID NOT NULL,
    "uploadedById" UUID NOT NULL,
    "fileName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskAttachment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TaskEvent" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "taskId" UUID NOT NULL,
    "actorId" UUID,
    "action" TEXT NOT NULL,
    "fromStatus" "TaskStatus",
    "toStatus" "TaskStatus",
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskEvent_pkey" PRIMARY KEY ("id")
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
CREATE INDEX "Task_companyId_teamId_status_idx" ON "Task"("companyId", "teamId", "status");
CREATE INDEX "Task_companyId_status_dueDate_idx" ON "Task"("companyId", "status", "dueDate");
CREATE INDEX "Task_companyId_assigneeId_dueDate_idx" ON "Task"("companyId", "assigneeId", "dueDate");
CREATE INDEX "Task_companyId_priority_dueDate_idx" ON "Task"("companyId", "priority", "dueDate");

CREATE INDEX "TaskComment_companyId_taskId_createdAt_idx" ON "TaskComment"("companyId", "taskId", "createdAt");
CREATE INDEX "TaskComment_companyId_authorId_idx" ON "TaskComment"("companyId", "authorId");
CREATE INDEX "TaskAttachment_companyId_taskId_createdAt_idx" ON "TaskAttachment"("companyId", "taskId", "createdAt");
CREATE INDEX "TaskEvent_companyId_taskId_createdAt_idx" ON "TaskEvent"("companyId", "taskId", "createdAt");

-- ---------------------------------------------------------------------------
-- Foreign keys
-- ---------------------------------------------------------------------------
ALTER TABLE "TaskComment" ADD CONSTRAINT "TaskComment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TaskComment" ADD CONSTRAINT "TaskComment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TaskComment" ADD CONSTRAINT "TaskComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TaskAttachment" ADD CONSTRAINT "TaskAttachment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TaskAttachment" ADD CONSTRAINT "TaskAttachment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TaskAttachment" ADD CONSTRAINT "TaskAttachment_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TaskEvent" ADD CONSTRAINT "TaskEvent_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TaskEvent" ADD CONSTRAINT "TaskEvent_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TaskEvent" ADD CONSTRAINT "TaskEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
