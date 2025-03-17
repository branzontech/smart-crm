import React, { useState, useEffect } from 'react';
import { useCotizacion } from '@/contexts/CotizacionContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { fetchPaises, fetchCiudades, fetchSectores } from '@/services/maestrosService';
import { Pais, Ciudad, Sector, Cliente as ClienteType } from '@/types/maestros';
import { getClientes } from '@/services/clientesService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ClienteStep: React.FC = () => {
  const { cotizacion, updateCliente } = useCotizacion();
  const { cliente } = cotizacion;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ClienteType[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Maestros data
  const [paises, setPaises] = useState<Pais[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [ciudadesFiltradas, setCiudadesFiltradas] = useState<Ciudad[]>([]);
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [isLoadingMaestros, setIsLoadingMaestros] = useState(true);

  // Cargar maestros al iniciar
  useEffect(() => {
    const loadMaestros = async () => {
      setIsLoadingMaestros(true);
      try {
        const [paisesData, ciudadesData, sectoresData] = await Promise.all([
          fetchPaises(),
          fetchCiudades(),
          fetchSectores()
        ]);
        
        setPaises(paisesData);
        setCiudades(ciudadesData);
        setSectores(sectoresData);
      } catch (error) {
        console.error("Error al cargar datos maestros:", error);
        toast.error("Error al cargar datos de referencia");
      } finally {
        setIsLoadingMaestros(false);
      }
    };

    loadMaestros();
  }, []);

  // Filtrar ciudades cuando cambia el país seleccionado
  useEffect(() => {
    if (cliente.pais_id) {
      const filtradas = ciudades.filter(ciudad => ciudad.pais_id === cliente.pais_id);
      setCiudadesFiltradas(filtradas);
      
      // Si ya hay una ciudad seleccionada y no está en el país actual, limpiar el campo
      if (cliente.ciudad_id && !filtradas.some(c => c.id === cliente.ciudad_id)) {
        // Fixed: Using a partial update
        updateCliente({ ciudad_id: '' });
      }
    } else {
      setCiudadesFiltradas([]);
    }
  }, [cliente.pais_id, ciudades, updateCliente, cliente.ciudad_id]);

  const handleSearch = async () => {
    if (!searchTerm) {
      toast.error('Ingrese un término de búsqueda');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data: clientes, error } = await getClientes();
      
      if (error) throw error;
      
      if (clientes) {
        const results = clientes.filter(
          c => c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
               c.documento.replace(/[.-]/g, '').includes(searchTerm.replace(/[.-]/g, ''))
        );
        
        setSearchResults(results);
        setShowResults(true);
        
        if (results.length === 0) {
          toast.info('No se encontraron clientes con ese criterio');
        }
      }
    } catch (error) {
      console.error("Error al buscar clientes:", error);
      toast.error("Error al buscar clientes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const selectCliente = (selectedCliente: ClienteType) => {
    // Transformar el cliente de la base de datos al formato requerido por la cotización
    const clienteData = {
      id: selectedCliente.id,
      nombre: selectedCliente.nombre,
      nit: selectedCliente.documento,
      telefono: selectedCliente.telefono,
      contacto: selectedCliente.tipo_persona === 'juridica' ? selectedCliente.cargo || '' : `${selectedCliente.nombre} ${selectedCliente.apellidos || ''}`,
      direccion: selectedCliente.direccion,
      email: selectedCliente.email,
      pais_id: selectedCliente.pais_id,
      ciudad_id: selectedCliente.ciudad_id,
      sector_id: selectedCliente.sector_id
    };
    
    updateCliente(clienteData);
    setShowResults(false);
    toast.success(`Cliente ${selectedCliente.nombre} seleccionado`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Fixed: Using a partial update via a properly typed object
    const update = { [name]: value } as Partial<{
      nombre: string;
      nit: string;
      telefono: string;
      contacto: string;
      direccion: string;
      email: string;
    }>;
    updateCliente(update);
  };

  const handleSelectChange = (name: string, value: string) => {
    // Fixed: Using a partial update via a properly typed object
    const update = { [name]: value } as Partial<{
      pais_id: string;
      ciudad_id: string;
      sector_id: string;
    }>;
    updateCliente(update);
  };

  if (isLoadingMaestros) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando datos...</span>
      </div>
    );
  }

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
            onKeyDown={handleKeyPress}
            placeholder="Buscar por nombre o documento"
            className="flex-1"
          />
          <Button onClick={handleSearch} type="button" className="shrink-0" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
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
                  <div className="text-sm text-gray-500">Documento: {result.documento}</div>
                  <div className="text-sm text-gray-500">
                    {result.tipo_persona === 'juridica' 
                      ? `Contacto: ${result.cargo || 'No especificado'}`
                      : `${result.apellidos || ''}`
                    }
                  </div>
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
              value={cliente.nombre || ''}
              onChange={handleInputChange}
              placeholder="Nombre del cliente"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nit">NIT</Label>
            <Input
              id="nit"
              name="nit"
              value={cliente.nit || ''}
              onChange={handleInputChange}
              placeholder="NIT"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contacto">Persona de Contacto</Label>
            <Input
              id="contacto"
              name="contacto"
              value={cliente.contacto || ''}
              onChange={handleInputChange}
              placeholder="Nombre de contacto"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sector">Sector</Label>
            <Select
              value={cliente.sector_id || ''}
              onValueChange={(value) => handleSelectChange('sector_id', value)}
            >
              <SelectTrigger id="sector">
                <SelectValue placeholder="Selecciona un sector" />
              </SelectTrigger>
              <SelectContent>
                {sectores.map((sector) => (
                  <SelectItem key={sector.id} value={sector.id}>
                    {sector.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              name="telefono"
              value={cliente.telefono || ''}
              onChange={handleInputChange}
              placeholder="Teléfono de contacto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              name="direccion"
              value={cliente.direccion || ''}
              onChange={handleInputChange}
              placeholder="Dirección del cliente"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pais">País</Label>
            <Select
              value={cliente.pais_id || ''}
              onValueChange={(value) => handleSelectChange('pais_id', value)}
            >
              <SelectTrigger id="pais">
                <SelectValue placeholder="Selecciona un país" />
              </SelectTrigger>
              <SelectContent>
                {paises.map((pais) => (
                  <SelectItem key={pais.id} value={pais.id}>
                    {pais.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ciudad">Ciudad</Label>
            <Select
              value={cliente.ciudad_id || ''}
              onValueChange={(value) => handleSelectChange('ciudad_id', value)}
              disabled={!cliente.pais_id || ciudadesFiltradas.length === 0}
            >
              <SelectTrigger id="ciudad">
                <SelectValue placeholder={
                  !cliente.pais_id 
                    ? "Selecciona primero un país" 
                    : ciudadesFiltradas.length === 0 
                      ? "No hay ciudades disponibles" 
                      : "Selecciona una ciudad"
                } />
              </SelectTrigger>
              <SelectContent>
                {ciudadesFiltradas.map((ciudad) => (
                  <SelectItem key={ciudad.id} value={ciudad.id}>
                    {ciudad.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
