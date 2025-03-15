
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Articulo } from "./NuevoArticuloForm";

interface ArticulosTableProps {
  articulos: Articulo[];
  eliminarArticulo: (id: string) => void;
}

export function ArticulosTable({ articulos, eliminarArticulo }: ArticulosTableProps) {
  if (articulos.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No hay artículos agregados
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Proveedor</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead className="text-right">Cantidad</TableHead>
          <TableHead className="text-right">Valor Unitario</TableHead>
          <TableHead className="text-right">IVA (%)</TableHead>
          <TableHead className="text-right">Valor IVA</TableHead>
          <TableHead className="text-right">Valor Total</TableHead>
          <TableHead className="text-center">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articulos.map((articulo) => (
          <TableRow key={articulo.id}>
            <TableCell>{articulo.nombreProveedor}</TableCell>
            <TableCell>{articulo.descripcion}</TableCell>
            <TableCell className="text-right">{articulo.cantidad}</TableCell>
            <TableCell className="text-right">
              ${articulo.valor_unitario.toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              {(articulo.tasa_iva * 100).toFixed(0)}%
            </TableCell>
            <TableCell className="text-right">
              ${articulo.valor_iva.toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              ${articulo.valor_total.toLocaleString()}
            </TableCell>
            <TableCell className="text-center">
              <Button 
                type="button" 
                variant="ghost" 
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => eliminarArticulo(articulo.id!)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
