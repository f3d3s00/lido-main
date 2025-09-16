import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getProducts = async (req, res) => {
  try {
    const { categoriaId } = req.query;
    let products;
    if (categoriaId) {
      products = await prisma.prodotto.findMany({
        where: { categoriaId: parseInt(categoriaId) },
      });
    } else {
      products = await prisma.prodotto.findMany();
    }
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore caricamento prodotti" });
  }
};
