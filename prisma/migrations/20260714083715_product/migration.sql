/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId]` on the table `UserProduct` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserProduct_userId_productId_key" ON "UserProduct"("userId", "productId");
