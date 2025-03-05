
import React, { useState } from 'react';
import { useCotizacion } from '@/contexts/CotizacionContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

// Mockup clients data for search functionality
const mockClientes = [
  {
    id: '1',
    nombre: 'Empresa ABC',
    nit: '800.123.456-1',
    telefono: '+57 (1) 234-5678',
    contacto: 'Juan Pérez',
    direccion: 'Calle 123 #45-67, Bogotá'
  },
  {
    id: '2',
    nombre: 'Comercial XYZ',
    nit: '900.456.789-2',
    telefono: '+57 (1) 987-6543',
    contacto: 'María López',
    direccion: 'Av. Principal #89-12, Medellín'
  }
];

export const ClienteStep: React.FC = () => {
  const { cotizacion, updateCliente } = useCotizacion();
  const { cliente } = cotizacion;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<typeof mockClientes>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    if (!searchTerm) {
      toast.error('Ingrese un término de búsqueda');
      return;
    }
    
    // In a real app, this would be an API call
    const results = mockClientes.filter(
      c => c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
           c.nit.replace(/[.-]/g, '').includes(searchTerm.replace(/[.-]/g, ''))
    );
    
    setSearchResults(results);
    setShowResults(true);
    
    if (results.length === 0) {
      toast.info('No se encontraron clientes con ese criterio');
    }
  };

  const selectCliente = (selectedCliente: typeof mockClientes[0]) => {
    updateCliente(selectedCliente);
    setShowResults(false);
    toast.success(`Cliente ${selectedCliente.nombre} seleccionado`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateCliente({ [name]: value });
  };

  return (
    <div className="space-y-6 w-full">
      <h2 className="text-2xl font-semibold">Información del Cliente</h2>
      <p className="text-gray-500">
        Busque un cliente existente o ingrese los datos manualmente.
      </p>

      <div className="border p-4 rounded-md bg-gray-50 mb-6">
        <Label htmlFor="search" className="mb-2 block">Buscar Cliente</Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o NIT"
            className="flex-1"
          />
          <Button onClick={handleSearch} type="button" className="shrink-0">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>
        
        {showResults && searchResults.length > 0 && (
          <div className="mt-4 border rounded bg-white">
            <div className="p-2 border-b bg-gray-100 font-medium">
              Resultados encontrados
            </div>
            <div className="divide-y max-h-60 overflow-auto">
              {searchResults.map((result) => (
                <div key={result.id} className="p-3 hover:bg-gray-50 cursor-pointer" onClick={() => selectCliente(result)}>
                  <div className="font-medium">{result.nombre}</div>
                  <div className="text-sm text-gray-500">NIT: {result.nit}</div>
                  <div className="text-sm text-gray-500">Contacto: {result.contacto}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre o Razón Social</Label>
            <Input
              id="nombre"
              name="nombre"
              value={cliente.nombre}
              onChange={handleInputChange}
              placeholder="Nombre del cliente"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nit">NIT</Label>
            <Input
              id="nit"
              name="nit"
              value={cliente.nit}
              onChange={handleInputChange}
              placeholder="NIT"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contacto">Persona de Contacto</Label>
            <Input
              id="contacto"
              name="contacto"
              value={cliente.contacto}
              onChange={handleInputChange}
              placeholder="Nombre de contacto"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              name="telefono"
              value={cliente.telefono}
              onChange={handleInputChange}
              placeholder="Teléfono de contacto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              name="direccion"
              value={cliente.direccion}
              onChange={handleInputChange}
              placeholder="Dirección del cliente"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
