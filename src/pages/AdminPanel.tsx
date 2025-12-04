import { useState } from "react";
import AdminGuard from "../components/admin/AdminGuard";
import PendingModeration from "../components/admin/PendingModeration";
import CategoryManager from "../components/admin/CategoryManager";
import TagManager from "../components/admin/TagManager";
import AdminSidebar from "../components/layout/AdminSidebar";

export default function AdminPanel() {
  // Estado para controlar qué sección se ve (por defecto: Dashboard)
  const [view, setView] = useState("dashboard");

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-100">
        
        {/* 1. La Barra Lateral Izquierda */}
        <AdminSidebar activeView={view} setActiveView={setView} />

        {/* 2. El Contenido Principal (Derecha) */}
        <main className="flex-1 p-8 overflow-y-auto">
          
          {/* Cabecera simple */}
          <header className="mb-8 flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-800 capitalize">
              {view === "categories" ? "Gestión de Categorías y Tags" : view}
            </h2>
            <div className="text-gray-500 text-sm">Admin: Tu Usuario</div>
          </header>

          {/* Renderizado condicional según el menú seleccionado */}
          <div className="bg-white p-6 rounded-2xl shadow-sm min-h-[500px]">
            
            {view === "dashboard" && (
              <div className="text-center py-20">
                <h3 className="text-xl text-gray-400">Bienvenido al Panel de CredEdu</h3>
                <p className="mt-2 text-gray-500">Selecciona una opción del menú para comenzar.</p>
              </div>
            )}

            {view === "moderation" && <PendingModeration />}

            {view === "categories" && (
              <div className="space-y-12">
                <CategoryManager />
                <hr className="border-gray-200" />
                <TagManager />
              </div>
            )}

            {(view === "users" || view === "config") && (
              <p className="text-gray-400 italic">Esta sección está en construcción 🚧</p>
            )}

          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
