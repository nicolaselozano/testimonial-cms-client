import { useEffect, useState } from "react";
import api from "../../config/axiosConfig";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

interface Testimonial {
  id: string;
  title: string;
  createdByName: string;
}

export default function DashboardWidgets() {
  const [pendingTasks, setPendingTasks] = useState<Testimonial[]>([]);

  useEffect(() => {
    // Reutilizamos el endpoint que ya funciona para buscar pendientes
    api.get<Testimonial[]>("/api/testimonials?status=PENDING")
      .then((res) => {
        // Solo tomamos los primeros 5 para el widget
        setPendingTasks(res.data.slice(0, 5));
      })
      .catch(console.error);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* WIDGET 1: Tareas del día (Simulado con Pendientes) */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">Tareas Pendientes</h3>
          <Link to="/admin" className="text-sm text-blue-600 hover:underline">Ver todo</Link>
        </div>

        <div className="space-y-4">
          {pendingTasks.length === 0 ? (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
              <Check className="w-5 h-5"/> ¡Estás al día! No hay testimonios pendientes.
            </div>
          ) : (
            pendingTasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                    ?
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Revisar testimonio de {t.createdByName || "Usuario"}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[200px]">{t.title}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                  Pendiente
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* WIDGET 2: Aviso / Call to Action */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold mb-2">Estado del Sistema</h3>
          <p className="text-blue-100 text-sm mb-6">
            El sistema está operando correctamente. Tienes {pendingTasks.length} elementos esperando moderación.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-blue-200">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div> API Online
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-200">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div> Base de datos conectada
            </div>
          </div>
        </div>

        <button 
            
            className="mt-6 w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-medium"
        >
          Ir a Configuración <ArrowRight className="w-4 h-4"/>
        </button>
      </div>
    </div>
  );
}