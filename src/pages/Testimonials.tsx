import { useEffect, useState } from "react";
import api from "../config/axiosConfig";
import TestimonialList, { type Testimonial } from "../components/testimonials/TestimonialList";
import CreateTestimonial from "../components/testimonials/CreateTestimonial";

export default function Testimonials() {
  const [approved, setApproved] = useState<Testimonial[]>([]);

  useEffect(() => {
    api.get("/api/testimonials").then((res) => setApproved(res.data));
  }, []);

  return (
    <div className="p-6">
      <CreateTestimonial />
      <h2 className="text-2xl font-bold mt-8 mb-4">Testimonios aprobados</h2>
      <TestimonialList testimonials={approved} />
    </div>
  );
}
