import { useEffect, useState } from "react";
import api from "../../config/axiosConfig";
import { User, Server, FileText, Code, Copy, Check, Edit2, X, Shield } from "lucide-react";

interface UserDetail {
  id: string;
  fullname: string;
  email: string;
  // El backend devuelve esto en /users/me
}

export default function ConfigPanel() {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Estados para la edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Cargar usuario actual
  const loadUser = () => {
    api.get<UserDetail>("/users/me")
      .then((res) => {
        setUser(res.data);
        setNewName(res.data.fullname); // Inicializar formulario
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Guardar cambios
  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      // Usamos el endpoint PUT /users/{id}
      // Nota: El backend espera el objeto User, enviamos lo que tenemos + el cambio
      await api.put(`/users/${user.id}`, {
        id: user.id,
        email: user.email,
        fullname: newName,
        // Al enviar el objeto así, el backend actualiza los campos básicos
      });
      
      await loadUser(); // Recargar datos frescos
      setIsEditModalOpen(false);
      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar perfil");
    } finally {
      setIsSaving(false);
    }
  };

  const embedCode = `
// Ejemplo: Obtener testimonios aprobados con JavaScript
fetch('http://localhost:8080/api/testimonials/search?query=')
  .then(response => response.json())
  .then(data => {
    console.log("Testimonios:", data);
    // Renderizar en tu sitio web...
  });
  `.trim();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="font-sans max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Configuración y API</h2>

      <div className="grid gap-8">
        
        {/* SECCIÓN 1: PERFIL */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <User className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-700">Tu Cuenta</h3>
            </div>
            
            <button 
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
                <Edit2 className="w-4 h-4" /> Editar Perfil
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Nombre</label>
              <p className="text-gray-800 font-medium text-lg">{user?.fullname || "Cargando..."}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</label>
              <div className="flex items-center gap-2">
                <p className="text-gray-800 font-medium">{user?.email || "..."}</p>
                <span className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded border">Google</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">ID de Usuario</label>
              <p className="text-gray-500 font-mono text-xs bg-gray-50 p-2 rounded border inline-block">{user?.id || "..."}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Rol</label>
              <span className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded font-bold">ADMINISTRADOR</span>
            </div>
          </div>
        </section>

        {/* SECCIÓN 2: DOCUMENTACIÓN API */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-700">Documentación & Estado</h3>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-gray-400" />
              <div>
                <h4 className="font-semibold text-gray-800">Swagger UI</h4>
                <p className="text-sm text-gray-500">Documentación interactiva de todos los endpoints.</p>
              </div>
            </div>
            <a 
              href="http://localhost:8080/swagger-ui/index.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm flex items-center gap-2"
            >
              Abrir Documentación <Server className="w-4 h-4"/>
            </a>
          </div>
        </section>

        {/* SECCIÓN 3: INTEGRACIÓN (EMBED) */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-700">Integración en Sitio Web</h3>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Utiliza este código para obtener los testimonios <strong>aprobados</strong> y mostrarlos en tu landing page externa.
          </p>

          <div className="relative bg-gray-900 rounded-xl overflow-hidden group">
            <div className="absolute top-3 right-3">
              <button 
                onClick={copyToClipboard}
                className="text-gray-400 hover:text-white p-2 rounded bg-white/10 hover:bg-white/20 transition"
                title="Copiar código"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <pre className="p-5 text-sm font-mono text-blue-100 overflow-x-auto">
              <code>{embedCode}</code>
            </pre>
          </div>
        </section>

      </div>

      {/* MODAL DE EDICIÓN DE PERFIL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Editar mi Perfil</h3>
                    <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-5">
                    {/* Campo Editable */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                        <input 
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Tu nombre"
                        />
                    </div>

                    {/* Campo Bloqueado (Visualmente distinto) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg px-3 py-2 text-sm cursor-not-allowed select-none flex justify-between items-center">
                            <span>{user?.email}</span>
                            <Shield className="w-3 h-3 text-amber-500" />
                        </div>
                        <p className="text-[10px] text-amber-600 mt-1.5 ml-1">
                            El email está vinculado a tu cuenta de Google y no puede cambiarse.
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button 
                        onClick={() => setIsEditModalOpen(false)} 
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                        disabled={isSaving}
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSaveProfile} 
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all disabled:opacity-70 disabled:cursor-wait"
                        disabled={isSaving}
                    >
                        {isSaving ? "Guardando..." : "Guardar Cambios"}
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}