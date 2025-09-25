import { useCart } from "../context/CartContext";
import { useTable } from "../context/TableContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/api";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { tableId } = useTable();
  const [paymentMethod, setPaymentMethod] = useState("contanti");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const totale = cartItems.reduce((acc, item) => acc + item.prezzo * item.quantity, 0);

  const handleOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const ordine = {
        id_ombrellone: tableId,
        metodoPagamento: paymentMethod,
        prodotti: cartItems.map((p) => ({
          id_prodotto: p.id_prodotto,
          quantita: p.quantity,
          prezzo: p.prezzo,
        })),
      };

      // 1. Crea ordine
      await createOrder(ordine);

      // 2. Libera l’ombrellone dopo l’ordine
      await fetch("http://localhost:4000/api/ombrelloni/libera", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero_ombrellone: tableId }),
      });

      // 3. Success
      setSuccess(true);
      clearCart();
    } catch (err) {
      console.error(err);
      setError(err.message || "Errore nell'invio dell'ordine");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 text-center bg-gradient-to-r from-[#ffde59] to-[#ff914D] h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-lime-600">✅ Ordine inviato!</h2>
        <p className="mt-2">Il cameriere riceverà la tua richiesta.</p>
        <button
          onClick={() => navigate("/menu")}
          className="mt-4 bg-lime-500 text-white py-2 px-6 rounded-xl hover:bg-lime-600 transition"
        >
          Torna al Menu
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-r from-[#ffde59] to-[#ff914D] min-h-screen rounded-xl shadow-md">
  {/* <div className="absolute inset-0 z-0 bg-[url('/img/sfondo.png')] bg-center bg-no-repeat bg-fixed" /> */}
      <h2 className="text-xl font-bold mb-4">Riepilogo Ordine - Tavolo {tableId}</h2>

      {cartItems.length === 0 ? (
        <p>Il carrello è vuoto.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {cartItems.map((item, index) => (
              <li
                key={item.id_prodotto ? `${item.id_prodotto}-${index}` : index}
                className="flex justify-between border-b pb-2"
              >
                <span>{item.nome} x {item.quantity}</span>
                <span className="font-semibold">{(item.prezzo * item.quantity).toFixed(2)} €</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 text-lg font-bold">Totale: {totale.toFixed(2)} €</div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Metodo di pagamento</h3>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="contanti"
                checked={paymentMethod === "contanti"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Contanti</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="carta"
                checked={paymentMethod === "carta"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Carta</span>
            </label>
          </div>

          {error && <p className="text-red-500 mt-2">{error}</p>}

          <button
            onClick={handleOrder}
            disabled={loading}
            className="w-full bg-lime-500 text-white py-3 mt-6 rounded-xl shadow-md hover:bg-lime-600 transition"
          >
            {loading ? "Invio ordine..." : "Conferma Ordine"}
          </button>
        </>
      )}
    </div>
  );
}
