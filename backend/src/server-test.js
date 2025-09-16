// backend/src/server-test.js
import express from "express";
import cors from "cors";
import ordineRouter from "./routes/ordineRouter.js"; // ✅ importa correttamente il router

const app = express();
app.use(cors());
app.use(express.json());

// Usa il router per gli ordini
app.use("/api/ordini", ordineRouter);

// Dati finti per test
const categorie = [
  { id: 1, denominazione: "Bibite" },
  { id: 2, denominazione: "Snack" },
  { id: 3, denominazione: "Gelati" },
  { id: 4, denominazione: "Panini" },
  { id: 5, denominazione: "Insalate" },
  { id: 6, denominazione: "Dolci" },
  { id: 7, denominazione: "Altro" },
];

const prodotti = [
  { id_prodotto: 1, descrizione: "Coca Cola", prezzo: 2.5, disponibilita: true, id_categoria: 1, img_prodotto: "/img/coca.jpg" },
  { id_prodotto: 2, descrizione: "Fanta", prezzo: 2.5, disponibilita: true, id_categoria: 1, img_prodotto: "/img/fanta.jpg" },
  { id_prodotto: 3, descrizione: "Patatine", prezzo: 1.5, disponibilita: true, id_categoria: 2, img_prodotto: "/img/patatine.jpg" },
  { id_prodotto: 4, descrizione: "Cornetto", prezzo: 1.2, disponibilita: true, id_categoria: 3, img_prodotto: "/img/cornetto.jpg" },
  // ... aggiungi altri prodotti fino a 30
];

// Rotta categorie
app.get("/api/categorie", (req, res) => {
  res.json(categorie);
});

// Rotta prodotti
app.get("/api/prodotti", (req, res) => {
  const { categoriaId } = req.query;
  if (categoriaId) {
    const filtered = prodotti.filter(p => p.id_categoria === Number(categoriaId));
    return res.json(filtered);
  }
  res.json(prodotti);
});

// Avvio server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server di test attivo su http://localhost:${PORT}`));
