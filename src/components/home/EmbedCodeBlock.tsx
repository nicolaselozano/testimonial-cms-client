import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function EmbedCodeBlock() {
  const [copied, setCopied] = useState(false);

  const embedUrl = import.meta.env.VITE_EMBED_URL;

  const code = `<div id="testimonial-widget"></div>
<script 
  src="${embedUrl}"
  data-limit="6">
</script>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative bg-gray-900 text-green-300 font-mono text-sm p-4 rounded-xl shadow-lg border border-gray-700">
      
      {/* Botón copiar */}
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 bg-gray-800 hover:bg-gray-700 text-gray-200 p-2 rounded-lg transition flex items-center gap-1
        cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-green-400">Copiado!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4"/>
            <span>Copiar</span>
          </>
        )}
      </button>

      <pre>{code}</pre>
    </div>
  );
}
