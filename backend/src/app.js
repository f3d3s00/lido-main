// backend/src/app.js
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

import categorieRouter from "./routes/categorieRouter.js";
import prodottiRouter from "./routes/prodottiRouter.js";
import ordineRouter from "./routes/ordiniRouter.js";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rotte principali
app.use("/api/categorie", categorieRouter);
app.use("/api/prodotti", prodottiRouter);
app.use("/api/ordini", ordineRouter);

// Rotta di test
app.get("/", (req, res) => {
  res.send("Backend attivo e funzionante");
});

export default app;
