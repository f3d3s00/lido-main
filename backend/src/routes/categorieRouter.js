
import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// DELETE /api/categorie/:id_categoria - elimina una categoria
router.delete('/:id_categoria', async (req, res) => {
  const id_categoria = req.params.id_categoria;
  try {
    const [result] = await pool.query('DELETE FROM categoria WHERE id_categoria = ?', [id_categoria]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Categoria non trovata' });
    }
    res.json({ message: 'Categoria eliminata' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore durante l\'eliminazione della categoria' });
  }
});

router.get("/", async (req, res) => {
  try {
    // Ora il campo si chiama id_categoria
    const [rows] = await pool.query("SELECT id_categoria, denominazione FROM categoria");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore nel caricamento delle categorie" });
  }
});

export default router;