import express from "express";
import { pool } from "../db.js";
const router = express.Router();

// Route per ottenere tutti i prodotti o filtrare per categoria tramite query string
router.get("/", async (req, res) => {
  try {
    const { id_categoria } = req.query; // CAMBIATO: da categoriaId a id_categoria
    let query = "SELECT * FROM prodotto";
    const params = [];
    if (id_categoria) {
      query += " WHERE id_categoria = ?";
      params.push(id_categoria);
    }
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore nel recupero dei prodotti" });
  }
});

// Route per ottenere prodotti di una categoria tramite parametro URL
router.get("/categoria/:id_categoria", async (req, res) => {
  try {
    const { id_categoria } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM prodotto WHERE id_categoria = ?",
      [id_categoria]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore nel recupero dei prodotti per categoria" });
  }
});

export default router;