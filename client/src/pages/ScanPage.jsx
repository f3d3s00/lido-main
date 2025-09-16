import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTable } from "../context/TableContext";

export default function ScanPage() {
  const { setTableId } = useTable();
  const [manual, setManual] = useState("");
  const [useScanner, setUseScanner] = useState(false);
  const navigate = useNavigate();

  const onManualConfirm = () => {
    const trimmed = manual.trim();
    if (!trimmed) return;
    setTableId(trimmed);
    navigate("/menu");
  };

  const handleQRResult = (result, error) => {
    if (!!result) {
      const text = result?.text || "";
      try {
        const maybeUrl = new URL(text);
        const t = new URLSearchParams(maybeUrl.search).get("table");
        if (t) {
          setTableId(t);
          navigate("/menu");
          return;
        }
      } catch {
        // non è URL
      }
      if (text) {
        setTableId(text);
        navigate("/menu");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-50 to-lime-100 flex flex-col items-center justify-center p-6 gap-6">
      <h1 className="text-3xl font-bold text-gray-800">Benvenuto 👋</h1>
      <p className="text-gray-600 text-center">
        Scansiona il QR del tavolo/ombrellone oppure inserisci l’ID manualmente.
      </p>

      <button
        className="bg-lime-400 hover:bg-lime-500 text-white px-6 py-3 rounded-xl shadow transition"
        onClick={() => setUseScanner((s) => !s)}
      >
        {useScanner ? "Usa inserimento manuale" : "Scansiona QR code"}
      </button>

      {useScanner ? (
        <div className="w-full max-w-sm bg-white rounded-xl shadow p-3">
        </div>
      ) : (
        <div className="w-full max-w-sm bg-white rounded-xl shadow p-4 flex flex-col gap-3">
          <label className="text-sm text-gray-600">ID Tavolo / Ombrellone</label>
          <input
            type="text"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-500"
            placeholder="Es. T12, O7..."
            value={manual}
            onChange={(e) => setManual(e.target.value)}
          />
          <button
            className="bg-lime-400 hover:bg-lime-500 text-white px-6 py-2 rounded-lg shadow transition"
            onClick={onManualConfirm}
          >
            Continua
          </button>
        </div>
      )}
    </div>
  );
}
