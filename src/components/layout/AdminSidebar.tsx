import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import UserIcon from "../icons/UserIcon";
import ModerationIcon from "../icons/ModerationIcon";
import DashboardIcon from "../icons/DashboardIcon";
import CategoriesIcon from "../icons/CategoriesIcon";
import TestimonialsIcon from "../icons/TestimonialsIcon";
import ConfigIcon from "../icons/ConfigIcon";

// props que aceptan los íconos
type IconProps = { className?: string };

// estructura exacta de un ítem del menú
// Esto le dice a TS: "IconComponent es OBLIGATORIO y es un Componente de React"
interface MenuItem {
  id: string;
  label: string;
  IconComponent: React.ComponentType<IconProps>; 
}

interface Props {
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function AdminSidebar({ activeView, setActiveView }: Props) {
  
  const menuItems: MenuItem[] = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      IconComponent: DashboardIcon
    },
    {
        id: "testimonials",
        label: "Testimonios",
        IconComponent: TestimonialsIcon
    },
    { 
      id: "moderation", 
      label: "Moderación", 
      IconComponent: ModerationIcon
    },
    { 
      id: "categories", 
      label: "Categorías/ Tags", 
      IconComponent: CategoriesIcon 
    },
    { 
      id: "users", 
      label: "Usuarios", 
      IconComponent: UserIcon 
    },
    { 
      id: "config", 
      label: "Configuración / API", 
      IconComponent: ConfigIcon
    },
  ];

  const sidebarBgColor = "rgb(52, 82, 230)";

  return (
    <aside className="w-64 bg-[#3452E6] min-h-screen text-white flex flex-col shadow-xl pr-4 font-sans relative z-10">
      {/* Logo Area */}
      <div className="p-6 flex flex-col items-center border-b border-blue-500/30 mb-2">
        <div className="bg-white p-2 rounded-2xl shadow-lg mb-2">
            <img src={logo} alt="CredEdu" className="w-40 h-20 object-contain" />
        </div>
        
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2 pl-4">
        {menuItems.map((item) => {
          const isActive = activeView === item.id;
          
          const Icon = item.IconComponent; 
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 transition-all duration-200
                rounded-l-full relative group
                ${
                  isActive
                    ? `bg-white text-blue-600 font-bold z-10 shadow-md
                      before:absolute before:right-0 before:-top-5 before:h-5 before:w-5 before:rounded-br-full
                      before:shadow-[0_20px_0_0_${sidebarBgColor}] before:pointer-events-none
                      after:absolute after:right-0 after:-bottom-5 after:h-5 after:w-5 after:rounded-tr-full
                      after:shadow-[0_-20px_0_0_${sidebarBgColor}] after:pointer-events-none`
                    : "hover:bg-blue-500/50 text-blue-100"
                }
              `}
            >
              {/* Usamos la variable Icon que ya sabemos que no es undefined */}
              <Icon className={`w-6 h-6 ${isActive ? "text-[#34D399]" : "text-white"}`} />
              
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 pl-8">
        <Link to="/" className="flex items-center gap-2 text-blue-200 hover:text-white text-sm">
          <span>⬅</span> Volver al Home
        </Link>
      </div>
    </aside>
  );
}