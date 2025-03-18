
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { getCotizacionById } from "@/services/cotizacionService";
import { Cotizacion } from "@/types/cotizacion";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { CotizacionHeader } from "@/components/cotizaciones/CotizacionHeader";
import { CotizacionColoredHeader } from "@/components/cotizaciones/CotizacionColoredHeader";
import { CotizacionClienteInfo } from "@/components/cotizaciones/CotizacionClienteInfo";
import { CotizacionProductosTable } from "@/components/cotizaciones/CotizacionProductosTable";
import { CotizacionTerminos } from "@/components/cotizaciones/CotizacionTerminos";
import { CotizacionFirma } from "@/components/cotizaciones/CotizacionFirma";
import { CotizacionFooter } from "@/components/cotizaciones/CotizacionFooter";
import { CotizacionSkeleton } from "@/components/cotizaciones/CotizacionSkeleton";
import { CotizacionEmpty } from "@/components/cotizaciones/CotizacionEmpty";
import { formatCurrency, formatDate, getEstadoClass } from "@/components/cotizaciones/cotizacionUtils";
import { emailService } from "@/services/emailService";
import { Progress } from "@/components/ui/progress";

const CotizacionDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const cotizacionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCotizacion = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await getCotizacionById(id);
        if (data) {
          console.log("Cotización cargada:", data);
          setCotizacion(data);
        } else {
          toast.error("No se pudo encontrar la cotización");
        }
      } catch (error) {
        console.error("Error fetching cotización:", error);
        toast.error("Error al cargar la cotización");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCotizacion();
  }, [id]);

  const handlePrint = () => {
    // Hide elements that shouldn't appear in print
    document.querySelectorAll('.navbar, .header, .smooth-sail-navbar, footer').forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.display = 'none';
      }
    });
    
    // Give the browser a moment to update the DOM
    setTimeout(() => {
      window.print();
      
      // Restore elements after printing
      setTimeout(() => {
        document.querySelectorAll('.navbar, .header, .smooth-sail-navbar, footer').forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.display = '';
          }
        });
      }, 100);
    }, 100);
  };

  const handleSendEmail = async () => {
    if (!cotizacion) return;

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

  if (isLoading) {
    return <CotizacionSkeleton />;
  }

  if (!cotizacion) {
    return <CotizacionEmpty />;
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto cotizacion-container">
        {/* Email sending progress indicator */}
        {isSendingEmail && (
          <div className="mb-4 bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600 mb-2">Enviando cotización por correo electrónico...</p>
            <Progress value={100} className="h-2" />
          </div>
        )}
        
        {/* Header with actions */}
        <CotizacionHeader 
          cotizacion={cotizacion} 
          handlePrint={handlePrint}
          handleSendEmail={handleSendEmail}
          isSendingEmail={isSendingEmail}
          getEstadoClass={getEstadoClass} 
        />
        
        {/* Main content - optimized for printing */}
        <div id="cotizacion-preview" className="bg-white shadow-md rounded-lg overflow-hidden print:shadow-none print:rounded-none" ref={cotizacionRef}>
          {/* Colored header with logo */}
          <CotizacionColoredHeader 
            empresaEmisor={cotizacion.empresaEmisor} 
            numero={cotizacion.numero} 
            fechaFormateada={formatDate(cotizacion.fechaEmision)} 
          />
          
          {/* Content with more compact spacing for printing */}
          <div className="p-6 space-y-6 print:p-4 print:space-y-4">
            {/* Client info with more compact layout */}
            <CotizacionClienteInfo cotizacion={cotizacion} formatDate={formatDate} />
            
            <Separator className="print:my-2" />
            
            {/* Products with compact table for printing */}
            <CotizacionProductosTable 
              productos={cotizacion.productos} 
              formatCurrency={formatCurrency} 
              subtotal={cotizacion.subtotal} 
              totalIva={cotizacion.totalIva} 
              total={cotizacion.total} 
            />
            
            <Separator className="print:my-2" />
            
            {/* Terms and conditions with compact text for printing */}
            <CotizacionTerminos />
            
            {/* Signature with more compact spacing */}
            <CotizacionFirma 
              firmaNombre={cotizacion.firmaNombre} 
              firmaUrl={cotizacion.firmaUrl} 
              nombreEmpresa={cotizacion.empresaEmisor.nombre} 
            />
          </div>
          
          {/* Footer with more compact design */}
          <CotizacionFooter empresaEmisor={cotizacion.empresaEmisor} />
        </div>
      </div>
    </Layout>
  );
};

export default CotizacionDetalle;
