// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider, useCart } from "./context/CartContext";
import { TableProvider } from "./context/TableContext";
import { useLocation } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home"
import MenuPage from "./pages/MenuPage";
import CategoryPage from "./pages/CategoryPage";
import PaginaIniziale from "./pages/PaginaIniziale";
import CheckoutPage from "./pages/CheckoutPage";
import CartSidebar from "./components/CartSidebar";
//import SidebarCategorieButton from "./components/SidebarCategorieButton";
import GestionePage from "./pages/GestionePage";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import StatoOrdine from "./pages/statoOrdine";
import ListaOrdini from "./pages/listaOrdini";


// Componente icona carrello con badge numerico
function CartIconButton() {
  const { toggleSidebar, totalQuantity } = useCart();
  const location = useLocation();

  const allowedPaths = ["/menu", "/category"];

  if (!allowedPaths.includes(location.pathname)) return null;

  return (
    <button
      onClick={toggleSidebar}
      className="fixed z-30 bottom-5 right-5 bg-gradient-to-l from-[#ff914D] to-[#ffde59] text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl shadow-lg hover:from-[#ffde59] hover:to-[#ff914D] transition border-2 border-orange-400"
      style={{ position: 'fixed', bottom: 10, right: 10 }}
    >
      <span role="img" aria-label="carrello" >🛒</span>
      {totalQuantity > 0 && (
        <span
          className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white"
          style={{ pointerEvents: 'none' }}
        >
          {totalQuantity}
        </span>
      )}
    </button>
  );
}

function App() {
  const [idOmbrellone, setIdOmbrellone] = useState(null);
  const [sessionOrdini, setSessionOrdini] = useState([]);
  return (
<TableProvider>
      <CartProvider>
        <Router>
          <AuthProvider>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/PaginaIniziale" element={<PaginaIniziale />} />
              <Route
                path="/menu"
                element={
                  <MenuPage
                    idOmbrellone={idOmbrellone}
                    setIdOmbrellone={setIdOmbrellone}
                    sessionOrdini={sessionOrdini}
                    setSessionOrdini={setSessionOrdini}
                  />
                }
              />
              <Route
                path="/checkout"
                element={
                  <CheckoutPage
                    idOmbrellone={idOmbrellone}
                    sessionOrdini={sessionOrdini}
                    setSessionOrdini={setSessionOrdini}
                  />
                }
              />
              <Route
                path="/listaordini"
                element={
                  <ListaOrdini
                    idOmbrellone={idOmbrellone}
                    sessionOrdini={sessionOrdini}
                  />
                }
              />
              <Route path="/ordine/:id" element={<StatoOrdine />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/gestione"
                element={
                  <PrivateRoute>
                    <GestionePage />
                  </PrivateRoute>
                }
              />
            </Routes>

            <CartSidebar />
            <CartIconButton />
          </AuthProvider>
        </Router>
      </CartProvider>
    </TableProvider>  );
}

export default App;