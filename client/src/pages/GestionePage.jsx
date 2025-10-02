import { useState, useEffect } from "react";


export default function GestionePage() {
  // Stati principali
  const [ordini, setOrdini] = useState([]);
  const [categorie, setCategorie] = useState([]);
  const [prodotti, setProdotti] = useState([]);
  const [newCategoria, setNewCategoria] = useState("");
  const [newProdotto, setNewProdotto] = useState({
    nome: "",
    prezzo: "",
    id_categoria: "",
    img_prodotto: "",
    descrizione: "",
  });
  const [editProdotto, setEditProdotto] = useState(null);
  const [editCategoria, setEditCategoria] = useState(null);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("ordini");
  const [showCompletati, setShowCompletati] = useState(false);
  const [showAnnullati, setShowAnnullati] = useState(false);

// Richieste cameriere
const [richieste, setRichieste] = useState([]);
const [error, setError] = useState(null);
const [loading, setLoading] = useState(true);


  const API_BASE = "http://localhost:4000";

  // --- FETCH DATI ---
  useEffect(() => {
    fetchOrdini();
    fetchCategorie();
    fetchProdotti();
  }, []);

  const fetchOrdini = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/ordini`);
      if (!res.ok) throw new Error(`Errore API ordini: ${res.status}`);
      setOrdini(await res.json());
    } catch (err) {
      console.error(err);
      setMessage("Errore caricamento ordini");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => fetchOrdini(), 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchCategorie = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/categorie`);
      if (!res.ok) throw new Error(`Errore API categorie: ${res.status}`);
      setCategorie(await res.json());
    } catch (err) {
      console.error(err);
      setMessage("Errore caricamento categorie");
    }
  };

  const fetchProdotti = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/prodotti`);
      if (!res.ok) throw new Error(`Errore API prodotti: ${res.status}`);
      setProdotti(await res.json());
    } catch (err) {
      console.error(err);
      setMessage("Errore caricamento prodotti");
    }
  };

  // --- ORDINI ---
  const aggiornaStatoOrdine = async (id_ordine, stato_ordine) => {
    await fetch(`${API_BASE}/api/ordini/${id_ordine}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stato_ordine }),
    });
    fetchOrdini();
  };

  // --- CATEGORIE ---
  const aggiungiCategoria = async () => {
    if (!newCategoria.trim()) return;
    await fetch(`${API_BASE}/api/categorie`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ denominazione: newCategoria }),
    });
    setNewCategoria("");
    fetchCategorie();
  };

  const eliminaCategoria = async (id_categoria) => {
    await fetch(`${API_BASE}/api/categorie/${id_categoria}`, {
      method: "DELETE",
    });
    fetchCategorie();
  };

  const salvaModificaCategoria = async () => {
    await fetch(`${API_BASE}/api/categorie/${editCategoria.id_categoria}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ denominazione: editCategoria.denominazione }),
    });
    setEditCategoria(null);
    fetchCategorie();
  };

  // --- PRODOTTI ---
  const aggiungiProdotto = async () => {
    if (!newProdotto.nome || !newProdotto.prezzo || !newProdotto.id_categoria) return;
    await fetch(`${API_BASE}/api/prodotti`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: newProdotto.nome,
        prezzo: parseFloat(newProdotto.prezzo),
        id_categoria: parseInt(newProdotto.id_categoria),
        img_prodotto: newProdotto.img_prodotto,
        descrizione: newProdotto.descrizione,
      }),
    });
    setNewProdotto({ nome: "", prezzo: "", id_categoria: "", img_prodotto: "", descrizione: "" });
    fetchProdotti();
  };

  const eliminaProdotto = async (id_prodotto) => {
    await fetch(`${API_BASE}/api/prodotti/${id_prodotto}`, { method: "DELETE" });
    fetchProdotti();
  };

  const salvaModificaProdotto = async () => {
    await fetch(`${API_BASE}/api/prodotti/${editProdotto.id_prodotto}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: editProdotto.nome,
        prezzo: parseFloat(editProdotto.prezzo),
        id_categoria: parseInt(editProdotto.id_categoria),
        img_prodotto: editProdotto.img_prodotto,
        descrizione: editProdotto.descrizione,
      }),
    });
    setEditProdotto(null);
    fetchProdotti();
  };

  // --- UPLOAD IMMAGINE ---
  const handleUploadImage = async (file, isEdit = false) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/api/upload`, { method: "POST", body: formData });
      const data = await res.json();
      const fileUrl = `${API_BASE}/uploads/${data.fileName}`;

      if (isEdit) {
        setEditProdotto(prev => ({ ...prev, img_prodotto: fileUrl }));
      } else {
        setNewProdotto(prev => ({ ...prev, img_prodotto: fileUrl }));
      }
    } catch (err) {
      console.error("Errore upload:", err);
    }
  };

  // --- FILTRI ORDINI ---
  const ordiniAttivi = ordini.filter(o => o.stato_ordine !== "completato" && o.stato_ordine !== "annullato");
  const ordiniCompletati = ordini.filter(o => o.stato_ordine === "completato");
  const ordiniAnnullati = ordini.filter(o => o.stato_ordine === "annullato");

// --- FETCH RICHIESTE CAMERIERE ---
const fetchRichiesteCameriere = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/richiesteCameriere`);
    if (!res.ok) throw new Error("Errore caricamento richieste cameriere");
    const data = await res.json();
    setRichieste(data);
  } catch (err) {
    console.error(err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchRichiesteCameriere();
  const interval = setInterval(fetchRichiesteCameriere, 10000); 
  return () => clearInterval(interval);
}, []);

