
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Building2,
  Coins,
  ClipboardList,
  BarChart3,
  Calendar,
  Mail,
  Settings,
  ChevronDown,
  Store,
  FileText,
  Database,
  UserCog
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  label: string;
  icon: typeof LayoutDashboard;
  path: string;
  subItems?: { label: string; path: string }[];
}

const NavLink = ({ item, isExpanded, isActive, onClick, openSubmenu, toggleSubmenu }: {
  item: NavItem;
  isExpanded: boolean;
  isActive: boolean;
  onClick: () => void;
  openSubmenu: string | null;
  toggleSubmenu: (path: string) => void;
}) => {
  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() =>
                item.subItems
                  ? toggleSubmenu(item.path)
                  : onClick()
              }
              className={cn(
                "w-full flex items-center p-3 rounded-lg text-white hover:bg-mint/20 transition-all duration-200 ease-in-out transform hover:translate-x-1",
                isActive && "bg-mint/30",
                !isExpanded && "justify-center"
              )}
            >
              {React.createElement(item.icon, {
                className: cn(
                  "h-5 w-5 min-w-[1.25rem] transition-transform duration-200",
                  isActive && "scale-110"
                )
              })}
              {isExpanded && (
                <>
                  <span className="ml-3 text-sm whitespace-nowrap">
                    {item.label}
                  </span>
                  {item.subItems && (
                    <ChevronDown
                      className={cn(
                        "ml-auto h-4 w-4 transition-transform duration-300 ease-in-out",
                        openSubmenu === item.path && "rotate-180"
                      )}
                    />
                  )}
                </>
              )}
            </button>
          </TooltipTrigger>
          {!isExpanded && (
            <TooltipContent
              side="right"
              className="bg-teal text-white animate-in fade-in-50 zoom-in-95"
            >
              {item.label}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      {item.subItems && openSubmenu === item.path && isExpanded && (
        <div className="ml-8 mt-2 space-y-2 overflow-hidden">
          {item.subItems.map((subItem, index) => (
            <button
              key={subItem.path}
              onClick={() => onClick()}
              className={cn(
                "w-full text-left p-2 text-sm text-white/80 hover:text-white hover:bg-mint/20 rounded-md transition-all duration-200 ease-in-out transform hover:translate-x-1",
                location.pathname === subItem.path && "bg-mint/30",
                "animate-in fade-in-50 slide-in-from-left-2",
                "data-[state=open]:animate-in",
                "data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0",
                "data-[state=open]:fade-in-0",
                "data-[state=closed]:zoom-out-95",
                "data-[state=open]:zoom-in-95"
              )}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {subItem.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const expandTimeoutRef = useRef<number | null>(null);
  const collapseTimeoutRef = useRef<number | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const handleMouseEnter = () => {
    if (isMobile) return;
    
    if (collapseTimeoutRef.current !== null) {
      window.clearTimeout(collapseTimeoutRef.current);
      collapseTimeoutRef.current = null;
    }
    
    expandTimeoutRef.current = window.setTimeout(() => {
      setIsExpanded(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    
    if (expandTimeoutRef.current !== null) {
      window.clearTimeout(expandTimeoutRef.current);
      expandTimeoutRef.current = null;
    }
    
    collapseTimeoutRef.current = window.setTimeout(() => {
      setIsExpanded(false);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (expandTimeoutRef.current !== null) {
        window.clearTimeout(expandTimeoutRef.current);
      }
      if (collapseTimeoutRef.current !== null) {
        window.clearTimeout(collapseTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Update CSS variable for sidebar width
    document.documentElement.style.setProperty(
      '--sidebar-width', 
      isExpanded ? '16rem' : '5rem'
    );
    
    if (isMobile) {
      setIsExpanded(false);
    }
    
    // Properly handle main container class
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
      if (isExpanded) {
        mainContainer.classList.add('expanded');
      } else {
        mainContainer.classList.remove('expanded');
      }
    }
    
    // Update header position
    const header = document.querySelector('header > div');
    if (header) {
      header.classList.remove('ml-20', 'ml-64');
      header.classList.add(isExpanded ? 'ml-64' : 'ml-20');
    }
  }, [isExpanded, isMobile]);

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setIsExpanded(false);
    }
  };

  const toggleSubmenu = (path: string) => {
    setOpenSubmenu(openSubmenu === path ? null : path);
  };

  const handleToggleClick = () => {
    setIsExpanded(!isExpanded);
  };

  // Lista de enlaces de navegación
  const navigationLinks: NavItem[] = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "Clientes", icon: Users, path: "/clientes" },
    { label: "Empresas", icon: Building2, path: "/empresas" },
    { label: "Proveedores", icon: Store, path: "/proveedores" },
    {
      label: "Recaudos",
      icon: Coins,
      path: "/recaudos",
      subItems: [
        { label: "Nuevo", path: "/recaudos/nuevo" },
        { label: "Seguimiento", path: "/recaudos/seguimiento" },
      ],
    },
    {
      label: "Cuentas de Cobro",
      icon: FileText,
      path: "/cuentas-cobro",
      subItems: [
        { label: "Listar", path: "/cuentas-cobro" },
        { label: "Nueva", path: "/cuentas-cobro/nueva" },
      ],
    },
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
    {
      label: "Datos Maestros",
      icon: Database,
      path: "/maestros",
      subItems: [
        { label: "Sectores", path: "/maestros/sectores" },
        { label: "Tipos de Servicios", path: "/maestros/tipos-servicios" },
        { label: "Países", path: "/maestros/paises" },
        { label: "Ciudades", path: "/maestros/ciudades" },
        { label: "Orígenes de Cliente", path: "/maestros/origenes-cliente" },
      ],
    },
    { label: "Reportes", icon: BarChart3, path: "/reportes" },
    { label: "Calendario", icon: Calendar, path: "/calendario" },
    { label: "Comunicaciones", icon: Mail, path: "/comunicaciones" },
    { 
      label: "Configuración", 
      icon: Settings, 
      path: "/configuracion",
      subItems: [
        { label: "General", path: "/configuracion" },
        { label: "Usuarios", path: "/configuracion/usuarios" },
      ],
    },
  ];

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "fixed top-0 left-0 h-screen bg-gradient-to-b from-teal to-sage shadow-lg transition-all duration-300 ease-in-out flex flex-col z-20",
        isExpanded ? "w-64" : "w-20",
        "scrollbar-custom"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={handleToggleClick}
        className="absolute -right-3 top-6 p-1.5 bg-teal rounded-full shadow-lg hover:bg-sage transition-all duration-300 ease-in-out transform hover:scale-110 z-30"
      >
        {isExpanded ? (
          <ChevronLeft className="h-4 w-4 text-white" />
        ) : (
          <ChevronRight className="h-4 w-4 text-white" />
        )}
      </button>

      <div 
        className={cn(
          "p-4 space-y-4 overflow-y-auto h-full pt-[calc(var(--header-height)+1rem)]",
          !isExpanded && "scrollbar-hidden"
        )}
      >
        {navigationLinks.map((item) => (
          <NavLink 
            key={item.path}
            item={item}
            isExpanded={isExpanded}
            isActive={location.pathname === item.path || 
                      (item.subItems && item.subItems.some(subItem => location.pathname === subItem.path))}
            onClick={() => handleNavigation(item.path)}
            openSubmenu={openSubmenu}
            toggleSubmenu={toggleSubmenu}
          />
        ))}
      </div>
    </aside>
  );
};
