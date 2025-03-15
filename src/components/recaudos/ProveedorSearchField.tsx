
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CreateProveedorDialog } from "@/components/CreateProveedorDialog";

interface ProveedorSearchFieldProps {
  proveedorQuery: string;
  setProveedorQuery: (query: string) => void;
  onSelectProveedor: (proveedor: { id: string; nombre: string }) => void;
}

export function ProveedorSearchField({
  proveedorQuery,
  setProveedorQuery,
  onSelectProveedor,
}: ProveedorSearchFieldProps) {
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState<any[]>([]);

  useEffect(() => {
    const fetchProveedores = async () => {
      if (proveedorQuery && proveedorQuery.length >= 2) {
        try {
          const { data, error } = await supabase
            .from('proveedores')
            .select('id, nombre')
            .ilike('nombre', `%${proveedorQuery}%`)
            .limit(10);

          if (error) throw error;
          
          if (data) {
            setProveedoresFiltrados(data);
          }
        } catch (error) {
          console.error("Error searching proveedores:", error);
        }
      } else {
        setProveedoresFiltrados([]);
      }
    };

    fetchProveedores();
  }, [proveedorQuery]);

  const handleProveedorCreated = (proveedor: { id: number | string; nombre: string }) => {
    onSelectProveedor({
      id: proveedor.id.toString(),
      nombre: proveedor.nombre
    });
  };

  return (
    <div>
      <Label htmlFor="proveedor">Proveedor</Label>
      <div className="relative">
        <div className="flex space-x-2">
          <div className="relative flex-grow">
            <Input
              id="proveedor"
              placeholder="Buscar proveedor..."
              value={proveedorQuery}
              onChange={(e) => setProveedorQuery(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          <CreateProveedorDialog onProveedorCreated={handleProveedorCreated} />
        </div>
        
        {proveedoresFiltrados.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
            {proveedoresFiltrados.map(proveedor => (
              <div
                key={proveedor.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => onSelectProveedor(proveedor)}
              >
                {proveedor.nombre}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
