-- CreateTable
CREATE TABLE `Return` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `borrower_id` INTEGER NOT NULL,
    `log_id` INTEGER NOT NULL,
    `owner_id` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `apply_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
