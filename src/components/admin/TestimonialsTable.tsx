import { useEffect, useState } from "react";
import api from "../../config/axiosConfig";
import { Eye, Check, X, Filter, Search } from "lucide-react";

// Tipos
interface CategoryOrTag {
  id: string;
  name: string;
}

interface Testimonial {
  id: string;
  title: string;
  content: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdByName: string;
  createdAt: string;
  categories: CategoryOrTag[];
  tags: CategoryOrTag[];
}

// Aceptamos una prop para saber con qué filtro arrancar
interface Props {
  initialStatus?: "PENDING" | "APPROVED" | "REJECTED";
}

export default function TestimonialsTable({ initialStatus = "APPROVED" }: Props) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  // Usamos la prop como valor inicial
  const [filterStatus, setFilterStatus] = useState<string>(initialStatus);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Cada vez que cambie la "pestaña" (initialStatus), reseteamos el filtro interno
  useEffect(() => {
    setFilterStatus(initialStatus);
  }, [initialStatus]);

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Testimonial[]>(`/api/testimonials?status=${filterStatus}`);
      setTestimonials(data);
    } catch (error) {
      console.error("Error al cargar testimonios", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, [filterStatus]);

  const handleModerate = async (id: string, newStatus: "APPROVED" | "REJECTED") => {
    try {
      await api.patch(`/api/testimonials/${id}/moderate`, { status: newStatus });
      loadTestimonials();
    } catch (error) {
      alert("Error al moderar.");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
  };

  const getAvatarColor = (name: string) => {
    const colors = ["bg-red-100 text-red-600 border-red-200", "bg-green-100 text-green-600 border-green-200", "bg-blue-100 text-blue-600 border-blue-200", "bg-amber-100 text-amber-600 border-amber-200", "bg-purple-100 text-purple-600 border-purple-200"];
    return colors[(name ? name.length : 0) % colors.length];
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const config = {
      APPROVED: { label: "Aprobado", className: "bg-blue-100 text-blue-700 border-blue-200" },
      PENDING: { label: "Pendiente", className: "bg-amber-100 text-amber-700 border-amber-200" },
      REJECTED: { label: "Rechazado", className: "bg-red-100 text-red-700 border-red-200" },
    };
    // @ts-expect-error - status string
    const style = config[status] || { label: status, className: "bg-gray-100" };
    return <span className={`px-3 py-1 rounded-full text-xs font-medium border ${style.className}`}>{style.label}</span>;
  };

  const filteredTestimonials = testimonials.filter((t) => {
    const term = searchTerm.toLowerCase();
    return (
      t.title.toLowerCase().includes(term) ||
      t.content.toLowerCase().includes(term) ||
      (t.createdByName && t.createdByName.toLowerCase().includes(term))
    );
  });

  return (
    <div className="font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800">
          {/* Título dinámico según lo que estemos viendo */}
          {initialStatus === "PENDING" ? "Cola de Moderación" : "Gestión de Testimonios"}
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none"/>
                <input 
                    type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border rounded-full text-sm bg-white text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none w-full shadow-sm hover:bg-gray-50 transition-colors"
                />
            </div>
            {/* Filter */}
            <div className="relative w-full sm:w-auto">
                <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-500 pointer-events-none"/>
                <select 
                    value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-9 pr-8 py-2 border rounded-full text-sm bg-white text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer shadow-sm hover:bg-gray-50 w-full appearance-none"
                >
                    <option value="PENDING">Pendientes</option>
                    <option value="APPROVED">Aprobados</option>
                    <option value="REJECTED">Rechazados</option>
                </select>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 uppercase text-xs font-semibold tracking-wider border-b border-gray-100">
                <th className="p-4 pl-6">#</th>
                <th className="p-4">Autor</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Categoría/Tags</th>
                <th className="p-4 w-1/3">Preview</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={7} className="p-12 text-center text-gray-500 italic">Cargando datos...</td></tr>
              ) : filteredTestimonials.length === 0 ? (
                <tr><td colSpan={7} className="p-12 text-center text-gray-500">No se encontraron testimonios.</td></tr>
              ) : (
                filteredTestimonials.map((t, index) => (
                  <tr key={t.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="p-4 pl-6 text-gray-400 font-mono text-xs">{(index + 1).toString().padStart(2, '0')}</td>
                    <td className="p-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border ${getAvatarColor(t.createdByName)}`}>
                                {t.createdByName ? t.createdByName.charAt(0).toUpperCase() : "?"}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-800 text-sm">{t.createdByName || "Anónimo"}</span>
                                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Usuario</span>
                            </div>
                        </div>
                    </td>
                    <td className="p-4"><StatusBadge status={t.status} /></td>
                    <td className="p-4 text-gray-500 whitespace-nowrap">{formatDate(t.createdAt)}</td>
                    <td className="p-4">
                        <div className="flex flex-col gap-1.5 items-start">
                            {t.categories[0] ? <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100 font-medium">{t.categories[0].name}</span> : <span className="text-gray-300 text-xs">-</span>}
                        </div>
                    </td>
                    <td className="p-4"><p className="text-gray-600 text-xs line-clamp-2 max-w-xs italic leading-relaxed">"{t.content}"</p></td>
                    <td className="p-4">
                        <div className="flex justify-center items-center gap-1">
                            <button title="Ver detalle" className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Eye className="w-4 h-4" /></button>
                            {t.status !== 'APPROVED' && (
                                <button onClick={() => handleModerate(t.id, 'APPROVED')} title="Aprobar" className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"><Check className="w-4 h-4" /></button>
                            )}
                            {t.status !== 'REJECTED' && (
                                <button onClick={() => handleModerate(t.id, 'REJECTED')} title="Rechazar" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><X className="w-4 h-4" /></button>
                            )}
                        </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
