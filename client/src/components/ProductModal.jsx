export default function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ✖
        </button>
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-60 object-cover rounded"
        />
        <h2 className="mt-4 text-xl font-bold">{product.name}</h2>
        <p className="mt-2 text-gray-300">{product.nome}</p>
        <p className="mt-2 font-bold">{product.prezzo.toFixed(2)} €</p>
        <button
          onClick={() => { onAddToCart(product); onClose(); }}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Aggiungi al carrello
        </button>
      </div>
    </div>
  );
}
