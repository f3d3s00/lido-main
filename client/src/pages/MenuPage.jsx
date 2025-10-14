import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
const [activeButton, setActiveButton] = useState(null);


  // Stati per il pop-up
  const [modalVisible, setModalVisible] = useState(false);
  const [productSearchVisible, setProductSearchVisible] = useState(false);

  // Stato per id_ombrellone
  const [idOmbrellone, setIdOmbrellone] = useState(null);

  // Carica le categorie
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/categorie");
        if (!res.ok) throw new Error("Errore nel caricamento delle categorie");
        const data = await res.json();
        setCategories(data);

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

    const fetchOmbrellone = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/ombrellone");
        if (!res.ok) throw new Error("Errore nel caricamento dell'ombrellone");
        const data = await res.json();
    
        console.log("🌴 Ombrelloni ricevuti dal server:", data);
    
        // ✅ Trova il primo ombrellone occupato
        const occupato = data.find((o) => o.stato_ombrellone === "occupato");
    
        if (occupato) {
          setIdOmbrellone(occupato.id_ombrellone);
          console.log("✅ idOmbrellone impostato su:", occupato.id_ombrellone);
        } else {
          console.warn("⚠️ Nessun ombrellone occupato trovato");
        }
      } catch (err) {
        console.error(err);
      }
    };
    

    fetchCategories();
    fetchOmbrellone();
  }, [searchParams]);

  // Funzione per chiamare il cameriere
  const handleCallWaiter = async () => {
    console.log("📦 idOmbrellone al momento del click:", idOmbrellone);
    if (!idOmbrellone) return alert("ID ombrellone non disponibile");
    try {
      await fetch("http://localhost:4000/api/richiesteCameriere", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_ombrellone: idOmbrellone }),
      });
      alert("Il cameriere è stato avvisato!");
      setModalVisible(false);
    } catch (err) {
      console.error(err);
      alert("Errore nell’invio della richiesta");
    }
  };

  if (loadingCategories) return <p>Caricamento categorie...</p>;
  if (errorCategories) return <p className="text-red-500">{errorCategories}</p>;

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0 z-10 bg-[url('/img/sfondo.png')] bg-center bg-no-repeat bg-fixed bg-contain" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#ffde59] to-[#ff914D]" />

      <Header />

      {/* Pulsante Richiesta */}
      <button
        onClick={() => setModalVisible(true)}
        className="fixed text-3xl text-black top-22 right-7 p-3 transform transition-transform duration-300 z-50 rounded-4xl shadow border-orange-700 bg-gradient-to-r from-amber-110 to-[#ffda6a]"
        > 𝒊 </button>

      {/* Modal principale */}
      {modalVisible && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-80 flex flex-col gap-4 relative">
            <h2 className="text-xl font-bold text-center">Seleziona azione</h2>

            {/* Pulsante Cameriere */}
            <button
              onClick={() => {
                setActiveButton("waiter");
                handleCallWaiter();
              }}
              className={`w-full mt-3 bg-[#e8af20] text-black text-l py-3 rounded-xl shadow-md transition font-bold
                ${
                  activeButton === "waiter"
                    ? "text-white border-orange-500"
                    : "text-black hover:bg-orange-100/80"
                }`}
            >
              Richiedi Cameriere
            </button>

            {/* Pulsante Ricerca Prodotto */}
            <button
              onClick={() => {
                setActiveButton("search");
                setProductSearchVisible(true);
              }}
              className={`w-full mt-3 bg-[#e8af20] text-black text-l py-3 rounded-xl shadow-md transition font-bold
                ${
                  activeButton === "search"
                    ? "text-white border-orange-500"
                    : "text-black hover:bg-orange-100/80"
                }`}
            >
              Ricerca Prodotto
            </button>

            {/* Pulsante Chiudi */}
            <button
              onClick={() => {
                setActiveButton(null); // reset
                setModalVisible(false);
              }}
              className="w-full mt-3 bg-gray-300 text-black py-2 rounded-3xl font-bold"
            >
              Chiudi
            </button>

            {/* Ricerca prodotto live */}
            {productSearchVisible && <ProductSearch addToCart={addToCart} />}
          </div>
        </div>
      )}

      {/* Contenuto principale */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-start p-6">
        <div className="w-full max-w-md rounded-2xl shadow-xl p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-4 mb-9 mt-25">
            {categories.map((cat) => (
              <button
                key={cat.id_categoria}
                className={`w-full mt-3 bg-amber-300 text-black text-l py-3 rounded-xl shadow-md hover:from-[#ffde59] hover:to-[#ff914D] transition font-bold ${
                  selectedCategory?.id_categoria === cat.id_categoria
                    ? " text-red-500 border-orange-500"
                    : " text-black hover:bg-orange-100/80"
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
            <p className="text-[#ff0000] text-center bg-amber-200 rounded-4xl">
              Seleziona una categoria per vedere i prodotti</p>
          )}
        </div>
      </main>

      <footer className="relative z-30 w-full bg-gradient-to-r from-[#ffda6a] to-[#fff7de] p-5 shadow flex flex-col items-center justify-center text-center">
        <p className="text-black text-lg sm:text-2xl md:text-3xl break-words whitespace-pre-line leading-tight">
          © 2025 Lido Acqua Serena<br className="block sm:hidden" />
          Tutti i diritti riservati
        </p>
      </footer>
    </div>
  );
}

// Componente per visualizzare prodotti per categoria
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
    <div className="flex flex-col gap-5">
      {products.map((product) => (
        <div key={product.id_prodotto} className="rounded-3xl shadow-xl hover:shadow-2xl transition p-4 flex flex-col bg-white border border-amber-400">
          <img src={product.img_prodotto} alt={product.nome} className="w-full h-48 object-contain rounded-2xl mb-3" />
          <h3 className="text-xl font-bold text-black">{product.nome}</h3>
          {product.descrizione && <p className="text-gray-700 italic mb-2">{product.descrizione}</p>}
          <p className="text-red-700 mt-1 font-semibold text-xl">€ {(Number(product.prezzo) || 0).toFixed(2)}</p>
          <button onClick={() => addToCart(product)} className="w-full mt-3 bg-[#e8af20] text-black text-l py-3 rounded-xl shadow-md hover:from-[#ffde59] hover:to-[#ff914D] transition font-bold">
            Aggiungi al carrello
          </button>
        </div>
      ))}
    </div>
  );
}

// Componente ricerca live dei prodotti
function ProductSearch({ addToCart }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:4000/api/prodotti`);
        if (!res.ok) throw new Error("Errore nel caricamento prodotti");
        const data = await res.json();
        setAllProducts(data);
      } catch (err) {
        console.error(err);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filtra i prodotti in base alla query
  const productResults = allProducts.filter((p) =>
    p.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ❗ Il return deve essere **dentro la funzione**
  return (
    <div className="mt-4 flex flex-col gap-2">
      <input
        type="text"
        placeholder="Cerca prodotto..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 rounded-lg"
      />

      {loading && <p className="text-gray-500 text-center">Caricamento...</p>}

      {productResults.length === 0 && searchQuery.trim() && !loading && (
        <p className="text-red-500 text-center">Nessun prodotto trovato</p>
      )}

      {productResults.length > 0 && (
        <div className="mt-2 max-h-64 overflow-y-auto flex flex-col gap-2">
          {productResults.map((p) => (
            <div key={p.id_prodotto || p.id} className="p-2 bg-yellow-100 rounded-lg flex justify-between items-center">
              <span>{p.nome}</span>
              <button onClick={() => addToCart(p)} className="bg-[#ff914D] text-white px-2 py-1 rounded-lg text-sm">
                Aggiungi
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
