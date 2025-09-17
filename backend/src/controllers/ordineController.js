const db = require("../db"); 

exports.createOrder = async (req, res) => {
  try {
    const { id_ombrellone, prodotti, paymentMethod } = req.body;

    if (!id_ombrellone || !prodotti || !Array.isArray(prodotti) || prodotti.length === 0) {
      return res.status(400).json({ error: "Dati ordine non validi" });
    }

    // 1️⃣ Inserisci l'ordine nella tabella ordini
    const insertOrdineQuery = `
      INSERT INTO ordine (id_ombrellone, data_ordine, stato_ordine)
      VALUES (?, NOW(), 'in attesa')
    `;

    const [ordineResult] = await db.promise().query(insertOrdineQuery, [id_ombrellone]);
    const ordineId = ordineResult.insertId;

    // 2️⃣ Inserisci ogni prodotto nella tabella ordini_prodotti
    const insertProdottoQuery = `
      INSERT INTO ordini_prodotti (id_ordine, id_prodotto, quantita, prezzo)
      VALUES (?, ?, ?, ?)
    `;

    for (let p of prodotti) {
      await db.promise().query(insertProdottoQuery, [
        ordineId,
        p.id_prodotto,
        p.quantita,
        p.prezzo,
      ]);
    }

    res.status(201).json({ message: "Ordine creato con successo", ordineId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore nella creazione dell'ordine" });
  }
};
