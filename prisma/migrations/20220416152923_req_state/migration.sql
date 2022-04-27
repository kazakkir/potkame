-- CreateEnum
CREATE TYPE "EnrollmentRequestState" AS ENUM ('PROCESSING', 'DECLINED', 'ACCEPTED');

-- AlterTable
ALTER TABLE "enrollment_requests" ADD COLUMN     "state" "EnrollmentRequestState" NOT NULL DEFAULT E'PROCESSING';
