import { useEffect, useState } from "react";
import api from "../../config/axiosConfig";
import { CheckCircle, Clock, XCircle, Layout } from "lucide-react";


interface Stats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get<Stats>("/api/testimonials/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error cargando stats", err));
  }, []);

  if (!stats) return <p className="text-gray-400">Cargando estadísticas...</p>;

  // Configuración visual de las tarjetas para iterar limpio
  const cards = [
    {
      label: "Testimonios Publicados",
      value: stats.approved,
      icon: CheckCircle,
      color: "text-emerald-500",
      border: "border-emerald-400",
      bg: "bg-white",
    },
    {
      label: "Testimonios Pendientes",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-400",
      border: "border-amber-300",
      bg: "bg-white",
    },
    {
      label: "Testimonios Rechazados",
      value: stats.rejected,
      icon: XCircle,
      color: "text-red-500",
      border: "border-red-300",
      bg: "bg-white",
    },
    {
      label: "Total en Plataforma",
      value: stats.total,
      icon: Layout,
      color: "text-blue-500",
      border: "border-blue-300",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className={`p-6 rounded-2xl border-2 ${card.border} ${card.bg} shadow-sm flex flex-col justify-between h-32 relative overflow-hidden`}
        >
          <div className="z-10">
            <h4 className="text-sm font-semibold text-gray-600 mb-1">{card.label}</h4>
            <span className={`text-4xl font-bold ${card.color}`}>{card.value}</span>
          </div>
          <card.icon className={`absolute right-4 bottom-4 w-12 h-12 opacity-10 ${card.color}`} />
        </div>
      ))}
    </div>
  );
}