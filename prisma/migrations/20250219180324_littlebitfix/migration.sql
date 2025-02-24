/*
  Warnings:

  - You are about to drop the column `amount` on the `return` table. All the data in the column will be lost.
  - Added the required column `owner_id` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `log` ADD COLUMN `owner_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `return` DROP COLUMN `amount`;
