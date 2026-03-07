import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function PaginaIniziale() {
  const navigate = useNavigate();
  const goToMenu = () => navigate("/menu");

  const immagini = [
    "src/img/vino.jpeg",
    "src/img/pesce.jpeg",
    "src/img/frittura.jpeg",
    "src/img/pizza.jpeg",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % immagini.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [immagini.length]);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* HEADER */}
      <Header />

      {/* CONTENUTO CENTRALE */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-start gap-10 p-3 mt-25">
       
        {/* Card slider immagini */}
        <div className="relative w-full max-w-2xl h-150 overflow-hidden rounded-2xl shadow-lg">
          {immagini.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="foto lido"
              className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
                i === index ? "opacity-50" : "opacity-0"
              }`}
            />
          ))}
            {/* Testo */}
            <div className="absolute inset-0 flex text-center justify-center items-center z-20">
              <p className="mb-40 text-3xl md:text-4xl font-bold font-menu text-yellow-700">
                ...che fame <br /> vediamo che c'è...
             </p>
             </div>

             <div className="absolute inset-0 flex items-center justify-center z-20">
             <button
              onClick={goToMenu}
                className="bg-yellow-600 hover:bg-gradient-to-l hover:from-[#ff914D] hover:to-[#ffde59] text-white px-10 py-5 rounded-lg shadow transition"
               >
               Ordina
              </button>
              </div>
        </div>
        </main>

         {/* FOOTER */}
         <footer className="w-full text-4xl justify-center text-center font-vivaldi text-red-700 bg-gradient-to-r from-[#ffda6a] to-[#fff7de]  p-6 shadow">
            <p className="text-[#ff3131] text-lg">
                 © 2025 Lido Acqua Serena - Tutti i diritti riservati
            </p>
        </footer>
    </div>
  );
}
