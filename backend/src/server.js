import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server attivo su http://localhost:${PORT}`);
});


/*import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
import cors from "cors";
import { pool } from "./db.js";

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server attivo su http://localhost:${PORT}`);
});

app.get("/api/categorie/", async (req, res) => {
  try {
    console.log("ciao");
    const [rows] = await pool.query("SELECT id_categoria, denominazione FROM categoria");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore nel caricamento delle categorie" });
  }
});*/