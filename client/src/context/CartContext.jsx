// src/context/CartContext.jsx

import { createContext, useState, useContext } from "react";

const CartContext = createContext();

import { useEffect } from "react";


export function CartProvider({ children }) {
  // Stato sidebar carrello
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // id_ombrellone gestito separatamente, persistente
  const [ombrelloneId, setOmbrelloneIdState] = useState(() => {
    try {
      const saved = localStorage.getItem("ombrelloneId");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Carrello unico per tutti
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cartItems");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Salva il carrello su localStorage ogni volta che cambia
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Salva l'id ombrellone su localStorage ogni volta che cambia
  useEffect(() => {
    localStorage.setItem("ombrelloneId", JSON.stringify(ombrelloneId));
  }, [ombrelloneId]);

  // Cambia ombrellone
  const setOmbrelloneId = (newId) => {
    setOmbrelloneIdState(newId);
  };

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id_prodotto === item.id_prodotto);
      if (existing) {
        return prev.map((i) =>
          i.id_prodotto === item.id_prodotto ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((i) => i.id_prodotto !== itemId));
  };

  const increaseQuantity = (itemId) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id_prodotto === itemId ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  const decreaseQuantity = (itemId) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.id_prodotto === itemId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  // 🧹 nuovo metodo per svuotare il carrello
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.prezzo * item.quantity,
    0
  );

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isSidebarOpen,
        toggleSidebar,
        totalPrice,
        totalQuantity,
        ombrelloneId,
        setOmbrelloneId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

