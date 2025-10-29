import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/* GET tutti gli ordini */
router.get("/", async (req, res) => {
  try {
    const ordini = await prisma.ordine.findMany({
      include: { ordiniprodotti: { include: { prodotto: true } } },
      orderBy: { data_ordine: "desc" },
    });
    res.json(ordini);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore nel caricamento degli ordini" });
  }
});

/* GET ordini per ombrellone e sessione */
router.get("/ombrellone/:id_ombrellone/:id_sessione", async (req, res) => {
  const id_ombrellone = parseInt(req.params.id_ombrellone, 10);
  const id_sessione = req.params.id_sessione;

  try {
    const ordini = await prisma.ordine.findMany({
      where: { id_ombrellone, id_sessione },
      include: { ordiniprodotti: { include: { prodotto: true } } },
      orderBy: { data_ordine: "desc" },
    });

    if (ordini.length === 0) return res.status(404).json([]);
    res.json(ordini);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore caricamento ordini per ombrellone" });
  }
});

/* ✅ GET ordine singolo per ID */
router.get("/:id_ordine", async (req, res) => {
  const id_ordine = parseInt(req.params.id_ordine, 10);

  try {
    const ordine = await prisma.ordine.findUnique({
      where: { id_ordine },
      include: {
        ordiniprodotti: {
          include: { prodotto: true },
        },
      },
    });

    if (!ordine) return res.status(404).json({ error: "Ordine non trovato" });
    res.json(ordine);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore nel caricamento dell'ordine" });
  }
});


/* POST crea nuovo ordine */
router.post("/", async (req, res) => {
  let { id_ombrellone, prodotti, metodoPagamento, id_sessione } = req.body;

  if (typeof id_ombrellone === "string") id_ombrellone = parseInt(id_ombrellone, 10);

  if (!id_ombrellone || !Array.isArray(prodotti) || prodotti.length === 0 || !id_sessione) {
    return res.status(400).json({ error: "Dati ordine incompleti" });
  }

  try {
    const ordine = await prisma.ordine.create({
      data: {
        id_ombrellone,
        stato_ordine: "in attesa",
        metodoPagamento,
        id_sessione,
        data_ordine: new Date(),
        ordiniprodotti: {
          create: prodotti.map(p => ({
            id_prodotto: p.id_prodotto,
            quantita: p.quantita,
            prezzo: p.prezzo ?? 0,
          })),
        },
      },
      include: { ordiniprodotti: { include: { prodotto: true } } },
    });

    res.status(201).json(ordine);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore nella creazione dell'ordine", details: err.message });
  }
});

/* PATCH aggiorna lo stato di un ordine */
router.patch("/:id_ordine", async (req, res) => {
  const id_ordine = parseInt(req.params.id_ordine, 10);
  const { stato_ordine } = req.body;

  if (!stato_ordine) {
    return res.status(400).json({ error: "Stato ordine mancante" });
  }

  try {
    const ordineAggiornato = await prisma.ordine.update({
      where: { id_ordine },
      data: { stato_ordine },
      include: { ordiniprodotti: { include: { prodotto: true } } },
    });

    res.json(ordineAggiornato);
  } catch (err) {
    console.error(err);
    if (err.code === "P2025") { // Prisma: record non trovato
      return res.status(404).json({ error: "Ordine non trovato" });
    }
    res.status(500).json({ error: "Errore aggiornamento ordine", details: err.message });
  }
});


export default router;
