
import { EmpresaEmisor } from "@/types/cotizacion";

interface CotizacionColoredHeaderProps {
  empresaEmisor: EmpresaEmisor;
  numero: string;
  fechaFormateada: string;
}

export const CotizacionColoredHeader = ({ empresaEmisor, numero, fechaFormateada }: CotizacionColoredHeaderProps) => {
  return (
    <div className="bg-[#2d1e2f] text-white p-6 print:bg-[#2d1e2f] print:text-white print:p-3 print:color-adjust-exact">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {empresaEmisor.logo && (
            <div className="flex-shrink-0 w-16 h-16 print:w-14 print:h-14">
              <img 
                src={empresaEmisor.logo} 
                alt={`${empresaEmisor.nombre} logo`} 
                className="w-full h-full object-contain rounded-md"
              />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold print:text-xl">{empresaEmisor.nombre}</h2>
            <p className="print:text-sm">NIT: {empresaEmisor.nit}</p>
          </div>
        </div>
        <div className="text-right">
          <h3 className="text-xl font-semibold print:text-lg">COTIZACION DE SERVICIOS BRANZON TECH</h3>
          <p className="print:text-sm">No. {numero}</p>
          <p className="print:text-sm">Fecha: {fechaFormateada}</p>
        </div>
      </div>
    </div>
  );
};
