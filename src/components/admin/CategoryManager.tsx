import { useEffect, useState } from "react";
import api from "../../config/axiosConfig";


interface Category {
  id: string; 
  name: string;
  description?: string;
}


interface CategoryRequest {
  name: string;
  description: string;
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CategoryRequest>({ name: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Cargar categorías al iniciar (GET)
  const loadCategories = () => {
    api.get<Category[]>("/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error cargando categorías", err));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Manejar envío del formulario (POST o PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // PUT /api/categories/{id}
        await api.put(`/api/categories/${editingId}`, form);
      } else {
        // POST /api/categories
        await api.post("/api/categories", form);
      }
      // Resetear form y recargar lista
      setForm({ name: "", description: "" });
      setEditingId(null);
      loadCategories();
    } catch (error) {
      alert("Error al guardar la categoría");
    }
  };

  // Preparar edición
  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, description: cat.description || "" });
    setEditingId(cat.id);
  };

  // Eliminar (DELETE)
  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta categoría?")) return;
    try {
      await api.delete(`/api/categories/${id}`);
      loadCategories();
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Gestión de Categorías</h2>
      
      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl border shadow mb-6 flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            className="border p-2 w-full rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            maxLength={100} 
          />
        </div>
        <div className="flex-[2]">
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <input
            className="border p-2 w-full rounded"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            maxLength={255}
          />
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded h-10 hover:bg-indigo-700">
          {editingId ? "Actualizar" : "Crear"}
        </button>
        {editingId && (
          <button 
            type="button" 
            onClick={() => { setEditingId(null); setForm({ name: "", description: "" }); }}
            className="bg-gray-400 text-white px-4 py-2 rounded h-10"
          >
            Cancelar
          </button>
        )}
      </form>

      {/* Lista */}
      <div className="grid gap-3">
        {categories.map((cat) => (
          <div key={cat.id} className="flex justify-between items-center p-3 border rounded bg-gray-50">
            <div>
              <h3 className="font-bold">{cat.name}</h3>
              <p className="text-sm text-gray-600">{cat.description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:underline">Editar</button>
              <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:underline">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}