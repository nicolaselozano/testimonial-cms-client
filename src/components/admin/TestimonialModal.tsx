import { X } from "lucide-react";


export interface TestimonialDetail {
  id: string;
  title: string;
  content: string;
  createdByName: string;
  createdAt: string;
  images?: { url: string }[];
  videos?: { url: string }[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  testimonial: TestimonialDetail | null;
}

export default function TestimonialModal({ isOpen, onClose, testimonial }: Props) {
  if (!isOpen || !testimonial) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Botón Cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-gray-100 rounded-full text-gray-500 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Contenido Multimedia (Video o Imagen Principal) */}
        <div className="w-full bg-gray-100 min-h-[250px] flex items-center justify-center">
          {testimonial.videos && testimonial.videos.length > 0 ? (
            <video 
              src={testimonial.videos[0].url} 
              controls 
              className="w-full max-h-[400px] object-contain bg-black"
            />
          ) : testimonial.images && testimonial.images.length > 0 ? (
            <img 
              src={testimonial.images[0].url} 
              alt="Testimonio" 
              className="w-full h-full object-cover max-h-[400px]"
            />
          ) : (
            <div className="text-gray-400 py-10">Sin contenido multimedia</div>
          )}
        </div>

        {/* Detalles del Texto */}
        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                {testimonial.createdByName.charAt(0).toUpperCase()}
             </div>
             <div>
                <h3 className="font-bold text-gray-900">{testimonial.createdByName}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(testimonial.createdAt).toLocaleDateString()}
                </p>
             </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">{testimonial.title}</h2>
          
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
            {testimonial.content}
          </p>

          {/* Galería extra si hay más de 1 imagen */}
          {testimonial.images && testimonial.images.length > 1 && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-sm font-semibold text-gray-500 mb-3">Imágenes adicionales</h4>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {testimonial.images.slice(1).map((img, idx) => (
                  <img key={idx} src={img.url} className="w-24 h-24 object-cover rounded-lg border" />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}