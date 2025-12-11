// src/components/hooks/useTestimonials.ts
import { useState } from "react";
import type { TestimonialResponse } from "../home/testimonial";
import api from "../../config/axiosConfig";
import apiPublic from "../../config/axiosPublic";

export function useTestimonials() {
  const [results, setResults] = useState<TestimonialResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const getTestimonials = async () => {
    setLoading(true);
    try {
      const { data } = await apiPublic.get<TestimonialResponse[]>(
        "/api/testimonials/public?status=APPROVED"
      );
      setResults(data);
    } catch (error) {
      console.error("Error loading testimonials", error);
    } finally {
      setLoading(false);
    }
  };

  const search = async (query: string) => {
    setLoading(true);
    try {
      const { data } = await api.get<TestimonialResponse[]>(
        "/api/testimonials/search",
        {
          params: { query },
        }
      );
      setResults(data);
    } catch (error) {
      console.error("Error searching testimonials", error);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, search, getTestimonials };
}
