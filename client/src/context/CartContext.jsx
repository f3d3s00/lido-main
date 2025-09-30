// src/context/CartContext.jsx

import { createContext, useState, useContext } from "react";

const CartContext = createContext();

import { useEffect } from "react";

export function CartProvider({ children }) {
  // Carica il carrello da localStorage all'avvio
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cartItems");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Salva il carrello su localStorage ogni volta che cambia
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

