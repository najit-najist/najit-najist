-- CreateEnum
CREATE TYPE "UserStates" AS ENUM ('ACTIVE', 'INVITED', 'PASSWORD_RESET', 'DEACTIVATED', 'DELETED', 'BANNED');

-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('ADMIN', 'NORMAL', 'PREMIUM');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "newsletter" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "UserStates" NOT NULL DEFAULT 'INVITED',
    "password" TEXT,
    "telephoneNumber" TEXT,
    "newsletterUuid" TEXT,
    "lastLoggedId" TIMESTAMP(3),
    "notes" TEXT,
    "role" "UserRoles" NOT NULL DEFAULT 'NORMAL',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "name" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Town" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,

    CONSTRAINT "Town_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "townId" INTEGER,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_key" ON "Region"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Address_ownerId_key" ON "Address"("ownerId");

-- AddForeignKey
ALTER TABLE "Town" ADD CONSTRAINT "Town_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_townId_fkey" FOREIGN KEY ("townId") REFERENCES "Town"("id") ON DELETE SET NULL ON UPDATE CASCADE;
