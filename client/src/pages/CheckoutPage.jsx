import { useCart } from "../context/CartContext";
import { useTable } from "../context/TableContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/api";
import { v4 as uuidv4 } from "uuid";

const BACKEND_URL = "http://localhost:4000";

const allProducts = [
  { id_prodotto: 13, nome: "Acqua Minerale", img: BACKEND_URL + "/uploads/acqua.jpeg", prezzo: 1.0 },
  { id_prodotto: 9, nome: "Patatine Rustiche", img: BACKEND_URL + "/uploads/rustica.jpeg", prezzo: 2.0 },
  { id_prodotto: 20, nome: "The limone", img: BACKEND_URL + "/uploads/the limone.jpeg", prezzo: 1.5 },
  { id_prodotto: 51, nome: "Brasilena", img: BACKEND_URL + "/uploads/brasilena.jpg", prezzo: 2.5 }
];

function getRandomProducts(array, count) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function CheckoutPage() {
  const { cartItems, clearCart, addToCart } = useCart();
  const { tableId } = useTable();
  const [metodoPagamento, setMetodoPagamento] = useState("CONTANTI");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [suggested, setSuggested] = useState([]);
  const navigate = useNavigate();

  const totale = cartItems.reduce((acc, item) => acc + item.prezzo * item.quantity, 0);

  // 🔹 Genera o recupera id_sessione corrente
  useEffect(() => {
    let sessione = localStorage.getItem("sessioneId");
    if (!sessione) {
      sessione = uuidv4();
      localStorage.setItem("sessioneId", sessione);
    }
  }, []);

  useEffect(() => {
    setSuggested(getRandomProducts(allProducts, 3));
  }, []);

  const handleOrder = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const id_sessione = localStorage.getItem("sessioneId"); // 🔹 recupero sessione corrente

      const ordine = {
        id_ombrellone: tableId,
        metodoPagamento,
        id_sessione, // 🔹 importante
        prodotti: cartItems.map((p) => ({
          id_prodotto: p.id_prodotto,
          quantita: p.quantity,
          prezzo: p.prezzo,
        })),
      };

      const createdOrder = await createOrder(ordine);

      setSuccess(true);
      clearCart();
      navigate(`/ordine/${createdOrder.id_ordine}`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Errore nell'invio dell'ordine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-[#ffde59] to-[#ff914D] min-h-screen rounded-xl shadow-md">
      <h2 className="text-3xl text-[#ff3131] font-bold mb-5 border-b border-[#ff3131]">
        Il tuo ordine include - Ombrellone n° {tableId}
      </h2>

      {cartItems.length === 0 ? (
        <p>Il carrello è vuoto.</p>
      ) : (
        <>
          <ul className="space-y-4 flex-1">
            {cartItems.map((item, idx) => (
              <li key={item.id_prodotto ? item.id_prodotto : idx} className="flex items-center space-x-4 border-b border-[#ff3131]">
                <img src={item.img_prodotto} alt={item.nome} className="w-16 h-16 object-cover rounded " />
                <div className="flex-1 ">
                  <h3 className="font-semibold">{item.nome}</h3>
                  <p className="font-semibold">x {item.quantity}</p>
                </div>
                <span className="font-semibold ">{(item.prezzo * item.quantity).toFixed(2)} €</span>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <h3 className="font-semibold text-[#ff3131] text-3xl justify-center text-center mb-2">
              Potresti ordinare anche:
            </h3>
            <div className="flex gap-4">
              {suggested.map((prod, idx) => (
                <div
                  key={idx}
                  onClick={() => addToCart({ id_prodotto: prod.id_prodotto, nome: prod.nome, prezzo: prod.prezzo, img_prodotto: prod.img })}
                  className="flex flex-col items-center bg-white p-2 rounded shadow w-28 cursor-pointer hover:scale-105 transition"
                >
                  <img src={prod.img} alt={prod.nome} className="w-20 h-20 object-cover rounded" />
                  <span className="text-sm mt-1">{prod.nome}</span>
                  <span className="font-semibold">{prod.prezzo.toFixed(2)} €</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 text-2xl font-bold">Totale: {totale.toFixed(2)} €</div>

          <form onSubmit={handleOrder} className="p-4 space-y-4">
            <h2 className="text-xl font-bold">Metodo di pagamento</h2>
            <select
              value={metodoPagamento}
              onChange={(e) => setMetodoPagamento(e.target.value)}
              className="border rounded-lg p-2 w-full"
            >
              <option value="CONTANTI">Contanti al cameriere</option>
              <option value="CARTA">Carta al cameriere</option>
              <option value="CASSA">Paga alla cassa </option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-600 hover:bg-gradient-to-l hover:from-[#ff914D] hover:to-[#ffde59] text-white px-3 py-5 rounded-lg shadow transition ml-2 mr-5"
            >
              {loading ? "Invio ordine..." : "Conferma Ordine"}
            </button>

            <button
              onClick={() => navigate("/menu")}
              className="bg-yellow-600 hover:bg-gradient-to-l hover:from-[#ff914D] hover:to-[#ffde59] text-white px-4 py-5 rounded-lg shadow transition ml-6 mr-5"
              type="button"
            >
              Indietro
            </button>
          </form>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </>
      )}
    </div>
  );
}
