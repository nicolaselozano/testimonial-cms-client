import { useState } from "react";
import api from "../../config/axiosConfig";

export default function CreateTestimonial() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const create = async () => {
    await api.post("/api/testimonials", {
      title,
      content,
      imageUrls: [],
      videoUrls: [],
      categories: [],
      tags: [],
    });
    alert("Testimonio enviado (PENDING)");
  };

  return (
    <div className="border p-4 rounded-xl bg-white shadow">
      <h2 className="text-xl font-bold mb-4">Crear Testimonio</h2>

      <input
        className="border p-2 w-full mb-3 rounded"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border p-2 w-full mb-3 rounded"
        placeholder="Contenido"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={create}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Enviar
      </button>
    </div>
  );
}
