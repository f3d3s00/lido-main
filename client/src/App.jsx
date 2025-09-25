// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider, useCart } from "./context/CartContext";
import { TableProvider } from "./context/TableContext";


import Home from "./pages/Home"
import MenuPage from "./pages/MenuPage";
import CategoryPage from "./pages/CategoryPage";

import CheckoutPage from "./pages/CheckoutPage";
import CartSidebar from "./components/CartSidebar";
import SidebarCategorieButton from "./components/SidebarCategorieButton";
import GestionePage from "./pages/GestionePage";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";





// Componente icona carrello con badge numerico
function CartIconButton() {
  const { toggleSidebar, totalQuantity } = useCart();

  return (
    <button
      onClick={toggleSidebar}
      className="fixed bottom-5 right-5 bg-gradient-to-l from-[#ff914D] to-[#ffde59] text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl shadow-lg hover:from-[#ffde59] hover:to-[#ff914D] transition border-2 border-orange-400"
      style={{ position: 'fixed', bottom: 20, right: 20 }}
    >
      <span role="img" aria-label="carrello">🛒</span>
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
  return (
<TableProvider>
      <CartProvider>
        <Router>
          <AuthProvider>
            <Routes>
<<<<<<< HEAD
              <Route path="/" element={<Home />} />
=======
            <Route path="/" element={<Home />} />
>>>>>>> cca1323371e5237b837254ef3f3360d5efd19b84
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/category/:id" element={<CategoryPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
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

            <SidebarCategorieButton />
            <CartSidebar />
            <CartIconButton />
          </AuthProvider>
        </Router>
      </CartProvider>
    </TableProvider>  );
}

export default App;