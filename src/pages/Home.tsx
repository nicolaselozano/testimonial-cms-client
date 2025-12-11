import { useEffect, useState } from "react";
import { useTestimonials } from "../components/hooks/useTestimonials";
import TestimonialCarousel from "../components/home/TestimonialCarousel";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import EmbedCodeBlock from "../components/home/EmbedCodeBlock";

export default function Home() {
  const { results, loading, getTestimonials } = useTestimonials();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getTestimonials();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/testimonials/list?query=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fijo */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur py-4 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Testimonial CMS</h1>

          <form onSubmit={handleSearch} className="flex gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar testimonios..."
                className="border rounded-lg pl-10 pr-4 py-2 w-72 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition
              cursor-pointer"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>

      {/* Hero section */}
      <section className="text-center py-16 px-6 bg-gradient-to-b from-white to-blue-50">
        <h2 className="text-5xl font-bold text-gray-800 leading-tight">
          Historias reales que generan impacto
        </h2>

        <p className="mt-5 text-gray-600 max-w-2xl mx-auto text-lg">
          Centralizá testimonios, organizalos por categorías y mostrálos de
          forma profesional en tu sitio.
        </p>
      </section>

      {/* Icon row */}
      <section className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 py-10">
        <div className="bg-white shadow-md p-6 rounded-2xl border hover:shadow-lg transition">
          <h4 className="text-xl font-semibold text-blue-600 mb-2">
            Gestión fácil
          </h4>
          <p className="text-gray-600 text-sm">
            Subí testimonios, imágenes y etiquetas con un solo clic.
          </p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-2xl border hover:shadow-lg transition">
          <h4 className="text-xl font-semibold text-blue-600 mb-2">
            Organización inteligente
          </h4>
          <p className="text-gray-600 text-sm">
            Filtrá por categorías, tags o estados.
          </p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-2xl border hover:shadow-lg transition">
          <h4 className="text-xl font-semibold text-blue-600 mb-2">
            Integración profesional
          </h4>
          <p className="text-gray-600 text-sm">
            Mostrá testimonios en tu web de forma atractiva.
          </p>
        </div>
      </section>

      {/* Carrusel */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h3 className="text-3xl font-semibold mb-6 text-gray-800">
          Testimonios destacados
        </h3>

        {loading ? (
          <p className="text-center text-gray-500">Cargando...</p>
        ) : (
          <TestimonialCarousel items={results.slice(0, 5)} />
        )}
      </section>

      {/* Sección código embed */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h3 className="text-3xl font-semibold mb-4 text-gray-800">
          Integración embebida
        </h3>

        <p className="text-gray-600 mb-4">
          Copiá y pegá este código en cualquier sitio web (WordPress, Webflow,
          HTML, etc.) para mostrar testimonios aprobados.
        </p>

        <EmbedCodeBlock />
      </section>
    </div>
  );
}