// --- FUNZIONE ELIMINA RICHIESTA ---
const evadiRichiesta = async (id) => {
  try {
    await fetch(`${API_BASE}/api/richiesteCameriere/${id}`, { method: "DELETE" });
    fetchRichiesteCameriere();
  } catch (err) {
    console.error(err);
  }
};
if (loading) return <p>Caricamento...</p>;
if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gradient-to-b from-lime-50 to-lime-600 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-lime-700">Gestione Acqua Serena</h1>
      {message && <div className="mb-4 text-green-600 font-semibold">{message}</div>}

      {/* TAB */}
      <div className="mb-6 space-x-0">
      <button onClick={() => setActiveTab("ordini")} className={`px-6 py-3 rounded ${activeTab === "ordini" ? "bg-black text-white" : "bg-white text-black"}`}>Ordini</button>
      <button onClick={() => setActiveTab("menu")} className={`px-6 py-3 rounded ${activeTab === "menu" ? "bg-black text-white" : "bg-white text-black"}`}>Menu</button>
      <button onClick={() => setActiveTab("richieste")} className={`px-6 py-3 rounded ${activeTab === "richieste" ? "bg-black text-white" : "bg-white text-black"}`}>Richieste Cameriere</button>
    </div>

      {/* SEZIONE ORDINI */}
      {activeTab === "ordini" && (
        <section className="mb-8">
          {/* ORDINI ATTIVI */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow">
              <thead>
                <tr className="bg-lime-100">
                  <th className="p-2">ID</th>
                  <th className="p-2">Ombrellone</th>
                  <th className="p-2">Data</th>
                  <th className="p-2">Stato</th>
                  <th className="p-2">Prodotti</th>
                  <th className="p-2">Pagamento</th>
                  <th className="p-2">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {ordiniAttivi.map((o) => (
                  <tr key={o.id_ordine} className="border-b">
                    <td className="p-2">{o.id_ordine}</td>
                    <td className="p-2">{o.id_ombrellone}</td>
                    <td className="p-2">{new Date(o.data_ordine).toLocaleString()}</td>
                    <td className="p-2 font-semibold">{o.stato_ordine}</td>
                    <td className="p-2">
                      <ul className="list-disc ml-4">
                        {(o.ordiniprodotti || o.ordini_prodotti || []).map((p, idx) => (
                          <li key={idx}>
                            {p.quantita} x {p.prodotto?.nome || p.id_prodotto}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-2 font-semibold">{o.metodoPagamento}</td> 
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => aggiornaStatoOrdine(o.id_ordine, "in preparazione")}
                        className="bg-yellow-300 px-2 py-1 rounded"
                      >
                        In Preparazione
                      </button>
                      <button
                        onClick={() => aggiornaStatoOrdine(o.id_ordine, "completato")}
                        className="bg-green-400 px-2 py-1 rounded"
                      >
                        Completa
                      </button>
                      <button
                        onClick={() => aggiornaStatoOrdine(o.id_ordine, "annullato")}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Annulla
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ORDINI COMPLETATI */}
          {ordiniCompletati.length > 0 && (
            <div className="mt-6">
              <button
                onClick={() => setShowCompletati(!showCompletati)}
                className="bg-gray-700 text-white px-4 py-2 rounded"
              >
                {showCompletati
                  ? "Nascondi ordini completati"
                  : `Mostra ordini completati (${ordiniCompletati.length})`}
              </button>

              {showCompletati && (
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full bg-gray-100 rounded-xl shadow">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2">ID</th>
                        <th className="p-2">Ombrellone</th>
                        <th className="p-2">Data</th>
                        <th className="p-2">Prodotti</th>
                        <th className="p-2">Pagamento</th> {/* nuova colonna */}
                      </tr>
                    </thead>
                    <tbody>
                      {ordiniCompletati.map((o) => (
                        <tr key={o.id_ordine} className="border-b">
                          <td className="p-2">{o.id_ordine}</td>
                          <td className="p-2">{o.id_ombrellone}</td>
                          <td className="p-2">{new Date(o.data_ordine).toLocaleString()}</td>
                          <td className="p-2">
                            <ul className="list-disc ml-4">
                              {(o.ordiniprodotti || o.ordini_prodotti || []).map((p, idx) => (
                                <li key={idx}>
                                  {p.quantita} x {p.prodotto?.nome || p.id_prodotto}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="p-2 font-semibold">{o.metodoPagamento}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ORDINI ANNULLATI */}
          {ordiniAnnullati.length > 0 && (
            <div className="mt-6">
              <button
                onClick={() => setShowAnnullati(!showAnnullati)}
                className="bg-gray-700 text-white px-4 py-2 rounded"
              >
                {showAnnullati
                  ? "Nascondi ordini annullati"
                  : `Mostra ordini annullati (${ordiniAnnullati.length})`}
              </button>

              {showAnnullati && (
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full bg-gray-100 rounded-xl shadow">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2">ID</th>
                        <th className="p-2">Ombrellone</th>
                        <th className="p-2">Data</th>
                        <th className="p-2">Prodotti</th>
                        <th className="p-2">Pagamento</th> {/* nuova colonna */}
                      </tr>
                    </thead>
                    <tbody>
                      {ordiniAnnullati.map((o) => (
                        <tr key={o.id_ordine} className="border-b">
                          <td className="p-2">{o.id_ordine}</td>
                          <td className="p-2">{o.id_ombrellone}</td>
                          <td className="p-2">{new Date(o.data_ordine).toLocaleString()}</td>
                          <td className="p-2">
                            <ul className="list-disc ml-4">
                              {(o.ordiniprodotti || o.ordini_prodotti || []).map((p, idx) => (
                                <li key={idx}>
                                  {p.quantita} x {p.prodotto?.nome || p.id_prodotto}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="p-2 font-semibold">{o.metodoPagamento}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* SEZIONE MENU */}
      {activeTab === "menu" && (
        <>
          {/* CATEGORIE */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-black">Categorie</h2>
            <div className="flex gap-2 mb-2">
              <input type="text" className="border rounded px-2 py-1" placeholder="Nuova categoria" value={newCategoria} onChange={(e) => setNewCategoria(e.target.value)} />
              <button onClick={aggiungiCategoria} className="bg-black text-white px-3 py-1 rounded">Aggiungi</button>
            </div>
            <ul className="bg-white rounded-xl shadow divide-y">
              {categorie.map(cat => (
                <li key={cat.id_categoria} className="flex items-center justify-between p-2">
                  {editCategoria && editCategoria.id_categoria === cat.id_categoria ? (
                    <>
                      <input type="text" className="border rounded px-2 py-1" value={editCategoria.denominazione} onChange={(e) => setEditCategoria({ ...editCategoria, denominazione: e.target.value })} />
                      <button onClick={salvaModificaCategoria} className="ml-2 bg-green-600 text-white px-2 py-1 rounded">Salva</button>
                      <button onClick={() => setEditCategoria(null)} className="ml-2 bg-red-600 text-white px-2 py-1 rounded">Annulla</button>
                    </>
                  ) : (
                    <>
                      <span>{cat.denominazione}</span>
                      <div>
                        <button onClick={() => setEditCategoria(cat)} className="ml-2 bg-yellow-500 text-white px-2 py-1 rounded">Modifica</button>
                        <button onClick={() => eliminaCategoria(cat.id_categoria)} className="ml-2 bg-red-600 text-white px-2 py-1 rounded">Elimina</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* PRODOTTI */}
          <section className="p-4">
            <h2 className="text-xl font-semibold mb-4 text-black">Prodotti</h2>

            <div className="flex flex-col sm:flex-row sm:items-end gap-2 mb-4 flex-wrap">
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                placeholder="Nome"
                value={newProdotto.nome}
                onChange={(e) => setNewProdotto({ ...newProdotto, nome: e.target.value })}
              />
              <input
                type="number"
                className="border rounded px-2 py-1 sm:w-32"
                placeholder="Prezzo"
                value={newProdotto.prezzo}
                onChange={(e) => setNewProdotto({ ...newProdotto, prezzo: e.target.value })}
              />
              <select
                className="border rounded px-2 py-1 sm:w-40"
                value={newProdotto.id_categoria}
                onChange={(e) => setNewProdotto({ ...newProdotto, id_categoria: e.target.value })}
              >
                <option value="">Categoria</option>
                {categorie.map(cat => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>{cat.denominazione}</option>
                ))}
              </select>
              <input
                type="text"
                className="border rounded px-2 py-1 sm:w-full sm:flex-1"
                placeholder="Descrizione"
                value={newProdotto.descrizione}
                onChange={(e) => setNewProdotto({ ...newProdotto, descrizione: e.target.value })}
              />
              <input
                type="file"
                accept="image/*"
                className="w-full sm:w-auto"
                onChange={(e) => e.target.files[0] && handleUploadImage(e.target.files[0])}
              />
              {newProdotto.img_prodotto && (
                <img
                  src={newProdotto.img_prodotto}
                  alt="Anteprima"
                  className="w-20 h-20 object-cover mt-2 sm:mt-0"
                />
              )}
              <button
                onClick={aggiungiProdotto}
                className="bg-black text-white px-3 py-1 rounded w-full sm:w-auto"
              >
                Aggiungi
              </button>
            </div>

            <ul className="bg-white rounded-xl shadow divide-y">
              {prodotti.map(prod => (
                <li key={prod.id_prodotto} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 flex-wrap">
                  {editProdotto && editProdotto.id_prodotto === prod.id_prodotto ? (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full flex-wrap">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 flex-wrap">
                        <input
                          type="text"
                          className="border rounded px-2 py-1 flex-1"
                          value={editProdotto.nome}
                          onChange={(e) => setEditProdotto({ ...editProdotto, nome: e.target.value })}
                        />
                        <input
                          type="number"
                          className="border rounded px-2 py-1 sm:w-32"
                          value={editProdotto.prezzo}
                          onChange={(e) => setEditProdotto({ ...editProdotto, prezzo: e.target.value })}
                        />
                        <select
                          className="border rounded px-2 py-1 sm:w-40"
                          value={editProdotto.id_categoria}
                          onChange={(e) => setEditProdotto({ ...editProdotto, id_categoria: e.target.value })}
                        >
                          {categorie.map(cat => (
                            <option key={cat.id_categoria} value={cat.id_categoria}>{cat.denominazione}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          className="border rounded px-2 py-1 sm:w-full sm:flex-1"
                          placeholder="Descrizione"
                          value={editProdotto.descrizione}
                          onChange={(e) => setEditProdotto({ ...editProdotto, descrizione: e.target.value })}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files[0] && handleUploadImage(e.target.files[0], true)}
                        />
                        {editProdotto.img_prodotto && (
                          <img
                            src={editProdotto.img_prodotto}
                            alt="Anteprima"
                            className="w-20 h-20 object-cover mt-2 sm:mt-0"
                          />
                        )}
                      </div>
                      <div className="flex gap-2 flex-wrap mt-2 sm:mt-0">
                        <button onClick={salvaModificaProdotto} className="bg-green-600 text-white px-4 py-2 rounded">Salva</button>
                        <button onClick={() => setEditProdotto(null)} className="bg-red-600 text-white px-4 py-2 rounded">Annulla</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full flex-wrap">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 flex-wrap">
                        <span>{prod.nome} - €{prod.prezzo.toFixed(2)} ({prod.categoria?.denominazione || "?"})</span>
                        {prod.descrizione && <span className="italic text-gray-600"> - {prod.descrizione}</span>}
                        {prod.img_prodotto && <img src={prod.img_prodotto} alt={prod.nome} className="w-20 h-20 object-cover" />}
                      </div>
                      <div className="flex gap-2 flex-wrap mt-2 sm:mt-0">
                        <button onClick={() => setEditProdotto(prod)} className="bg-yellow-500 text-white px-2 py-1 rounded">Modifica</button>
                        <button onClick={() => eliminaProdotto(prod.id_prodotto)} className="bg-red-600 text-white px-2 py-1 rounded">Elimina</button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

       {/* TAB Richieste Cameriere */}
    {activeTab === "richieste" && (
      <div>
        <h2 className="text-xl mb-2">Richieste Cameriere</h2>

        {console.log("STATO:", { loading, error, richieste })}

        {loading ? (
          <p>Caricamento...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : richieste.length === 0 ? (
          <p>Nessuna richiesta in attesa</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Ombrellone</th>
                  <th className="p-2 border">Richiesta</th>
                  <th className="p-2 border">Azione</th>
                </tr>
              </thead>
              <tbody>
                {richieste.map((r) => {
                  console.log("RENDER riga richiesta:", r);
                  return (
                    <tr key={r.id_richiesta} className="border-b">
                      <td className="p-2">{r.id_richiesta}</td>
                      <td className="p-2">{r.id_ombrellone}</td>
                      <td className="p-2">{r.richiesta}</td>
                      <td className="p-2">
                        <button
                          onClick={() => evadiRichiesta(r.id_richiesta)}
                          className="bg-red-600 text-white px-2 py-1 rounded"
                        >
                          Evadi
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )}
    </div>
  );
}
