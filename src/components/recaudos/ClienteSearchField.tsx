
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { CreateClienteDialog } from "@/components/CreateClienteDialog";

interface ClienteSearchFieldProps {
  clienteQuery: string;
  setClienteQuery: (query: string) => void;
  onSelectCliente: (cliente: { id: string; nombre: string }) => void;
  error?: string;
}

export function ClienteSearchField({
  clienteQuery,
  setClienteQuery,
  onSelectCliente,
  error
}: ClienteSearchFieldProps) {
  const [clientesFiltrados, setClientesFiltrados] = useState<any[]>([]);

  useEffect(() => {
    const fetchClientes = async () => {
      if (clienteQuery && clienteQuery.length >= 2) {
        try {
          const { data, error } = await supabase
            .from('clientes')
            .select('id, nombre, apellidos, empresa, tipo_persona')
            .or(`nombre.ilike.%${clienteQuery}%,apellidos.ilike.%${clienteQuery}%,empresa.ilike.%${clienteQuery}%`)
            .limit(10);

          if (error) throw error;
          
          if (data) {
            const formattedClientes = data.map(cliente => ({
              id: cliente.id,
              nombre: cliente.tipo_persona === 'juridica' 
                ? cliente.empresa 
                : `${cliente.nombre} ${cliente.apellidos || ''}`
            }));
            
            setClientesFiltrados(formattedClientes);
          }
        } catch (error) {
          console.error("Error searching clientes:", error);
        }
      } else {
        setClientesFiltrados([]);
      }
    };

    fetchClientes();
  }, [clienteQuery]);

  const handleClienteCreated = (cliente: { id: number | string; nombre: string }) => {
    onSelectCliente({
      id: cliente.id.toString(),
      nombre: cliente.nombre
    });
  };

  return (
    <div className="relative">
      <div className="flex space-x-2 mb-2">
        <div className="relative flex-grow">
          <Input
            placeholder="Buscar cliente..."
            value={clienteQuery}
            onChange={(e) => setClienteQuery(e.target.value)}
            className="pr-10"
          />
          <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
        </div>
        <CreateClienteDialog onClienteCreated={handleClienteCreated} />
      </div>
      
      {clientesFiltrados.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
          {clientesFiltrados.map(cliente => (
            <div
              key={cliente.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelectCliente(cliente)}
            >
              {cliente.nombre}
            </div>
          ))}
        </div>
      )}
      {error && <FormMessage>{error}</FormMessage>}
    </div>
  );
}
