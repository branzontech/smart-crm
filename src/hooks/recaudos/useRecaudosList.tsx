
import { useState, useEffect } from "react";
import { Recaudo } from "@/pages/recaudos/seguimiento";
import { toast } from "sonner";
import { getRecaudos as fetchRecaudos } from "@/services/recaudos/recaudosService";

export const useRecaudosList = () => {
  const [recaudos, setRecaudos] = useState<Recaudo[]>([]);
  const [cargandoRecaudos, setCargandoRecaudos] = useState(true);
  
  // Función para cargar los recaudos desde la base de datos
  const cargarRecaudos = async () => {
    setCargandoRecaudos(true);
    try {
      const { data, error } = await fetchRecaudos();
      if (error) throw error;
      
      if (data) {
        // Transformar los datos al formato que espera la aplicación
        const recaudosFormateados = data.map(recaudo => {
          // Calcular días vencido
          const hoy = new Date();
          const fechaVencimiento = new Date(recaudo.fecha_vencimiento);
          const diasVencido = fechaVencimiento < hoy ? 
            Math.floor((hoy.getTime() - fechaVencimiento.getTime()) / (1000 * 60 * 60 * 24)) : 0;
          
          // Formatear el nombre del cliente
          const nombreCliente = recaudo.cliente ? 
            (recaudo.cliente.nombre || "Cliente no especificado") : 
            "Cliente no especificado";
          
          return {
            id: recaudo.id,
            cliente: nombreCliente,
            cliente_id: recaudo.cliente_id,
            factura: recaudo.numero,
            numero: recaudo.numero,
            monto: recaudo.monto,
            fechaVencimiento: recaudo.fecha_vencimiento,
            estado: recaudo.estado.charAt(0).toUpperCase() + recaudo.estado.slice(1), // Capitalizar el estado
            diasVencido: diasVencido,
            subtotal: recaudo.subtotal,
            iva: recaudo.iva,
            total: recaudo.total,
            fecha_pago: recaudo.fecha_pago,
            metodo_pago: recaudo.metodo_pago,
            notas: recaudo.notas
          };
        });
        
        setRecaudos(recaudosFormateados);
      }
    } catch (error) {
      console.error("Error al cargar recaudos:", error);
      toast.error("Error al cargar los recaudos");
    } finally {
      setCargandoRecaudos(false);
    }
  };

  // Cargar recaudos al iniciar
  useEffect(() => {
    cargarRecaudos();
  }, []);

  return {
    recaudos,
    setRecaudos,
    cargandoRecaudos,
    cargarRecaudos
  };
};
