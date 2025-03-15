import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ArrowLeft, Coins } from "lucide-react";
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
  cliente_id?: string;
  factura: string;
  numero?: string;
  monto: number;
  fechaVencimiento: string;
  estado: string;
  diasVencido: number;
  subtotal?: number;
  iva?: number;
  total?: number;
  fecha_pago?: string;
  metodo_pago?: string;
  notas?: string;
  detalles?: {
    direccion: string;
    telefono: string;
    fechaEmision?: string;
    fechaPago?: string;
    metodoPago: string;
    articulos: Array<{
      nombre: string;
      cantidad: number;
      precio: number;
      proveedor?: string;
      iva?: number;
    }>;
    subtotal?: number;
    totalIva?: number;
    notas: string;
    infoPago?: {
      fechaConfirmacion: string;
      referencia: string;
      notas?: string;
    };
    archivosAdjuntos?: Array<{
      id: string;
      nombre: string;
      tipo: string;
      url: string;
      tamaño: number;
      fechaSubida: string;
    }>;
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
    cambiarEstado,
    actualizarNotas
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
        <Header />
        <main className="flex-1 content-container pt-[var(--header-height)]">
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
              onEditStatus={abrirCambioEstado}
              onUpdateNotes={actualizarNotas}
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
