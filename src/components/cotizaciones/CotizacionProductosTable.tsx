
import { Separator } from "@/components/ui/separator";
import { Producto } from "@/types/cotizacion";

interface CotizacionProductosTableProps {
  productos: Producto[];
  formatCurrency: (value: number) => string;
  subtotal: number;
  totalIva: number;
  total: number;
}

export const CotizacionProductosTable = ({ 
  productos, 
  formatCurrency, 
  subtotal, 
  totalIva, 
  total 
}: CotizacionProductosTableProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-[#2d1e2f] print:mb-1">Productos y Servicios</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#2d1e2f]/20">
              <th className="text-left py-2 px-4 text-[#2d1e2f] font-semibold print:py-1 print:px-2">Descripción</th>
              <th className="text-center py-2 px-4 text-[#2d1e2f] font-semibold print:py-1 print:px-2">Cantidad</th>
              <th className="text-right py-2 px-4 text-[#2d1e2f] font-semibold print:py-1 print:px-2">Precio Unitario</th>
              <th className="text-right py-2 px-4 text-[#2d1e2f] font-semibold print:py-1 print:px-2">IVA</th>
              <th className="text-right py-2 px-4 text-[#2d1e2f] font-semibold print:py-1 print:px-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-3 px-4 print:py-1 print:px-2">{producto.descripcion}</td>
                <td className="py-3 px-4 text-center print:py-1 print:px-2">{producto.cantidad}</td>
                <td className="py-3 px-4 text-right print:py-1 print:px-2">{formatCurrency(producto.precioUnitario)}</td>
                <td className="py-3 px-4 text-right print:py-1 print:px-2">{producto.iva}%</td>
                <td className="py-3 px-4 text-right print:py-1 print:px-2">{formatCurrency(producto.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Totals with more compact spacing */}
      <div className="mt-4 flex justify-end print:mt-2">
        <div className="w-full max-w-xs">
          <div className="flex justify-between py-2 print:py-0.5">
            <span className="font-medium">Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between py-2 print:py-0.5">
            <span className="font-medium">IVA:</span>
            <span>{formatCurrency(totalIva)}</span>
          </div>
          <Separator className="my-2 print:my-0.5" />
          <div className="flex justify-between py-2 text-lg font-bold print:py-0.5">
            <span>Total:</span>
            <span className="text-[#f15025]">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
