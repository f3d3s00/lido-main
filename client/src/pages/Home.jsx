import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTable } from "../context/TableContext";

export default function Home() {
  const { setTableId } = useTable();
  const [manual, setManual] = useState("");
  const navigate = useNavigate();

  const onManualConfirm = () => {
    const trimmed = manual.trim();
    if (!trimmed) return;
    setTableId(trimmed);
    navigate("/menu");
  };

  return (
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
      </div>
    </div>
  );
}
