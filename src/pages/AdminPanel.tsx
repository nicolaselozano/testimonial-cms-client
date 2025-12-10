import { useState, useEffect } from "react";
import AdminGuard from "../components/admin/AdminGuard";
import PendingModeration from "../components/admin/PendingModeration";
import CategoryManager from "../components/admin/CategoryManager";
import TagManager from "../components/admin/TagManager";
import AdminSidebar from "../components/layout/AdminSidebar";
import api from "../config/axiosConfig"; 

interface UserDetailDto {
  id: string;
  email: string;
  fullname: string;
}

export default function AdminPanel() {
  const [view, setView] = useState("dashboard");
  const [user, setUser] = useState<UserDetailDto | null>(null);

  // DICCIONARIO DE TÍTULOS (Traducción de ID -> Título Real)
  const sectionTitles: Record<string, string> = {
    dashboard: "Dashboard Principal",
    testimonials: "Gestión de Testimonios", 
    moderation: "Moderación de Contenido",
    categories: "Categorías y Tags",
    users: "Gestión de Usuarios",
    config: "Configuración del Sistema",
  };

  useEffect(() => {

    api.get("/users/me")
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => console.error("Error cargando usuario:", err));
  }, []);

  return (
    <AdminGuard>
      <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
        
        {/* Sidebar */}
        <AdminSidebar activeView={view} setActiveView={setView} />

        {/* Contenido Principal */}
        <main className="flex-1 overflow-y-auto p-10">
          
          <header className="mb-10 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
             <h2 className="text-2xl font-bold text-gray-800 capitalize">
                {sectionTitles[view] || view}
             </h2>
             
             {/* SECCIÓN DE USUARIO CONECTADA AL BACKEND */}
             <div className="flex items-center gap-3">
                {/* Avatar con Inicial */}
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                  {/* Si ya cargó el usuario, mostramos la 1ra letra de su fullname. Si no, una 'U' */}
                  {user?.fullname ? user.fullname.charAt(0).toUpperCase() : "..."}
                </div>
                
                <div className="flex flex-col">
                  {/* Nombre traído de la BD */}
                  <span className="text-gray-800 font-medium text-sm">
                    {user?.fullname || "Cargando..."}
                  </span>
                  {/* Email */}
                  <span className="text-xs text-gray-500">
                    {user?.email || "Administrador"}
                  </span>
                </div>
             </div>
          </header>

          <div className="bg-white p-8 rounded-2xl shadow-sm min-h-[500px]">
             
             {view === "dashboard" && (
                <div className="text-center py-20">
                  <h3 className="text-xl text-gray-400">Bienvenido al Panel de CredEdu</h3>
                  <p className="mt-2 text-gray-500">Hola <b>{user?.fullname}</b>, selecciona una opción para comenzar.</p>
                </div>
             )}

             {view === "moderation" && <PendingModeration />}

             {view === "categories" && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                  <CategoryManager />
                  <TagManager />
                </div>
             )}
             
             {view === "testimonials" && (
                 <PendingModeration/>
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