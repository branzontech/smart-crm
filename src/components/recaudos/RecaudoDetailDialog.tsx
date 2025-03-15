
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Recaudo } from "@/pages/recaudos/seguimiento";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Printer, 
  Building, 
  Calendar, 
  CreditCard, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  Info,
  FileImage,
  File,
  FileVideo,
  Download,
  Paperclip,
  Edit,
  Save
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface RecaudoDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recaudo: Recaudo | null;
  onEditStatus: (recaudo: Recaudo) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export const RecaudoDetailDialog = ({ 
  open, 
  onOpenChange, 
  recaudo,
  onEditStatus,
  onUpdateNotes
}: RecaudoDetailDialogProps) => {
  const impresionRef = useRef<HTMLDivElement>(null);
  const [editingNotes, setEditingNotes] = useState(false);
  const [newNotes, setNewNotes] = useState("");

  // Para imprimir el detalle
  const handlePrint = useReactToPrint({
    content: () => impresionRef.current,
  });

  // Inicializar notas cuando el recaudo cambia
  React.useEffect(() => {
    if (recaudo && recaudo.detalles?.notas) {
      setNewNotes(recaudo.detalles.notas);
    }
  }, [recaudo]);

  if (!recaudo) return null;

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para obtener el nombre del estado
  const getEstadoLabel = (estado: string) => {
    const estados: Record<string, string> = {
      'pendiente': 'Pendiente',
      'enproceso': 'En proceso',
      'pagado': 'Pagado',
      'vencido': 'Vencido'
    };
    return estados[estado] || estado;
  };

  // Función para obtener el nombre del método de pago
  const getMetodoPagoLabel = (metodoPago: string) => {
    const metodos: Record<string, string> = {
      'transferencia': 'Transferencia Bancaria',
      'efectivo': 'Efectivo',
      'cheque': 'Cheque',
      'tarjeta': 'Tarjeta de Crédito/Débito',
      'app': 'Aplicación de Pago'
    };
    return metodos[metodoPago] || metodoPago;
  };

  // Función para obtener el icono del tipo de archivo
  const getFileIcon = (tipo: string) => {
    if (tipo.startsWith('image/')) return <FileImage className="h-4 w-4 text-blue-500" />;
    if (tipo.startsWith('video/')) return <FileVideo className="h-4 w-4 text-purple-500" />;
    if (tipo.startsWith('application/pdf')) return <FileText className="h-4 w-4 text-red-500" />;
    return <File className="h-4 w-4 text-gray-500" />;
  };

  // Función para formatear el tamaño de archivo
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Función para guardar las notas
  const handleSaveNotes = () => {
    if (recaudo) {
      onUpdateNotes(recaudo.id, newNotes);
      setEditingNotes(false);
      toast.success("Notas actualizadas correctamente");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalle del Recaudo #{recaudo.id}</DialogTitle>
          <DialogDescription>
            Información completa del recaudo y sus artículos asociados
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <div className="flex justify-between flex-wrap gap-2 mb-4">
            <Button 
              variant="outline" 
              className="bg-teal-50 text-teal-600 hover:bg-teal-100"
              onClick={() => onEditStatus(recaudo)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Cambiar Estado
            </Button>
            <Button 
              variant="outline" 
              className="bg-green-50 text-green-600 hover:bg-green-100"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
          </div>
          
          <div ref={impresionRef} className="p-6 bg-white">
            {/* Encabezado con información principal */}
            <div className="border-b pb-4 mb-6">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-teal-600" />
                    Recaudo {recaudo.id}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Building className="h-4 w-4 text-gray-500" />
                    <h3 className="font-semibold text-lg">{recaudo.cliente}</h3>
                  </div>
                  <p className="text-gray-600 mt-1">{recaudo.detalles?.direccion}</p>
                  <p className="text-gray-600">{recaudo.detalles?.telefono}</p>
                </div>
                <div>
                  <Badge
                    variant="outline"
                    className={`
                      ${recaudo.estado === "Pendiente" ? "bg-yellow-100 text-yellow-800" : ""}
                      ${recaudo.estado === "En proceso" ? "bg-blue-100 text-blue-800" : ""}
                      ${recaudo.estado === "Vencido" ? "bg-red-100 text-red-800" : ""}
                      ${recaudo.estado === "Pagado" ? "bg-green-100 text-green-800" : ""}
                    `}
                  >
                    {recaudo.estado === "Pendiente" && <Clock className="mr-1 h-3 w-3" />}
                    {recaudo.estado === "En proceso" && <Clock className="mr-1 h-3 w-3" />}
                    {recaudo.estado === "Vencido" && <AlertCircle className="mr-1 h-3 w-3" />}
                    {recaudo.estado === "Pagado" && <CheckCircle className="mr-1 h-3 w-3" />}
                    {recaudo.estado}
                    {recaudo.diasVencido > 0 && recaudo.estado !== "Pagado" && ` (${recaudo.diasVencido} días)`}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Información de facturación y fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4 text-teal-600" />
                  Información General
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Número de Factura:</span>
                    <span className="font-medium">{recaudo.factura}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Método de pago:</span>
                    <span className="font-medium">{getMetodoPagoLabel(recaudo.detalles?.metodoPago || '')}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Estado:</span>
                    <span className="font-medium">{getEstadoLabel(recaudo.estado)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-teal-600" />
                  Fechas Importantes
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Fecha de Emisión:</span>
                    <span className="font-medium">{recaudo.detalles?.fechaEmision ? formatDate(recaudo.detalles.fechaEmision) : 'No especificada'}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Fecha de Pago:</span>
                    <span className="font-medium">{recaudo.detalles?.fechaPago ? formatDate(recaudo.detalles.fechaPago) : 'No especificada'}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Fecha de Vencimiento:</span>
                    <span className={`font-medium ${recaudo.diasVencido > 0 && recaudo.estado !== "Pagado" ? "text-red-600" : ""}`}>
                      {formatDate(recaudo.fechaVencimiento)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detalles de los artículos */}
            <div className="mb-6 overflow-x-auto">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-teal-600" />
                Detalle de Artículos
              </h3>
              <div className="min-w-full overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-2 text-left">Proveedor</th>
                      <th className="border p-2 text-left">Artículo</th>
                      <th className="border p-2 text-right">Cantidad</th>
                      <th className="border p-2 text-right">Precio Unitario</th>
                      <th className="border p-2 text-right">IVA</th>
                      <th className="border p-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recaudo.detalles?.articulos.map((articulo, index) => (
                      <tr key={index} className="border-b">
                        <td className="border p-2">{articulo.proveedor || 'No especificado'}</td>
                        <td className="border p-2">{articulo.nombre}</td>
                        <td className="border p-2 text-right">{articulo.cantidad}</td>
                        <td className="border p-2 text-right">${articulo.precio.toLocaleString()}</td>
                        <td className="border p-2 text-right">${(articulo.iva || 0).toLocaleString()}</td>
                        <td className="border p-2 text-right">${(articulo.cantidad * articulo.precio).toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="border p-2 text-right font-medium">Subtotal:</td>
                      <td colSpan={2} className="border p-2 text-right">${recaudo.detalles?.subtotal?.toLocaleString() || recaudo.monto.toLocaleString()}</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="border p-2 text-right font-medium">IVA Total:</td>
                      <td colSpan={2} className="border p-2 text-right">${recaudo.detalles?.totalIva?.toLocaleString() || '0'}</td>
                    </tr>
                    <tr className="bg-gray-50 font-bold">
                      <td colSpan={4} className="border p-2 text-right">Total:</td>
                      <td colSpan={2} className="border p-2 text-right">${recaudo.monto.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Archivos adjuntos */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-teal-600" />
                Archivos Adjuntos
              </h3>
              
              {recaudo.detalles?.archivosAdjuntos && recaudo.detalles.archivosAdjuntos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recaudo.detalles.archivosAdjuntos.map((archivo, index) => (
                    <div 
                      key={index} 
                      className="flex items-center p-3 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="mr-3">
                        {getFileIcon(archivo.tipo)}
                      </div>
                      <div className="flex-grow overflow-hidden">
                        <p className="font-medium truncate">{archivo.nombre}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(archivo.tamaño)} • {formatDate(archivo.fechaSubida)}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-2" asChild>
                        <a href={archivo.url} target="_blank" rel="noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-md">
                  No hay archivos adjuntos
                </div>
              )}
            </div>

            {/* Notas y observaciones */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">Notas</h3>
                {!editingNotes ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setEditingNotes(true)}
                    className="text-teal-600"
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Editar
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSaveNotes}
                    className="text-teal-600"
                  >
                    <Save className="h-3.5 w-3.5 mr-1" />
                    Guardar
                  </Button>
                )}
              </div>
              
              {editingNotes ? (
                <Textarea 
                  value={newNotes} 
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="min-h-[100px]"
                  placeholder="Añadir notas aquí..."
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md">
                  {recaudo.detalles?.notas || 'No hay notas adicionales.'}
                </div>
              )}
            </div>

            {/* Información de pagos */}
            {recaudo.estado === "Pagado" && recaudo.detalles?.infoPago && (
              <div className="mb-6 p-4 bg-green-50 rounded-md border border-green-100">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  Información de Pago
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between pb-2 border-b border-green-100">
                    <span className="text-green-700">Fecha de confirmación:</span>
                    <span className="font-medium">{recaudo.detalles.infoPago.fechaConfirmacion ? formatDate(recaudo.detalles.infoPago.fechaConfirmacion) : 'No especificada'}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-green-100">
                    <span className="text-green-700">Referencia de pago:</span>
                    <span className="font-medium">{recaudo.detalles.infoPago.referencia || 'No especificada'}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-green-100">
                    <span className="text-green-700">Notas de pago:</span>
                    <span className="font-medium">{recaudo.detalles.infoPago.notas || 'No hay notas adicionales'}</span>
                  </div>
                </div>
              </div>
            )}

            <Separator className="my-6" />

            <div className="text-center text-sm text-gray-500 mt-6">
              <p>Este documento es un comprobante de recaudo y no tiene validez como factura fiscal.</p>
              <p className="mt-1">Generado el {new Date().toLocaleDateString()} a las {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
