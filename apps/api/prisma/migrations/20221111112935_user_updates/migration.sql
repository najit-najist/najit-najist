/*
  Warnings:

  - You are about to drop the column `lastLoggedId` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "UserStates" ADD VALUE 'SUBSCRIBED';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "lastLoggedId",
ADD COLUMN     "lastLoggedIn" TIMESTAMP(3),
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "role" DROP NOT NULL;
