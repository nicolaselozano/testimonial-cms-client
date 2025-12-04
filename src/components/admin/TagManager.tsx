import { useEffect, useState } from "react";
import api from "../../config/axiosConfig";

interface Tag {
  id: string;
  name: string;
}

export default function TagManager() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagName, setTagName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadTags = () => {
    api.get<Tag[]>("/api/tags").then((res) => setTags(res.data));
  };

  useEffect(() => {
    loadTags();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/tags/${editingId}`, { name: tagName });
      } else {
        await api.post("/api/tags", { name: tagName });
      }
      setTagName("");
      setEditingId(null);
      loadTags();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar tag?")) return;
    await api.delete(`/api/tags/${id}`);
    loadTags();
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Gestión de Tags</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl border shadow mb-6 flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Nombre del Tag</label>
          <input
            className="border p-2 w-full rounded"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            required
            maxLength={100}
          />
        </div>
        <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded h-10 hover:bg-teal-700">
          {editingId ? "Guardar" : "Agregar"}
        </button>
        {editingId && (
          <button 
            type="button" 
            onClick={() => { setEditingId(null); setTagName(""); }}
            className="bg-gray-400 text-white px-4 py-2 rounded h-10"
          >
            X
          </button>
        )}
      </form>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag.id} className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2">
            {tag.name}
            <button onClick={() => { setEditingId(tag.id); setTagName(tag.name); }} className="text-blue-500 text-xs">✎</button>
            <button onClick={() => handleDelete(tag.id)} className="text-red-500 font-bold text-xs">×</button>
          </span>
        ))}
      </div>
    </div>
  );
}