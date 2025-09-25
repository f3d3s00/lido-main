import app from "./app.js";
import dotenv from "dotenv";
import { pool as db } from "./db.js";  

dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server attivo su http://localhost:${PORT}`);
});

// GET tutti gli ombrelloni
app.get("/api/ombrelloni", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM ombrellone ORDER BY numero_ombrellone ASC");
    console.log("Ombrelloni trovati:", rows); // debug
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Errore caricamento ombrelloni" });
  }
});

// Prenota ombrellone
app.post("/api/ombrelloni/prenota", async (req, res) => {
  const { numero_ombrellone } = req.body;
  try {
    const [rows] = await db.query(
      "SELECT stato_ombrellone FROM ombrellone WHERE numero_ombrellone = ? LIMIT 1",
      [numero_ombrellone]
    );
    if (!rows.length) return res.status(404).json({ msg: "Ombrellone non trovato" });

    if (rows[0].stato_ombrellone === "libero") {
      const [result] = await db.query(
        'UPDATE ombrellone SET stato_ombrellone="occupato" WHERE numero_ombrellone=? AND stato_ombrellone="libero"',
        [numero_ombrellone]
      );

      if (result.affectedRows === 0)
        return res.status(400).json({ msg: "Ombrellone già occupato" });

      res.json({ msg: "Ombrellone prenotato con successo" });
    } else {
      res.status(400).json({ msg: "Ombrellone già occupato" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Errore del server" });
  }
});

// Rilascia ombrellone
app.post("/api/ombrelloni/libera", async (req, res) => {
  const { numero_ombrellone } = req.body;
  try {
    await db.query(
      'UPDATE ombrellone SET stato_ombrellone="libero" WHERE numero_ombrellone=?',
      [numero_ombrellone]
    );
    res.json({ msg: "Ombrellone liberato" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Errore del server" });
  }
});
