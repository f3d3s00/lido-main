// src/routes/richiesteCameriere.js
import express from "express";

const router = express.Router();

// Array fittizio in memoria (poi lo sostituirai con DB)
let richieste = [];

// POST /api/richiesteCameriere
router.post("/", (req, res) => {
  try {
    const { id_ombrellone } = req.body;
    if (!id_ombrellone) {
      return res.status(400).json({ error: "id_ombrellone mancante" });
    }

    const nuovaRichiesta = {
      id_richiesta: richieste.length + 1,
      id_ombrellone,
      richiesta: "Chiamata cameriere",
    };

    richieste.push(nuovaRichiesta);

    console.log(`Richiesta cameriere per ombrellone ${id_ombrellone}`);
    res.status(200).json(nuovaRichiesta);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore server" });
  }
});

// GET /api/richiesteCameriere
router.get("/", (req, res) => {
  res.json(richieste);
});

// DELETE /api/richiesteCameriere/:id
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  richieste = richieste.filter(r => r.id_richiesta !== parseInt(id));
  res.json({ success: true });
});

export default router;
