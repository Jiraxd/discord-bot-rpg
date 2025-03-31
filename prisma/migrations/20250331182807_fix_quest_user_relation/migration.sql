-- CreateEnum
CREATE TYPE "CharacterClass" AS ENUM ('MAGE', 'WARRIOR', 'ARCHER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "money" INTEGER NOT NULL DEFAULT 0,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "class" "CharacterClass",
    "health" INTEGER NOT NULL DEFAULT 100,
    "maxHealth" INTEGER NOT NULL DEFAULT 100,
    "attack" INTEGER NOT NULL DEFAULT 10,
    "defense" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "state" INTEGER[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quests" (
    "id" SERIAL NOT NULL,
    "questId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "quests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quests_userId_key" ON "quests"("userId");

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quests" ADD CONSTRAINT "quests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
