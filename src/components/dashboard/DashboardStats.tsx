import { useEffect, useState } from "react";
import api from "../../config/axiosConfig";
import { CheckCircle, Hourglass, AlertCircle, Layout, type LucideIcon } from "lucide-react";

interface Stats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  approvedToday?: number;
}

interface CardConfig {
  title: string;
  count: number | undefined;
  icon: LucideIcon;
  colorClass: string;   // Para el texto y el icono
  borderClass: string;  // Para el borde
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get<Stats>("/api/testimonials/stats")
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error(err);
        setError(true);
      });
  }, []);

  if (error) return <div className="text-red-500 text-sm">Error al cargar datos.</div>;
  if (!stats) return <div className="text-gray-400 text-sm animate-pulse">Cargando...</div>;

  const cards: CardConfig[] = [
    {
      title: "Testimonios Publicados",
      count: stats.approved,
      icon: CheckCircle,
      colorClass: "text-emerald-400",
      borderClass: "border-emerald-400",
    },
    {
      title: "Testimonios Pendientes",
      count: stats.pending,
      icon: Hourglass, 
      colorClass: "text-amber-300",
      borderClass: "border-amber-300",
    },
    {
      title: "Testimonios Rechazados",
      count: stats.rejected,
      icon: AlertCircle, 
      colorClass: "text-red-400",
      borderClass: "border-red-400",
    },
    {
      title: "Total en Plataforma",
      count: stats.total,
      icon: Layout, 
      colorClass: "text-blue-400",
      borderClass: "border-blue-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <div 
          key={index}
          // Fondo blanco, bordes redondeados y borde de color grueso (3px)
          className={`bg-white rounded-2xl border-[3px] ${card.borderClass} p-5 flex flex-col justify-between h-32 shadow-sm transition-transform hover:scale-105`}
        >
          {/* Título en negro/gris oscuro arriba */}
          <h3 className="text-sm font-bold text-gray-800 leading-tight">
            {card.title}
          </h3>

          {/* Fila inferior con Icono y Número */}
          <div className="flex items-center gap-3 mt-2">
            {/* Icono */}
            <card.icon className={`w-8 h-8 ${card.colorClass}`} strokeWidth={2} />
            
            {/* Número */}
            <span className={`text-4xl font-bold ${card.colorClass}`}>
              {card.count}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}