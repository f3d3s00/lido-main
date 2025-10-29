import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTable } from "../context/TableContext";
import { Card, CardContent } from "../components/ui/card";
import { Package, Truck, CheckCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import Header from "../components/Header";

export default function ListaOrdini() {
  const { tableId } = useTable();
  const navigate = useNavigate();
  const [ordiniUtente, setOrdiniUtente] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Genera o recupera l'id_sessione corrente
  useEffect(() => {
    let sessione = localStorage.getItem("sessioneId");
    if (!sessione) {
      sessione = uuidv4();
      localStorage.setItem("sessioneId", sessione);
    }
  }, []);

  // 🔹 Carica solo gli ordini della sessione corrente
  useEffect(() => {
    if (!tableId) return;

    const fetchOrdini = async () => {
      try {
        const sessioneCorrente = localStorage.getItem("sessioneId");

        const res = await fetch(
          `http://localhost:4000/api/ordini/ombrellone/${tableId}/${sessioneCorrente}`
        );

        if (!res.ok) {
          if (res.status === 404) {
            setOrdiniUtente([]);
            return;
          }
          throw new Error("Errore caricamento ordini");
        }

        const data = await res.json();
        setOrdiniUtente(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdini();
  }, [tableId]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>Caricamento ordini...</p>
      </div>
    );

  // 🔹 Helper per messaggi quando non ci sono ordini o tableId
  const renderEmptyState = (message) => (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <p className="text-gray-600 text-center mt-30">{message}</p>
      <button
        onClick={() => navigate("/menu")}
        className="bg-yellow-600 hover:bg-gradient-to-l hover:from-[#ff914D] hover:to-[#ffde59] text-white px-6 py-3 rounded-lg shadow transition mt-4"
      >
        Indietro
      </button>
    </div>
  );

  if (!tableId) return renderEmptyState("Nessun ombrellone associato all'utente.");
  if (ordiniUtente.length === 0) return renderEmptyState("Nessun ordine in questa sessione.");
  console.log(ordiniUtente);

  // 🔹 Funzione per badge colore stato
  const getBadgeColor = (status) => {
    switch (status) {
      case "in attesa":
        return "bg-yellow-100 text-yellow-800";
      case "in preparazione":
        return "bg-blue-100 text-blue-800";
      case "spedito":
      case "consegnato":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 🔹 Funzione per icona e label stato
  const getStatusUI = (status) => {
    switch (status) {
      case "in attesa":
        return { icon: <Package className="text-yellow-500" />, label: "In attesa" };
      case "in preparazione":
        return { icon: <Truck className="text-blue-500" />, label: "In preparazione" };
      case "spedito":
        return { icon: <Truck className="text-blue-500" />, label: "Spedito" };
      case "consegnato":
        return { icon: <CheckCircle className="text-green-600" />, label: "Consegnato" };
      default:
        return { icon: <Package />, label: status };
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      {ordiniUtente.map((ordine) => {
        const { icon, label } = getStatusUI(ordine.stato_ordine);
        return (
          <Card key={ordine.id_ordine} className="z-10 max-w-md w-full shadow-lg rounded-2xl p-4 mb-6 mt-25 mx-auto">
            <CardContent className="flex flex-col gap-4 items-center text-center">
              <div className="flex items-center justify-between w-full text-xl font-semibold">
                <div className="flex items-center gap-2">
                  {icon}
                  <span>Ordine #{ordine.id_ordine}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(
                    ordine.stato
                  )}`}
                >
                  {label}
                </span>
              </div>

              <p className="text-sm text-gray-500">
                Data ordine: {new Date(ordine.data_ordine).toLocaleString()}
              </p>

              <div className="mt-4 w-full">
                <h3 className="font-semibold text-lg mb-2">Prodotti ordinati:</h3>
                <ul className="space-y-2">
                  {ordine.ordiniprodotti.map((item, index) => (
                    <li
                      key={item.id_ordiniprodotti || `${item.id_prodotto}-${index}`}
                      className="flex justify-between border-b pb-1"
                    >
                      <span>
                        {item.prodotto?.nome} x {item.quantita}
                      </span>
                      <span>{(item.prezzo * item.quantita).toFixed(2)} €</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <button
        onClick={() => navigate("/menu")}
        className="bg-yellow-600 hover:bg-gradient-to-l hover:from-[#ff914D] hover:to-[#ffde59] text-white px-6 py-4 rounded-lg shadow transition mt-4 mx-auto"
      >
        Indietro
      </button>
    </div>
  );
}
