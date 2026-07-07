/*
  Warnings:

  - You are about to drop the column `nom` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `postnom` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `prenom` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `fName` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pName` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "nom",
DROP COLUMN "postnom",
DROP COLUMN "prenom",
ADD COLUMN     "fName" TEXT NOT NULL,
ADD COLUMN     "lName" TEXT,
ADD COLUMN     "pName" TEXT NOT NULL;
