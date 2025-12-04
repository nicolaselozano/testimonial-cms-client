import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";

interface Props {
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function AdminSidebar({ activeView, setActiveView }: Props) {
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "moderation", label: "Moderación", icon: "⚠️" }, // componente PendingModeration
    { id: "categories", label: "Categorías/ Tags", icon: "🏷️" },
    { id: "users", label: "Usuarios", icon: "👤" },
    { id: "config", label: "Configuración / API", icon: "⚙️" },
  ];

  return (
    <aside className="w-64 bg-blue-600 min-h-screen text-white flex flex-col shadow-xl">
      {/* Logo Area */}
      <div className="p-6 flex flex-col items-center border-b border-blue-500">
        <img src={logo} alt="CredEdu Logo" className="w-16 mb-2 bg-white rounded-full p-1" />
        <h1 className="text-2xl font-bold tracking-wide">CredEdu</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 relative
                ${isActive 
                  ? "bg-white text-blue-600 font-bold rounded-l-none rounded-r-3xl translate-x-2 shadow-md" 
                  : "hover:bg-blue-500 text-white"
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer / Salir */}
      <div className="p-6 border-t border-blue-500">
        <Link to="/" className="flex items-center gap-2 text-blue-100 hover:text-white">
          <span>⬅</span> Volver al Home
        </Link>
      </div>
    </aside>
  );
}