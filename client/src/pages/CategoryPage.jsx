// src/pages/CategoryPage.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CategoryPage() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/prodotti/categoria/${id}`);
        if (!res.ok) throw new Error("Errore nel caricamento dei prodotti");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [id]);

  if (loading) return <p>Caricamento prodotti...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (products.length === 0) return <p className="text-gray-500 text-center">Nessun prodotto disponibile in questa categoria.</p>;

  return (
    <div className="p-4 bg-gradient-to-b from-lime-50 to-lime-600 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Prodotti categoria {id}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => (
          <div
            key={product.id_prodotto}
            className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col"
          >
            <img
              src={product.img_prodotto}
              alt={product.descrizione}
              className="w-full h-48 object-cover rounded-2xl mb-3"
            />
            <h3 className="text-lg font-bold">{product.descrizione}</h3>
            <p className="text-gray-600 mt-1">€ {(Number(product.prezzo) || 0).toFixed(2)}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-3 bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold px-5 py-2 rounded-full shadow hover:shadow-lg active:scale-95 transition"
            >
              Aggiungi al carrello
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
