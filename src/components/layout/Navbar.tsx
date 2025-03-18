
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Home,
  LayoutDashboard,
  Settings,
  Sliders,
  Users,
  ShoppingBag,
  Calendar,
  Coins,
  Contact2,
  Building2,
  LucideIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Define el tipo para los enlaces de navegación
interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  activeWhen: string;
  requiredRoles?: string[]; // Roles requeridos para ver el enlace
}

// Define el tipo para las secciones de enlaces de navegación
interface NavLinkSection {
  title: string;
  icon: React.ReactNode;
  links: NavLink[];
}

// Función para determinar si un enlace está activo
const isNavLinkActive = (location: string, activeWhen: string): boolean => {
  return location === activeWhen || location.startsWith(activeWhen + "/");
};

// Función para determinar si un enlace debe mostrarse basado en el rol del usuario
const shouldShowLink = (link: NavLink, userRole?: string) => {
  if (!link.requiredRoles || link.requiredRoles.length === 0) {
    return true;
  }
  
  return userRole && link.requiredRoles.includes(userRole);
};

export function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Enlaces de navegación agrupados por sección
  const navigationLinks: NavLinkSection[] = [
    {
      title: "General",
      icon: <LayoutDashboard className="w-5 h-5" />,
      links: [
        {
          href: "/",
          label: "Dashboard",
          icon: Home,
          activeWhen: "/",
        },
      ],
    },
    {
      title: "Ventas",
      icon: <ShoppingBag className="w-5 h-5" />,
      links: [
        {
          href: "/ventas/cotizaciones",
          label: "Cotizaciones",
          icon: Coins,
          activeWhen: "/ventas/cotizaciones",
        },
        {
          href: "/ventas/clientes",
          label: "Clientes",
          icon: Contact2,
          activeWhen: "/ventas/clientes",
        },
        {
          href: "/ventas/oportunidades",
          label: "Oportunidades",
          icon: Building2,
          activeWhen: "/ventas/oportunidades",
        },
      ],
    },
    {
      title: "Recaudos",
      icon: <Coins className="w-5 h-5" />,
      links: [
        {
          href: "/recaudos",
          label: "Recaudos",
          icon: Coins,
          activeWhen: "/recaudos",
        },
      ],
    },
    {
      title: "Agenda",
      icon: <Calendar className="w-5 h-5" />,
      links: [
        {
          href: "/agenda",
          label: "Calendario",
          icon: Calendar,
          activeWhen: "/agenda",
        },
      ],
    },
    {
      title: "Configuración",
      icon: <Settings className="w-5 h-5" />,
      links: [
        {
          href: "/configuracion",
          label: "General",
          icon: Sliders,
          activeWhen: "/configuracion/index",
        },
        {
          href: "/configuracion/usuarios",
          label: "Usuarios",
          icon: Users,
          activeWhen: "/configuracion/usuarios",
          requiredRoles: ["Administrador"], // Solo visible para administradores
        },
        // {
        //   href: "/configuracion/mi-empresa",
        //   label: "Mi Empresa",
        //   icon: <Sliders className="w-4 h-4" />,
        //   activeWhen: "/configuracion/mi-empresa",
        // },
      ],
    },
  ];

  return (
    <>
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 pt-6">
          <SheetHeader className="pl-6 pb-4">
            <SheetTitle>Menú</SheetTitle>
            <SheetDescription>
              Navega a través de las diferentes secciones de la aplicación.
            </SheetDescription>
          </SheetHeader>
          <div className="pb-6">
            {navigationLinks.map((section, index) => (
              <div key={index} className="space-y-1">
                <h3 className="px-6 py-2 font-medium text-sm text-muted-foreground">
                  {section.title}
                </h3>
                {section.links.map((link) =>
                  shouldShowLink(link, user?.rol_usuario) ? (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`flex items-center space-x-2 px-6 py-2 text-sm font-medium hover:bg-secondary hover:text-foreground transition-colors duration-200 ${isNavLinkActive(location.pathname, link.activeWhen)
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground"
                        }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {React.createElement(link.icon, { className: "w-4 h-4" })}
                      <span>{link.label}</span>
                    </Link>
                  ) : null
                )}
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
      <nav className="hidden md:flex flex-col w-[240px] border-r bg-secondary/50 dark:bg-secondary/80 h-screen fixed top-0 left-0 z-10">
        <div className="flex items-center justify-between py-4 px-6">
          <Link to="/" className="flex items-center font-semibold">
            <LayoutDashboard className="mr-2 h-6 w-6" />
            Smooth Sail CRM
          </Link>
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-8 w-8">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.nombre || "Avatar"} />
                    <AvatarFallback>{user.nombre?.[0] || user.email[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end" forceMount>
                <DropdownMenuItem>
                  Hola, {user.nombre}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="py-4">
          {navigationLinks.map((section, index) => (
            <div key={index} className="space-y-1">
              <h3 className="px-6 py-2 font-medium text-sm text-muted-foreground">
                {section.title}
              </h3>
              {section.links.map((link) =>
                shouldShowLink(link, user?.rol_usuario) ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`flex items-center space-x-2 px-6 py-2 text-sm font-medium hover:bg-secondary hover:text-foreground transition-colors duration-200 ${isNavLinkActive(location.pathname, link.activeWhen)
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground"
                      }`}
                  >
                    {React.createElement(link.icon, { className: "w-4 h-4" })}
                    <span>{link.label}</span>
                  </Link>
                ) : null
              )}
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}
