/*
  Warnings:

  - You are about to drop the column `name` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `nom` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prenom` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "name",
DROP COLUMN "profileImage",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "nom" TEXT NOT NULL,
ADD COLUMN     "postnom" TEXT,
ADD COLUMN     "prenom" TEXT NOT NULL,
ADD COLUMN     "whatsapp" TEXT;
