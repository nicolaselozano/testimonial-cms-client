import { useEffect, useState } from "react";
import api from "../../config/axiosConfig";
import type { Testimonial } from "../testimonials/TestimonialList";

export default function PendingModeration() {
  const [pending, setPending] = useState<Testimonial[]>([]);

  const load = () => {
    api.get("/api/testimonials?status=PENDING").then((res) => {
      setPending(res.data);
    });
  };

  useEffect(load, []);

  const moderate = async (id: string, status: "APPROVED" | "REJECTED") => {
    await api.patch(`/api/testimonials/${id}/moderate`, { status });
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Moderación</h2>

      {pending.map((t) => (
        <div key={t.id} className="border p-4 rounded mb-3">
          <h3 className="font-semibold">{t.title}</h3>
          <p className="mb-2">{t.content}</p>

          <button
            onClick={() => moderate(t.id, "APPROVED")}
            className="bg-green-600 text-white px-3 py-1 rounded mr-2"
          >
            Aprobar
          </button>

          <button
            onClick={() => moderate(t.id, "REJECTED")}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Rechazar
          </button>
        </div>
      ))}
    </div>
  );
}
