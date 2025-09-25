// src/components/CartSidebar.jsx
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartSidebar() {
  const { cartItems, isSidebarOpen, toggleSidebar, increaseQuantity, decreaseQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <div
  className={`fixed top-0 right-0 h-full w-80 shadow-xl transform transition-transform duration-300 z-50 border-4 border-red-500
    ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
  style={{ background: "linear-gradient(135deg, #ffde5990 0%, #ff914d90 100%)" }}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold">Carrello</h2>
        <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
      </div>

      <div className="p-4 flex flex-col flex-1 overflow-y-auto">
        {cartItems.length === 0 ? (
          <p className="text-gray-500">Il carrello è vuoto.</p>
        ) : (
          <ul className="space-y-4 flex-1">
            {cartItems.map((item, idx) => (
              <li key={item.id_prodotto ? item.id_prodotto : idx} className="flex items-center space-x-4">
                <img src={item.img_prodotto} alt={item.descrizione} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.descrizione}</h3>
                  <div className="flex items-center mt-2 space-x-2">
                    <button
                      onClick={() => decreaseQuantity(item.id_prodotto)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id_prodotto)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
                <span className="font-semibold">{(item.prezzo * item.quantity).toFixed(2)} €</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="p-4 border-t">
          <div className="flex justify-between text-lg font-bold mb-4">
            <span>Totale:</span>
            <span>{totalPrice.toFixed(2)} €</span>
          </div>
          <button
            onClick={() => {
              navigate("/checkout");
              toggleSidebar();
            }}
            className="w-full bg-gradient-to-l from-[#ff914D] to-[#ffde59] text-white py-3 rounded-xl shadow-md hover:from-[#ffde59] hover:to-[#ff914D] transition font-bold border-2 border-orange-400"
          >
            Conferma Ordine
          </button>
        </div>
      )}
    </div>
  );
}
