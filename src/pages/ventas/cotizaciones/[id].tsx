
import { useState, useEffect } from "react";
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

const CotizacionDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    // Make sure any hidden elements get a chance to render
    setTimeout(() => {
      window.print();
    }, 100);
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
        {/* Header with actions */}
        <CotizacionHeader 
          cotizacion={cotizacion} 
          handlePrint={handlePrint} 
          getEstadoClass={getEstadoClass} 
        />
        
        {/* Main content - optimized for printing */}
        <div id="cotizacion-preview" className="bg-white shadow-md rounded-lg overflow-hidden print:shadow-none print:rounded-none">
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
