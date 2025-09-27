import { useCart } from "../context/CartContext";
import { useTable } from "../context/TableContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/api";

const BACKEND_URL= 'http://localhost:4000';

const allProducts = [
  { id_prodotto: 13, nome: "Acqua Minerale", img: BACKEND_URL + "/uploads/acqua.jpeg", prezzo: 1.0 },
  { id_prodotto: 9, nome: "Patatine Rustiche", img: BACKEND_URL + "/uploads/rustica.jpeg", prezzo: 2.0},
  { id_prodotto: 20, nome: "The limone", img: BACKEND_URL + "/uploads/the limone.jpeg", prezzo: 1.5},
  { id_prodotto: 51, nome: "Brasilena", img: BACKEND_URL + "/uploads/brasilena.jpg", prezzo: 2.5}
];

function getRandomProducts(array, count) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function CheckoutPage() {
  const { cartItems, clearCart, addToCart } = useCart();
  const { tableId } = useTable();
  const [paymentMethod, setPaymentMethod] = useState("contanti");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [suggested, setSuggested] = useState([]);
  const navigate = useNavigate();

  const totale = cartItems.reduce((acc, item) => acc + item.prezzo * item.quantity, 0);

  useEffect(() => {
    setSuggested(getRandomProducts(allProducts, 3));
  }, []);

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

      await createOrder(ordine);

      await fetch("http://localhost:4000/api/ombrelloni/libera", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero_ombrellone: tableId }),
      });

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
      <div className="p-6 text-center bg-gradient-to-r from-[#ffde59] to-[#ff914D] h-screen flex flex-col items-center justify-center gap-4 relative">

      <img src="/src/img/barca_finale.png" className="bg-ship" />
      <img src="/src/img/granchio.png" className="bg-granchio" />
      
      <h2 className="text-4xl z-50 mb-30 font-bold text-[#ff3131]">✅ Ordine inviato!</h2>
      <p className="mb-25 z-50 text-2xl">Il tuo ordine arriverà a breve</p>
    
      <button
        onClick={() => navigate("/menu")}
        className="z-50 bg-yellow-600 hover:bg-gradient-to-l hover:from-[#ff914D] hover:to-[#ffde59] text-white px-7 py-5 rounded-lg shadow transition mt-3 mr-3"
      >
        Torna al Menu
      </button>
    
      <button
        onClick={() => navigate("/")}
        className="z-50 bg-yellow-600 hover:bg-gradient-to-l hover:from-[#ff914D] hover:to-[#ffde59] text-white px-7 py-5 rounded-lg shadow transition mt-10 mr-3"
      >
        Torna al login
      </button>
    </div>

    );
  }

  return (
    <div className="p-6 bg-gradient-to-r from-[#ffde59] to-[#ff914D] min-h-screen rounded-xl shadow-md">
      <h2 className="text-3xl text-[#ff3131] font-bold mb-5 mt-15 border-b border-[#ff3131]">
        Il tuo ordine include - Ombrellone n° {tableId}
      </h2>

      {cartItems.length === 0 ? (
        <p>Il carrello è vuoto.</p>
      ) : (
        <>
          {/* Lista carrello */}
          <ul className="space-y-4 flex-1">

            {cartItems.map((item, idx) => (
              <li key={item.id_prodotto ? item.id_prodotto : idx} className="flex items-center space-x-4 border-b border-[#ff3131]">
                <img src={item.img_prodotto} alt={item.nome} className="w-16 h-16 object-cover rounded " />
                <div className="flex-1 ">
                  <h3 className="font-semibold">{item.nome}</h3>
                </div>
                <span className="font-semibold ">{(item.prezzo * item.quantity).toFixed(2)} €</span>
              {/* Linea colorata, tranne dopo l’ultimo elemento */}
              {idx !== cartItems.length - 1 && 
              <div className="h-1 bg-gradient-to-r from-[#ffde59] to-[#ff914D] my-3 rounded-full"></div>}
              </li>
            ))}
          </ul>

{/* Sezione suggerimenti */}
<div className="mt-6">
  <h3 className="font-semibold text-[#ff3131] text-3xl justify-center text-center mb-2">
    Potresti ordinare anche:
  </h3>
  <div className="flex gap-4">
    {suggested.map((prod, idx) => (
      <div
        key={idx}
        onClick={() => addToCart({
          id_prodotto: prod.id_prodotto,
          nome: prod.nome,
          prezzo: prod.prezzo,
          img_prodotto: prod.img
        })}
        className="flex flex-col items-center bg-white p-2 rounded shadow w-28 cursor-pointer hover:scale-105 transition"
      >
        <img src={prod.img} alt={prod.nome} className="w-20 h-20 object-cover rounded" />
        <span className="text-sm mt-1">{prod.nome}</span>
        <span className="font-semibold">{prod.prezzo.toFixed(2)} €</span>
      </div>
    ))}
  </div>
</div>

          {/* Totale */}
          <div className="mt-4 text-2xl font-bold">Totale: {totale.toFixed(2)} €</div>

          {/* Metodo di pagamento */}
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
            className="bg-yellow-600 hover:bg-gradient-to-l hover:from-[#ff914D] hover:to-[#ffde59] text-white px-7 py-5 rounded-lg shadow transition mt-3 mr-3"
          >
            {loading ? "Invio ordine..." : "Conferma Ordine"}
          </button>

          <button
            onClick={() => navigate("/menu")}
            className="bg-yellow-600 hover:bg-gradient-to-l hover:from-[#ff914D] hover:to-[#ffde59] text-white px-10 py-5 rounded-lg shadow transition ml-2"
          >
            Indietro
          </button>
        </>
      )}
    </div>
  );
}
