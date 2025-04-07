-- AlterTable
ALTER TABLE `diemdanh` ADD COLUMN `faceID` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `sv` ADD COLUMN `faceID` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'TEACHER', 'STUDENT') NOT NULL DEFAULT 'ADMIN',
    `mssv` VARCHAR(191) NULL,
    `mgv` VARCHAR(191) NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_mssv_key`(`mssv`),
    UNIQUE INDEX `User_mgv_key`(`mgv`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_mssv_fkey` FOREIGN KEY (`mssv`) REFERENCES `SV`(`mssv`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_mgv_fkey` FOREIGN KEY (`mgv`) REFERENCES `GV`(`mgv`) ON DELETE SET NULL ON UPDATE CASCADE;
