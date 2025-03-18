
import { Separator } from "@/components/ui/separator";
import { Producto } from "@/types/cotizacion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
    <div className="productos-table">
      <h3 className="text-lg font-semibold mb-4 text-[#2d1e2f] print:mb-2 print:text-base">Productos y Servicios</h3>
      <div className="overflow-x-auto print:overflow-visible">
        <Table className="w-full border-collapse">
          <TableHeader className="bg-gray-50 print:bg-gray-100">
            <TableRow className="border-b border-[#2d1e2f]/20">
              <TableHead className="text-left py-2 px-4 text-[#2d1e2f] font-semibold print:py-1 print:px-2 print:text-sm">Descripción</TableHead>
              <TableHead className="text-center py-2 px-4 text-[#2d1e2f] font-semibold print:py-1 print:px-2 print:text-sm w-24">Cantidad</TableHead>
              <TableHead className="text-right py-2 px-4 text-[#2d1e2f] font-semibold print:py-1 print:px-2 print:text-sm w-32">Precio Unitario</TableHead>
              <TableHead className="text-right py-2 px-4 text-[#2d1e2f] font-semibold print:py-1 print:px-2 print:text-sm w-20">IVA</TableHead>
              <TableHead className="text-right py-2 px-4 text-[#2d1e2f] font-semibold print:py-1 print:px-2 print:text-sm w-32">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos.map((producto, index) => (
              <TableRow key={index} className="border-b border-gray-200 break-inside-avoid print:text-sm">
                <TableCell className="py-3 px-4 print:py-1 print:px-2 align-top">{producto.descripcion}</TableCell>
                <TableCell className="py-3 px-4 text-center print:py-1 print:px-2 align-top">{producto.cantidad}</TableCell>
                <TableCell className="py-3 px-4 text-right print:py-1 print:px-2 align-top">{formatCurrency(producto.precioUnitario)}</TableCell>
                <TableCell className="py-3 px-4 text-right print:py-1 print:px-2 align-top">{producto.iva}%</TableCell>
                <TableCell className="py-3 px-4 text-right print:py-1 print:px-2 align-top font-medium">{formatCurrency(producto.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-4 flex justify-end print:mt-2">
        <div className="w-full max-w-xs print:max-w-[200px]">
          <div className="flex justify-between py-2 print:py-0.5 print:text-sm bg-gray-50 print:bg-gray-100 px-3 rounded-t-md print:rounded-none">
            <span className="font-medium">Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between py-2 print:py-0.5 print:text-sm bg-gray-50 print:bg-gray-100 px-3">
            <span className="font-medium">IVA:</span>
            <span>{formatCurrency(totalIva)}</span>
          </div>
          <div className="flex justify-between py-2 text-lg font-bold print:py-1 print:text-base bg-gray-100 print:bg-gray-200 px-3 rounded-b-md print:rounded-none">
            <span>Total:</span>
            <span className="text-[#f15025]">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
