
import { EmpresaEmisor } from "@/types/cotizacion";

interface CotizacionColoredHeaderProps {
  empresaEmisor: EmpresaEmisor;
  numero: string;
  fechaFormateada: string;
}

export const CotizacionColoredHeader = ({ empresaEmisor, numero, fechaFormateada }: CotizacionColoredHeaderProps) => {
  return (
    <div className="bg-[#2d1e2f] text-white p-6 print:bg-primary print:text-primary-foreground print:p-3">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold">{empresaEmisor.nombre}</h2>
          <p>NIT: {empresaEmisor.nit}</p>
        </div>
        <div className="text-right">
          <h3 className="text-xl font-semibold">COTIZACIÓN</h3>
          <p>No. {numero}</p>
          <p>Fecha: {fechaFormateada}</p>
        </div>
      </div>
    </div>
  );
};
