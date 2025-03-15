
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus } from "lucide-react";
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

const tasasIVA = [
  { valor: 0, etiqueta: "0%" },
  { valor: 0.05, etiqueta: "5%" },
  { valor: 0.16, etiqueta: "16%" },
  { valor: 0.19, etiqueta: "19%" },
];

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
            value={nuevoArticulo.cantidad} 
            onChange={(e) => setNuevoArticulo({...nuevoArticulo, cantidad: parseInt(e.target.value) || 1})}
          />
        </div>
        <div>
          <Label htmlFor="valorUnitario">Valor Unitario</Label>
          <Input 
            id="valorUnitario"
            type="number" 
            min="0" 
            value={nuevoArticulo.valor_unitario} 
            onChange={(e) => setNuevoArticulo({...nuevoArticulo, valor_unitario: parseFloat(e.target.value) || 0})}
          />
        </div>
        <div>
          <Label htmlFor="tasaIva">IVA</Label>
          <Select 
            value={nuevoArticulo.tasa_iva.toString()}
            onValueChange={(value) => setNuevoArticulo({
              ...nuevoArticulo, 
              tasa_iva: parseFloat(value)
            })}
          >
            <SelectTrigger id="tasaIva">
              <SelectValue placeholder="Seleccionar IVA" />
            </SelectTrigger>
            <SelectContent>
              {tasasIVA.map((tasa) => (
                <SelectItem key={tasa.valor} value={tasa.valor.toString()}>
                  {tasa.etiqueta}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
