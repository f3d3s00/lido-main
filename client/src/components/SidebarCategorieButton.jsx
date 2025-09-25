import { useTable } from "../context/TableContext";
import SidebarCategorie from "./SidebarCategorie";
import { useState } from "react";

export default function SidebarCategorieButton() {
  const { tableId } = useTable();
  const [open, setOpen] = useState(false);

  if (!tableId) return null; // Mostra il pulsante solo se l'utente ha inserito il numero ombrellone

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-5 left-5 bg-gradient-to-l from-[#ff914D] to-[#ffde59] text-white rounded-full w-20 h-12 flex items-center justify-center text-lg font-bold shadow-lg hover:from-[#ffde59] hover:to-[#ff914D] transition z-50 border-2 border-orange-400"
      >
        MENU
      </button>
      <SidebarCategorie isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
