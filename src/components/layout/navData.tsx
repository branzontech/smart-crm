
import {
  LayoutDashboard,
  Users,
  Building2,
  Coins,
  ClipboardList,
  BarChart3,
  Calendar,
  Mail,
  Settings,
  Store,
  FileText,
  Database,
  UserCog,
} from "lucide-react";
import { NavItem } from "./types/navbar.types";

// Lista de enlaces de navegación
export const navigationLinks: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
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
      { label: "Nueva Cotización", path: "/ventas/cotizaciones/nueva" },
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
  { label: "Configuración", icon: Settings, path: "/configuracion" },
  { label: "Usuarios", icon: UserCog, path: "/configuracion/usuarios" },
];
