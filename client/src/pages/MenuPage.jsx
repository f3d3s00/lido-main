// src/pages/MenuPage.jsx
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/categorie");
        if (!res.ok) throw new Error("Errore nel caricamento delle categorie");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
        setErrorCategories(err.message);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  if (loadingCategories) return <p>Caricamento categorie...</p>;
  if (errorCategories) return <p className="text-red-500">{errorCategories}</p>;

  return (
    <div className="bg-gradient-to-br from-blue-300 to-amber-500 min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <div className="flex flex-col gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id_categoria}
              className={`w-full px-4 py-3 rounded-2xl font-semibold transition shadow hover:shadow-lg active:scale-95 ${
                selectedCategory?.id_categoria === cat.id_categoria
                  ? "bg-lime-500 text-white"
                  : "bg-blue-100 hover:bg-amber-400  text-gray-800"
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.denominazione}
            </button>
          ))}
        </div>

        {selectedCategory ? (
          <CategoryProducts categoryId={selectedCategory.id_categoria} addToCart={addToCart} />
        ) : (
          <p className="text-gray-600 text-center">Seleziona una categoria per vedere i prodotti.</p>
        )}
      </div>
    </div>
  );
}

// Componente interno per caricare prodotti di una categoria
function CategoryProducts({ categoryId, addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/prodotti/categoria/${categoryId}`);
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
  }, [categoryId]);

  if (loading) return <p>Caricamento prodotti...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (products.length === 0) return <p className="text-gray-500 text-center">Nessun prodotto disponibile.</p>;

  return (
    <div className="flex flex-col gap-4">
      {products.map((product) => (
        <div
          key={product.id_prodotto}
          className="bg-white rounded-3xl shadow-md hover:shadow-xl transition p-4 flex flex-col"
        >
          <img
            src={product.img_prodotto}
            alt={product.descrizione}
            className="w-full h-48 object-cover rounded-2xl mb-3"
          />
          <h3 className="text-lg font-bold text-gray-800">{product.descrizione}</h3>
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
  );
}
