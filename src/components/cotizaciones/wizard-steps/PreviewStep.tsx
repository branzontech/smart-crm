
import React, { useState } from 'react';
import { useCotizacion } from '@/contexts/CotizacionContext';
import { Button } from '@/components/ui/button';
import { Save, Printer, Download } from 'lucide-react';
import { saveCotizacion } from '@/services/cotizacionService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CotizacionColoredHeader } from '../CotizacionColoredHeader';
import { CotizacionProductosTable } from '../CotizacionProductosTable';

export const PreviewStep: React.FC = () => {
  const { cotizacion, currentStep, setCurrentStep } = useCotizacion();
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const cotizacionId = await saveCotizacion(cotizacion);
      
      if (cotizacionId) {
        toast.success("Cotización guardada correctamente");
        navigate(`/ventas/cotizaciones`);
      }
    } catch (error) {
      console.error("Error al guardar la cotización:", error);
      toast.error("Error al guardar la cotización");
    } finally {
      setIsSaving(false);
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };
  
  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: es });
  };
  
  const validateCotizacion = () => {
    const errors = [];
    
    if (!cotizacion.empresaEmisor.nombre) {
      errors.push("Falta el nombre de la empresa emisora");
    }
    
    if (!cotizacion.cliente.nombre) {
      errors.push("Falta el nombre del cliente");
    }
    
    if (cotizacion.productos.length === 0) {
      errors.push("No ha agregado productos a la cotización");
    }
    
    return errors;
  };
  
  const errors = validateCotizacion();
  const hasErrors = errors.length > 0;
  const fechaFormateada = formatDate(cotizacion.fechaEmision);

  const handleGoBack = () => {
    // Fixed: Using the string literal 'productos' instead of currentStep - 1
    setCurrentStep('productos');
  };

  return (
    <div className="space-y-6 w-full">
      <h2 className="text-2xl font-semibold">Previsualización de Cotización</h2>
      <p className="text-gray-500">
        Verifique la información de la cotización antes de guardar.
      </p>
      
      {hasErrors && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            <div className="font-medium mb-2">Por favor corrija los siguientes errores antes de guardar:</div>
            <ul className="list-disc pl-5">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      <div id="cotizacion-preview" className="border rounded-md p-8 bg-white print:border-none">
        <div className="flex flex-col gap-8">
          <CotizacionColoredHeader 
            empresaEmisor={cotizacion.empresaEmisor}
            numero={cotizacion.numero}
            fechaFormateada={fechaFormateada}
          />
          
          <div className="px-6 pt-4">
            <h3 className="font-semibold text-lg mb-2 text-[#2d1e2f]">Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <p className="font-medium">Nombre:</p>
                <p>{cotizacion.cliente.nombre}</p>
              </div>
              <div>
                <p className="font-medium">NIT:</p>
                <p>{cotizacion.cliente.nit}</p>
              </div>
              <div>
                <p className="font-medium">Dirección:</p>
                <p>{cotizacion.cliente.direccion}</p>
              </div>
              <div>
                <p className="font-medium">Teléfono:</p>
                <p>{cotizacion.cliente.telefono}</p>
              </div>
              <div>
                <p className="font-medium">Contacto:</p>
                <p>{cotizacion.cliente.contacto}</p>
              </div>
            </div>
          </div>
          
          <div className="px-6">
            <CotizacionProductosTable 
              productos={cotizacion.productos}
              formatCurrency={formatCurrency}
              subtotal={cotizacion.subtotal}
              totalIva={cotizacion.totalIva}
              total={cotizacion.total}
            />
          </div>
          
          <div className="px-6 border-t pt-4">
            <h3 className="font-semibold text-lg mb-2 text-[#2d1e2f]">Términos y Condiciones</h3>
            <p className="text-sm text-gray-600">
              1. Esta cotización es válida por 30 días a partir de la fecha de emisión.<br />
              2. Los precios pueden estar sujetos a cambios sin previo aviso.<br />
              3. Los tiempos de entrega son estimados y pueden variar.<br />
              4. Los precios incluyen IVA según corresponda.
            </p>
          </div>
          
          <div className="px-6 border-t pt-4 mt-auto">
            <div className="flex flex-col items-center mt-8">
              <div className="border-t border-gray-400 w-48 mb-1 pt-2"></div>
              <p className="font-medium">{cotizacion.empresaEmisor.nombre}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleGoBack}>
          Anterior
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2" />
            Imprimir
          </Button>
          <Button variant="outline" onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2" />
            Guardar
          </Button>
          <Button variant="outline" onClick={() => navigate(`/ventas/cotizaciones`)}>
            <Download className="mr-2" />
            Descargar
          </Button>
        </div>
      </div>
    </div>
  );
};
