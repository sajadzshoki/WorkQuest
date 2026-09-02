-- ---------------------------------------------------------------------------
-- WorkQuest — self-service registration / company onboarding
--
-- * `OtpPurpose` binds a one-time code to the flow it was requested for.
-- * `OnboardingTicket` is the single-use, server-revocable authorisation that
--   lets a freshly verified phone create a company and become its OWNER.
-- * Indexes follow the access patterns of the auth endpoints: verify looks up
--   the newest unconsumed code for (phone, purpose); login resolves a user by
--   phone across companies.
--
-- NOTE: authored to match Prisma's PostgreSQL conventions exactly. Regenerate
-- with `npm run db:migrate` on any machine that can download the Prisma
-- schema-engine binary.
-- ---------------------------------------------------------------------------

-- CreateEnum
CREATE TYPE "OtpPurpose" AS ENUM ('LOGIN', 'REGISTER');

-- AlterTable
ALTER TABLE "OtpCode" ADD COLUMN "purpose" "OtpPurpose" NOT NULL DEFAULT 'LOGIN';

-- DropIndex (superseded by the purpose-aware index below)
DROP INDEX "OtpCode_phone_createdAt_idx";

-- CreateTable
CREATE TABLE "OnboardingTicket" (
    "id" UUID NOT NULL,
    "phone" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OnboardingTicket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OtpCode_phone_purpose_createdAt_idx" ON "OtpCode"("phone", "purpose", "createdAt");

-- CreateIndex
CREATE INDEX "OtpCode_expiresAt_idx" ON "OtpCode"("expiresAt");

-- CreateIndex
CREATE INDEX "OnboardingTicket_phone_consumedAt_idx" ON "OnboardingTicket"("phone", "consumedAt");

-- CreateIndex
CREATE INDEX "OnboardingTicket_expiresAt_idx" ON "OnboardingTicket"("expiresAt");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");
