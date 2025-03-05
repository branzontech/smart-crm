
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Recaudo } from "@/pages/recaudos/seguimiento";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer } from "lucide-react";

interface RecaudoDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recaudo: Recaudo | null;
}

export const RecaudoDetailDialog = ({ open, onOpenChange, recaudo }: RecaudoDetailDialogProps) => {
  const impresionRef = useRef<HTMLDivElement>(null);

  // Para imprimir el detalle
  const handlePrint = useReactToPrint({
    content: () => impresionRef.current,
  });

  if (!recaudo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Detalle del Recaudo</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="flex justify-end mb-4">
            <Button 
              variant="outline" 
              className="bg-green-50 text-green-600 hover:bg-green-100"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
          </div>
          
          <div ref={impresionRef} className="p-6 bg-white">
            <div className="border-b pb-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{recaudo.id}</h2>
              <div className="flex justify-between mt-2">
                <div>
                  <h3 className="font-semibold text-lg">{recaudo.cliente}</h3>
                  <p className="text-gray-600">{recaudo.detalles?.direccion}</p>
                  <p className="text-gray-600">{recaudo.detalles?.telefono}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Factura: {recaudo.factura}</p>
                  <p className="text-gray-600">
                    Fecha de vencimiento: {new Date(recaudo.fechaVencimiento).toLocaleDateString()}
                  </p>
                  <Badge
                    variant="outline"
                    className={`
                      ${recaudo.estado === "Pendiente" ? "bg-yellow-100 text-yellow-800" : ""}
                      ${recaudo.estado === "En proceso" ? "bg-blue-100 text-blue-800" : ""}
                      ${recaudo.estado === "Vencido" ? "bg-red-100 text-red-800" : ""}
                    `}
                  >
                    {recaudo.estado}
                    {recaudo.diasVencido > 0 && ` (${recaudo.diasVencido} días)`}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Detalles de los Artículos</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left">Artículo</th>
                    <th className="border p-2 text-right">Cantidad</th>
                    <th className="border p-2 text-right">Precio Unitario</th>
                    <th className="border p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recaudo.detalles?.articulos.map((articulo, index) => (
                    <tr key={index} className="border-b">
                      <td className="border p-2">{articulo.nombre}</td>
                      <td className="border p-2 text-right">{articulo.cantidad}</td>
                      <td className="border p-2 text-right">${articulo.precio.toLocaleString()}</td>
                      <td className="border p-2 text-right">${(articulo.cantidad * articulo.precio).toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="font-semibold">
                    <td colSpan={3} className="border p-2 text-right">Total:</td>
                    <td className="border p-2 text-right">${recaudo.monto.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Método de Pago</h3>
                <p>{recaudo.detalles?.metodoPago}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Notas</h3>
                <p>{recaudo.detalles?.notas}</p>
              </div>
            </div>

            <div className="border-t pt-4 text-center text-sm text-gray-500">
              <p>Este documento es un comprobante de recaudo y no tiene validez como factura.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
