/*
  Warnings:

  - You are about to drop the column `defaultId` on the `UserProduct` table. All the data in the column will be lost.
  - Added the required column `productId` to the `UserProduct` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserProduct" DROP CONSTRAINT "UserProduct_defaultId_fkey";

-- AlterTable
ALTER TABLE "UserProduct" DROP COLUMN "defaultId",
ADD COLUMN     "productId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UserProduct" ADD CONSTRAINT "UserProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
