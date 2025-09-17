// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider, useCart } from "./context/CartContext";
import { TableProvider } from "./context/TableContext";


import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CartSidebar from "./components/CartSidebar";
import GestionePage from "./pages/GestionePage";




// Componente icona carrello con TailwindCSS
function CartIconButton() {
  const { toggleSidebar } = useCart();

  return (
    <button
      onClick={toggleSidebar}
      className="fixed bottom-5 right-5 bg-lime-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl shadow-lg hover:bg-lime-600 transition"
    >
      🛒
    </button>
  );
}

function App() {
  return (
    <TableProvider>
      <CartProvider>
        <Router>
          {/* Rotte principali */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/gestione" element={<GestionePage />} />
          </Routes>

          {/* Sidebar sempre presente ma nascosta */}
          <CartSidebar />

          {/* Icona carrello sempre visibile */}
          <CartIconButton />
        </Router>
      </CartProvider>
    </TableProvider>
  );
}

export default App;

