import express from "express";
import { pool } from "../db.js";
const router = express.Router();

// DELETE /api/prodotti/:id_prodotto - elimina un prodotto
router.delete('/:id_prodotto', async (req, res) => {
  const id_prodotto = req.params.id_prodotto;
  try {
    const [result] = await pool.query('DELETE FROM prodotto WHERE id_prodotto = ?', [id_prodotto]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }
    res.json({ message: 'Prodotto eliminato' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore durante l\'eliminazione del prodotto' });
  }
});

// Route per ottenere tutti i prodotti o filtrare per categoria tramite query string
router.get("/", async (req, res) => {
  try {
    const { id_categoria } = req.query;
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

// POST /api/prodotti
router.post("/", async (req, res) => {
  const { nome, prezzo, id_categoria, img_prodotto, descrizione } = req.body;
  if (!nome || !prezzo || !id_categoria) {
    return res.status(400).json({ message: "Nome, prezzo e categoria obbligatori" });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO prodotto (nome, prezzo, id_categoria, img_prodotto, descrizione) VALUES (?, ?, ?, ?, ?)",
      [nome, prezzo, id_categoria, img_prodotto || null, descrizione || null]
    );
    res.status(201).json({ id_prodotto: result.insertId, nome, prezzo, id_categoria, img_prodotto, descrizione });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore nell'inserimento del prodotto" });
  }
});

// PUT /api/prodotti/:id_prodotto
router.put("/:id_prodotto", async (req, res) => {
  const { id_prodotto } = req.params;
  const { nome, prezzo, id_categoria, img_prodotto, descrizione } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE prodotto SET nome=?, prezzo=?, id_categoria=?, img_prodotto=?, descrizione=? WHERE id_prodotto=?",
      [nome, prezzo, id_categoria, img_prodotto || null, descrizione || null, id_prodotto]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Prodotto non trovato" });
    }
    res.json({ message: "Prodotto aggiornato" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore nell'aggiornamento del prodotto" });
  }
});

export default router;
