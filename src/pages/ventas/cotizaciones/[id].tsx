import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { getCotizacionById } from "@/services/cotizacionService";
import { Cotizacion } from "@/types/cotizacion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Printer, Download, Send, Edit } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const CotizacionDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCotizacion = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await getCotizacionById(id);
        if (data) {
          setCotizacion(data);
        } else {
          toast.error("No se pudo encontrar la cotización");
          navigate("/ventas/cotizaciones");
        }
      } catch (error) {
        console.error("Error fetching cotización:", error);
        toast.error("Error al cargar la cotización");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCotizacion();
  }, [id, navigate]);

  const handlePrint = () => {
    // Make sure any hidden elements get a chance to render
    setTimeout(() => {
      window.print();
    }, 100);
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

  const getEstadoClass = (estado: string) => {
    switch (estado) {
      case 'aprobada':
        return "bg-green-100 text-green-800";
      case 'enviada':
        return "bg-blue-100 text-blue-800";
      case 'borrador':
        return "bg-gray-100 text-gray-800";
      case 'rechazada':
        return "bg-red-100 text-red-800";
      case 'vencida':
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-[600px] w-full" />
        </div>
      </Layout>
    );
  }

  if (!cotizacion) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">No se encontró la cotización</h2>
          <Button onClick={() => navigate("/ventas/cotizaciones")}>
            Volver a cotizaciones
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto cotizacion-container">
        {/* Header with actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 print:hidden">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/ventas/cotizaciones")}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-semibold">
              Cotización {cotizacion.numero}
            </h1>
            <span className={`ml-2 px-2.5 py-1 rounded-full text-xs font-medium ${getEstadoClass(cotizacion.estado)}`}>
              {cotizacion.estado.charAt(0).toUpperCase() + cotizacion.estado.slice(1)}
            </span>
          </div>
          
          <div className="flex gap-2 print:hidden">
            <Button 
              variant="outline" 
              onClick={() => cotizacion.id && navigate(`/ventas/cotizaciones/${cotizacion.id}/editar`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button 
              variant="outline" 
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button 
              variant="default" 
              className="bg-[#f15025] hover:bg-[#d43d16] text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar
            </Button>
          </div>
        </div>
        
        {/* Main content */}
        <div id="cotizacion-preview" className="bg-white shadow-md rounded-lg overflow-hidden print:shadow-none cotizacion-printable">
          {/* Colored header */}
          <div className="bg-[#2d1e2f] text-white p-6 print:bg-primary print:text-primary-foreground">
            <div className="flex justify-between">
              <div>
                <h2 className="text-2xl font-bold">{cotizacion.empresaEmisor.nombre}</h2>
                <p>NIT: {cotizacion.empresaEmisor.nit}</p>
              </div>
              <div className="text-right">
                <h3 className="text-xl font-semibold">COTIZACIÓN</h3>
                <p>No. {cotizacion.numero}</p>
                <p>Fecha: {formatDate(cotizacion.fechaEmision)}</p>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Client info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#2d1e2f]">Cliente</h3>
                <div className="space-y-1">
                  <p><span className="font-medium">Nombre:</span> {cotizacion.cliente.nombre}</p>
                  <p><span className="font-medium">NIT:</span> {cotizacion.cliente.nit}</p>
                  <p><span className="font-medium">Dirección:</span> {cotizacion.cliente.direccion}</p>
                  <p><span className="font-medium">Teléfono:</span> {cotizacion.cliente.telefono}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#2d1e2f]">Detalles de la Cotización</h3>
                <div className="space-y-1">
                  <p><span className="font-medium">Fecha de emisión:</span> {formatDate(cotizacion.fechaEmision)}</p>
                  <p><span className="font-medium">Válida hasta:</span> {formatDate(cotizacion.fechaVencimiento)}</p>
                  <p><span className="font-medium">Estado:</span> {cotizacion.estado.charAt(0).toUpperCase() + cotizacion.estado.slice(1)}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Products */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#2d1e2f]">Productos y Servicios</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#2d1e2f]/20">
                      <th className="text-left py-2 px-4 text-[#2d1e2f] font-semibold">Descripción</th>
                      <th className="text-center py-2 px-4 text-[#2d1e2f] font-semibold">Cantidad</th>
                      <th className="text-right py-2 px-4 text-[#2d1e2f] font-semibold">Precio Unitario</th>
                      <th className="text-right py-2 px-4 text-[#2d1e2f] font-semibold">IVA</th>
                      <th className="text-right py-2 px-4 text-[#2d1e2f] font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cotizacion.productos.map((producto, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-3 px-4">{producto.descripcion}</td>
                        <td className="py-3 px-4 text-center">{producto.cantidad}</td>
                        <td className="py-3 px-4 text-right">{formatCurrency(producto.precioUnitario)}</td>
                        <td className="py-3 px-4 text-right">{producto.iva}%</td>
                        <td className="py-3 px-4 text-right">{formatCurrency(producto.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Totals */}
              <div className="mt-4 flex justify-end">
                <div className="w-full max-w-xs">
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Subtotal:</span>
                    <span>{formatCurrency(cotizacion.subtotal)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium">IVA:</span>
                    <span>{formatCurrency(cotizacion.totalIva)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between py-2 text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-[#f15025]">{formatCurrency(cotizacion.total)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Terms and conditions */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-[#2d1e2f]">Términos y Condiciones</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>1. Esta cotización tiene validez de 30 días a partir de la fecha de emisión.</p>
                <p>2. Los precios están expresados en pesos colombianos e incluyen IVA.</p>
                <p>3. Los tiempos de entrega son aproximados y pueden variar según disponibilidad.</p>
                <p>4. El pago debe realizarse según las condiciones acordadas previamente.</p>
                <p>5. Esta cotización no representa un compromiso de venta hasta su aprobación formal.</p>
              </div>
            </div>
            
            {/* Signature */}
            {cotizacion.firmaNombre && (
              <div className="mt-10 pt-10 border-t text-center">
                <div className="inline-block">
                  {cotizacion.firmaUrl && (
                    <img 
                      src={cotizacion.firmaUrl} 
                      alt="Firma" 
                      className="h-16 mx-auto mb-2"
                    />
                  )}
                  <div className="w-48 border-t border-black mt-2 pt-1 mx-auto">
                    <p className="font-medium">{cotizacion.firmaNombre}</p>
                    <p className="text-sm text-gray-600">{cotizacion.empresaEmisor.nombre}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 p-6 text-center text-gray-600 text-sm print:bg-white">
            <p>{cotizacion.empresaEmisor.nombre} | NIT: {cotizacion.empresaEmisor.nit}</p>
            <p>{cotizacion.empresaEmisor.direccion} | Tel: {cotizacion.empresaEmisor.telefono}</p>
            {cotizacion.empresaEmisor.email && <p>Email: {cotizacion.empresaEmisor.email}</p>}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CotizacionDetalle;
