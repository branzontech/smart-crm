
import { useState } from "react";
import { Recaudo } from "@/pages/recaudos/seguimiento";
import { toast } from "sonner";
import { 
  getRecaudoDetails, 
  updateRecaudoStatus, 
  updateRecaudoNotes 
} from "@/services/recaudos/detailsService";

export const useRecaudoDetails = (onRecaudoUpdate: () => void) => {
  const [recaudoSeleccionado, setRecaudoSeleccionado] = useState<Recaudo | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  // Función para obtener los detalles completos de un recaudo
  const obtenerDetalleRecaudo = async (id: string) => {
    setCargandoDetalle(true);
    try {
      const { data, error } = await getRecaudoDetails(id);
      if (error) throw error;
      
      if (data) {
        // Calcular días vencido
        const hoy = new Date();
        const fechaVencimiento = new Date(data.fecha_vencimiento);
        const diasVencido = fechaVencimiento < hoy ? 
          Math.floor((hoy.getTime() - fechaVencimiento.getTime()) / (1000 * 60 * 60 * 24)) : 0;
        
        // Formatear el nombre del cliente
        const nombreCompleto = data.cliente.tipo_persona === 'juridica' ? 
          data.cliente.empresa : 
          `${data.cliente.nombre} ${data.cliente.apellidos || ''}`;
        
        // Mapeamos los datos desde la API a nuestro formato de recaudo
        const recaudoConDetalle: Recaudo = {
          id: data.id,
          numero: data.numero,
          cliente: nombreCompleto,
          cliente_id: data.cliente_id,
          factura: data.factura || data.numero,
          monto: data.monto,
          fechaVencimiento: data.fecha_vencimiento,
          estado: data.estado.charAt(0).toUpperCase() + data.estado.slice(1), // Capitalizar el estado
          diasVencido: diasVencido,
          subtotal: data.subtotal,
          iva: data.iva,
          total: data.total,
          fecha_pago: data.fecha_pago,
          metodo_pago: data.metodo_pago,
          notas: data.notas,
          detalles: {
            direccion: data.cliente?.direccion || '',
            telefono: data.cliente?.telefono || '',
            fechaEmision: data.created_at,
            fechaPago: data.fecha_pago,
            metodoPago: data.metodo_pago,
            notas: data.notas || '',
            subtotal: data.subtotal,
            totalIva: data.iva,
            articulos: data.articulos?.map((art: any) => ({
              nombre: art.descripcion,
              cantidad: art.cantidad,
              precio: art.valor_unitario,
              iva: art.valor_iva,
              proveedor: art.proveedor?.nombre || 'No especificado'
            })) || [],
            archivosAdjuntos: data.archivos?.map((archivo: any) => ({
              id: archivo.id,
              nombre: archivo.nombre,
              tipo: archivo.tipo,
              url: archivo.url,
              tamaño: archivo.tamano,
              fechaSubida: archivo.created_at
            })) || []
          }
        };
        
        setRecaudoSeleccionado(recaudoConDetalle);
      }
    } catch (error) {
      console.error("Error al obtener detalles del recaudo:", error);
      toast.error("Error al cargar los detalles del recaudo");
    } finally {
      setCargandoDetalle(false);
    }
  };

  // Función para marcar como pagado
  const marcarComoPagado = async (id: string) => {
    const result = await updateRecaudoStatus(id, "Pagado");
    
    if (result.success) {
      // Actualizar recaudo seleccionado si corresponde
      if (recaudoSeleccionado && recaudoSeleccionado.id === id) {
        setRecaudoSeleccionado({ ...recaudoSeleccionado, estado: "Pagado", diasVencido: 0 });
      }
      
      // Recargar los recaudos después de la actualización
      onRecaudoUpdate();
    }
  };

  // Función para cambiar estado
  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    if (nuevoEstado) {
      const estadoFormateado = nuevoEstado.charAt(0).toUpperCase() + nuevoEstado.slice(1).toLowerCase();
      const result = await updateRecaudoStatus(id, estadoFormateado);
      
      if (result.success) {
        // Actualizar recaudo seleccionado si corresponde
        if (recaudoSeleccionado && recaudoSeleccionado.id === id) {
          setRecaudoSeleccionado({ 
            ...recaudoSeleccionado, 
            estado: estadoFormateado, 
            diasVencido: estadoFormateado === "Pagado" ? 0 : recaudoSeleccionado.diasVencido 
          });
        }
        
        // Recargar los recaudos después de la actualización
        onRecaudoUpdate();
      }
    }
  };

  // Función para actualizar notas
  const actualizarNotas = async (id: string, nuevasNotas: string) => {
    const result = await updateRecaudoNotes(id, nuevasNotas);
    
    if (result.success) {
      // Actualizar recaudo seleccionado si corresponde
      if (recaudoSeleccionado && recaudoSeleccionado.id === id) {
        setRecaudoSeleccionado({
          ...recaudoSeleccionado,
          notas: nuevasNotas,
          detalles: {
            ...recaudoSeleccionado.detalles!,
            notas: nuevasNotas
          }
        });
      }
      
      // Actualizar para reflejar cambios
      onRecaudoUpdate();
    }
  };

  return {
    recaudoSeleccionado,
    setRecaudoSeleccionado,
    cargandoDetalle,
    obtenerDetalleRecaudo,
    marcarComoPagado,
    cambiarEstado,
    actualizarNotas
  };
};
