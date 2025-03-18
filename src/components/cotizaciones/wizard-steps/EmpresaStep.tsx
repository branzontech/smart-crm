
import React, { useEffect, useState } from 'react';
import { useCotizacion } from '@/contexts/CotizacionContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { es } from 'date-fns/locale';
import { fetchCompanyConfig } from '@/services/configService';

export const EmpresaStep: React.FC = () => {
  const { cotizacion, updateEmpresaEmisor, updateFechaVencimiento } = useCotizacion();
  const { empresaEmisor, fechaEmision, fechaVencimiento } = cotizacion;
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedData, setHasLoadedData] = useState(false);

  useEffect(() => {
    // Solo cargar los datos si no se han cargado previamente
    if (!hasLoadedData) {
      const loadCompanyData = async () => {
        setIsLoading(true);
        try {
          const config = await fetchCompanyConfig();
          if (config) {
            console.log("Loading company config with email:", config.email);
            updateEmpresaEmisor({
              nombre: config.razon_social,
              nit: config.nit,
              telefono: config.telefono,
              direccion: config.direccion,
              logo: config.logo_path,
              email: config.email || ''
            });
          }
        } catch (error) {
          console.error('Error loading company config:', error);
        } finally {
          setIsLoading(false);
          setHasLoadedData(true);
        }
      };

      loadCompanyData();
    }
  }, [hasLoadedData, updateEmpresaEmisor]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <h2 className="text-2xl font-semibold">Información de la Empresa Emisora</h2>
      <p className="text-gray-500">
        Esta información aparecerá en el encabezado de la cotización.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre o Razón Social</Label>
            <Input
              id="nombre"
              name="nombre"
              value={empresaEmisor.nombre}
              readOnly
              disabled
              className="bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nit">NIT</Label>
            <Input
              id="nit"
              name="nit"
              value={empresaEmisor.nit}
              readOnly
              disabled
              className="bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              name="telefono"
              value={empresaEmisor.telefono}
              readOnly
              disabled
              className="bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              name="direccion"
              value={empresaEmisor.direccion}
              readOnly
              disabled
              className="bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              name="email"
              value={empresaEmisor.email}
              readOnly
              disabled
              className="bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo de la Empresa</Label>
            {empresaEmisor.logo ? (
              <div className="mt-2">
                <img 
                  src={empresaEmisor.logo} 
                  alt="Logo de la empresa"
                  className="h-16 object-contain"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No hay logo configurado</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Número de Cotización</Label>
            <Input
              value={cotizacion.numero}
              readOnly
              disabled
              className="bg-gray-100"
            />
            <p className="text-xs text-gray-500">
              Este número se genera automáticamente
            </p>
          </div>

          <div className="space-y-2">
            <Label>Fecha de Emisión</Label>
            <Input
              value={format(fechaEmision, 'dd/MM/yyyy')}
              readOnly
              disabled
              className="bg-gray-100"
            />
            <p className="text-xs text-gray-500">
              Esta es la fecha actual
            </p>
          </div>

          <div className="space-y-2">
            <Label>Fecha de Vencimiento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(fechaVencimiento, 'dd/MM/yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fechaVencimiento}
                  onSelect={(date) => date && updateFechaVencimiento(date)}
                  initialFocus
                  locale={es}
                  disabled={date => date < new Date()}
                  fromDate={new Date()}
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-gray-500">
              Seleccione la fecha de vencimiento de la cotización
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
