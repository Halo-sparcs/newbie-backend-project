/*
  Warnings:

  - You are about to drop the column `returned` on the `log` table. All the data in the column will be lost.
  - Added the required column `image` to the `Posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `log` DROP COLUMN `returned`;

-- AlterTable
ALTER TABLE `posts` ADD COLUMN `image` VARCHAR(191) NOT NULL;
