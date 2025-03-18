
import React, { useState, useRef } from 'react';
import { useCotizacion } from '@/contexts/CotizacionContext';
import { Button } from '@/components/ui/button';
import { Save, Printer, Download, Send } from 'lucide-react';
import { saveCotizacion } from '@/services/cotizacionService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CotizacionColoredHeader } from '../CotizacionColoredHeader';
import { CotizacionProductosTable } from '../CotizacionProductosTable';
import { Separator } from '@/components/ui/separator';
import { CotizacionTerminos } from '../CotizacionTerminos';
import { CotizacionFooter } from '../CotizacionFooter';
import { emailService } from '@/services/emailService';
import { Progress } from '@/components/ui/progress';

export const PreviewStep: React.FC = () => {
  const { cotizacion, currentStep, setCurrentStep } = useCotizacion();
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const navigate = useNavigate();
  const cotizacionRef = useRef<HTMLDivElement>(null);
  
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

  const handleSendEmail = async () => {
    // Validate client email
    if (!cotizacion.cliente.email) {
      toast.error("No se puede enviar el correo: el cliente no tiene dirección de correo electrónico");
      return;
    }

    // Validate sender email
    if (!cotizacion.empresaEmisor.email) {
      toast.error("No se puede enviar el correo: la empresa emisora no tiene dirección de correo electrónico");
      return;
    }

    try {
      setIsSendingEmail(true);
      toast("Preparando el envío de la cotización...");

      // Get the HTML content of the quotation
      const htmlContent = cotizacionRef.current?.outerHTML || "";
      if (!htmlContent) {
        throw new Error("No se pudo obtener el contenido de la cotización");
      }

      // Send the email with the quotation as PDF
      const result = await emailService.sendQuotationEmail(cotizacion, htmlContent);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error(`Error al enviar el correo: ${error.message || "Error desconocido"}`);
    } finally {
      setIsSendingEmail(false);
    }
  };
  
  const errors = validateCotizacion();
  const hasErrors = errors.length > 0;
  const fechaFormateada = formatDate(cotizacion.fechaEmision);

  const handleGoBack = () => {
    setCurrentStep('productos');
  };

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="space-y-6 w-full">
      <h2 className="text-2xl font-semibold">Previsualización de Cotización</h2>
      <p className="text-gray-500">
        Verifique la información de la cotización antes de guardar.
      </p>
      
      {isSendingEmail && (
        <div className="mb-4 bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600 mb-2">Enviando cotización por correo electrónico...</p>
          <Progress value={100} className="h-2" />
        </div>
      )}
      
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
      
      <div id="cotizacion-preview" className="border rounded-md bg-white print:border-none print:shadow-none" ref={cotizacionRef}>
        <CotizacionColoredHeader 
          empresaEmisor={cotizacion.empresaEmisor}
          numero={cotizacion.numero}
          fechaFormateada={fechaFormateada}
        />
        
        <div className="p-6 space-y-6 print:p-4 print:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-2">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-[#2d1e2f]">Cliente</h3>
              <div className="space-y-1">
                <p><span className="font-medium">Nombre:</span> {cotizacion.cliente.nombre}</p>
                <p><span className="font-medium">NIT:</span> {cotizacion.cliente.nit}</p>
                <p><span className="font-medium">Dirección:</span> {cotizacion.cliente.direccion}</p>
                <p><span className="font-medium">Teléfono:</span> {cotizacion.cliente.telefono}</p>
                {cotizacion.cliente.email && (
                  <p><span className="font-medium">Email:</span> {cotizacion.cliente.email}</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-[#2d1e2f]">Detalles de la Cotización</h3>
              <div className="space-y-1">
                <p><span className="font-medium">Fecha de emisión:</span> {fechaFormateada}</p>
                <p><span className="font-medium">Válida hasta:</span> {formatDate(cotizacion.fechaVencimiento)}</p>
                <p><span className="font-medium">Estado:</span> {cotizacion.estado.charAt(0).toUpperCase() + cotizacion.estado.slice(1)}</p>
              </div>
            </div>
          </div>
          
          <Separator className="print:my-2" />
          
          <CotizacionProductosTable 
            productos={cotizacion.productos}
            formatCurrency={formatCurrency}
            subtotal={cotizacion.subtotal}
            totalIva={cotizacion.totalIva}
            total={cotizacion.total}
          />
          
          <Separator className="print:my-2" />
          
          <CotizacionTerminos />
          
          {cotizacion.firmaNombre && (
            <div className="mt-10 pt-6 border-t text-center">
              <div className="w-48 border-t border-gray-400 pt-2 mx-auto">
                <p className="font-medium">{cotizacion.firmaNombre}</p>
                <p className="text-sm text-gray-600">{cotizacion.empresaEmisor.nombre}</p>
              </div>
            </div>
          )}
        </div>
        
        <CotizacionFooter empresaEmisor={cotizacion.empresaEmisor} />
      </div>
      
      <div className="flex justify-between print:hidden">
        <Button variant="outline" onClick={handleGoBack}>
          Anterior
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2" />
            Imprimir
          </Button>
          <Button variant="outline" onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2" />
            Guardar
          </Button>
          <Button
            variant="outline"
            onClick={handleSendEmail}
            disabled={isSendingEmail || hasErrors || !cotizacion.cliente.email}
          >
            <Send className="mr-2" />
            {isSendingEmail ? "Enviando..." : "Enviar por correo"}
          </Button>
        </div>
      </div>
    </div>
  );
};
