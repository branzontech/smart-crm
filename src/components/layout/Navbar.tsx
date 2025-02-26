
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Building2,
  ClipboardList,
  BarChart3,
  Calendar,
  Mail,
  Settings,
  ChevronDown,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  label: string;
  icon: any;
  path: string;
  subItems?: { label: string; path: string }[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Clientes", icon: Users, path: "/clientes" },
  { label: "Empresas", icon: Building2, path: "/empresas" },
  {
    label: "Ventas",
    icon: ClipboardList,
    path: "/ventas",
    subItems: [
      { label: "Oportunidades", path: "/ventas/oportunidades" },
      { label: "Cotizaciones", path: "/ventas/cotizaciones" },
      { label: "Contratos", path: "/ventas/contratos" },
    ],
  },
  { label: "Reportes", icon: BarChart3, path: "/reportes" },
  { label: "Calendario", icon: Calendar, path: "/calendario" },
  { label: "Comunicaciones", icon: Mail, path: "/comunicaciones" },
  { label: "Configuración", icon: Settings, path: "/configuracion" },
];

export const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setIsExpanded(false);
    }
  }, [isMobile]);

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setIsExpanded(false);
    }
  };

  const toggleSubmenu = (path: string) => {
    setOpenSubmenu(openSubmenu === path ? null : path);
  };

  return (
    <nav
      className={cn(
        "min-h-screen bg-gradient-to-b from-primary/95 to-primary shadow-lg transition-all duration-300 ease-in-out flex flex-col relative",
        isExpanded ? "w-64" : "w-20"
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-6 p-1.5 bg-primary rounded-full shadow-lg hover:bg-primary/90 transition-colors duration-200"
      >
        {isExpanded ? (
          <ChevronLeft className="h-4 w-4 text-white" />
        ) : (
          <ChevronRight className="h-4 w-4 text-white" />
        )}
      </button>

      <div className="p-4 space-y-4">
        <div className="h-16 flex items-center justify-center">
          <span className={cn(
            "text-xl font-semibold text-white transition-all duration-300",
            !isExpanded && "hidden"
          )}>
            CRM
          </span>
        </div>

        {navItems.map((item) => (
          <div key={item.path} className="relative">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() =>
                      item.subItems
                        ? toggleSubmenu(item.path)
                        : handleNavigation(item.path)
                    }
                    className={cn(
                      "w-full flex items-center p-3 rounded-lg text-white/90 hover:bg-white/10 transition-all duration-200",
                      location.pathname === item.path && "bg-white/20",
                      !isExpanded && "justify-center"
                    )}
                  >
                    <item.icon className="h-5 w-5 min-w-[1.25rem]" />
                    {isExpanded && (
                      <>
                        <span className="ml-3 text-sm">{item.label}</span>
                        {item.subItems && (
                          <ChevronDown
                            className={cn(
                              "ml-auto h-4 w-4 transition-transform duration-200",
                              openSubmenu === item.path && "transform rotate-180"
                            )}
                          />
                        )}
                      </>
                    )}
                  </button>
                </TooltipTrigger>
                {!isExpanded && (
                  <TooltipContent side="right" className="bg-primary text-white">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            {item.subItems && openSubmenu === item.path && isExpanded && (
              <div className="ml-8 mt-2 space-y-2 animate-accordion-down">
                {item.subItems.map((subItem) => (
                  <button
                    key={subItem.path}
                    onClick={() => handleNavigation(subItem.path)}
                    className={cn(
                      "w-full text-left p-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors duration-200",
                      location.pathname === subItem.path && "bg-white/20"
                    )}
                  >
                    {subItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};
