// src/components/SidebarCategorie.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTable } from "../context/TableContext"; 

const BACKEND_URL = "http://localhost:4000"; 

export default function SidebarCategorie({ isOpen, onClose }) {
  const [categorie, setCategorie] = useState([]);
  const navigate = useNavigate();
  const { tableId } = useTable(); 

  useEffect(() => {
    if (isOpen) {
      fetch(`${BACKEND_URL}/api/categorie`)
        .then((res) => res.json())
        .then(setCategorie)
        .catch(() => setCategorie([]));
    }
  }, [isOpen]);

  const handleCategoriaClick = (id_categoria) => {
    onClose();
    navigate(`/menu?categoria=${id_categoria}`);
  };

  const goToPaginaIniziale = () => {
    onClose();
    navigate("/PaginaIniziale");
  };

  const goToListaOrdini = () => {
    onClose();
    navigate("/listaordini");
  };

  // libera ombrellone
  const liberaOmbrellone = async (numero_ombrellone) => {
    console.log("Sto liberando ombrellone numero:", numero_ombrellone);
    try {
      const res = await fetch(`${BACKEND_URL}/api/ombrelloni/libera`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero_ombrellone }),
      });

      if (!res.ok) throw new Error("Errore durante la liberazione dell'ombrellone");

      console.log(`✅ Ombrellone ${numero_ombrellone} liberato con successo`);
    } catch (err) {
      console.error("❌ Errore:", err);
    }
  };

  const handleLogout = async () => {
    if (tableId) {
      await liberaOmbrellone(tableId);
    }

    // Pulisco i dati locali
    localStorage.removeItem("sessioneId");
    localStorage.removeItem("tableId");

    // Torno al login
    navigate("/");
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-br from-[#ffde59]/80 to-[#ff914D]/80 backdrop-blur-md shadow-xl border-r border-yellow-300 transform transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center p-4 border-b border-yellow-200 bg-white/60">
        <h2 className="text-2xl font-bold text-yellow-700">Home</h2>
        <button onClick={onClose} className="text-yellow-600 hover:text-yellow-800 text-2xl">
          &times;
        </button>
      </div>

      {/* CATEGORIE */}
      <div className="p-4 flex flex-col gap-2 overflow-y-auto">
        {categorie.length === 0 ? (
          <p className="text-gray-500">Nessuna categoria trovata.</p>
        ) : (
          categorie.map((cat) => (
            <button
              key={cat.id_categoria}
              onClick={() => handleCategoriaClick(cat.id_categoria)}
              className="w-full text-left font-menu px-4 py-2 text-xl font-semibold hover:bg-orange-100/80 transition text-[#ff9100] shadow rounded-lg"
            >
              {cat.denominazione}
            </button>
          ))
        )}
      </div>

      {/* LINK EXTRA */}
      <div className="mt-auto border-t border-yellow-200">
        <button
          onClick={goToPaginaIniziale}
          className="w-full text-left font-menu px-4 py-3 text-xl font-semibold hover:bg-orange-100/80 transition text-[#ff9100] shadow"
        >
          Pagina iniziale
        </button>

        <button
          onClick={goToListaOrdini}
          className="w-full text-left font-menu px-4 py-3 text-xl font-semibold hover:bg-orange-100/80 transition text-[#ff9100] shadow"
        >
          Stato Ordini
        </button>

        <button
          onClick={handleLogout}
          className="w-full text-left font-menu px-4 py-3 text-xl font-semibold hover:bg-orange-100/80 transition text-[#ff9100] shadow"
        >
          Torna al login
        </button>
      </div>
    </div>
  );
}
