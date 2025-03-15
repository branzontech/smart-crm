
import { useState, useEffect } from "react";
import { Recaudo } from "@/pages/recaudos/seguimiento";
import { toast } from "sonner";
import { getRecaudoDetails, updateRecaudoStatus, updateRecaudoNotes } from "@/services/recaudos/detailsService";

// Datos ficticios de recaudos pendientes o en proceso
const recaudosPendientes: Recaudo[] = [
  {
    id: "REC-2023-001",
    cliente: "Tech Solutions SA",
    factura: "FAC-2023-045",
    monto: 15000,
    fechaVencimiento: "2023-11-15",
    estado: "Pendiente",
    diasVencido: 0,
    detalles: {
      direccion: "Calle Principal #123, Ciudad Empresa",
      telefono: "+57 300 123 4567",
      articulos: [
        { nombre: "Servicio de Consultoría", cantidad: 1, precio: 15000 }
      ],
      metodoPago: "Transferencia",
      notas: "Pago a 30 días"
    }
  },
  {
    id: "REC-2023-002",
    cliente: "Green Energy Corp",
    factura: "FAC-2023-032",
    monto: 45000,
    fechaVencimiento: "2023-10-25",
    estado: "Vencido",
    diasVencido: 21,
    detalles: {
      direccion: "Av. Sostenible #456, Ciudad Verde",
      telefono: "+57 300 765 4321",
      articulos: [
        { nombre: "Paneles Solares", cantidad: 3, precio: 10000 },
        { nombre: "Instalación", cantidad: 1, precio: 15000 }
      ],
      metodoPago: "Efectivo",
      notas: "Cliente con historial de pagos tardíos"
    }
  },
  {
    id: "REC-2023-003",
    cliente: "Global Logistics",
    factura: "FAC-2023-018",
    monto: 28500,
    fechaVencimiento: "2023-11-05",
    estado: "En proceso",
    diasVencido: 0,
    detalles: {
      direccion: "Puerto Industrial #789, Ciudad Logística",
      telefono: "+57 300 987 6543",
      articulos: [
        { nombre: "Servicio de Transporte", cantidad: 1, precio: 28500 }
      ],
      metodoPago: "Transferencia",
      notas: "El cliente confirmó la transferencia, esperando verificación"
    }
  },
  {
    id: "REC-2023-004",
    cliente: "Digital Systems Inc",
    factura: "FAC-2023-067",
    monto: 12800,
    fechaVencimiento: "2023-11-30",
    estado: "Pendiente",
    diasVencido: 0,
    detalles: {
      direccion: "Calle Tecnológica #321, Ciudad Digital",
      telefono: "+57 300 234 5678",
      articulos: [
        { nombre: "Hosting Anual", cantidad: 1, precio: 8800 },
        { nombre: "Dominio Premium", cantidad: 1, precio: 4000 }
      ],
      metodoPago: "Tarjeta de Crédito",
      notas: "Renovación automática anual"
    }
  },
  {
    id: "REC-2023-005",
    cliente: "Smart Solutions",
    factura: "FAC-2023-039",
    monto: 35600,
    fechaVencimiento: "2023-10-15",
    estado: "Vencido",
    diasVencido: 31,
    detalles: {
      direccion: "Av. Innovación #654, Ciudad Inteligente",
      telefono: "+57 300 876 5432",
      articulos: [
        { nombre: "Software a medida", cantidad: 1, precio: 30000 },
        { nombre: "Soporte técnico", cantidad: 1, precio: 5600 }
      ],
      metodoPago: "Cheque",
      notas: "Contactar para gestionar el cobro"
    }
  },
  {
    id: "REC-2023-006",
    cliente: "Innovación Digital",
    factura: "FAC-2023-078",
    monto: 22500,
    fechaVencimiento: "2023-09-30",
    estado: "Pagado",
    diasVencido: 0,
    detalles: {
      direccion: "Av. Progreso #789, Ciudad Futuro",
      telefono: "+57 300 111 2222",
      articulos: [
        { nombre: "Desarrollo web", cantidad: 1, precio: 18000 },
        { nombre: "Diseño UX/UI", cantidad: 1, precio: 4500 }
      ],
      metodoPago: "Transferencia",
      notas: "Pagado en su totalidad el 29/09/2023"
    }
  }
];

