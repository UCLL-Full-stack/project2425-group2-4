/*
  Warnings:

  - You are about to drop the column `accepted` on the `FriendRequest` table. All the data in the column will be lost.
  - You are about to drop the column `declined` on the `FriendRequest` table. All the data in the column will be lost.
  - Added the required column `status` to the `FriendRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FriendRequest" DROP COLUMN "accepted",
DROP COLUMN "declined",
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
