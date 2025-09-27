// backend/src/app.js
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";

import categorieRouter from "./routes/categorieRouter.js";
import prodottiRouter from "./routes/prodottiRouter.js";
import ordineRouter from "./routes/ordiniRouter.js";
import uplodRouter from "./routes/uplodRouter.js";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rotte principali
app.use("/api/categorie", categorieRouter);
app.use("/api/prodotti", prodottiRouter);
app.use("/api/ordini", ordineRouter);
app.use("/api/upload", uplodRouter);


//upload
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve la cartella uploads (corretto)
app.use("/uploads", express.static(path.join(__dirname, "../uploads"))); 

app.use(express.json())
// Rotta di test
app.get("/", (req, res) => {
  res.send("Backend attivo e funzionante");
});

export default app;
