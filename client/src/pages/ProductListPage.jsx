/*import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductListPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const products = [
    { id: 1, name: "Prodotto 1", price: 5 },
    { id: 2, name: "Prodotto 2", price: 7 },
  ]; // Qui poi useremo fetch API

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Categoria {id}</h1>
      <div className="flex flex-col gap-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="p-4 bg-white rounded shadow flex justify-between"
          >
            <span>{p.name} - €{p.price}</span>
            <button
              onClick={() => addToCart(p)}
              className="bg-lime-300 px-3 py-1 rounded shadow"
            >
              Aggiungi
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
*/