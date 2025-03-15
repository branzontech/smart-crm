
import { useState, useEffect } from "react";
import { Recaudo } from "@/pages/recaudos/seguimiento";
import { toast } from "sonner";
import { getRecaudoDetails, updateRecaudoStatus, updateRecaudoNotes } from "@/services/recaudos/detailsService";
import { getRecaudos as fetchRecaudos } from "@/services/recaudos/recaudosService";

export const useRecaudos = () => {
  const [recaudos, setRecaudos] = useState<Recaudo[]>([]);
  const [recaudoSeleccionado, setRecaudoSeleccionado] = useState<Recaudo | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [estado, setEstado] = useState("todos");
  const [fechaDesde, setFechaDesde] = useState<Date | undefined>(undefined);
  const [fechaHasta, setFechaHasta] = useState<Date | undefined>(undefined);
  const [montoMinimo, setMontoMinimo] = useState("");
  const [montoMaximo, setMontoMaximo] = useState("");
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
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
          const nombreCompleto = recaudo.cliente.tipo_persona === 'juridica' ? 
            recaudo.cliente.empresa : 
            `${recaudo.cliente.nombre} ${recaudo.cliente.apellidos || ''}`;
          
          return {
            id: recaudo.id,
            cliente: nombreCompleto,
            cliente_id: recaudo.cliente_id,
            factura: recaudo.factura,
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

  // Función para filtrar recaudos
  const filtrarRecaudos = () => {
    let recaudosFiltrados = [...recaudos];
    
    // Filtrar por texto (cliente, factura, id)
    if (filtro) {
      const lowercaseFiltro = filtro.toLowerCase();
      recaudosFiltrados = recaudosFiltrados.filter(
        recaudo => 
          recaudo.cliente.toLowerCase().includes(lowercaseFiltro) ||
          (recaudo.factura && recaudo.factura.toLowerCase().includes(lowercaseFiltro)) ||
          (recaudo.numero && recaudo.numero.toLowerCase().includes(lowercaseFiltro)) ||
          recaudo.id.toLowerCase().includes(lowercaseFiltro)
      );
    }
    
    // Filtrar por estado
    if (estado !== "todos") {
      recaudosFiltrados = recaudosFiltrados.filter(
        recaudo => recaudo.estado.toLowerCase() === estado.toLowerCase()
      );
    }
    
    // Filtrar por rango de fechas
    if (fechaDesde) {
      recaudosFiltrados = recaudosFiltrados.filter(
        recaudo => new Date(recaudo.fechaVencimiento) >= fechaDesde
      );
    }
    
    if (fechaHasta) {
      recaudosFiltrados = recaudosFiltrados.filter(
        recaudo => new Date(recaudo.fechaVencimiento) <= fechaHasta
      );
    }
    
    // Filtrar por rango de montos
    if (montoMinimo !== "") {
      const min = parseFloat(montoMinimo);
      if (!isNaN(min)) {
        recaudosFiltrados = recaudosFiltrados.filter(
          recaudo => recaudo.monto >= min
        );
      }
    }
    
    if (montoMaximo !== "") {
      const max = parseFloat(montoMaximo);
      if (!isNaN(max)) {
        recaudosFiltrados = recaudosFiltrados.filter(
          recaudo => recaudo.monto <= max
        );
      }
    }
    
    return recaudosFiltrados;
  };

  // Función para marcar como pagado
  const marcarComoPagado = async (id: string) => {
    const result = await updateRecaudoStatus(id, "Pagado");
    
    if (result.success) {
      // Actualizamos el estado local
      const recaudosActualizados = recaudos.map(recaudo => 
        recaudo.id === id ? { ...recaudo, estado: "Pagado", diasVencido: 0 } : recaudo
      );
      setRecaudos(recaudosActualizados);
      
      // Actualizar recaudo seleccionado si corresponde
      if (recaudoSeleccionado && recaudoSeleccionado.id === id) {
        setRecaudoSeleccionado({ ...recaudoSeleccionado, estado: "Pagado", diasVencido: 0 });
      }
      
      // Recargar los recaudos después de la actualización
      cargarRecaudos();
    }
  };

  // Función para cambiar estado
  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    if (nuevoEstado) {
      const estadoFormateado = nuevoEstado.charAt(0).toUpperCase() + nuevoEstado.slice(1).toLowerCase();
      const result = await updateRecaudoStatus(id, estadoFormateado);
      
      if (result.success) {
        // Actualizamos el estado local
        const recaudosActualizados = recaudos.map(recaudo => 
          recaudo.id === id 
            ? { ...recaudo, estado: estadoFormateado, diasVencido: estadoFormateado === "Pagado" ? 0 : recaudo.diasVencido } 
            : recaudo
        );
        setRecaudos(recaudosActualizados);
        
        // Actualizar recaudo seleccionado si corresponde
        if (recaudoSeleccionado && recaudoSeleccionado.id === id) {
          setRecaudoSeleccionado({ 
            ...recaudoSeleccionado, 
            estado: estadoFormateado, 
            diasVencido: estadoFormateado === "Pagado" ? 0 : recaudoSeleccionado.diasVencido 
          });
        }
        
        // Recargar los recaudos después de la actualización
        cargarRecaudos();
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
      
      // Actualizar el estado local de recaudos
      const recaudosActualizados = recaudos.map(recaudo => 
        recaudo.id === id ? { ...recaudo, notas: nuevasNotas } : recaudo
      );
      setRecaudos(recaudosActualizados);
    }
  };

  // Aplicar filtros cuando cambian
  const aplicarFiltros = () => {
    const recaudosFiltrados = filtrarRecaudos();
    // No actualizamos el estado recaudos aquí para mantener los datos originales
    setMostrarFiltrosAvanzados(false);
    return recaudosFiltrados;
  };

  const handleLimpiarFiltros = () => {
    setFiltro("");
    setEstado("todos");
    setFechaDesde(undefined);
    setFechaHasta(undefined);
    setMontoMinimo("");
    setMontoMaximo("");
    cargarRecaudos();
  };

  // Cargar detalles cuando se selecciona un recaudo
  useEffect(() => {
    if (recaudoSeleccionado) {
      obtenerDetalleRecaudo(recaudoSeleccionado.id);
    }
  }, [recaudoSeleccionado?.id]);

  // Cargar recaudos al iniciar
  useEffect(() => {
    cargarRecaudos();
  }, []);

  // Filtrar recaudos cuando cambian los filtros básicos
  useEffect(() => {
    // No actualizamos setRecaudos para mantener los datos originales
  }, [filtro, estado]);

  return {
    recaudos: filtrarRecaudos(), // Aplicamos filtros pero mantenemos los datos originales
    recaudosOriginales: recaudos,
    recaudoSeleccionado,
    setRecaudoSeleccionado,
    cargandoDetalle,
    cargandoRecaudos,
    filtro,
    setFiltro,
    estado,
    setEstado,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    montoMinimo,
    setMontoMinimo,
    montoMaximo,
    setMontoMaximo,
    mostrarFiltrosAvanzados,
    setMostrarFiltrosAvanzados,
    aplicarFiltros,
    handleLimpiarFiltros,
    marcarComoPagado,
    cambiarEstado,
    actualizarNotas,
    cargarRecaudos,
    obtenerDetalleRecaudo,
    filtrarRecaudos
  };
};
