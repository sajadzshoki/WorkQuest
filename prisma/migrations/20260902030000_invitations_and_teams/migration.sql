-- ---------------------------------------------------------------------------
-- WorkQuest — employee invitations and team management
--
-- * `Invitation` holds a pending employee invitation. It is intentionally not a
--   `User` row: the invitee has no account yet and may be invited by several
--   companies at once.
-- * `pendingPhone` is set while the invitation is open and nulled afterwards,
--   so the unique index enforces "one open invitation per company + phone"
--   while keeping the history of closed ones (NULLs are distinct in Postgres
--   unique indexes).
-- * One primary team per employee: `TeamMember` gains a unique
--   (companyId, userId). The seed data already satisfies it.
--
-- NOTE: authored to match Prisma's PostgreSQL conventions exactly. Regenerate
-- with `npm run db:migrate` on any machine that can download the Prisma
-- schema-engine binary.
-- ---------------------------------------------------------------------------

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REVOKED', 'EXPIRED');

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'INVITATION';
ALTER TYPE "NotificationType" ADD VALUE 'TEAM_UPDATE';

-- CreateTable
CREATE TABLE "Invitation" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "phone" TEXT NOT NULL,
    "pendingPhone" TEXT,
    "fullName" TEXT NOT NULL,
    "jobTitle" TEXT,
    "teamId" UUID,
    "role" "UserRole" NOT NULL DEFAULT 'EMPLOYEE',
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "invitedById" UUID NOT NULL,
    "acceptedById" UUID,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_companyId_pendingPhone_key" ON "Invitation"("companyId", "pendingPhone");

-- CreateIndex
CREATE INDEX "Invitation_companyId_status_idx" ON "Invitation"("companyId", "status");

-- CreateIndex
CREATE INDEX "Invitation_phone_status_idx" ON "Invitation"("phone", "status");

-- CreateIndex
CREATE INDEX "Invitation_expiresAt_idx" ON "Invitation"("expiresAt");

-- CreateIndex: one primary team per employee
CREATE UNIQUE INDEX "TeamMember_companyId_userId_key" ON "TeamMember"("companyId", "userId");

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_acceptedById_fkey" FOREIGN KEY ("acceptedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
