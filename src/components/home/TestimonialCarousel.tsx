import { Carousel } from "flowbite-react";
import type { TestimonialResponse } from "./testimonial";

interface Props {
  items: TestimonialResponse[];
}

export default function TestimonialCarousel({ items }: Props) {
  if (!items.length) {
    return <p className="text-gray-500">No hay testimonios.</p>;
  }

  return (
    <div className="w-full h-80 rounded-xl overflow-hidden shadow-lg relative">
      <Carousel slideInterval={5000} pauseOnHover className="cursor-pointer">

        {items.map((t) => (
          <div key={t.id} className="relative w-full h-full">

            {/* Trick: Flowbite-react necesita un IMG obligatoriamente */}
            <img
              src="/placeholder.png"
              alt=""
              className="opacity-0 w-full h-full"
            />

            {/* Tu contenido encima */}
            <div className="absolute inset-0 flex flex-col justify-between bg-white p-6">

              {t.images?.length > 0 && (
                <img
                  src={t.images[0].url}
                  alt={t.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
              )}

              <h3 className="text-xl font-semibold">{t.title}</h3>

              <p className="text-gray-600 text-sm line-clamp-3">
                {t.content}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                {t.tags?.map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

      </Carousel>
    </div>
  );
}
