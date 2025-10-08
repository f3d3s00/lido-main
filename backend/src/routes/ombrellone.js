// src/routes/ombrellone.js
import express from "express";
import { pool as db } from "../db.js";

const router = express.Router();

/**
 * GET /api/ombrellone/occupati
 * Restituisce la lista degli ID ombrelloni attualmente occupati
 */
router.get("/occupati", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id_ombrellone
      FROM ombrellone
      WHERE stato_ombrellone = 'occupato'
      ORDER BY numero_ombrellone ASC
    `);

    const ombrelloniOccupati = rows.map(r => r.id_ombrellone);
    console.log("Ombrelloni occupati trovati:", ombrelloniOccupati);
    res.json(ombrelloniOccupati);
  } catch (err) {
    console.error("Errore nel recupero degli ombrelloni occupati:", err);
    res.status(500).json({ error: "Errore nel recupero degli ombrelloni occupati" });
  }
});

/**
 * POST /api/ombrellone/libera
 * Libera un ombrellone: imposta lo stato_ombrellone a 'libero'
 */
router.post("/libera", async (req, res) => {
  const { numero_ombrellone } = req.body;
  console.log("Libera ombrellone chiamato con:", numero_ombrellone);

  if (!numero_ombrellone) {
    return res.status(400).json({ error: "Numero ombrellone mancante" });
  }

  try {
    const [result] = await db.query(
      `
      UPDATE ombrellone
      SET stato_ombrellone = 'libero'
      WHERE id_ombrellone = ?
      `,
      [numero_ombrellone]
    );

    console.log("Righe modificate:", result.affectedRows);
    res.json({ message: `Ombrellone ${numero_ombrellone} liberato`, modifiedRows: result.affectedRows });
  } catch (err) {
    console.error("Errore durante la liberazione dell’ombrellone:", err);
    res.status(500).json({ error: "Errore durante la liberazione dell’ombrellone" });
  }
});

/**
 * GET /api/ombrellone
 * Restituisce la lista completa di tutti gli ombrelloni
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM ombrellone ORDER BY numero_ombrellone ASC");
    res.json(rows);
  } catch (err) {
    console.error("Errore nel recupero degli ombrelloni:", err);
    res.status(500).json({ error: "Errore nel recupero degli ombrelloni" });
  }
});

export default router;
