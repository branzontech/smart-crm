
import React, { useEffect, useState } from 'react';
import { useCotizacion } from '@/contexts/CotizacionContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Info } from 'lucide-react';
import { es } from 'date-fns/locale';
import { fetchCompanyConfig } from '@/services/configService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const EmpresaStep: React.FC = () => {
  const { cotizacion, updateEmpresaEmisor, updateFechaVencimiento } = useCotizacion();
  const { empresaEmisor, fechaEmision, fechaVencimiento } = cotizacion;
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedData, setHasLoadedData] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // Solo cargar los datos si no se han cargado previamente
    if (!hasLoadedData) {
      const loadCompanyData = async () => {
        setIsLoading(true);
        setLoadError(null);
        try {
          const config = await fetchCompanyConfig();
          console.log("Company config fetched:", config);
          
          if (config) {
            updateEmpresaEmisor({
              nombre: config.razon_social,
              nit: config.nit,
              telefono: config.telefono,
              direccion: config.direccion,
              logo: config.logo_path,
              email: config.email || ''
            });
          } else {
            setLoadError('No se encontró configuración de empresa. Por favor, configure los datos de su empresa en la sección de Configuración.');
          }
        } catch (error) {
          console.error('Error loading company config:', error);
          setLoadError('Error al cargar la configuración de la empresa. Intente nuevamente.');
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

      {loadError && (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-700">
            {loadError}
          </AlertDescription>
        </Alert>
      )}

      {!empresaEmisor.email && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertDescription className="text-amber-700">
            No hay correo electrónico configurado para la empresa. Esto es necesario para enviar cotizaciones por email.
            Configure un correo electrónico en la sección de Configuración.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre o Razón Social</Label>
            <Input
              id="nombre"
              name="nombre"
              value={empresaEmisor.nombre || ''}
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
              value={empresaEmisor.nit || ''}
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
              value={empresaEmisor.telefono || ''}
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
              value={empresaEmisor.direccion || ''}
              readOnly
              disabled
              className="bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1">
              Correo Electrónico
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-primary cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Necesario para enviar cotizaciones por email</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="email"
              name="email"
              value={empresaEmisor.email || ''}
              readOnly
              disabled
              className={`bg-gray-100 ${!empresaEmisor.email ? 'border-amber-300' : ''}`}
            />
            {!empresaEmisor.email && (
              <p className="text-sm text-amber-600">No configurado</p>
            )}
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
