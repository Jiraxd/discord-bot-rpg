/*
  Warnings:

  - You are about to drop the column `questId` on the `users` table. All the data in the column will be lost.
  - Added the required column `itemId` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "items" ADD COLUMN     "itemId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "questId";
