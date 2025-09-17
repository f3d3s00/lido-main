import { useState, useEffect } from "react";

export default function GestionePage() {
  // Stati per ordini, categorie, prodotti
  const [ordini, setOrdini] = useState([]);
  const [categorie, setCategorie] = useState([]);
  const [prodotti, setProdotti] = useState([]);
  const [newCategoria, setNewCategoria] = useState("");
  const [newProdotto, setNewProdotto] = useState({ descrizione: "", prezzo: "", id_categoria: "", img_prodotto: "" });
  const [editProdotto, setEditProdotto] = useState(null);
  const [editCategoria, setEditCategoria] = useState(null);
  const [message, setMessage] = useState("");

  // Carica dati all'avvio
  useEffect(() => {
    fetchOrdini();
    fetchCategorie();
    fetchProdotti();
  }, []);

  const fetchOrdini = async () => {
    try {
      console.log("sto chiamando fetch ordini")
      const res = await fetch("http://localhost:4000/api/ordini");
      if (!res.ok) throw new Error(`Errore API ordini: ${res.status}`);
      setOrdini(await res.json());
    } catch (err) {
      console.error("Errore caricamento ordini:", err);
      setMessage("Errore caricamento ordini");
    }
  };
  

  setTimeout(() => fetchOrdini(), 4000);
  
  const fetchCategorie = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/categorie");
      if (!res.ok) throw new Error(`Errore API categorie: ${res.status}`);
      setCategorie(await res.json());
    } catch (err) {
      console.error("Errore caricamento categorie:", err);
      setMessage("Errore caricamento categorie");
    }
  };
  const fetchProdotti = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/prodotti");
      if (!res.ok) throw new Error(`Errore API prodotti: ${res.status}`);
      setProdotti(await res.json());
    } catch (err) {
      console.error("Errore caricamento prodotti:", err);
      setMessage("Errore caricamento prodotti");
    }
  };

  // ORDINI
  const aggiornaStatoOrdine = async (id_ordine, stato_ordine) => {
    await fetch(`http://localhost:4000/api/ordini/${id_ordine}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stato_ordine }),
    });
    fetchOrdini();
  };

  // CATEGORIE
  const aggiungiCategoria = async () => {
    if (!newCategoria.trim()) return;
    await fetch("http://localhost:4000/api/categorie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ denominazione: newCategoria }),
    });
    setNewCategoria("");
    fetchCategorie();
  };
  const eliminaCategoria = async (id_categoria) => {
    await fetch(`http://localhost:4000/api/categorie/${id_categoria}`, { method: "DELETE" });
    fetchCategorie();
  };
  const salvaModificaCategoria = async () => {
    await fetch(`http://localhost:4000/api/categorie/${editCategoria.id_categoria}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ denominazione: editCategoria.denominazione }),
    });
    setEditCategoria(null);
    fetchCategorie();
  };

  // PRODOTTI
  const aggiungiProdotto = async () => {
    if (!newProdotto.descrizione || !newProdotto.prezzo || !newProdotto.id_categoria) return;
    await fetch("http://localhost:4000/api/prodotti", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        descrizione: newProdotto.descrizione,
        prezzo: parseFloat(newProdotto.prezzo),
        id_categoria: parseInt(newProdotto.id_categoria),
        img_prodotto: newProdotto.img_prodotto,
      }),
    });
    setNewProdotto({ descrizione: "", prezzo: "", id_categoria: "", img_prodotto: "" });
    fetchProdotti();
  };
  const eliminaProdotto = async (id_prodotto) => {
    await fetch(`http://localhost:4000/api/prodotti/${id_prodotto}`, { method: "DELETE" });
    fetchProdotti();
  };
  const salvaModificaProdotto = async () => {
    await fetch(`http://localhost:4000/api/prodotti/${editProdotto.id_prodotto}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        descrizione: editProdotto.descrizione,
        prezzo: parseFloat(editProdotto.prezzo),
        id_categoria: parseInt(editProdotto.id_categoria),
        img_prodotto: editProdotto.img_prodotto,
      }),
    });
    setEditProdotto(null);
    fetchProdotti();
  };

  return (
    <div className="p-6 bg-gradient-to-b from-lime-50 to-lime-600 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-lime-700">Gestione Lido</h1>
      {message && <div className="mb-4 text-green-600 font-semibold">{message}</div>}

      {/* ORDINI */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-lime-800">Ordini</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead>
              <tr className="bg-lime-100">
                <th className="p-2">ID</th>
                <th className="p-2">Ombrellone</th>
                <th className="p-2">Data</th>
                <th className="p-2">Stato</th>
                <th className="p-2">Prodotti</th>
                <th className="p-2">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {ordini.map((o) => (
                <tr key={o.id_ordine} className="border-b">
                  <td className="p-2">{o.id_ordine}</td>
                  <td className="p-2">{o.id_ombrellone}</td>
                  <td className="p-2">{new Date(o.data_ordine).toLocaleString()}</td>
                  <td className="p-2 font-semibold">{o.stato_ordine}</td>
                  <td className="p-2">
                    <ul className="list-disc ml-4">
                      {(o.ordiniprodotti || o.ordini_prodotti || []).map((p, idx) => (
                        <li key={idx}>{p.quantita} x {p.prodotto?.descrizione || p.id_prodotto}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-2 space-x-2">
                    <button onClick={() => aggiornaStatoOrdine(o.id_ordine, "in preparazione")} className="bg-yellow-300 px-2 py-1 rounded">Prepara</button>
                    <button onClick={() => aggiornaStatoOrdine(o.id_ordine, "servito")} className="bg-blue-300 px-2 py-1 rounded">Servito</button>
                    <button onClick={() => aggiornaStatoOrdine(o.id_ordine, "completato")} className="bg-green-400 px-2 py-1 rounded">Completa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CATEGORIE */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-lime-800">Categorie</h2>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            className="border rounded px-2 py-1"
            placeholder="Nuova categoria"
            value={newCategoria}
            onChange={e => setNewCategoria(e.target.value)}
          />
          <button onClick={aggiungiCategoria} className="bg-lime-500 text-white px-3 py-1 rounded">Aggiungi</button>
        </div>
        <ul className="bg-white rounded-xl shadow divide-y">
          {categorie.map((cat) => (
            <li key={cat.id_categoria} className="flex items-center justify-between p-2">
              {editCategoria && editCategoria.id_categoria === cat.id_categoria ? (
                <>
                  <input
                    type="text"
                    className="border rounded px-2 py-1"
                    value={editCategoria.denominazione}
                    onChange={e => setEditCategoria({ ...editCategoria, denominazione: e.target.value })}
                  />
                  <button onClick={salvaModificaCategoria} className="ml-2 bg-lime-400 px-2 py-1 rounded">Salva</button>
                  <button onClick={() => setEditCategoria(null)} className="ml-2 text-gray-500">Annulla</button>
                </>
              ) : (
                <>
                  <span>{cat.denominazione}</span>
                  <div>
                    <button onClick={() => setEditCategoria(cat)} className="text-blue-500 mr-2">Modifica</button>
                    <button onClick={() => eliminaCategoria(cat.id_categoria)} className="text-red-500">Elimina</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* PRODOTTI */}
      <section>
        <h2 className="text-xl font-semibold mb-2 text-lime-800">Prodotti</h2>
        <div className="flex gap-2 mb-2 flex-wrap">
          <input
            type="text"
            className="border rounded px-2 py-1"
            placeholder="Descrizione"
            value={newProdotto.descrizione}
            onChange={e => setNewProdotto({ ...newProdotto, descrizione: e.target.value })}
          />
          <input
            type="number"
            className="border rounded px-2 py-1"
            placeholder="Prezzo"
            value={newProdotto.prezzo}
            onChange={e => setNewProdotto({ ...newProdotto, prezzo: e.target.value })}
          />
          <select
            className="border rounded px-2 py-1"
            value={newProdotto.id_categoria}
            onChange={e => setNewProdotto({ ...newProdotto, id_categoria: e.target.value })}
          >
            <option value="">Categoria</option>
            {categorie.map(cat => (
              <option key={cat.id_categoria} value={cat.id_categoria}>{cat.denominazione}</option>
            ))}
          </select>
          <input
            type="text"
            className="border rounded px-2 py-1"
            placeholder="URL immagine"
            value={newProdotto.img_prodotto}
            onChange={e => setNewProdotto({ ...newProdotto, img_prodotto: e.target.value })}
          />
          <button onClick={aggiungiProdotto} className="bg-lime-500 text-white px-3 py-1 rounded">Aggiungi</button>
        </div>
        <ul className="bg-white rounded-xl shadow divide-y">
          {prodotti.map((prod) => (
            <li key={prod.id_prodotto} className="flex items-center justify-between p-2">
              {editProdotto && editProdotto.id_prodotto === prod.id_prodotto ? (
                <>
                  <input
                    type="text"
                    className="border rounded px-2 py-1"
                    value={editProdotto.descrizione}
                    onChange={e => setEditProdotto({ ...editProdotto, descrizione: e.target.value })}
                  />
                  <input
                    type="number"
                    className="border rounded px-2 py-1 ml-2"
                    value={editProdotto.prezzo}
                    onChange={e => setEditProdotto({ ...editProdotto, prezzo: e.target.value })}
                  />
                  <select
                    className="border rounded px-2 py-1 ml-2"
                    value={editProdotto.id_categoria}
                    onChange={e => setEditProdotto({ ...editProdotto, id_categoria: e.target.value })}
                  >
                    <option value="">Categoria</option>
                    {categorie.map(cat => (
                      <option key={cat.id_categoria} value={cat.id_categoria}>{cat.denominazione}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className="border rounded px-2 py-1 ml-2"
                    value={editProdotto.img_prodotto}
                    onChange={e => setEditProdotto({ ...editProdotto, img_prodotto: e.target.value })}
                  />
                  <button onClick={salvaModificaProdotto} className="ml-2 bg-lime-400 px-2 py-1 rounded">Salva</button>
                  <button onClick={() => setEditProdotto(null)} className="ml-2 text-gray-500">Annulla</button>
                </>
              ) : (
                <>
                  <span>{prod.descrizione} - €{Number(prod.prezzo).toFixed(2)} - {prod.id_categoria && categorie.find(c => c.id_categoria === prod.id_categoria)?.denominazione}</span>
                  <div>
                    <button onClick={() => setEditProdotto(prod)} className="text-blue-500 mr-2">Modifica</button>
                    <button onClick={() => eliminaProdotto(prod.id_prodotto)} className="text-red-500">Elimina</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
