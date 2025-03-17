
import React, { useState } from 'react';
import { Cotizacion } from '@/types/cotizacion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Printer, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { updateCotizacionStatus } from '@/services/cotizacionService';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface CotizacionViewerProps {
  cotizacion: Cotizacion;
  onStatusChange?: () => void;
}

export const CotizacionViewer: React.FC<CotizacionViewerProps> = ({ 
  cotizacion,
  onStatusChange 
}) => {
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailDestination, setEmailDestination] = useState(cotizacion.cliente.email || '');

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'borrador':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Borrador</Badge>;
      case 'enviada':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Enviada</Badge>;
      case 'aprobada':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Aprobada</Badge>;
      case 'rechazada':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rechazada</Badge>;
      case 'vencida':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Vencida</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    // Mock email functionality - would connect to a real service in production
    toast.success(`Cotización enviada por correo a ${emailDestination}`, {
      position: "top-center"
    });
    setShowEmailDialog(false);
  };

  const handleChangeStatus = async (newStatus: 'enviada' | 'aprobada' | 'rechazada' | 'vencida') => {
    setIsChangingStatus(true);
    
    try {
      if (cotizacion.id) {
        const success = await updateCotizacionStatus(cotizacion.id, newStatus);
        
        if (success) {
          toast.success(`Estado de cotización actualizado a ${newStatus}`, {
            position: "top-center"
          });
          
          // Update local state
          cotizacion.estado = newStatus;
          
          // Trigger parent refresh if callback exists
          if (onStatusChange) {
            onStatusChange();
          }
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error al actualizar el estado de la cotización", {
        position: "top-center"
      });
    } finally {
      setIsChangingStatus(false);
    }
  };

  return (
    <div className="cotizacion-viewer">
      {/* Print-only header */}
      <div className="print:block hidden mb-6 text-center">
        <h1 className="text-xl font-bold">Cotización #{cotizacion.numero}</h1>
      </div>
      
      {/* Main content */}
      <div id="cotizacion-preview" className="cotizacion-content bg-white rounded-lg shadow-md overflow-hidden print:shadow-none">
        {/* Header with controls - hide when printing */}
        <div className="print:hidden bg-[#2d1e2f] text-white px-6 py-4 flex flex-wrap justify-between items-center gap-3">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              Cotización #{cotizacion.numero}
              <span className="ml-2">{getStatusBadge(cotizacion.estado)}</span>
            </h2>
            <p className="text-sm text-gray-200">
              Creada el {formatDate(cotizacion.fechaEmision)}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              className="text-white border-white hover:bg-white/20" 
              onClick={handlePrint}
            >
              <Printer className="mr-2 h-4 w-4" /> Imprimir
            </Button>
            
            <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="text-white border-white hover:bg-white/20"
                >
                  <Mail className="mr-2 h-4 w-4" /> Enviar por Email
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enviar Cotización por Email</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <label className="block text-sm font-medium mb-2">
                    Correo electrónico del destinatario
                  </label>
                  <input
                    type="email"
                    value={emailDestination}
                    onChange={(e) => setEmailDestination(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSendEmail}>
                    <Send className="mr-2 h-4 w-4" /> Enviar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <div className="relative group">
              <Button
                variant="default" 
                className="bg-[#f15025] hover:bg-[#f15025]/90 text-white"
              >
                Cambiar Estado
              </Button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
                <div className="py-1">
                  <button
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => handleChangeStatus('enviada')}
                    disabled={isChangingStatus || cotizacion.estado === 'enviada'}
                  >
                    <Send className="mr-2 h-4 w-4" /> Enviada
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => handleChangeStatus('aprobada')}
                    disabled={isChangingStatus || cotizacion.estado === 'aprobada'}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Aprobada
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => handleChangeStatus('rechazada')}
                    disabled={isChangingStatus || cotizacion.estado === 'rechazada'}
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Rechazada
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => handleChangeStatus('vencida')}
                    disabled={isChangingStatus || cotizacion.estado === 'vencida'}
                  >
                    <Clock className="mr-2 h-4 w-4" /> Vencida
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main quotation content */}
        <div className="p-8">
          <div className="flex flex-col gap-8">
            {/* Company header section */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                {cotizacion.empresaEmisor.logo && (
                  <div className="w-24 h-24 flex-shrink-0">
                    <img 
                      src={cotizacion.empresaEmisor.logo} 
                      alt={`Logo de ${cotizacion.empresaEmisor.nombre}`} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-[#2d1e2f]">{cotizacion.empresaEmisor.nombre}</h1>
                  <p className="text-gray-600">NIT: {cotizacion.empresaEmisor.nit}</p>
                  <p className="text-gray-600">{cotizacion.empresaEmisor.direccion}</p>
                  <p className="text-gray-600">Teléfono: {cotizacion.empresaEmisor.telefono}</p>
                  {cotizacion.empresaEmisor.email && (
                    <p className="text-gray-600">Email: {cotizacion.empresaEmisor.email}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-semibold text-[#f15025]">COTIZACIÓN</h2>
                <p className="text-gray-600">No. {cotizacion.numero}</p>
                <p className="text-gray-600">Fecha: {formatDate(cotizacion.fechaEmision)}</p>
                <p className="text-gray-600">Válida hasta: {formatDate(cotizacion.fechaVencimiento)}</p>
              </div>
            </div>
            
            {/* Client section */}
            <div className="border-t border-gray-200 pt-4">
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
                {cotizacion.cliente.email && (
                  <div>
                    <p className="font-medium">Email:</p>
                    <p>{cotizacion.cliente.email}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Products section */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-lg mb-2 text-[#2d1e2f]">Productos y Servicios</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-sm text-[#2d1e2f]">Descripción</th>
                      <th className="text-center py-3 px-4 font-semibold text-sm text-[#2d1e2f]">Cantidad</th>
                      <th className="text-right py-3 px-4 font-semibold text-sm text-[#2d1e2f]">Precio Unit.</th>
                      <th className="text-right py-3 px-4 font-semibold text-sm text-[#2d1e2f]">IVA</th>
                      <th className="text-right py-3 px-4 font-semibold text-sm text-[#2d1e2f]">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cotizacion.productos.map((producto, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="py-3 px-4">{producto.descripcion}</td>
                        <td className="py-3 px-4 text-center">{producto.cantidad}</td>
                        <td className="py-3 px-4 text-right">{formatCurrency(producto.precioUnitario)}</td>
                        <td className="py-3 px-4 text-right">{producto.iva}%</td>
                        <td className="py-3 px-4 text-right">{formatCurrency(producto.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3}></td>
                      <td className="py-3 px-4 text-right font-medium">Subtotal:</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(cotizacion.subtotal)}</td>
                    </tr>
                    <tr>
                      <td colSpan={3}></td>
                      <td className="py-3 px-4 text-right font-medium">IVA:</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(cotizacion.totalIva)}</td>
                    </tr>
                    <tr className="font-bold text-lg">
                      <td colSpan={3}></td>
                      <td className="py-3 px-4 text-right text-[#f15025]">Total:</td>
                      <td className="py-3 px-4 text-right text-[#f15025]">{formatCurrency(cotizacion.total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            {/* Terms and conditions */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-lg mb-2 text-[#2d1e2f]">Términos y Condiciones</h3>
              <p className="text-sm text-gray-600">
                1. Esta cotización es válida por 30 días a partir de la fecha de emisión.<br />
                2. Los precios pueden estar sujetos a cambios sin previo aviso.<br />
                3. Los tiempos de entrega son estimados y pueden variar.<br />
                4. Los precios incluyen IVA según corresponda.
              </p>
            </div>
            
            {/* Signature */}
            <div className="border-t border-gray-200 pt-4 mt-auto">
              <div className="flex flex-col items-center mt-8">
                <div className="border-t border-gray-400 w-48 mb-1 pt-2"></div>
                <p className="font-medium">{cotizacion.empresaEmisor.nombre}</p>
                {cotizacion.firmaNombre && <p>{cotizacion.firmaNombre}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
