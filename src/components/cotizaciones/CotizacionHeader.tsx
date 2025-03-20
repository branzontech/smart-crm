
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Printer, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Cotizacion } from "@/types/cotizacion";

interface CotizacionHeaderProps {
  cotizacion: Cotizacion;
  handlePrint: () => void;
  handleSendEmail: () => void;
  isSendingEmail: boolean;
  getEstadoClass: (estado: string) => string;
}

export const CotizacionHeader = ({ 
  cotizacion, 
  handlePrint, 
  handleSendEmail,
  isSendingEmail,
  getEstadoClass 
}: CotizacionHeaderProps) => {
  const navigate = useNavigate();
  
  return (
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
          onClick={handleSendEmail}
          disabled={isSendingEmail}
        >
          <Send className="h-4 w-4 mr-2" />
          {isSendingEmail ? "Enviando..." : "Enviar por correo"}
        </Button>
      </div>
    </div>
  );
};
