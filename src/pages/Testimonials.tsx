import { useState, useEffect } from "react";
import api from "../config/axiosConfig";
import CreateTestimonial from "../components/testimonials/CreateTestimonial";
import { motion, AnimatePresence } from "framer-motion";

// Iconos
const ICONS = {
  "mis-testimonios": (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  "crear-testimonio": (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  "testimonios-publicos": (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  "mi-perfil": (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
};

export default function Testimonials() {
  const [activeSection, setActiveSection] = useState("mis-testimonios");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [misTestimonios, setMisTestimonios] = useState<any[]>([]);
  const [testimoniosPublicos, setTestimoniosPublicos] = useState<any[]>([]);
  const [loadingTestimonios, setLoadingTestimonios] = useState(true);

  /* ============================
      Cargar usuario logueado
     ============================ */
  useEffect(() => {
    async function cargarUsuario() {
      try {
        const res = await api.get("/users/me");
        setUserName(res.data.fullname);
        setUserId(res.data.id);
      } catch {
        setUserName("Invitado");
        setUserId(null);
      } finally {
        setLoadingUser(false);
      }
    }

    cargarUsuario();
  }, []);

  /* ============================
      Cargar testimonios
     ============================ */
  useEffect(() => {
    if (!userId) {
      // Usuario no logueado --> no cargar testimonios privados
      setLoadingTestimonios(false);
      return;
    }

    const cargarTestimonios = async () => {
      try {
        const response = await api.get("/api/testimonials/mine");
        const todos = response.data || [];
        setMisTestimonios(todos.filter((t: any) => t.createdById === userId));
        setTestimoniosPublicos(todos.filter((t: any) => t.status === "APPROVED"));
      } catch (err) {
        console.error("Error cargando testimonios:", err);
      } finally {
        setLoadingTestimonios(false);
      }
    };

    cargarTestimonios();
  }, [userId]);

  /* ============================
      Menú lateral
     ============================ */
  const USER_MENU = [
    { id: "mis-testimonios", title: "Mis Testimonios", icon: ICONS["mis-testimonios"] },
    { id: "crear-testimonio", title: "Crear Testimonio", icon: ICONS["crear-testimonio"] },
    { id: "testimonios-publicos", title: "Testimonios Públicos", icon: ICONS["testimonios-publicos"] },
    { id: "mi-perfil", title: "Mi Perfil", icon: ICONS["mi-perfil"] }
  ];

  /* ============================
      Render de secciones
     ============================ */
  const renderContent = () => {
    if (loadingUser || loadingTestimonios) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    switch (activeSection) {
      case "mis-testimonios":
        return (
          <MisTestimonios
            misTestimonios={misTestimonios}
            setActiveSection={setActiveSection}
          />
        );

      case "crear-testimonio":
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Crear Nuevo Testimonio</h2>
              <p className="text-gray-600">Compartí tu experiencia con la comunidad</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <CreateTestimonial />
            </div>
          </div>
        );

      case "testimonios-publicos":
        return (
          <TestimoniosPublicos testimonios={testimoniosPublicos} />
        );

      case "mi-perfil":
        return (
          <MiPerfil
            userId={userId}
            misTestimonios={misTestimonios}
            setUserName={setUserName}
          />
        );

      default:
        return <div>Sección no encontrada</div>;
    }
  };

  /* ============================
      Layout general
     ============================ */
  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">

      {/* Menú lateral */}
      <aside className="w-64 bg-indigo-600 text-white flex flex-col">
        <div className="p-6 border-b border-indigo-500">
          <h1 className="text-xl font-bold">Mi Panel</h1>
          <p className="text-indigo-200 text-sm">{userName || "Invitado"}</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {USER_MENU.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? "bg-indigo-700 text-white"
                      : "text-indigo-200 hover:bg-indigo-500 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-indigo-500">
          <p className="text-indigo-200 text-xs text-center">Testimonios CMS v1.0</p>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {USER_MENU.find(item => item.id === activeSection)?.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
              {userName ? userName.charAt(0).toUpperCase() : "?"}
            </div>
            <div className="flex flex-col">
              <span className="text-gray-800 font-medium text-sm">{userName}</span>
              <span className="text-xs text-gray-500">Usuario activo</span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ============================================================
   Componente: Mis Testimonios
   ============================================================ */
function MisTestimonios({
  misTestimonios,
  setActiveSection
}: {
  misTestimonios: any[];
  setActiveSection: (x: string) => void;
}) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Mis Testimonios</h2>
        <p className="text-gray-600">Aquí podés ver todos los testimonios que has creado</p>
      </div>

      {misTestimonios.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 mb-4">Aún no has creado testimonios</p>
          <button
            onClick={() => setActiveSection("crear-testimonio")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Crear mi primer testimonio
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Listado de Testimonios</h3>
            <p className="text-sm text-gray-600 mt-1">{misTestimonios.length} testimonios encontrados</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {misTestimonios.map((testimonio) => (
                  <tr key={testimonio.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {testimonio.images?.[0] && (
                          <img
                            src={testimonio.images[0].url}
                            alt={testimonio.title}
                            className="w-10 h-10 rounded-lg object-cover mr-3"
                          />
                        )}
                        <div className="text-sm font-medium text-gray-900">
                          {testimonio.title}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          testimonio.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : testimonio.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {testimonio.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(testimonio.createdAt || "").toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">Ver</button>
                      {testimonio.status === "PENDING" && (
                        <button className="text-yellow-600 hover:text-yellow-900">Editar</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Componente: Testimonios Públicos
   ============================================================ */
function TestimoniosPublicos({ testimonios }: { testimonios: any[] }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Testimonios Públicos</h2>
        <p className="text-gray-600">Experiencias compartidas por la comunidad</p>
      </div>

      {testimonios.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500">No hay testimonios públicos aún</p>
        </div>
      ) : (
        <div className="space-y-4">
          {testimonios.map((testimonio) => (
            <div key={testimonio.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{testimonio.title}</h3>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  APROBADO
                </span>
              </div>
              <p className="text-gray-600 mb-4">{testimonio.content}</p>

              {testimonio.images?.length > 0 && (
                <img
                  src={testimonio.images[0].url}
                  alt={testimonio.title}
                  className="w-full max-w-xs h-32 object-cover rounded-lg mb-4"
                />
              )}

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Por {testimonio.createdByName}</span>
                <span>{new Date(testimonio.createdAt || "").toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Componente: Mi Perfil
   ============================================================ */
function MiPerfil({
  userId,
  misTestimonios,
  setUserName
}: {
  userId: string | null;
  misTestimonios: any[];
  setUserName: (name: string) => void;
}) {
  const [fullname, setFullname] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userId) return;
    api.get("/users/me").then((res) => setFullname(res.data.fullname));
  }, [userId]);

  const updateProfile = async (payload: { fullname?: string }) => {
    setLoading(true);
    try {
      await api.patch(
        "/users/update/me",
        { username: payload.fullname, fullname: payload.fullname },
        { headers: { "Content-Type": "application/json" } }
      );
      setFullname(payload.fullname!);
      setUserName(payload.fullname!);
      setMessage("Perfil actualizado ✅");
    } catch {
      setMessage("Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = async () => {
    const newName = prompt("Nuevo nombre:", fullname);
    if (!newName || newName === fullname) return;
    await updateProfile({ fullname: newName });
  };

  if (!userId) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <p className="text-gray-500">No estás logueado</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Mi Perfil</h2>
        <p className="text-gray-600">Información de tu cuenta</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-3xl mx-auto mb-4">
              {fullname.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-xl font-bold text-gray-800">{fullname}</h3>
            <p className="text-gray-600">Usuario activo</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleNameChange}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Actualizando..." : "Actualizar nombre"}
            </button>
            {message && <p className="text-sm text-green-600">{message}</p>}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">Estadísticas de tu cuenta</p>

            <div className="grid grid-cols-3 gap-6 mt-4 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{misTestimonios.length}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {misTestimonios.filter((t) => t.status === "APPROVED").length}
                </div>
                <div className="text-sm text-gray-600">Aprob.</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {misTestimonios.filter((t) => t.status === "PENDING").length}
                </div>
                <div className="text-sm text-gray-600">Pend.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
