CREATE TYPE "AuthorStatus" AS ENUM ('NONE', 'PENDING', 'APPROVED', 'REJECTED');

ALTER TABLE "User"
  ADD COLUMN "authorStatus" "AuthorStatus" NOT NULL DEFAULT 'NONE',
  ADD COLUMN "authorAppliedAt" TIMESTAMP(3),
  ADD COLUMN "authorReviewedAt" TIMESTAMP(3);

CREATE INDEX "User_authorStatus_idx" ON "User"("authorStatus");