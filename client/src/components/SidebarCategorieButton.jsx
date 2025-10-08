import { useTable } from "../context/TableContext";
import SidebarCategorie from "./SidebarCategorie";
import { useState } from "react";
import { useLocation } from "react-router-dom"; 

export default function SidebarCategorieButton() {
  const { tableId } = useTable();
  const [open, setOpen] = useState(false);
  const location = useLocation(); 

  // Lista delle pagine in cui vuoi mostrare il pulsante
  const allowedPages = ["/PaginaIniziale","/menu", "/category"]; 

  if (!tableId || !allowedPages.includes(location.pathname)) return null;

  return (
    <>
      {/* Pulsante apri menu */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-3 left-4 text-[#cba24d] w-13 h-12 flex items-center justify-center text-5xl font-bold z-50"
      >
        ☰
      </button>

      {/* Overlay trasparente */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40"
        ></div>
      )}

      {/* Sidebar categorie */}
      <SidebarCategorie isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
