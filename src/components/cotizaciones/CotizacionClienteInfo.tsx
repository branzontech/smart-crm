
import { Cotizacion } from "@/types/cotizacion";

interface CotizacionClienteInfoProps {
  cotizacion: Cotizacion;
  formatDate: (date: Date) => string;
}

export const CotizacionClienteInfo = ({ cotizacion, formatDate }: CotizacionClienteInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-2">
      <div>
        <h3 className="text-lg font-semibold mb-3 text-[#2d1e2f] print:mb-1">Cliente</h3>
        <div className="space-y-1 print:space-y-0">
          <p><span className="font-medium">Nombre:</span> {cotizacion.cliente.nombre}</p>
          <p><span className="font-medium">NIT:</span> {cotizacion.cliente.nit}</p>
          <p><span className="font-medium">Dirección:</span> {cotizacion.cliente.direccion}</p>
          <p><span className="font-medium">Teléfono:</span> {cotizacion.cliente.telefono}</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3 text-[#2d1e2f] print:mb-1">Detalles de la Cotización</h3>
        <div className="space-y-1 print:space-y-0">
          <p><span className="font-medium">Fecha de emisión:</span> {formatDate(cotizacion.fechaEmision)}</p>
          <p><span className="font-medium">Válida hasta:</span> {formatDate(cotizacion.fechaVencimiento)}</p>
          <p><span className="font-medium">Estado:</span> {cotizacion.estado.charAt(0).toUpperCase() + cotizacion.estado.slice(1)}</p>
        </div>
      </div>
    </div>
  );
};
