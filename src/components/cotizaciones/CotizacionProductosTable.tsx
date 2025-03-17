
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
    <div>
      <h3 className="text-lg font-semibold mb-4 text-[#2d1e2f] print:mb-1">Productos y Servicios</h3>
      <div className="overflow-x-auto print:overflow-visible">
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow className="border-b border-[#2d1e2f]/20">
              <TableHead className="text-left py-2 px-4 text-[#2d1e2f] font-semibold print:py-1 print:px-2 print:text-xs">Descripción</TableHead>
              <TableHead className="text-center py-2 px-4 text-[#2d1e2f] font-semibold print:py-1 print:px-2 print:text-xs">Cantidad</TableHead>
              <TableHead className="text-right py-2 px-4 text-[#2d1e2f] font-semibold print:py-1 print:px-2 print:text-xs">Precio Unitario</TableHead>
              <TableHead className="text-right py-2 px-4 text-[#2d1e2f] font-semibold print:py-1 print:px-2 print:text-xs">IVA</TableHead>
              <TableHead className="text-right py-2 px-4 text-[#2d1e2f] font-semibold print:py-1 print:px-2 print:text-xs">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos.map((producto, index) => (
              <TableRow key={index} className="border-b border-gray-200 break-inside-avoid print:text-xs">
                <TableCell className="py-3 px-4 print:py-1 print:px-2">{producto.descripcion}</TableCell>
                <TableCell className="py-3 px-4 text-center print:py-1 print:px-2">{producto.cantidad}</TableCell>
                <TableCell className="py-3 px-4 text-right print:py-1 print:px-2">{formatCurrency(producto.precioUnitario)}</TableCell>
                <TableCell className="py-3 px-4 text-right print:py-1 print:px-2">{producto.iva}%</TableCell>
                <TableCell className="py-3 px-4 text-right print:py-1 print:px-2">{formatCurrency(producto.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Totals with improved spacing and alignment */}
      <div className="mt-4 flex justify-end print:mt-2">
        <div className="w-full max-w-xs">
          <div className="flex justify-between py-2 print:py-0.5 print:text-xs">
            <span className="font-medium">Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between py-2 print:py-0.5 print:text-xs">
            <span className="font-medium">IVA:</span>
            <span>{formatCurrency(totalIva)}</span>
          </div>
          <Separator className="my-2 print:my-0.5" />
          <div className="flex justify-between py-2 text-lg font-bold print:py-0.5 print:text-sm">
            <span>Total:</span>
            <span className="text-[#f15025]">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
