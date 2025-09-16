export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
      {product.img && (
        <img
          src={product.img}
          alt={product.name}
          className="h-40 w-full object-cover"
        />
      )}

      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          {product.descrizione && (
            <p className="text-gray-500 mt-1 text-sm">{product.descrizione}</p>
          )}
          <p className="text-gray-700 mt-2 font-medium">{product.prezzo} €</p>
        </div>

        <button
          className="mt-4 bg-lime-400 hover:bg-lime-500 text-white py-2 rounded-xl shadow transition"
          onClick={() => addToCart(product)}
        >
          Aggiungi
        </button>
      </div>
    </div>
  );
}

