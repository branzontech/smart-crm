
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Check, 
  Coins, 
  Search, 
  Clock, 
  AlertCircle, 
  Eye, 
  Printer,
  MoreHorizontal,
  Columns,
  GripVertical,
  Calendar,
  DollarSign,
  Building,
  FileText,
  Edit
} from "lucide-react";
import { RecaudoFilterBar } from "@/components/recaudos/RecaudoFilterBar";
import { RecaudoTable } from "@/components/recaudos/RecaudoTable";
import { RecaudoDetailDialog } from "@/components/recaudos/RecaudoDetailDialog";
import { RecaudoStatusDialog } from "@/components/recaudos/RecaudoStatusDialog";
import { RecaudoPaymentDialog } from "@/components/recaudos/RecaudoPaymentDialog";
import { useRecaudos } from "@/hooks/useRecaudos";

// Tipo para el recaudo
export interface Recaudo {
  id: string;
  cliente: string;
  factura: string;
  monto: number;
  fechaVencimiento: string;
  estado: string;
  diasVencido: number;
  detalles?: {
    direccion: string;
    telefono: string;
    articulos: Array<{
      nombre: string;
      cantidad: number;
      precio: number;
    }>;
    metodoPago: string;
    notas: string;
  };
}

// Tipos para las columnas
export interface Column {
  id: string;
  header: string;
  accessorKey: string;
  isVisible: boolean;
  order: number;
}

const SeguimientoRecaudos = () => {
  const navigate = useNavigate();
  const { 
    recaudos, 
    recaudoSeleccionado, 
    setRecaudoSeleccionado,
    marcarComoPagado, 
    cambiarEstado
  } = useRecaudos();
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [mostrarPagoConfirmacion, setMostrarPagoConfirmacion] = useState(false);
  const [mostrarCambioEstado, setMostrarCambioEstado] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState("");
  
  // Función para ver detalle de recaudo
  const verDetalleRecaudo = (recaudo: Recaudo) => {
    setRecaudoSeleccionado(recaudo);
    setMostrarDetalle(true);
  };

  // Función para abrir diálogo de confirmación de pago
  const confirmarPago = (recaudo: Recaudo) => {
    setRecaudoSeleccionado(recaudo);
    setMostrarPagoConfirmacion(true);
  };

  // Función para abrir diálogo de cambio de estado
  const abrirCambioEstado = (recaudo: Recaudo) => {
    setRecaudoSeleccionado(recaudo);
    setNuevoEstado(recaudo.estado);
    setMostrarCambioEstado(true);
  };

  const handleCambiarEstado = () => {
    if (recaudoSeleccionado) {
      cambiarEstado(recaudoSeleccionado.id, nuevoEstado);
      setMostrarCambioEstado(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <div className="main-container">
        <main className="flex-1 content-container">
          <div className="max-w-content">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="text-teal hover:text-sage hover:bg-mint/20"
                  onClick={() => navigate("/recaudos")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
                </Button>
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                  <Coins className="h-6 w-6 text-teal" />
                  Seguimiento de Recaudos
                </h1>
              </div>
            </div>
            
            <RecaudoFilterBar />
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Recaudos Pendientes</CardTitle>
                    <CardDescription>
                      {recaudos.length} recaudos encontrados
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <RecaudoTable 
                  onViewDetail={verDetalleRecaudo}
                  onChangeStatus={abrirCambioEstado}
                  onPayment={confirmarPago}
                />
              </CardContent>
            </Card>

            {/* Diálogos de las acciones */}
            <RecaudoDetailDialog 
              open={mostrarDetalle} 
              onOpenChange={setMostrarDetalle} 
              recaudo={recaudoSeleccionado} 
            />

            <RecaudoPaymentDialog 
              open={mostrarPagoConfirmacion} 
              onOpenChange={setMostrarPagoConfirmacion} 
              recaudo={recaudoSeleccionado} 
              onConfirm={(id) => marcarComoPagado(id)}
            />

            <RecaudoStatusDialog 
              open={mostrarCambioEstado} 
              onOpenChange={setMostrarCambioEstado} 
              recaudo={recaudoSeleccionado} 
              nuevoEstado={nuevoEstado}
              onEstadoChange={setNuevoEstado}
              onConfirm={handleCambiarEstado}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SeguimientoRecaudos;
