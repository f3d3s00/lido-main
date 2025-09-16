// PATCH /api/ordini/:id - aggiorna lo stato di un ordine

// PATCH /api/ordini/:id - aggiorna lo stato di un ordine


import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/ordini - restituisce tutti gli ordini con prodotti associati
router.get("/", async (req, res) => {
  try {
    const ordini = await prisma.ordine.findMany({
      include: {
        ordiniprodotti: {
          include: {
            prodotto: true
          }
        }
      },
      orderBy: { data_ordine: "desc" }
    });
    res.json(ordini);
  } catch (err) {
    console.error("Errore caricamento ordini:", err);
    res.status(500).json({ error: "Errore nel caricamento degli ordini" });
  }
});

router.patch("/:id", async (req, res) => {
  const id_ordine = parseInt(req.params.id, 10);
  const { stato_ordine } = req.body;
  if (!stato_ordine) {
    return res.status(400).json({ error: "stato_ordine richiesto" });
  }
  try {
    const ordine = await prisma.ordine.update({
      where: { id_ordine },
      data: { stato_ordine },
    });
    res.json(ordine);
  } catch (err) {
    console.error("Errore aggiornamento stato ordine:", err);
    res.status(500).json({ error: "Errore aggiornamento stato ordine" });
  }
});

// POST /api/ordini - crea un nuovo ordine
router.post("/", async (req, res) => {
  let { id_ombrellone, metodoPagamento, prodotti } = req.body;
  // Forza id_ombrellone a intero se possibile
  if (typeof id_ombrellone === "string") {
    id_ombrellone = parseInt(id_ombrellone, 10);
  }

  // Validazione base
  if (!id_ombrellone || !prodotti || !prodotti.length) {
    return res.status(400).json({ error: "Dati ordine incompleti" });
  }

  try {
    // Creazione ordine principale usando il modello ordine (singolare)
    const ordine = await prisma.ordine.create({
      data: {
        id_ombrellone,
        stato_ordine: "in attesa",
        data_ordine: new Date(),
        ordiniprodotti: {
          create: prodotti.map((p) => ({
            id_prodotto: p.id_prodotto,
            quantita: p.quantita,
            prezzo: p.prezzo,
          })),
        },
      },
      include: { ordiniprodotti: true },
    });

    res.status(201).json(ordine);
  } catch (err) {
    console.error("Errore creazione ordine:", err);
    res.status(500).json({ error: "Errore nella creazione dell'ordine" });
  }
});

export default router;
