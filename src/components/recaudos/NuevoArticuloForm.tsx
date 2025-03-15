
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, BadgePercent } from "lucide-react";
import { ProveedorSearchField } from "./ProveedorSearchField";
import { z } from "zod";

export const articuloSchema = z.object({
  id: z.string().optional(),
  proveedor_id: z.string().min(1, { message: "El proveedor es requerido" }),
  nombreProveedor: z.string().optional(),
  descripcion: z.string().min(1, { message: "La descripción es requerida" }),
  cantidad: z.number().min(1, { message: "La cantidad debe ser mayor a 0" }),
  valor_unitario: z.number().min(0, { message: "El valor unitario debe ser mayor o igual a 0" }),
  valor_total: z.number().min(0, { message: "El valor total debe ser mayor o igual a 0" }),
  tasa_iva: z.number().min(0, { message: "La tasa de IVA debe ser mayor o igual a 0" }),
  valor_iva: z.number().min(0, { message: "El valor del IVA debe ser mayor o igual a 0" }),
});

export type Articulo = z.infer<typeof articuloSchema>;

interface NuevoArticuloFormProps {
  nuevoArticulo: {
    proveedor_id: string;
    nombreProveedor: string;
    descripcion: string;
    cantidad: number;
    valor_unitario: number;
    tasa_iva: number;
  };
  setNuevoArticulo: (articulo: any) => void;
  agregarArticulo: () => void;
  proveedorQuery: string;
  setProveedorQuery: (query: string) => void;
}

export function NuevoArticuloForm({
  nuevoArticulo,
  setNuevoArticulo,
  agregarArticulo,
  proveedorQuery,
  setProveedorQuery
}: NuevoArticuloFormProps) {
  const seleccionarProveedor = (proveedor: any) => {
    setNuevoArticulo({
      ...nuevoArticulo,
      proveedor_id: proveedor.id,
      nombreProveedor: proveedor.nombre,
    });
    setProveedorQuery(proveedor.nombre);
  };

  const handleAplicarIvaChange = (checked: boolean) => {
    setNuevoArticulo({
      ...nuevoArticulo,
      tasa_iva: checked ? 0.19 : 0
    });
  };

  return (
    <div className="mb-4 grid grid-cols-1 gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProveedorSearchField 
          proveedorQuery={proveedorQuery} 
          setProveedorQuery={setProveedorQuery} 
          onSelectProveedor={seleccionarProveedor} 
        />

        <div>
          <Label htmlFor="descripcion">Descripción</Label>
          <Input 
            id="descripcion"
            placeholder="Descripción del artículo o servicio" 
            value={nuevoArticulo.descripcion} 
            onChange={(e) => setNuevoArticulo({...nuevoArticulo, descripcion: e.target.value})}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="cantidad">Cantidad</Label>
          <Input 
            id="cantidad"
            type="number" 
            min="1" 
            placeholder="Cantidad"
            value={nuevoArticulo.cantidad === 1 && !proveedorQuery ? "" : nuevoArticulo.cantidad} 
            onChange={(e) => setNuevoArticulo({...nuevoArticulo, cantidad: parseInt(e.target.value) || 1})}
          />
        </div>
        <div>
          <Label htmlFor="valorUnitario">Valor Unitario</Label>
          <Input 
            id="valorUnitario"
            type="number" 
            min="0" 
            placeholder="Valor unitario"
            value={nuevoArticulo.valor_unitario === 0 && !proveedorQuery ? "" : nuevoArticulo.valor_unitario} 
            onChange={(e) => setNuevoArticulo({...nuevoArticulo, valor_unitario: parseFloat(e.target.value) || 0})}
          />
        </div>
        <div className="flex items-start md:items-center gap-2 pt-7">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="aplicarIva" 
              checked={nuevoArticulo.tasa_iva > 0} 
              onCheckedChange={(checked) => handleAplicarIvaChange(checked === true)}
            />
            <div className="flex items-center space-x-1.5">
              <Label 
                htmlFor="aplicarIva" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Aplicar IVA (19%)
              </Label>
              <BadgePercent className="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-2">
        <Button 
          type="button" 
          className="bg-teal hover:bg-sage text-white"
          onClick={agregarArticulo}
          disabled={!nuevoArticulo.proveedor_id || !nuevoArticulo.descripcion}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Artículo
        </Button>
      </div>
    </div>
  );
}
