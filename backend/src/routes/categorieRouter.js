import express from "express";
import { pool } from "../db.js";

const router = express.Router();

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