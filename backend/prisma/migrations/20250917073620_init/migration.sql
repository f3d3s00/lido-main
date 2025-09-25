-- CreateTable
CREATE TABLE `categoria` (
    `id_categoria` INTEGER NOT NULL AUTO_INCREMENT,
    `denominazione` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_categoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ombrellone` (
    `id_ombrellone` INTEGER NOT NULL AUTO_INCREMENT,
    `fila` VARCHAR(191) NOT NULL,
    `numero_ombrellone` INTEGER NOT NULL,
    `stato_ombrellone` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_ombrellone`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ombrelloni` (
    `id_ombrellone` INTEGER NOT NULL AUTO_INCREMENT,
    `fila` VARCHAR(10) NULL,
    `numero_ombrellone` INTEGER NULL,
    `stato_ombrellone` VARCHAR(50) NULL,

    PRIMARY KEY (`id_ombrellone`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordine` (
    `id_ordine` INTEGER NOT NULL AUTO_INCREMENT,
    `id_ombrellone` INTEGER NOT NULL,
    `data_ordine` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `stato_ordine` VARCHAR(191) NOT NULL,

    INDEX `Ordine_id_ombrellone_fkey`(`id_ombrellone`),
    PRIMARY KEY (`id_ordine`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordini` (
    `id_ordine` INTEGER NOT NULL AUTO_INCREMENT,
    `id_ombrellone` INTEGER NULL,
    `data_ordine` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `stato_ordine` VARCHAR(50) NULL,

    INDEX `id_ombrellone`(`id_ombrellone`),
    PRIMARY KEY (`id_ordine`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordini_prodotti` (
    `id_ordine_prodotto` INTEGER NOT NULL AUTO_INCREMENT,
    `id_ordfine` INTEGER NULL,
    `id_prodotto` INTEGER NULL,
    `quantita` INTEGER NULL,
    `prezzo` DECIMAL(10, 2) NULL,

    INDEX `id_ordfine`(`id_ordfine`),
    INDEX `id_prodotto`(`id_prodotto`),
    PRIMARY KEY (`id_ordine_prodotto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordiniprodotti` (
    `id_ordine_prodotto` INTEGER NOT NULL AUTO_INCREMENT,
    `id_ordine` INTEGER NOT NULL,
    `id_prodotto` INTEGER NOT NULL,
    `quantita` INTEGER NOT NULL,
    `prezzo` DOUBLE NOT NULL,

    INDEX `OrdiniProdotti_id_ordine_fkey`(`id_ordine`),
    INDEX `OrdiniProdotti_id_prodotto_fkey`(`id_prodotto`),
    PRIMARY KEY (`id_ordine_prodotto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prodotto` (
    `id_prodotto` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `prezzo` DOUBLE NOT NULL,
    `disponibilita` BOOLEAN NOT NULL DEFAULT true,
    `img_prodotto` VARCHAR(191) NULL,
    `id_categoria` INTEGER NOT NULL,

    PRIMARY KEY (`id_prodotto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ordine` ADD CONSTRAINT `Ordine_id_ombrellone_fkey` FOREIGN KEY (`id_ombrellone`) REFERENCES `ombrellone`(`id_ombrellone`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ordini` ADD CONSTRAINT `ordini_ibfk_1` FOREIGN KEY (`id_ombrellone`) REFERENCES `ombrelloni`(`id_ombrellone`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ordini_prodotti` ADD CONSTRAINT `ordini_prodotti_ibfk_1` FOREIGN KEY (`id_ordfine`) REFERENCES `ordini`(`id_ordine`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ordiniprodotti` ADD CONSTRAINT `OrdiniProdotti_id_ordine_fkey` FOREIGN KEY (`id_ordine`) REFERENCES `ordine`(`id_ordine`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ordiniprodotti` ADD CONSTRAINT `OrdiniProdotti_id_prodotto_fkey` FOREIGN KEY (`id_prodotto`) REFERENCES `prodotto`(`id_prodotto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prodotto` ADD CONSTRAINT `prodotto_id_categoria_fkey` FOREIGN KEY (`id_categoria`) REFERENCES `categoria`(`id_categoria`) ON DELETE RESTRICT ON UPDATE CASCADE;
