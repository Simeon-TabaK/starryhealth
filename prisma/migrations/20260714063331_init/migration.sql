/*
  Warnings:

  - You are about to drop the column `fName` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `lName` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `pName` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Testimony` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `middleName` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `Testimony` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Testimony" DROP CONSTRAINT "Testimony_userId_fkey";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "fName",
DROP COLUMN "lName",
DROP COLUMN "pName",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "middleName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Testimony" DROP COLUMN "userId",
ADD COLUMN     "profileId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ClientAccess" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "subdomain" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientAccess_code_key" ON "ClientAccess"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ClientAccess_subdomain_key" ON "ClientAccess"("subdomain");

-- AddForeignKey
ALTER TABLE "Testimony" ADD CONSTRAINT "Testimony_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAccess" ADD CONSTRAINT "ClientAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
