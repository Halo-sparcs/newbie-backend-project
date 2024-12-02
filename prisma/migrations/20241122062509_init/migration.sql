-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `user_pwd` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `banned` BOOLEAN NOT NULL DEFAULT false,
    `score` DOUBLE NULL,
    `contact` VARCHAR(191) NOT NULL,
    `place` VARCHAR(191) NULL,

    UNIQUE INDEX `Users_user_id_key`(`user_id`),
    UNIQUE INDEX `Users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Posts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `owner` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
