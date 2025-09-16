// src/context/CartContext.jsx
import { createContext, useState, useContext } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


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
    (acc, item) => acc + item.prezzo * item.quantity, // usa "prezzo" dal JSON
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,       // 👈 aggiunto qui
        isSidebarOpen,
        toggleSidebar,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
