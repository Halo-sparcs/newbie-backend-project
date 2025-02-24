/*
  Warnings:

  - Added the required column `borrower_id` to the `Borrow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `borrow` ADD COLUMN `borrower_id` INTEGER NOT NULL;
