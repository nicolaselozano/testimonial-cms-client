import { motion } from "framer-motion";

export interface Testimonial {
  id: string;
  title: string;
  content: string;
  imageUrls?: string[];
  videoUrls?: string[];
}

interface Props {
  testimonials: Testimonial[];
}

export default function TestimonialList({ testimonials }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {testimonials.map((t) => (
        <motion.div
          key={t.id}
          className="p-4 border rounded-xl shadow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="font-bold text-xl">{t.title}</h3>
          <p className="text-gray-700 mt-2">{t.content}</p>

          {t.imageUrls?.length ? (
            <img
              src={t.imageUrls[0]}
              className="mt-4 rounded-xl"
              alt="testimonial"
            />
          ) : null}
        </motion.div>
      ))}
    </div>
  );
}