export const useRecaudos = () => {
  const [recaudos, setRecaudos] = useState<Recaudo[]>(recaudosPendientes);
  const [recaudoSeleccionado, setRecaudoSeleccionado] = useState<Recaudo | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [estado, setEstado] = useState("todos");
  const [fechaDesde, setFechaDesde] = useState<Date | undefined>(undefined);
  const [fechaHasta, setFechaHasta] = useState<Date | undefined>(undefined);
  const [montoMinimo, setMontoMinimo] = useState("");
  const [montoMaximo, setMontoMaximo] = useState("");
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
  
  // Función para obtener los detalles completos de un recaudo
  const obtenerDetalleRecaudo = async (id: string) => {
    setCargandoDetalle(true);
    try {
      const { data, error } = await getRecaudoDetails(id);
      if (error) throw error;
      
      if (data) {
        // Mapeamos los datos desde la API a nuestro formato de recaudo
        const recaudoConDetalle = {
          ...recaudoSeleccionado,
          detalles: {
            ...(recaudoSeleccionado?.detalles || {}),
            direccion: data.cliente?.direccion || '',
            telefono: data.cliente?.telefono || '',
            fechaEmision: data.created_at,
            fechaPago: data.fecha_pago,
            metodoPago: data.metodo_pago,
            notas: data.notas || '',
            subtotal: data.subtotal,
            totalIva: data.iva,
            articulos: data.articulos.map((art: any) => ({
              nombre: art.descripcion,
              cantidad: art.cantidad,
              precio: art.valor_unitario,
              iva: art.valor_iva,
              proveedor: art.proveedor?.nombre || 'No especificado'
            })),
            archivosAdjuntos: data.archivos.map((archivo: any) => ({
              id: archivo.id,
              nombre: archivo.nombre,
              tipo: archivo.tipo,
              url: archivo.url,
              tamaño: archivo.tamano,
              fechaSubida: archivo.created_at
            }))
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
    let recaudosFiltrados = recaudosPendientes;
    
    // Filtrar por texto (cliente, factura, id)
    if (filtro) {
      const lowercaseFiltro = filtro.toLowerCase();
      recaudosFiltrados = recaudosFiltrados.filter(
        recaudo => 
          recaudo.cliente.toLowerCase().includes(lowercaseFiltro) ||
          recaudo.factura.toLowerCase().includes(lowercaseFiltro) ||
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
    
    setRecaudos(recaudosFiltrados);
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
    }
  };

  // Función para cambiar estado
  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    if (nuevoEstado) {
      const result = await updateRecaudoStatus(id, nuevoEstado);
      
      if (result.success) {
        // Actualizamos el estado local
        const recaudosActualizados = recaudos.map(recaudo => 
          recaudo.id === id 
            ? { ...recaudo, estado: nuevoEstado, diasVencido: nuevoEstado === "Pagado" ? 0 : recaudo.diasVencido } 
            : recaudo
        );
        setRecaudos(recaudosActualizados);
        
        // Actualizar recaudo seleccionado si corresponde
        if (recaudoSeleccionado && recaudoSeleccionado.id === id) {
          setRecaudoSeleccionado({ 
            ...recaudoSeleccionado, 
            estado: nuevoEstado, 
            diasVencido: nuevoEstado === "Pagado" ? 0 : recaudoSeleccionado.diasVencido 
          });
        }
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
          detalles: {
            ...recaudoSeleccionado.detalles,
            notas: nuevasNotas
          }
        });
      }
    }
  };

  // Aplicar filtros cuando cambian
  const aplicarFiltros = () => {
    filtrarRecaudos();
    setMostrarFiltrosAvanzados(false);
  };

  const handleLimpiarFiltros = () => {
    setFiltro("");
    setEstado("todos");
    setFechaDesde(undefined);
    setFechaHasta(undefined);
    setMontoMinimo("");
    setMontoMaximo("");
    setRecaudos(recaudosPendientes);
  };

  // Cargar detalles cuando se selecciona un recaudo
  useEffect(() => {
    if (recaudoSeleccionado) {
      obtenerDetalleRecaudo(recaudoSeleccionado.id);
    }
  }, [recaudoSeleccionado?.id]);

  useEffect(() => {
    filtrarRecaudos();
  }, [filtro, estado]);

  return {
    recaudos,
    recaudoSeleccionado,
    setRecaudoSeleccionado,
    cargandoDetalle,
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
    actualizarNotas
  };
};
