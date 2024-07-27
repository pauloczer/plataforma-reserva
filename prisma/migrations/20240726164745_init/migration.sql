/*
  Warnings:

  - You are about to drop the column `clientId` on the `reservation` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_clientId_fkey`;

-- AlterTable
ALTER TABLE `reservation` DROP COLUMN `clientId`,
    ADD COLUMN `userId` INTEGER NOT NULL,
    MODIFY `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
