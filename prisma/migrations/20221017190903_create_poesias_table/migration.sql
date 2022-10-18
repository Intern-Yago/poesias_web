-- CreateTable
CREATE TABLE `Poetrys` (
    `id` VARCHAR(191) NOT NULL,
    `autor` VARCHAR(191) NOT NULL,
    `mensagem` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
