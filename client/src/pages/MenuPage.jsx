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

  // Carica le categorie e seleziona quella da query string
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/categorie");
        if (!res.ok) throw new Error("Errore nel caricamento delle categorie");
        const data = await res.json();
        setCategories(data);

        const catId = searchParams.get("categoria");
        if (catId) {
          const found = data.find(
            (c) => String(c.id_categoria) === String(catId)
          );
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

  // Aggiorna la categoria selezionata quando cambia la query string
  useEffect(() => {
    if (!categories.length) return;
    const catId = searchParams.get("categoria");
    if (catId) {
      const found = categories.find(
        (c) => String(c.id_categoria) === String(catId)
      );
      if (found) setSelectedCategory(found);
    }
  }, [searchParams, categories]);

  if (loadingCategories) return <p>Caricamento categorie...</p>;
  if (errorCategories) return <p className="text-red-500">{errorCategories}</p>;

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* SFONDO */}
      <div className="absolute inset-0 z-10 bg-[url('/img/sfondo.png')] bg-center bg-no-repeat bg-fixed bg-contain opacity-40" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#ffde59] to-[#ff914D]" />

      {/* HEADER */}
      <header className="relative z-30 w-full flex justify-center ">
        <h1 className="w-full text-6xl text-center font-title text-[#ff3131] bg-gradient-to-r from-[#ffda6a] to-[#fff7de] p-5 shadow pl-17 pb-0 ">
          <i>Acqua Serena</i>
        </h1>
      </header>

      {/* CONTENUTO CENTRALE */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-start p-6">
        <div className="w-full max-w-md rounded-2xl shadow-xl p-6 flex flex-col gap-6 ">
          <div className="flex flex-col gap-4 mb-9 mt-13">
            {categories.map((cat) => (
              <button
                key={cat.id_categoria}
                className={`w-full mt-3 bg-[#e8af20] text-black text-l py-3 rounded-xl shadow-md hover:from-[#ffde59] hover:to-[#ff914D] transition font-bold ${
                  selectedCategory?.id_categoria === cat.id_categoria
                    ? " text-white border-orange-500"
                    : " text-black hover:bg-lime-100/60"
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
            <CategoryProducts
              categoryId={selectedCategory.id_categoria}
              addToCart={addToCart}
            />
          ) : (
            <p className="text-[#ff3131] text-center"></p>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-30 w-full text-3xl text-center bg-gradient-to-r from-[#ffda6a] to-[#fff7de]  p-5 shadow">
        <p className="text-[#ff3131] text-lg">
          © 2025 Lido Acqua Serena - Tutti i diritti riservati
        </p>
      </footer>
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
        const res = await fetch(
          `http://localhost:4000/api/prodotti/categoria/${categoryId}`
        );
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
  if (products.length === 0)
    return (
      <p className="text-gray-500 text-center">Nessun prodotto disponibile.</p>
    );

  return (
    <div className="flex flex-col gap-5">
      {products.map((product) => (
        <div
          key={product.id_prodotto}
          className=" rounded-3xl shadow-xl hover:shadow-2xl transition p-4 flex flex-col bg-white border border-yellow-200"
        >
          <img
            src={product.img_prodotto}
            alt={product.nome}
            className="w-full h-48 object-contain rounded-2xl mb-3"
          />
          <h3 className="text-xl font-bold text-black">{product.nome}</h3>
          {/* Descrizione */}
          {product.descrizione && (
            <p className="text-gray-700 italic mb-2">{product.descrizione}</p>
          )}
          <p className="text-red-700 mt-1 font-semibold text-xl">
            € {(Number(product.prezzo) || 0).toFixed(2)}
          </p>
          <button
            onClick={() => addToCart(product)}
            className="w-full mt-3 bg-[#e8af20] text-black text-l py-3 rounded-xl shadow-md hover:from-[#ffde59] hover:to-[#ff914D] transition font-bold"
          >
            Aggiungi al carrello
          </button>
        </div>
      ))}
    </div>
  );
}
