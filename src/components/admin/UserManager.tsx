import { useEffect, useState } from "react";
import api from "../../config/axiosConfig";
import { Edit2, Trash2, X, Check, ChevronLeft, Shield, ChevronRight } from "lucide-react";

interface Role {
  id: string;
  role: "ADMIN" | "USER";
}

interface User {
  id: string;
  fullname: string;
  username: string;
  email: string;
  roles: Role[];
  createdAt: string;
}

interface UserPage {
  content: User[];
  totalPages: number;
  first: boolean;
  last: boolean;
  number: number; // Página actual
}

export default function UserManager() {
  const [data, setData] = useState<UserPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  
  // Estado para Edición
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ fullname: "", email: "", isAdmin: false });

  const loadUsers = async (pageNum: number) => {
    setLoading(true);
    try {
      const { data } = await api.get<UserPage>(`/users?page=${pageNum}&limit=5&sortBy=createdAt&ascending=false`);
      setData(data);
      setPage(pageNum);
    } catch (error) {
      console.error("Error cargando usuarios", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(0);
  }, []);

  // --- ACCIONES ---

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await api.delete(`/users/${id}`);
      loadUsers(page); // Recargar página actual
    } catch (error) {
      alert("Error al eliminar usuario");
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditForm({
      fullname: user.fullname,
      email: user.email,
      isAdmin: user.roles.some(r => r.role === "ADMIN")
    });
  };

  const handleSave = async () => {
    if (!editingUser) return;
    
    try {
      // 1. Actualizar datos básicos (PUT /users/{id})
      await api.put(`/users/${editingUser.id}`, {
        ...editingUser, // Mantenemos ID y otros campos
        fullname: editForm.fullname,
        email: editForm.email
      });

      // 2. Actualizar Roles (PATCH /roles)
      // Definimos la lista de roles basada en el checkbox
      const roles = ["USER"]; // Siempre es usuario
      if (editForm.isAdmin) roles.push("ADMIN");

      await api.patch("/roles", {
        userId: editingUser.id,
        roles: roles
      });

      alert("Usuario actualizado correctamente");
      setEditingUser(null);
      loadUsers(page);

    } catch (error) {
      console.error(error);
      alert("Error al guardar cambios. Revisa la consola.");
    }
  };

  // --- UI HELPERS ---

  const getAvatarColor = (name: string) => {
    const colors = ["bg-indigo-100 text-indigo-600", "bg-pink-100 text-pink-600", "bg-blue-100 text-blue-600", "bg-teal-100 text-teal-600"];
    return colors[(name ? name.length : 0) % colors.length];
  };

  return (
    <div className="font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Gestión de Usuarios</h2>
        <div className="text-sm text-gray-500">
            Total: {data?.content.length || 0} usuarios en esta página
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 uppercase text-xs font-semibold tracking-wider border-b border-gray-100">
                <th className="p-4 pl-6">Usuario</th>
                <th className="p-4">Email / Username</th>
                <th className="p-4">Roles</th>
                <th className="p-4">Fecha Registro</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="p-12 text-center text-gray-400">Cargando...</td></tr>
              ) : (
                data?.content.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                    
                    <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${getAvatarColor(user.fullname)}`}>
                                {user.fullname?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <span className="font-semibold text-gray-800">{user.fullname}</span>
                        </div>
                    </td>

                    <td className="p-4">
                        <div className="flex flex-col">
                            <span className="text-gray-700">{user.email}</span>
                            <span className="text-xs text-gray-400">@{user.username}</span>
                        </div>
                    </td>

                    <td className="p-4">
                        <div className="flex gap-1">
                            {user.roles?.map(r => (
                                <span key={r.id} className={`px-2 py-0.5 rounded text-[10px] font-bold border ${r.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                    {r.role}
                                </span>
                            ))}
                        </div>
                    </td>

                    <td className="p-4 text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                        <div className="flex justify-center gap-2">
                            <button onClick={() => openEditModal(user)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(user.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {data && (
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
                <button 
                    disabled={data.first}
                    onClick={() => loadUsers(page - 1)}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-4 h-4" /> Anterior
                </button>
                <span className="text-xs text-gray-400">
                    Página {data.number + 1} de {data.totalPages}
                </span>
                <button 
                    disabled={data.last}
                    onClick={() => loadUsers(page + 1)}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Siguiente <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        )}
      </div>

      {/* Modal de Edición */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Editar Usuario</h3>
                    <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                        <input 
                            value={editForm.fullname}
                            onChange={e => setEditForm({...editForm, fullname: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            {/* CAMBIO: Usamos un div en lugar de un input */}
                            <div className="w-full border border-gray-200 bg-gray-50 text-gray-600 rounded-lg px-3 py-2 text-sm select-all">
                                {editForm.email}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-amber-600/80 font-medium">
                                <Shield className="w-3 h-3" />
                                <span>No editable (Vinculado a Google)</span>
                            </div>
                    </div>
                    
                    <div className="pt-2 border-t mt-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${editForm.isAdmin ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'}`}>
                                {editForm.isAdmin && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <input 
                                type="checkbox" 
                                className="hidden"
                                checked={editForm.isAdmin}
                                onChange={e => setEditForm({...editForm, isAdmin: e.target.checked})}
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-800">Permisos de Administrador</span>
                                <span className="text-xs text-gray-500">Habilita acceso completo al dashboard</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button onClick={() => setEditingUser(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-200">Guardar Cambios</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}