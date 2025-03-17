
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value);
};

export const formatDate = (date: Date) => {
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: es });
};

export const getEstadoClass = (estado: string) => {
  switch (estado) {
    case 'aprobada':
      return "bg-green-100 text-green-800";
    case 'enviada':
      return "bg-blue-100 text-blue-800";
    case 'borrador':
      return "bg-gray-100 text-gray-800";
    case 'rechazada':
      return "bg-red-100 text-red-800";
    case 'vencida':
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
