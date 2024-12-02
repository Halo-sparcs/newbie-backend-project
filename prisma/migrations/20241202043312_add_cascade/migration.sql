-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `Posts_ownerId_fkey`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `refreshToken` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Posts` ADD CONSTRAINT `Posts_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
