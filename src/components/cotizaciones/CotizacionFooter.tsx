
import { EmpresaEmisor } from "@/types/cotizacion";

interface CotizacionFooterProps {
  empresaEmisor: EmpresaEmisor;
}

export const CotizacionFooter = ({ empresaEmisor }: CotizacionFooterProps) => {
  return (
    <div className="bg-gray-50 p-6 text-center text-gray-600 text-sm print:bg-white print:p-2 print:text-xs print:mt-auto">
      <p>{empresaEmisor.nombre} | NIT: {empresaEmisor.nit}</p>
      <p>{empresaEmisor.direccion} | Tel: {empresaEmisor.telefono}</p>
      {empresaEmisor.email && <p>Email: {empresaEmisor.email}</p>}
    </div>
  );
};
