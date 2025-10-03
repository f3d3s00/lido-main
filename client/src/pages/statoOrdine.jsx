// src/pages/statoOrdine.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Package, Truck, CheckCircle } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";


const BACKEND_URL = "http://localhost:4000";

export default function StatoOrdine() {
  const { id } = useParams();
  const [ordine, setOrdine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/ordini/${id}`)
      .then(res => {
        if (!res.ok) throw new Error(`Errore ${res.status}`);
        return res.json();
      })
      .then(data => {
        setOrdine(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const getStatusUI = (status) => {
    switch (status) {
      case "in attesa":
        return { icon: <Package className="text-yellow-500" />, label: "In attesa" };
      case "in preparazione":
        return { icon: <Truck className="text-blue-500" />, label: "In preparazione" };
      case "spedito":
        return { icon: <Truck className="text-blue-500" />, label: "Consegnato" };
      case "consegnato":
        return { icon: <CheckCircle className="text-green-600" />, label: "Consegnato" };
      default:
        return { icon: <Package />, label: status };
    }
  };

  if (loading) return <p className="text-center mt-10">Caricamento stato ordine...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  const { icon, label } = getStatusUI(ordine.stato_ordine);

//libera ombrellone
const liberaOmbrellone = async (numero_ombrellone) => {
  console.log("Sto liberando ombrellone numero:", numero_ombrellone);
  try {
    const res = await fetch(`${BACKEND_URL}/api/ombrelloni/libera`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numero_ombrellone }),
    });

    if (!res.ok) {
      throw new Error("Errore durante la liberazione dell'ombrellone");
    }

    console.log(`Ombrellone ${numero_ombrellone} liberato con successo`);
  } catch (err) {
    console.error(err);
  }
};


  return (
    <div className="relative p-6 bg-gradient-to-r from-[#ffde59] to-[#ff914D] min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Sfondo */}
      <img src="/src/img/barca_finale.png" className="absolute bottom-0 left-0 w-1/2 opacity-20 pointer-events-none" />
      <img src="/src/img/granchio.png" className="absolute bottom-0 right-0 w-1/4 opacity-30 pointer-events-none" />

      {/* Messaggio */}
      <div className="z-10 text-center mb-6">
        <h2 className="text-4xl font-bold text-[#ff3131] mb-2">✅ Ordine inviato!</h2>
        <p className="text-2xl mb-4"><strong>Il tuo ordine arriverà a breve</strong></p>
      </div>

      {/* Card stato ordine */}
      <Card className="z-10 max-w-md w-full shadow-lg rounded-2xl p-4 mb-6">
        <CardContent className="flex flex-col gap-4 items-center text-center">
          <div className="flex items-center gap-2 text-xl font-semibold">
            {icon}
            <span>{label}</span>
          </div>
          <p className="text-sm text-gray-500">
            Ordine #{ordine.id_ordine} <br />
            Data ordine: {new Date(ordine.data_ordine).toLocaleString()}
          </p>

          <div className="mt-4 w-full">
            <h3 className="font-semibold text-lg mb-2">Prodotti ordinati:</h3>
            <ul className="space-y-2">
              {ordine.ordiniprodotti.map(item => (
                <li key={item.id_ordiniprodotti} className="flex justify-between border-b pb-1">
                  <span>{item.prodotto.nome} x {item.quantita}</span>
                  <span>{(item.prezzo * item.quantita).toFixed(2)} €</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Pulsanti */}
      <div className="z-10 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/menu")}
          className="bg-yellow-600 hover:bg-gradient-to-l hover:from-[#ff914D] hover:to-[#ffde59] text-white px-7 py-4 rounded-lg shadow transition"
        >
          Torna al Menu
        </button>
        <button
        onClick={async () => {
          if (ordine?.id_ombrellone){
          await liberaOmbrellone(ordine.id_ombrellone);
          }
          navigate("/");
        }}
        className="bg-yellow-600 hover:bg-gradient-to-l hover:from-[#ff914D] hover:to-[#ffde59] text-white px-7 py-4 rounded-lg shadow transition"
      >
        Torna al login
      </button>
      </div>
    </div>
  );
}
