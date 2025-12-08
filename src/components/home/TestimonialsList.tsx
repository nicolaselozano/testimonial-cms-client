// src/pages/TestimonialList.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTestimonials } from "../hooks/useTestimonials";

export default function TestimonialList() {
  const { results, loading, search, getTestimonials } = useTestimonials();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const queryParam = params.get("query") ?? "";
  const [query, setQuery] = useState(queryParam);

  // 🔥 Efecto que se ejecuta cuando cambia queryParam en la URL
  useEffect(() => {
    if (queryParam.trim()) {
      search(queryParam);
    } else {
      getTestimonials();
    }
  }, [queryParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Si no hay texto → quitar filtro
    if (!query.trim()) {
      navigate("/testimonials/list");
      return;
    }

    // Actualiza la URL, lo que dispara el useEffect automáticamente
    navigate(`/testimonials/list?query=${encodeURIComponent(query)}`);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Barra de búsqueda */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar testimonios..."
          className="border rounded-lg px-4 py-2 w-64"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Buscar
        </button>
      </form>

      <h1 className="text-2xl font-bold mb-6">
        {queryParam
          ? <>Resultados para: <span className="text-blue-600">"{queryParam}"</span></>
          : "Todos los testimonios"}
      </h1>

      {loading && <p>Cargando...</p>}

      {!loading && results.length === 0 && (
        <p className="text-gray-500">No se encontraron testimonios.</p>
      )}

      {/* GRID de tarjetas */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl shadow p-6 flex flex-col gap-3"
          >
            {t.images?.length > 0 && (
              <img
                src={t.images[0].url}
                alt=""
                className="w-full h-40 object-cover rounded-lg"
              />
            )}

            <h3 className="text-lg font-semibold">{t.title}</h3>
            <p className="text-gray-600 line-clamp-3">{t.content}</p>

            <div className="flex flex-wrap gap-2 mt-auto">
              {t.tags?.map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
