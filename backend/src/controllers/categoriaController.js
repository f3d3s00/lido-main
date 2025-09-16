import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.categoria.findMany();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore caricamento categorie" });
  }
};
