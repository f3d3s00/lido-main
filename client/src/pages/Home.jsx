import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTable } from "../context/TableContext";

export default function Home() {
  const { setTableId } = useTable();
  const [ombrelloni, setOmbrelloni] = useState([]);
  const [numeroOmbrellone, setNumeroOmbrellone] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Carico lista ombrelloni
  useEffect(() => {
    const fetchOmbrelloni = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/ombrelloni");
        if (!res.ok) throw new Error("Errore caricamento ombrelloni");
        setOmbrelloni(await res.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchOmbrelloni();
  }, []);

  // Prenotazione ombrellone
  const onConfirm = async () => {
    const trimmed = numeroOmbrellone.trim();
    if (!trimmed) return alert("Inserisci o scegli un ombrellone!");

    try {
      const res = await fetch("http://localhost:4000/api/ombrelloni/prenota", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero_ombrellone: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);

      setTableId(trimmed);
      navigate("/menu");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
<<<<<<< HEAD
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 gap-6 overflow-hidden">
      {/* Sfondo immagine */}
     <div className="absolute inset-0 z-10 bg-[url('/img/sfondo.png')] bg-center bg-no-repeat bg-fixed" />
      {/* Overlay gradiente sopra l'immagine */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#ffde59] to-[#ff914D]" />
      <div className="relative z-20 flex flex-col items-center w-auto justify-start min-h-screen pt-2 sm:pt-2 md:pt-6 lg:pt-8 xl:pt-12">
      <span className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-extrabold text-orange-700 text-shadow-sm shadow-gray-700 ">Benvenuto</span>
       
        <div className="w-full max-w-sm rounded-xl shadow p-4 flex flex-col gap-3 mt-70 ">
          <label className="text-m text-black font-bold text-center w-full">Numero Ombrellone</label>
          <input
            type="text"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-500"
            placeholder="Es. T12, O7..."
            value={manual}
            onChange={(e) => setManual(e.target.value)}
          />
          <button
            className="bg-orange-700 hover:bg-gradient-to-l hover:from-[#ff914D] hover:to-[#ffde59] text-white px-6 py-2 rounded-lg shadow transition"
            onClick={onManualConfirm}
          >
            Continua
          </button>
        </div>
=======
    <div className="min-h-screen bg-gradient-to-b from-lime-50 to-lime-100 flex flex-col items-center justify-center p-6 gap-6">
      <h1 className="text-3xl font-bold text-gray-800">Benvenuto 👋</h1>
      <p className="text-gray-600 text-center">Seleziona o inserisci il tuo ombrellone</p>

      <div className="w-full max-w-sm bg-white rounded-xl shadow p-4 flex flex-col gap-3 relative">
        <label className="text-sm text-gray-600">Numero Ombrellone</label>
        
        {/* Input con menu dropdown */}
        <input
          type="text"
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-500"
          placeholder="Da 1 a 10"
          value={numeroOmbrellone}
          onChange={(e) => setNumeroOmbrellone(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)} // delay per permettere il click
        />

        {showDropdown && (
          <ul className="absolute top-24 left-4 right-4 bg-white border rounded-lg shadow max-h-48 overflow-y-auto z-10">
            {ombrelloni.map((o) => (
              <li
                key={o.id_ombrellone}
                className={`px-3 py-2 cursor-pointer hover:bg-lime-100 ${
                  o.stato_ombrellone !== "libero" ? "text-gray-400 cursor-not-allowed" : ""
                }`}
                onClick={() => {
                  if (o.stato_ombrellone === "libero") {
                    setNumeroOmbrellone(o.numero_ombrellone.toString());
                    setShowDropdown(false);
                  }
                }}
              >
                Ombrellone {o.numero_ombrellone}{" "}
                {o.stato_ombrellone !== "libero" && "(Occupato)"}
              </li>
            ))}
          </ul>
        )}

        <button
          className="bg-lime-400 hover:bg-lime-500 text-white px-6 py-2 rounded-lg shadow transition"
          onClick={onConfirm}
        >
          Continua
        </button>
>>>>>>> cca1323371e5237b837254ef3f3360d5efd19b84
      </div>
    </div>
  );
}
