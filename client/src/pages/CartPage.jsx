import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart, totalPrice } = useCart();

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Il tuo carrello</h1>
      {cartItems.length === 0 ? (
        <p>Il carrello è vuotooo</p>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {cartItems.map((item, idx) => (
              <div
                key={item.id_prodotto ? item.id_prodotto : idx} // MODIFICATO: chiave unica
                className="flex justify-between items-center p-2 bg-white rounded shadow"
              >
                <span>
                  {item.descrizione} x {item.quantity} - € {(item.prezzo * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => removeFromCart(item.id_prodotto)} // MODIFICATO: usa id_prodotto
                  className="text-red-500"
                >
                  Rimuovi
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 font-bold text-lg">Totale: € {totalPrice.toFixed(2)}</div>

          <button
            onClick={clearCart}
            className="mt-4 w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition"
          >
            Svuota carrello
          </button>
        </>
      )}
    </div>
  );
}