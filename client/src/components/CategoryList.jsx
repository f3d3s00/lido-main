import { useNavigate } from "react-router-dom";
export default function CategoryList({ categories }) {
  const navigate = useNavigate();

  if (!categories || categories.length === 0) {
    return <p className="text-red-500">Nessuna categoria disponibile.</p>;
  }

  return (
    <div className="w-full flex flex-col gap-3 mt-4">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => navigate(`/category/${cat.id}`)}
          className="w-full bg-lime-300 text-gray-900 font-semibold py-4 rounded-xl shadow-md transform hover:scale-110 active:scale-95 hover:shadow-lg transition"
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
