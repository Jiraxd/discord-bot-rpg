/*
  Warnings:

  - You are about to drop the column `userId` on the `quests` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[activeForUserId]` on the table `quests` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "quests" DROP CONSTRAINT "quests_userId_fkey";

-- DropIndex
DROP INDEX "quests_userId_key";

-- AlterTable
ALTER TABLE "quests" DROP COLUMN "userId",
ADD COLUMN     "activeForUserId" TEXT,
ADD COLUMN     "availableForUserId" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "startedAt" DROP NOT NULL,
ALTER COLUMN "startedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "questId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "quests_activeForUserId_key" ON "quests"("activeForUserId");

-- AddForeignKey
ALTER TABLE "quests" ADD CONSTRAINT "quests_activeForUserId_fkey" FOREIGN KEY ("activeForUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quests" ADD CONSTRAINT "quests_availableForUserId_fkey" FOREIGN KEY ("availableForUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
