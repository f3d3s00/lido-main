// src/pages/MenuPage.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";


export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();

  // Carica le categorie e seleziona quella da query string (solo al primo caricamento)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/categorie");
        if (!res.ok) throw new Error("Errore nel caricamento delle categorie");
        const data = await res.json();
        setCategories(data);
        // Se c'è una categoria nella query string, selezionala
        const catId = searchParams.get("categoria");
        if (catId) {
          const found = data.find((c) => String(c.id_categoria) === String(catId));
          if (found) setSelectedCategory(found);
        }
      } catch (err) {
        console.error(err);
        setErrorCategories(err.message);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  // Ogni volta che cambia la query string, seleziona la categoria giusta
  useEffect(() => {
    if (!categories.length) return;
    const catId = searchParams.get("categoria");
    if (catId) {
      const found = categories.find((c) => String(c.id_categoria) === String(catId));
      if (found) setSelectedCategory(found);
    }
  }, [searchParams, categories]);

  if (loadingCategories) return <p>Caricamento categorie...</p>;
  if (errorCategories) return <p className="text-red-500">{errorCategories}</p>;

  return (
  <div className="bg-gradient-to-r from-[#ffde59] to-[#ff914D] min-h-screen p-4 flex flex-col items-center justify-center">
    <div className="absolute inset-0 z-0 bg-[url('/img/sfondo.png')] bg-center bg-no-repeat bg-fixed" />    
    <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id_categoria}
              className={`w-full px-4 py-3 rounded-2xl font-semibold transition shadow hover:shadow-lg active:scale-95 border-2 border-yellow-200 ${
                selectedCategory?.id_categoria === cat.id_categoria
                  ? "bg-gradient-to-l from-[#ff914D] to-[#ffde59] text-white border-orange-500"
                  : "bg-gradient-to-l from-[#ffde59]/60 to-[#ff914D]/60 text-yellow-900 hover:bg-lime-100/60"
              }`}
              onClick={() => {
                if (selectedCategory?.id_categoria === cat.id_categoria) {
                  setSelectedCategory(null);
                } else {
                  setSelectedCategory(cat);
                }
              }}
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
          className="bg-gradient-to-br from-[#ffde59]/80 to-[#ff914D]/80 rounded-3xl shadow-xl hover:shadow-2xl transition p-4 flex flex-col border border-yellow-200"
        >
          <img
            src={product.img_prodotto}
            alt={product.nome}
            className="w-full h-48 object-contain rounded-2xl mb-3"
          />
          <h3 className="text-lg font-bold text-gray-800">{product.descrizione}</h3>
          <p className="text-gray-700 mt-1 font-semibold">€ {(Number(product.prezzo) || 0).toFixed(2)}</p>
          <button
            onClick={() => addToCart(product)}
            className="mt-3 bg-gradient-to-l from-[#ff914D] to-[#ffde59] text-white font-semibold px-5 py-2 rounded-lg shadow hover:from-[#ffde59] hover:to-[#ff914D] active:scale-95 transition border-2 border-orange-400"
          >
            Aggiungi al carrello
          </button>
        </div>
      ))}
    </div>
  );
}
