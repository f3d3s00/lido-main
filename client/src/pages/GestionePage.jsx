import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "../components/ui/card";

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
  const [searchTerm, setSearchTerm] = useState("");

  // UI / behaviour
  const [activeTab, setActiveTab] = useState("ordini"); // ordini | menu | richieste
  const [showCompletati, setShowCompletati] = useState(false);
  const [showAnnullati, setShowAnnullati] = useState(false);
  const [showActions, setShowActions] = useState(null); 
  const [message, setMessage] = useState("");

  // Richieste / ombrelloni / errori / loading
  const [richieste, setRichieste] = useState([]);
  const [ombrelloniOccupati, setOmbrelloniOccupati] = useState([]);
  const [error, setError] = useState(null);
  const [loadingCount, setLoadingCount] = useState(0); 

  const API_BASE = "http://localhost:4000";

  // Helper loading
  const startLoading = () => setLoadingCount((c) => c + 1);
  const stopLoading = () => setLoadingCount((c) => Math.max(0, c - 1));
  const loading = loadingCount > 0;

  // -------------------------
  // FETCH FUNCTIONS (useCallback per stabilità referenze)
  // -------------------------
  const fetchOrdini = useCallback(async () => {
    startLoading();
    try {
      const res = await fetch(`${API_BASE}/api/ordini`);
      if (!res.ok) throw new Error(`Errore API ordini: ${res.status}`);
      const data = await res.json();
      setOrdini(data || []);
    } catch (err) {
      console.error(err);
      setMessage("Errore caricamento ordini");
    } finally {
      stopLoading();
    }
  }, []);

  const fetchCategorie = useCallback(async () => {
    startLoading();
    try {
      const res = await fetch(`${API_BASE}/api/categorie`);
      if (!res.ok) throw new Error(`Errore API categorie: ${res.status}`);
      const data = await res.json();
      setCategorie(data || []);
    } catch (err) {
      console.error(err);
      setMessage("Errore caricamento categorie");
    } finally {
      stopLoading();
    }
  }, []);

  const fetchProdotti = useCallback(async () => {
    startLoading();
    try {
      const res = await fetch(`${API_BASE}/api/prodotti`);
      if (!res.ok) throw new Error(`Errore API prodotti: ${res.status}`);
      const data = await res.json();
      setProdotti(data || []);
    } catch (err) {
      console.error(err);
      setMessage("Errore caricamento prodotti");
    } finally {
      stopLoading();
    }
  }, []);

  const fetchRichiesteCameriere = useCallback(async () => {
    startLoading();
    try {
      const res = await fetch(`${API_BASE}/api/richiesteCameriere`);
      if (!res.ok) throw new Error("Errore caricamento richieste cameriere");
      const data = await res.json();
      setRichieste(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Errore caricamento richieste");
    } finally {
      stopLoading();
    }
  }, []);

  const fetchOmbrelloniOccupati = useCallback(async () => {
    startLoading();
    try {
      const res = await fetch(`${API_BASE}/api/ombrellone/occupati`);
      if (!res.ok) throw new Error("Errore caricamento ombrelloni occupati");
      const data = await res.json();
  
      // Log per debug
      console.log("Ombrelloni occupati aggiornati:", data);
  
      // Aggiorno lo stato
      setOmbrelloniOccupati(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      stopLoading();
    }
  }, []);
  
  // Caricamenti iniziali
  useEffect(() => {
    fetchOrdini();
    fetchCategorie();
    fetchProdotti();
    fetchRichiesteCameriere();
    fetchOmbrelloniOccupati();
  }, [fetchOrdini, fetchCategorie, fetchProdotti, fetchRichiesteCameriere, fetchOmbrelloniOccupati]);

  // Polling periodico (10s)
  useEffect(() => {
    if (activeTab === "menu") return; // niente polling in Menu
  
    const t1 = setInterval(fetchOrdini, 10000);
    const t2 = setInterval(fetchRichiesteCameriere, 10000);
    const t3 = setInterval(fetchOmbrelloniOccupati, 10000);
  
    return () => {
      clearInterval(t1);
      clearInterval(t2);
      clearInterval(t3);
    };
  }, [fetchOrdini, fetchRichiesteCameriere, fetchOmbrelloniOccupati, activeTab]);
  
  // -------------------------
  // ORDINI: aggiornamento stato
  // -------------------------
  const aggiornaStatoOrdine = async (id_ordine, nuovoStato) => {
    try {
      const res = await fetch(`${API_BASE}/api/ordini/${id_ordine}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stato_ordine: nuovoStato }),
      });
      if (!res.ok) throw new Error(`Errore aggiornamento ordine: ${res.status}`);

      // Aggiorno lo stato locale in modo ottimistico
      setOrdini((prev) => prev.map((o) => (o.id_ordine === id_ordine ? { ...o, stato_ordine: nuovoStato } : o)));

      // Se completato, controllo se liberare ombrellone (chiedo al backend dopo)
      if (nuovoStato === "completato") {
        // chiedo a backend lista ordini aggiornata per quell'ombrellone (semplice fetchOrdini)
        await fetchOrdini();
        // aggiorno anche la lista ombrelloni
        await fetchOmbrelloniOccupati();
      }

      setShowActions(null);
      setMessage("Stato aggiornato con successo");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      console.error(err);
      setMessage("Errore aggiornamento ordine ❌");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // -------------------------
  // CATEGORIE
  // -------------------------
  const aggiungiCategoria = async () => {
    if (!newCategoria.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/api/categorie`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ denominazione: newCategoria.trim() }),
      });
      if (!res.ok) throw new Error("Errore aggiunta categoria");
      setNewCategoria("");
      fetchCategorie();
      setMessage("Categoria aggiunta");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error(err);
      setMessage("Errore aggiunta categoria");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const eliminaCategoria = async (id_categoria) => {
    try {
      const res = await fetch(`${API_BASE}/api/categorie/${id_categoria}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Errore eliminazione categoria");
      fetchCategorie();
      setMessage("Categoria eliminata");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error(err);
      setMessage("Errore eliminazione categoria");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const salvaModificaCategoria = async () => {
    if (!editCategoria || !editCategoria.denominazione) return;
    try {
      const res = await fetch(`${API_BASE}/api/categorie/${editCategoria.id_categoria}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ denominazione: editCategoria.denominazione }),
      });
      if (!res.ok) throw new Error("Errore modifica categoria");
      setEditCategoria(null);
      fetchCategorie();
      setMessage("Categoria aggiornata");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error(err);
      setMessage("Errore modifica categoria");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // -------------------------
  // PRODOTTI
  // -------------------------
  const aggiungiProdotto = async () => {
    if (!newProdotto.nome || !newProdotto.prezzo || !newProdotto.id_categoria) {
      setMessage("Compila tutti i campi obbligatori (*)");
      setTimeout(() => setMessage(""), 2500);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/prodotti`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: newProdotto.nome,
          prezzo: parseFloat(newProdotto.prezzo),
          id_categoria: parseInt(newProdotto.id_categoria, 10),
          img_prodotto: newProdotto.img_prodotto,
          descrizione: newProdotto.descrizione,
        }),
      });
      if (!res.ok) throw new Error("Errore aggiunta prodotto");
      setNewProdotto({ nome: "", prezzo: "", id_categoria: "", img_prodotto: "", descrizione: "" });
      fetchProdotti();
      setMessage("Prodotto aggiunto");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error(err);
      setMessage("Errore aggiunta prodotto");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const eliminaProdotto = async (id_prodotto) => {
    try {
      const res = await fetch(`${API_BASE}/api/prodotti/${id_prodotto}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Errore eliminazione prodotto");
      fetchProdotti();
      setMessage("Prodotto eliminato");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error(err);
      setMessage("Errore eliminazione prodotto");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const salvaModificaProdotto = async () => {
    if (!editProdotto) return;
    try {
      const res = await fetch(`${API_BASE}/api/prodotti/${editProdotto.id_prodotto}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: editProdotto.nome,
          prezzo: parseFloat(editProdotto.prezzo),
          id_categoria: parseInt(editProdotto.id_categoria, 10),
          img_prodotto: editProdotto.img_prodotto,
          descrizione: editProdotto.descrizione,
        }),
      });
      if (!res.ok) throw new Error("Errore salvataggio prodotto");
      setEditProdotto(null);
      fetchProdotti();
      setMessage("Prodotto aggiornato");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error(err);
      setMessage("Errore salvataggio prodotto");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Upload immagine (aggiorna newProdotto o editProdotto)
  const handleUploadImage = async (file, isEdit = false) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${API_BASE}/api/upload`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Errore upload immagine");
      const data = await res.json();
      const fileUrl = `${API_BASE}/uploads/${data.fileName}`;
      if (isEdit) setEditProdotto((prev) => ({ ...prev, img_prodotto: fileUrl }));
      else setNewProdotto((prev) => ({ ...prev, img_prodotto: fileUrl }));
    } catch (err) {
      console.error("Errore upload:", err);
      setMessage("Errore upload immagine");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // -------------------------
  // RICHIESTE CAMERIERE
  // -------------------------
  const evadiRichiesta = async (id_richiesta) => {
    try {
      const res = await fetch(`${API_BASE}/api/richiesteCameriere/${id_richiesta}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Errore evadere richiesta");
      fetchRichiesteCameriere();
      setMessage("Richiesta evasa");
      setTimeout(() => setMessage(""), 1800);
    } catch (err) {
      console.error(err);
      setMessage("Errore evadere richiesta");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // -------------------------
  // LIBERA OMBRELLONE
  // - annulla eventuali ordini attivi sullo stesso ombrellone (backend)
  // - aggiorna stati locali (ordini, ombrelloniOccupati)
  // -------------------------
  const liberaOmbrellone = async (numero_ombrellone) => {
    try {
      console.log("Sto liberando ombrellone:", numero_ombrellone);
  
      const res = await fetch(`${API_BASE}/api/ombrellone/libera`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero_ombrellone }),
      });
  
      if (!res.ok) throw new Error("Errore liberazione ombrellone");
  
      const data = await res.json();
      console.log("Risposta liberazione:", data);
  
      // Aggiorno ordini locali
      setOrdini((prev) => prev.filter((o) => o.id_ombrellone !== numero_ombrellone));
  
      // ✅ Aggiorno lista ombrelloni occupati subito dopo
      await fetchOmbrelloniOccupati();
  
      setMessage(`Ombrellone ${numero_ombrellone} liberato ✅`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Errore liberazione ombrellone:", err);
      setMessage("Errore durante la liberazione dell’ombrellone ❌");
      setTimeout(() => setMessage(""), 3000);
    }
  };
    
  // -------------------------
  // Filtri e derivati
  // -------------------------
  const ordiniAttivi = ordini.filter((o) => o.stato_ordine !== "completato" && o.stato_ordine !== "annullato");
  const ordiniCompletati = ordini.filter((o) => o.stato_ordine === "completato");
  const ordiniAnnullati = ordini.filter((o) => o.stato_ordine === "annullato");

  const prodottiFiltrati = prodotti.filter(
    (prod) =>
      (prod?.nome?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (prod?.descrizione?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  // -------------------------
  // RENDER
  // -------------------------
  if (loading) return <p className="text-center mt-10 text-lg font-semibold">Caricamento...</p>;
  if (error) return <p className="text-center mt-10 text-lg font-semibold text-red-600">{error}</p>;

  return (
    <div className="p-6 bg-gradient-to-b from-lime-50 to-lime-600 min-h-screen font-sans">
      <h1 className="text-4xl font-extrabold mb-8 text-lime-900 text-center drop-shadow-md">Gestione Acqua Serena</h1>

      {message && (
        <div className="mb-6 max-w-xl mx-auto text-center text-green-700 font-semibold bg-green-100 rounded-md py-2 shadow-md">
          {message}
        </div>
      )}

      {/* TABS */}
      <div className="flex justify-center mb-8 space-x-4">
        {["ordini", "menu", "richieste"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-300 ${
              activeTab === tab ? "bg-lime-900 text-white shadow-lg" : "bg-white text-lime-900 hover:bg-lime-200"
            }`}
          >
            {tab === "ordini" ? "Home" : tab === "menu" ? "Menu" : "Richieste Cameriere"}
          </button>
        ))}
      </div>

      {/* ---------------- HOME / ORDINI ---------------- */}
      {activeTab === "ordini" && (
        <section className="max-w-7xl mx-auto">
{/* CARDS OMBRELLONI OCCUPATI */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
  {ombrelloniOccupati.length === 0 ? (
    <div className="text-gray-500 italic text-center col-span-full">Nessun ombrellone occupato</div>
  ) : (
    ombrelloniOccupati.map((numero) => (
      <Card
        key={numero}
        className="flex flex-col items-center justify-between bg-red-50 border border-red-300 rounded-2xl shadow-md p-4 hover:shadow-lg transition-shadow"
      >
        <CardContent className="flex flex-col items-center">
          <span className="text-2xl font-bold text-red-700 mb-2">
            Ombrellone {numero}
          </span>
          <span className="text-sm font-semibold text-red-500 mb-4">Occupato</span>

          <button
            onClick={() => liberaOmbrellone(numero)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-sm"
          >
            Libera
          </button>
        </CardContent>
      </Card>
    ))
  )}
</div>

          {/* TABELLA ORDINI ATTIVI */}
          <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
            <table className="min-w-full border-collapse border border-black">
              <thead className="bg-lime-100">
                <tr>
                  <th className="p-3 border border-gray-300 text-left text-lime-900 font-semibold">ID</th>
                  <th className="p-3 border border-gray-300 text-left text-lime-900 font-semibold">Ombrellone</th>
                  <th className="p-3 border border-gray-300 text-left text-lime-900 font-semibold">Data</th>
                  <th className="p-3 border border-gray-300 text-left text-lime-900 font-semibold">Stato</th>
                  <th className="p-3 border border-gray-300 text-left text-lime-900 font-semibold">Prodotti</th>
                  <th className="p-3 border border-gray-300 text-left text-lime-900 font-semibold">Pagamento</th>
                  <th className="p-3 border border-gray-300 text-center text-lime-900 font-semibold">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {ordiniAttivi.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500 italic">
                      Nessun ordine attivo
                    </td>
                  </tr>
                )}
                {ordiniAttivi.map((o) => (
                  <tr key={o.id_ordine} id={`ombrellone-${o.id_ombrellone}`} className="border-b border-gray-300 hover:bg-lime-50 transition-colors">
                    <td className="p-3 border border-gray-300">{o.id_ordine}</td>
                    <td className="p-3 border border-gray-300">{o.id_ombrellone}</td>
                    <td className="p-3 border border-gray-300">{new Date(o.data_ordine).toLocaleString()}</td>
                    <td className="p-3 border border-gray-300 font-semibold capitalize">{o.stato_ordine}</td>
                    <td className="p-3 border border-gray-300">
                      <ul className="list-disc ml-5 max-h-32 overflow-auto">
                        {(o.ordiniprodotti || o.ordini_prodotti || []).map((p, idx) => (
                          <li key={idx} className="text-gray-700">
                            {p.quantita} x {p.prodotto?.nome || p.id_prodotto}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-3 border border-gray-300 font-semibold">{o.metodoPagamento}</td>
                    <td className="p-3 border border-gray-300 text-center space-y-2">
                      <button
                        onClick={() => setShowActions((s) => (s === o.id_ordine ? null : o.id_ordine))}
                        className="w-full bg-lime-900 text-white rounded-md py-1 font-semibold hover:bg-lime-700 transition"
                        title="Mostra/Nascondi azioni"
                      >
                        👨‍🍳
                      </button>

                      {showActions === o.id_ordine && (
                        <div className="flex flex-col space-y-2 mt-2">
                          <button
                            onClick={() => aggiornaStatoOrdine(o.id_ordine, "in preparazione")}
                            className="bg-yellow-400 hover:bg-yellow-500 text-lime-900 font-semibold rounded-md py-1 transition"
                          >
                            In Preparazione
                          </button>
                          <button
                            onClick={() => aggiornaStatoOrdine(o.id_ordine, "consegnato")}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md py-1 transition"
                          >
                            Consegnato
                          </button>
                          <button
                            onClick={() => aggiornaStatoOrdine(o.id_ordine, "annullato")}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md py-1 transition"
                          >
                            Annulla
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          aggiornaStatoOrdine(o.id_ordine, "completato");
                          liberaOmbrellone(o.id_ombrellone);
                        }}
                        className="mt-2 w-full bg-green-800 hover:bg-green-900 text-white rounded-md py-1 font-semibold transition"
                      >
                        Completato
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ORDINI COMPLETATI */}
          {ordiniCompletati.length > 0 && (
            <div className="mt-10 max-w-7xl mx-auto">
              <button
                onClick={() => setShowCompletati((s) => !s)}
                className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-lg font-semibold transition"
              >
                {showCompletati ? "Nascondi ordini completati" : `Mostra ordini completati (${ordiniCompletati.length})`}
              </button>

              {showCompletati && (
                <div className="mt-6 overflow-x-auto rounded-lg shadow-lg bg-gray-50">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 border border-gray-300 text-left">ID</th>
                        <th className="p-3 border border-gray-300 text-left">Ombrellone</th>
                        <th className="p-3 border border-gray-300 text-left">Data</th>
                        <th className="p-3 border border-gray-300 text-left">Prodotti</th>
                        <th className="p-3 border border-gray-300 text-left">Pagamento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordiniCompletati.map((o) => (
                        <tr key={o.id_ordine} className="border-b border-gray-300 hover:bg-gray-100">
                          <td className="p-3 border border-gray-300">{o.id_ordine}</td>
                          <td className="p-3 border border-gray-300">{o.id_ombrellone}</td>
                          <td className="p-3 border border-gray-300">{new Date(o.data_ordine).toLocaleString()}</td>
                          <td className="p-3 border border-gray-300">
                            <ul className="list-disc ml-5 max-h-32 overflow-auto">
                              {(o.ordiniprodotti || o.ordini_prodotti || []).map((p, idx) => (
                                <li key={idx}>{p.quantita} x {p.prodotto?.nome || p.id_prodotto}</li>
                              ))}
                            </ul>
                          </td>
                          <td className="p-3 border border-gray-300 font-semibold">{o.metodoPagamento}</td>
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
            <div className="mt-10 max-w-7xl mx-auto">
              <button
                onClick={() => setShowAnnullati((s) => !s)}
                className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-lg font-semibold transition"
              >
                {showAnnullati ? "Nascondi ordini annullati" : `Mostra ordini annullati (${ordiniAnnullati.length})`}
              </button>

              {showAnnullati && (
                <div className="mt-6 overflow-x-auto rounded-lg shadow-lg bg-red-50">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-red-100">
                      <tr>
                        <th className="p-3 border border-gray-300 text-left">ID</th>
                        <th className="p-3 border border-gray-300 text-left">Ombrellone</th>
                        <th className="p-3 border border-gray-300 text-left">Data</th>
                        <th className="p-3 border border-gray-300 text-left">Prodotti</th>
                        <th className="p-3 border border-gray-300 text-left">Pagamento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordiniAnnullati.map((o) => (
                        <tr key={o.id_ordine} className="border-b border-gray-300 hover:bg-red-100">
                          <td className="p-3 border border-gray-300">{o.id_ordine}</td>
                          <td className="p-3 border border-gray-300">{o.id_ombrellone}</td>
                          <td className="p-3 border border-gray-300">{new Date(o.data_ordine).toLocaleString()}</td>
                          <td className="p-3 border border-gray-300">
                            <ul className="list-disc ml-5 max-h-32 overflow-auto">
                              {(o.ordiniprodotti || o.ordini_prodotti || []).map((p, idx) => (
                                <li key={idx}>{p.quantita} x {p.prodotto?.nome || p.id_prodotto}</li>
                              ))}
                            </ul>
                          </td>
                          <td className="p-3 border border-gray-300 font-semibold">{o.metodoPagamento}</td>
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

      {/* ---------------- MENU (CATEGORIE + PRODOTTI) ---------------- */}
      {activeTab === "menu" && (
        <section className="max-w-7xl mx-auto">
          {/* CATEGORIE */}
          <section className="mb-10 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-lime-900 border-b border-lime-300 pb-2">Categorie</h2>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="text"
                className="border border-gray-300 rounded-md px-3 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-lime-500"
                placeholder="Nuova categoria"
                value={newCategoria}
                onChange={(e) => setNewCategoria(e.target.value)}
              />
              <button onClick={aggiungiCategoria} className="bg-lime-900 hover:bg-lime-800 text-white font-semibold rounded-md px-5 py-2 transition">
                Aggiungi
              </button>
            </div>

            <ul className="divide-y divide-gray-200">
              {categorie.map((cat) => (
                <li key={cat.id_categoria} className="flex items-center justify-between py-3">
                  {editCategoria?.id_categoria === cat.id_categoria ? (
                    <>
                      <input
                        type="text"
                        className="border border-gray-300 rounded-md px-3 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-lime-500"
                        value={editCategoria.denominazione}
                        onChange={(e) => setEditCategoria({ ...editCategoria, denominazione: e.target.value })}
                      />
                      <div className="flex space-x-2 ml-4">
                        <button onClick={salvaModificaCategoria} className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-md font-semibold transition">
                          Salva
                        </button>
                        <button onClick={() => setEditCategoria(null)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md font-semibold transition">
                          Annulla
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-lime-900 font-medium">{cat.denominazione}</span>
                      <div className="flex space-x-2">
                        <button onClick={() => setEditCategoria(cat)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md font-semibold transition">Modifica</button>
                        <button onClick={() => eliminaCategoria(cat.id_categoria)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md font-semibold transition">Elimina</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* PRODOTTI */}
          <section className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-lime-900 border-b border-lime-500 pb-2">Prodotti</h2>

            {/* FORMA AGGIUNGI PRODOTTO (lasciata intatta con piccole migliorie) */}
            <section className="bg-white rounded-lg shadow-sm p-6 max-w-4xl mx-auto mb-6">
              <h3 className="text-xl font-semibold mb-4 text-lime-900">Aggiungi Nuovo Prodotto</h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  aggiungiProdotto();
                }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                {/* Nome */}
                <div className="flex flex-col">
                  <label htmlFor="nome" className="mb-1 font-medium text-gray-700">
                    Nome prodotto <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="nome"
                    type="text"
                    required
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-500"
                    placeholder="Nome del prodotto"
                    value={newProdotto.nome}
                    onChange={(e) => setNewProdotto({ ...newProdotto, nome: e.target.value })}
                  />
                </div>

                {/* Prezzo */}
                <div className="flex flex-col">
                  <label htmlFor="prezzo" className="mb-1 font-medium text-gray-700">
                    Prezzo (€) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="prezzo"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-500"
                    placeholder="0.00"
                    value={newProdotto.prezzo}
                    onChange={(e) => setNewProdotto({ ...newProdotto, prezzo: e.target.value })}
                  />
                </div>

                {/* Categoria */}
                <div className="flex flex-col">
                  <label htmlFor="categoria" className="mb-1 font-medium text-gray-700">
                    Categoria <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="categoria"
                    required
                    className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                    value={newProdotto.id_categoria}
                    onChange={(e) => setNewProdotto({ ...newProdotto, id_categoria: e.target.value })}
                  >
                    <option value="">Seleziona categoria</option>
                    {categorie.map((cat) => (
                      <option key={cat.id_categoria} value={cat.id_categoria}>
                        {cat.denominazione}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Descrizione */}
                <div className="flex flex-col sm:col-span-2">
                  <label htmlFor="descrizione" className="mb-1 font-medium text-gray-700">
                    Descrizione
                  </label>
                  <textarea
                    id="descrizione"
                    rows="3"
                    className="border border-gray-300 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-lime-500"
                    placeholder="Descrizione del prodotto (opzionale)"
                    value={newProdotto.descrizione}
                    onChange={(e) => setNewProdotto({ ...newProdotto, descrizione: e.target.value })}
                  />
                </div>

                {/* Upload immagine */}
                <div className="flex flex-col">
                  <label htmlFor="img_prodotto" className="mb-1 font-medium text-gray-700">
                    Immagine prodotto
                  </label>
                  <input
                    id="img_prodotto"
                    type="file"
                    accept="image/*"
                    className="border border-gray-300 rounded-md px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-lime-500"
                    onChange={(e) => e.target.files[0] && handleUploadImage(e.target.files[0])}
                  />
                </div>

                {/* Anteprima immagine */}
                <div className="flex items-center justify-center border border-gray-300 rounded-md p-2 bg-gray-50">
                  {newProdotto.img_prodotto ? (
                    <img src={newProdotto.img_prodotto} alt="Anteprima prodotto" className="max-h-32 object-contain rounded-md" />
                  ) : (
                    <span className="text-gray-400 italic">Nessuna immagine selezionata</span>
                  )}
                </div>

                {/* Submit */}
                <div className="sm:col-span-2 flex justify-end">
                  <button type="submit" className="bg-lime-900 hover:bg-lime-800 text-white font-semibold rounded-md px-6 py-2 transition">
                    Aggiungi Prodotto
                  </button>
                </div>
              </form>
            </section>

            {/* Lista prodotti */}
            <input
              type="text"
              placeholder="Cerca prodotto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border rounded-md w-full mb-4"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {prodottiFiltrati.map((p) => (
                <Card key={p.id_prodotto} className="p-4 bg-white border border-gray-300">
                  <CardContent className="flex flex-col gap-5">
                    {p.img_prodotto ? (
                      <img src={p.img_prodotto} alt={p.nome} className="w-50 h-50 object-cover rounded-md mb-2" />
                    ) : (
                      <div className="w-full h-32 bg-gray-100 rounded-md mb-2 flex items-center justify-center text-gray-400">No image</div>
                    )}

                    {editProdotto?.id_prodotto === p.id_prodotto ? (
                      <>
                        <input value={editProdotto.nome} onChange={(e) => setEditProdotto({ ...editProdotto, nome: e.target.value })} className="border rounded px-2 py-1 mb-1" />
                        <input value={editProdotto.prezzo} onChange={(e) => setEditProdotto({ ...editProdotto, prezzo: e.target.value })} className="border rounded px-2 py-1 mb-1" />
                        <input
                    id="img_prodotto"
                    type="file"
                    accept="image/*"
                    className="border border-gray-300 rounded-md px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-lime-500"
                    onChange={(e) => e.target.files[0] && handleUploadImage(e.target.files[0])}
                  />

                        <div className="mt-2 flex gap-2">
                          <button onClick={salvaModificaProdotto} className="bg-green-500 text-white px-3 py-1 rounded">💾 Salva</button>
                          <button onClick={() => setEditProdotto(null)} className="bg-red-500 text-white px-3 py-1 rounded">Annulla</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="font-semibold">{p.nome}</span>
                        <span className="text-gray-600">€{Number(p.prezzo).toFixed(2)}</span>
                        <span className="font-semibold">{p.descrizione}</span>
                        <div className="mt-2 flex space-x-2">
                          <button onClick={() => setEditProdotto(p)} className="text-blue-600">Modifica</button>
                          <button onClick={() => eliminaProdotto(p.id_prodotto)} className="text-red-600">Elimina</button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </section>
      )}

      {/* ---------------- RICHIESTE CAMERIERE ---------------- */}
      {activeTab === "richieste" && (
        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-lime-900 border-b border-lime-300 pb-2">Richieste Cameriere</h2>

          {richieste.length === 0 ? (
            <p className="text-center text-gray-500 mt-10 italic">Nessuna richiesta cameriere</p>
          ) : (
            <ul className="space-y-4">
              {richieste.map((r) => (
                <li key={r.id_richiesta || r.id} className="border p-4 rounded-md bg-lime-50 flex justify-between items-center">
                  <span>Ombrellone {r.id_ombrellone}: {r.richiesta || r.descrizione}</span>
                  <button onClick={() => evadiRichiesta(r.id_richiesta || r.id)} className="bg-lime-900 hover:bg-lime-700 text-white px-3 py-1 rounded-md font-semibold transition">
                    Evadi
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
