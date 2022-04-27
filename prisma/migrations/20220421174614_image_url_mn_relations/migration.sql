/*
  Warnings:

  - The primary key for the `enrollment_requests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `enrollment_requests` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `_UserSavesevent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_eventHasParticipants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `username` on table `enrollment_requests` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_authorUsername_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_parentCommentId_fkey";

-- DropForeignKey
ALTER TABLE "_UserSavesevent" DROP CONSTRAINT "_UserSavesevent_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserSavesevent" DROP CONSTRAINT "_UserSavesevent_B_fkey";

-- DropForeignKey
ALTER TABLE "_eventHasParticipants" DROP CONSTRAINT "_eventHasParticipants_A_fkey";

-- DropForeignKey
ALTER TABLE "_eventHasParticipants" DROP CONSTRAINT "_eventHasParticipants_B_fkey";

-- DropForeignKey
ALTER TABLE "enrollment_requests" DROP CONSTRAINT "enrollment_requests_eventId_fkey";

-- DropForeignKey
ALTER TABLE "enrollment_requests" DROP CONSTRAINT "enrollment_requests_username_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_authorUsername_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_receiverUsername_fkey";

-- AlterTable
ALTER TABLE "enrollment_requests" DROP CONSTRAINT "enrollment_requests_pkey",
DROP COLUMN "id",
ALTER COLUMN "username" SET NOT NULL,
ADD CONSTRAINT "enrollment_requests_pkey" PRIMARY KEY ("eventId", "username");

-- AlterTable
ALTER TABLE "events" DROP COLUMN "images",
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "images",
ADD COLUMN     "imageUrl" TEXT;

-- DropTable
DROP TABLE "_UserSavesevent";

-- DropTable
DROP TABLE "_eventHasParticipants";

-- DropTable
DROP TABLE "notifications";

-- DropEnum
DROP TYPE "NotificationType";

-- CreateTable
CREATE TABLE "UserSaveEvent" (
    "eventId" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "UserSaveEvent_pkey" PRIMARY KEY ("eventId","username")
);

-- CreateTable
CREATE TABLE "UserEnrolledEvent" (
    "eventId" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "UserEnrolledEvent_pkey" PRIMARY KEY ("eventId","username")
);

-- AddForeignKey
ALTER TABLE "UserSaveEvent" ADD CONSTRAINT "UserSaveEvent_username_fkey" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSaveEvent" ADD CONSTRAINT "UserSaveEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEnrolledEvent" ADD CONSTRAINT "UserEnrolledEvent_username_fkey" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEnrolledEvent" ADD CONSTRAINT "UserEnrolledEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_authorUsername_fkey" FOREIGN KEY ("authorUsername") REFERENCES "users"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorUsername_fkey" FOREIGN KEY ("authorUsername") REFERENCES "users"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment_requests" ADD CONSTRAINT "enrollment_requests_username_fkey" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment_requests" ADD CONSTRAINT "enrollment_requests_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
