import { useState, useEffect } from "react";
import api from "../../config/axiosConfig";

interface Props {
  onSuccess?: () => void;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Tag {
  id: string;
  name: string;
}

export default function CreateTestimonial({ onSuccess }: Props) {
  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Datos completos de categorías y tags (con ID y nombre)
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  // IDs seleccionados
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  // Cargar categorías y tags disponibles
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/categories");
        console.log("📁 Categorías cargadas:", res.data);
        setAvailableCategories(res.data);
        if (res.data.length > 0) {
          setSelectedCategoryId(res.data[0].id);
        }
      } catch (e) {
        console.error("❌ Error cargando categorías", e);
      }
    };

    const fetchTags = async () => {
      try {
        const res = await api.get("/api/tags");
        console.log("🏷️ Tags cargados:", res.data);
        setAvailableTags(res.data);
      } catch (e) {
        console.error("❌ Error cargando tags", e);
      }
    };

    fetchCategories();
    fetchTags();
  }, []);

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("name", file.name.replace(/\.[^/.]+$/, ""));
    formData.append("file", file);

    const endpoint = file.type.startsWith("image/") ? "/upload" : "/video/upload";

    try {
      const response = await api.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.url;
    } catch (error: any) {
      throw new Error(`Upload failed: ${error.response?.data?.error || error.message}`);
    }
  };

  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter(id => id !== tagId));
    } else {
      if (selectedTagIds.length < 3) {
        setSelectedTagIds([...selectedTagIds, tagId]);
      } else {
        setMessage("⚠️ Máximo 3 tags permitidos");
        setTimeout(() => setMessage(""), 2000);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!form.title || !form.content) {
      setMessage("❌ Título y contenido son obligatorios");
      return;
    }

    if (!selectedFile) {
      setMessage("❌ Debes subir una imagen o video");
      return;
    }

    if (!selectedCategoryId) {
      setMessage("❌ Debes seleccionar una categoría");
      return;
    }

    if (selectedTagIds.length === 0) {
      setMessage("❌ Debes seleccionar al menos un tag");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      setMessage("📤 Subiendo archivo...");
      const fileUrl = await uploadFile(selectedFile);

      setMessage("📝 Creando testimonio...");

      // IMPORTANTE: Ahora enviamos los UUIDs correctamente
      const testimonioData = {
        title: form.title,
        content: form.content,
        categories: [selectedCategoryId],  // ✅ UUID de la categoría
        tags: selectedTagIds,              // ✅ UUIDs de los tags
        imageUrls: selectedFile.type.startsWith("image/") ? [fileUrl] : [],
        videoUrls: selectedFile.type.startsWith("video/") ? [fileUrl] : [],
      };

      console.log("📤 Enviando testimonio:", testimonioData);

      await api.post("/api/testimonials", testimonioData);

      setMessage("✅ Testimonio enviado para revisión");

      if (onSuccess) onSuccess();

      // Limpiar formulario
      setForm({ title: "", content: "" });
      setSelectedFile(null);
      setSelectedCategoryId(availableCategories[0]?.id || "");
      setSelectedTagIds([]);
    } catch (error: any) {
      console.error("❌ Error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Error desconocido";
      setMessage(`❌ Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // Obtener el nombre de un tag por su ID
  const getTagName = (tagId: string) => {
    return availableTags.find(t => t.id === tagId)?.name || "";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Título */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título *
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="Título del testimonio"
          required
        />
      </div>

      {/* Contenido */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contenido *
        </label>
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="Compartí tu experiencia..."
          required
        />
      </div>

      {/* Categoría - Dropdown simple */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categoría *
        </label>
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          required
        >
          {availableCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tags - Chips visuales */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Etiquetas * (máx. 3)
        </label>
        <div className="space-y-3">
          {/* Chips seleccionados */}
          {selectedTagIds.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-indigo-50 rounded-xl">
              {selectedTagIds.map((tagId) => (
                <span
                  key={tagId}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors"
                  onClick={() => toggleTag(tagId)}
                >
                  {getTagName(tagId)}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
              ))}
            </div>
          )}

          {/* Tags disponibles */}
          <div className="flex flex-wrap gap-2">
            {availableTags
              .filter(tag => !selectedTagIds.includes(tag.id))
              .map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className="px-3 py-1.5 bg-white border-2 border-gray-300 text-gray-700 text-sm rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
                >
                  + {tag.name}
                </button>
              ))}
          </div>

          <p className="text-xs text-gray-500">
            {selectedTagIds.length === 0 && "Seleccioná al menos un tag"}
            {selectedTagIds.length > 0 && `${selectedTagIds.length}/3 tags seleccionados`}
          </p>
        </div>
      </div>

      {/* Archivo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagen o Video *
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="hidden"
            id="file-upload"
            required
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="text-gray-500">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm">Click para subir {selectedFile ? "otro" : ""} archivo</p>
              <p className="text-xs mt-1">Máx. 10MB (imágenes o videos)</p>
            </div>
          </label>
          {selectedFile && (
            <div className="mt-3 p-2 bg-indigo-50 rounded-lg">
              <p className="text-sm text-indigo-600 font-medium">{selectedFile.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mensaje de estado */}
      {message && (
        <div
          className={`p-4 rounded-xl ${
            message.includes("✅")
              ? "bg-green-50 text-green-700"
              : message.includes("❌")
              ? "bg-red-50 text-red-700"
              : message.includes("⚠️")
              ? "bg-yellow-50 text-yellow-700"
              : "bg-blue-50 text-blue-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Botón submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading ? "Procesando..." : "Enviar Testimonio"}
      </button>
    </form>
  );
}