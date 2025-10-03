import { useState } from "react";
import SidebarCategorie from "./SidebarCategorie";
import { useLocation } from "react-router-dom"; // React Router
import { useNavigate } from "react-router-dom";

 function Header() {
    const [open, setOpen] = useState(false);
    const location = useLocation(); // ottieni il percorso corrente
    console.log(location)
    const navigate = useNavigate();

    return (
        <>
            <header className="fixed z-30 w-full flex justify-between bg-gradient-to-r from-[#ffda6a] to-[#fff7de] p-4 pb-0 shadow ">
                <button
                    onClick={() => setOpen(true)}
                    className="top-3 left-4 text-[#cba24d] w-13 h-12 flex items-center justify-center text-5xl font-bold z-50"
                >
                    ☰
                </button>
                <h1 className="w-full text-6xl text-center font-title text-[#ff3131] "
                onClick={() => navigate("/menu")}
                >
                    Acqua Serena
                </h1>
            </header>

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

export default Header;