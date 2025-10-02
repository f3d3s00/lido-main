// src/routes/ombrellone.js
import express from "express";
const router = express.Router();

// Endpoint per restituire un id_ombrellone (qui puoi sostituire con una query al DB)
router.get("/", async (req, res) => {
  try {
    // Esempio statico: in produzione prendi dal DB
    const idOmbrellone = 5; 
    res.json({ id_ombrellone: idOmbrellone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore nel recupero dell'ombrellone" });
  }
});

export default router;
