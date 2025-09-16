-- CreateTable
CREATE TABLE `Categoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `denominazione` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Prodotto` (
    `id_prodotto` INTEGER NOT NULL AUTO_INCREMENT,
    `descrizione` VARCHAR(191) NOT NULL,
    `prezzo` DOUBLE NOT NULL,
    `disponibilita` BOOLEAN NOT NULL DEFAULT true,
    `img_prodotto` VARCHAR(191) NULL,
    `categoriaId` INTEGER NULL,

    PRIMARY KEY (`id_prodotto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ombrellone` (
    `id_ombrellone` INTEGER NOT NULL AUTO_INCREMENT,
    `fila` VARCHAR(191) NOT NULL,
    `numero_ombrellone` INTEGER NOT NULL,
    `stato_ombrellone` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_ombrellone`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ordine` (
    `id_ordine` INTEGER NOT NULL AUTO_INCREMENT,
    `id_ombrellone` INTEGER NOT NULL,
    `data_ordine` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `stato_ordine` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_ordine`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrdiniProdotti` (
    `id_ordine_prodotto` INTEGER NOT NULL AUTO_INCREMENT,
    `id_ordine` INTEGER NOT NULL,
    `id_prodotto` INTEGER NOT NULL,
    `quantita` INTEGER NOT NULL,
    `prezzo` DOUBLE NOT NULL,

    PRIMARY KEY (`id_ordine_prodotto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Prodotto` ADD CONSTRAINT `Prodotto_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ordine` ADD CONSTRAINT `Ordine_id_ombrellone_fkey` FOREIGN KEY (`id_ombrellone`) REFERENCES `Ombrellone`(`id_ombrellone`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdiniProdotti` ADD CONSTRAINT `OrdiniProdotti_id_ordine_fkey` FOREIGN KEY (`id_ordine`) REFERENCES `Ordine`(`id_ordine`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdiniProdotti` ADD CONSTRAINT `OrdiniProdotti_id_prodotto_fkey` FOREIGN KEY (`id_prodotto`) REFERENCES `Prodotto`(`id_prodotto`) ON DELETE RESTRICT ON UPDATE CASCADE;
