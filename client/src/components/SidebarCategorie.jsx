import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SidebarCategorie({ isOpen, onClose }) {
  const [categorie, setCategorie] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:4000/api/categorie")
        .then((res) => res.json())
        .then(setCategorie)
        .catch(() => setCategorie([]));
    }
  }, [isOpen]);

  const handleCategoriaClick = (id_categoria) => {
    onClose();
    navigate(`/menu?categoria=${id_categoria}`);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-br from-[#ffde59]/80 to-[#ff914D]/80 backdrop-blur-md shadow-xl border-r border-yellow-300 transform transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-yellow-200 bg-white/60">
        <h2 className="text-2xl font-bold text-yellow-700">Home</h2>
        <button onClick={onClose} className="text-yellow-600 hover:text-yellow-800 text-2xl">&times;</button>
      </div>
      <div className="p-4 flex flex-col gap-2">
        {categorie.length === 0 ? (
          <p className="text-gray-500">Nessuna categoria trovata.</p>
        ) : (
          categorie.map((cat) => (
            <button
              key={cat.id_categoria}
              onClick={() => handleCategoriaClick(cat.id_categoria)}
              className="w-full text-left font-menu px-4 py-2 text-xl font-semibold hover:bg-lime-200/60 transition text-[#ff9100] shadow"
            >
              {cat.denominazione}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
