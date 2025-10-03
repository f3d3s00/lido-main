import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTable } from "../context/TableContext";
import { useCart } from "../context/CartContext";

export default function Home() {
  const { setTableId } = useTable();
  const { clearCart } = useCart();
  const [ombrelloni, setOmbrelloni] = useState([]);
  const [numeroOmbrellone, setNumeroOmbrellone] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOmbrelloni = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/ombrelloni");
        if (!res.ok) throw new Error("Errore caricamento ombrelloni");
        setOmbrelloni(await res.json());
        clearCart();
        localStorage.clear();
      } catch (err) {
        console.error(err);
      }
    };
    fetchOmbrelloni();
  }, []);

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
      navigate("/PaginaIniziale");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start ">

      {/* Sfondo immagine */}
      <div className="absolute inset-0 z-10 bg-[url('/img/sfondo.png')] bg-center bg-no-repeat bg-fixed bg-contain" />
      {/* Overlay gradiente sopra l'immagine */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#ffde59] to-[#ff914D]" />

      {/* Titolo in alto curvo */}
      <div className="relative z-20 w-full flex justify-center pt-15">
        <svg viewBox="0 0 500 150" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-3xl">
          {/* percorso curvo */}
          <path id="curve" d="M 50 150 Q 250 0 450 150" fill="transparent" />
          {/* Testo */}
          <text fill="rgb(194,65,12)" fontSize="90" fontWeight="900" fontFamily="serif">
            <textPath href="#curve" startOffset="50%" textAnchor="middle">
              Benvenuto
            </textPath>
          </text>
        </svg>
      </div>

      {/* Box centrato verticalmente nella parte rimanente */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-sm flex-1 mb-20 justify-center">
        <div className="w-4/5 sm:w-3/5 md:w-1/2 rounded-xl shadow p-2 flex flex-col gap-2 relative bg-white/20 backdrop-blur-md border border-white/10">
          <p className="text-l text-red-800 font-bold text-center w-full">
            Numero Ombrellone
          </p>

          <input
            type="text"
            className=" relative border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#ffde59]"
            placeholder="Da 1 a 10"
            value={numeroOmbrellone}
            onChange={(e) => setNumeroOmbrellone(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          />

          {showDropdown && (
            <ul className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow max-h-48 overflow-y-auto z-10">
              {ombrelloni.map((o) => (
                <li
                  key={o.id_ombrellone}
                  className={`px-3 py-2 cursor-pointer hover:bg-lime-100 ${o.stato_ombrellone !== "libero"
                      ? "text-gray-400 cursor-not-allowed"
                      : ""
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
            className="relative bg-yellow-600 hover:bg-gradient-to-l hover:from-[#ff914D] hover:to-[#ffde59] text-white py-2 rounded-lg shadow transition"
            onClick={onConfirm}
          >
            Continua
          </button>
        </div>
      </div>
    </div>
  );
}
