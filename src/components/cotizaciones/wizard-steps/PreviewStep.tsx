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
      
      <div className="border rounded-md p-8 bg-white print:border-none">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              {cotizacion.empresaEmisor.logo && (
                <div className="w-16 h-16 flex-shrink-0">
                  <img 
                    src={cotizacion.empresaEmisor.logo} 
                    alt={`${cotizacion.empresaEmisor.nombre} logo`} 
                    className="w-full h-full object-contain rounded-md"
                  />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">{cotizacion.empresaEmisor.nombre}</h1>
                <p className="text-gray-600">NIT: {cotizacion.empresaEmisor.nit}</p>
                <p className="text-gray-600">{cotizacion.empresaEmisor.direccion}</p>
                <p className="text-gray-600">Teléfono: {cotizacion.empresaEmisor.telefono}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold text-primary">COTIZACIÓN</h2>
              <p className="text-gray-600">No. {cotizacion.numero}</p>
              <p className="text-gray-600">Fecha: {formatDate(cotizacion.fechaEmision)}</p>
              <p className="text-gray-600">Válida hasta: {formatDate(cotizacion.fechaVencimiento)}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-2">Cliente</h3>
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
          
          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-2">Productos y Servicios</h3>
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-semibold">Descripción</th>
                  <th className="text-center py-2 font-semibold">Cantidad</th>
                  <th className="text-right py-2 font-semibold">Precio Unit.</th>
                  <th className="text-right py-2 font-semibold">IVA</th>
                  <th className="text-right py-2 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {cotizacion.productos.map((producto, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2">{producto.descripcion}</td>
                    <td className="py-2 text-center">{producto.cantidad}</td>
                    <td className="py-2 text-right">{formatCurrency(producto.precioUnitario)}</td>
                    <td className="py-2 text-right">{producto.iva}%</td>
                    <td className="py-2 text-right">{formatCurrency(producto.total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3}></td>
                  <td className="py-2 text-right font-medium">Subtotal:</td>
                  <td className="py-2 text-right">{formatCurrency(cotizacion.subtotal)}</td>
                </tr>
                <tr>
                  <td colSpan={3}></td>
                  <td className="py-2 text-right font-medium">IVA:</td>
                  <td className="py-2 text-right">{formatCurrency(cotizacion.totalIva)}</td>
                </tr>
                <tr className="font-bold text-lg">
                  <td colSpan={3}></td>
                  <td className="py-2 text-right">Total:</td>
                  <td className="py-2 text-right">{formatCurrency(cotizacion.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-2">Términos y Condiciones</h3>
            <p className="text-sm text-gray-600">
              1. Esta cotización es válida por 30 días a partir de la fecha de emisión.<br />
              2. Los precios pueden estar sujetos a cambios sin previo aviso.<br />
              3. Los tiempos de entrega son estimados y pueden variar.<br />
              4. Los precios incluyen IVA según corresponda.
            </p>
          </div>
          
          <div className="border-t pt-4 mt-auto">
            <div className="flex flex-col items-center mt-8">
              <div className="border-t border-gray-400 w-48 mb-1 pt-2"></div>
              <p className="font-medium">{cotizacion.empresaEmisor.nombre}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
          <Save className="mr-2" />
          Guardar
        </Button>
        <Button variant="outline" onClick={handleSave}>
          <Save className="mr-2" />
          Guardar y Imprimir
        </Button>
        <Button variant="outline" onClick={() => navigate(`/ventas/cotizaciones`)}>
          <Download className="mr-2" />
          Descargar
        </Button>
      </div>
    </div>
  );
};
