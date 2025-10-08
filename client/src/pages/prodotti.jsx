import { useState } from "react";

function prodotti() {
  const [newProdotto, setNewProdotto] = useState({
    nome: "",
    prezzo: "",
    id_categoria: "",
    descrizione: "",
    img_prodotto: ""
  });

  const [editProdotto, setEditProdotto] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // 👈 ricerca prodotti

  // Stati iniziali protetti come array vuoti
  const [prodotti, setProdotti] = useState([]);
  const [categorie, setCategorie] = useState([]);

  const API_BASE = "http://localhost:4000";

  // ---- FUNZIONI DI GESTIONE ----
  const aggiungiProdotto = async () => {
    if (!newProdotto.nome || !newProdotto.prezzo || !newProdotto.id_categoria) return;
    await fetch(`${API_BASE}/api/prodotti`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: newProdotto.nome,
        prezzo: parseFloat(newProdotto.prezzo),
        id_categoria: parseInt(newProdotto.id_categoria),
        img_prodotto: newProdotto.img_prodotto,
        descrizione: newProdotto.descrizione,
      }),
    });
    setNewProdotto({ nome: "", prezzo: "", id_categoria: "", img_prodotto: "", descrizione: "" });
    fetchProdotti();
  };


  const salvaModificaProdotto = () => {
    setProdotti(prodotti.map(p =>
      p.id_prodotto === editProdotto.id_prodotto ? editProdotto : p
    ));
    setEditProdotto(null);
  };

  const eliminaProdotto = (id) => {
    setProdotti(prodotti.filter(p => p.id_prodotto !== id));
  };

  const handleUploadImage = (file, isEdit = false) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (isEdit) {
        setEditProdotto({ ...editProdotto, img_prodotto: reader.result });
      } else {
        setNewProdotto({ ...newProdotto, img_prodotto: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  // ---- FILTRO PRODOTTI ----
  const prodottiFiltrati = prodotti.filter(prod =>
    (prod?.nome?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (prod?.descrizione?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <section className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-lime-900 border-b border-lime-500 pb-2">
        Prodotti
      </h2>

      {/* FORM NUOVO PRODOTTO */}
      <section className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-6 text-lime-900 border-b border-lime-500 pb-2">
          Aggiungi Nuovo Prodotto
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            aggiungiProdotto();
          }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 "
        >
          {/* Nome */}
          <div className="flex flex-col">
            <label htmlFor="nome" className="mb-1 font-medium text-gray-700">
              Nome prodotto <span className="text-red-500">*</span>
            </label>
            <input
              id="nome"
              type="text"
              required
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-500"
              placeholder="Nome del prodotto"
              value={newProdotto.nome}
              onChange={(e) =>
                setNewProdotto({ ...newProdotto, nome: e.target.value })
              }
            />
          </div>

          {/* Prezzo */}
          <div className="flex flex-col">
            <label htmlFor="prezzo" className="mb-1 font-medium text-gray-700">
              Prezzo (€) <span className="text-red-500">*</span>
            </label>
            <input
              id="prezzo"
              type="number"
              min="0"
              step="0.01"
              required
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-500"
              placeholder="0.00"
              value={newProdotto.prezzo}
              onChange={(e) =>
                setNewProdotto({ ...newProdotto, prezzo: e.target.value })
              }
            />
          </div>

          {/* Categoria */}
          <div className="flex flex-col">
            <label
              htmlFor="categoria"
              className="mb-1 font-medium text-gray-700"
            >
              Categoria <span className="text-red-500">*</span>
            </label>
            <select
              id="categoria"
              required
              className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-lime-500"
              value={newProdotto.id_categoria}
              onChange={(e) =>
                setNewProdotto({ ...newProdotto, id_categoria: e.target.value })
              }
            >
              <option value="" disabled>
                Seleziona categoria
              </option>
              {categorie.map((cat) => (
                <option key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.denominazione}
                </option>
              ))}
            </select>
          </div>

          {/* Descrizione */}
          <div className="flex flex-col sm:col-span-2">
            <label
              htmlFor="descrizione"
              className="mb-1 font-medium text-gray-700"
            >
              Descrizione
            </label>
            <textarea
              id="descrizione"
              rows="3"
              className="border border-gray-300 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-lime-500"
              placeholder="Descrizione del prodotto (opzionale)"
              value={newProdotto.descrizione}
              onChange={(e) =>
                setNewProdotto({
                  ...newProdotto,
                  descrizione: e.target.value,
                })
              }
            />
          </div>

          {/* Upload immagine */}
          <div className="flex flex-col">
            <label
              htmlFor="img_prodotto"
              className="mb-1 font-medium text-gray-700"
            >
              Immagine prodotto
            </label>
            <input
              id="img_prodotto"
              type="file"
              accept="image/*"
              className="border border-gray-300 rounded-md px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-lime-500"
              onChange={(e) =>
                e.target.files[0] && handleUploadImage(e.target.files[0])
              }
            />
          </div>

          {/* Anteprima immagine */}
          <div className="flex items-center justify-center border border-gray-300 rounded-md p-2 bg-gray-50">
            {newProdotto.img_prodotto ? (
              <img
                src={newProdotto.img_prodotto}
                alt="Anteprima prodotto"
                className="max-h-32 object-contain rounded-md"
              />
            ) : (
              <span className="text-gray-400 italic">
                Nessuna immagine selezionata
              </span>
            )}
          </div>

          {/* Bottone submit */}
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-lime-900 hover:bg-lime-800 text-white font-semibold rounded-md px-6 py-2 transition"
            >
              Aggiungi Prodotto
            </button>
          </div>
        </form>
      </section>

      {/* CAMPO RICERCA PRODOTTI */}
      <div className="mt-8 mb-6">
        <label htmlFor="search" className="block mb-2 font-medium text-gray-700">
          Cerca prodotto
        </label>
        <input
          id="search"
          type="text"
          placeholder="Cerca per nome o descrizione..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ELENCO PRODOTTI */}
      <p className="text-2xl font-semibold mb-6 text-lime-900 border-b border-lime-500 pb-2 mt-7">
        Elenco prodotti
      </p>
      <ul className="divide-y divide-gray-900">
        {prodottiFiltrati.map((prod) => (
          <li
            key={prod.id_prodotto}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4"
          >
            {editProdotto && editProdotto.id_prodotto === prod.id_prodotto ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-grow flex-wrap">
                <input
                  type="text"
                  className="border border-gray-300 rounded-md px-3 py-2 flex-grow min-w-[150px] focus:outline-none focus:ring-2 focus:ring-lime-500"
                  value={editProdotto.nome}
                  onChange={(e) =>
                    setEditProdotto({ ...editProdotto, nome: e.target.value })
                  }
                />
                <input
                  type="number"
                  className="border border-gray-300 rounded-md px-3 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-lime-500"
                  value={editProdotto.prezzo}
                  onChange={(e) =>
                    setEditProdotto({ ...editProdotto, prezzo: e.target.value })
                  }
                  min="0"
                  step="0.01"
                />
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-lime-500"
                  value={editProdotto.id_categoria}
                  onChange={(e) =>
                    setEditProdotto({
                      ...editProdotto,
                      id_categoria: e.target.value,
                    })
                  }
                >
                  {categorie.map((cat) => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.denominazione}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className="border border-gray-300 rounded-md px-3 py-2 flex-grow min-w-[200px] focus:outline-none focus:ring-2 focus:ring-lime-500"
                  placeholder="Descrizione"
                  value={editProdotto.descrizione}
                  onChange={(e) =>
                    setEditProdotto({
                      ...editProdotto,
                      descrizione: e.target.value,
                    })
                  }
                />
                <input
                  type="file"
                  accept="image/*"
                  className="cursor-pointer"
                  onChange={(e) =>
                    e.target.files[0] && handleUploadImage(e.target.files[0], true)
                  }
                />
                {editProdotto.img_prodotto && (
                  <img
                    src={editProdotto.img_prodotto}
                    alt="Anteprima"
                    className="w-20 h-20 object-cover rounded-md border border-gray-300"
                  />
                )}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-grow flex-wrap">
                <span className="text-lime-900 font-semibold">
                  {prod?.nome} - €{(prod?.prezzo || 0).toFixed(2)} (
                  {prod?.categoria?.denominazione || "?"})
                </span>
                {prod?.descrizione && (
                  <span className="italic text-gray-600">
                    - {prod.descrizione}
                  </span>
                )}
                {prod?.img_prodotto && (
                  <img
                    src={prod.img_prodotto}
                    alt={prod?.nome}
                    className="w-20 h-20 object-cover rounded-md border border-gray-300"
                  />
                )}
              </div>
            )}
            <div className="flex gap-3 flex-wrap mt-2 sm:mt-0">
              {editProdotto && editProdotto.id_prodotto === prod.id_prodotto ? (
                <>
                  <button
                    onClick={salvaModificaProdotto}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md font-semibold transition"
                  >
                    Salva
                  </button>
                  <button
                    onClick={() => setEditProdotto(null)}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md font-semibold transition"
                  >
                    Annulla
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditProdotto(prod)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-md font-semibold transition"
                  >
                    Modifica
                  </button>
                  <button
                    onClick={() => eliminaProdotto(prod.id_prodotto)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md font-semibold transition"
                  >
                    Elimina
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default prodotti;
