/*
  Warnings:

  - A unique constraint covering the columns `[chatId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Message_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Message_chatId_key" ON "Message"("chatId");
