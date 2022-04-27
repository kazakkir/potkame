/*
  Warnings:

  - You are about to drop the `UserEnrolledEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserEnrolledEvent" DROP CONSTRAINT "UserEnrolledEvent_eventId_fkey";

-- DropForeignKey
ALTER TABLE "UserEnrolledEvent" DROP CONSTRAINT "UserEnrolledEvent_username_fkey";

-- DropTable
DROP TABLE "UserEnrolledEvent";

-- CreateTable
CREATE TABLE "UserEnrollEvent" (
    "eventId" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "UserEnrollEvent_pkey" PRIMARY KEY ("eventId","username")
);

-- AddForeignKey
ALTER TABLE "UserEnrollEvent" ADD CONSTRAINT "UserEnrollEvent_username_fkey" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEnrollEvent" ADD CONSTRAINT "UserEnrollEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
