
import { useState, useEffect } from "react";
import { Recaudo } from "@/pages/recaudos/seguimiento";
import { toast } from "sonner";

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
  }
];

export const useRecaudos = () => {
  const [recaudos, setRecaudos] = useState<Recaudo[]>(recaudosPendientes);
  const [recaudoSeleccionado, setRecaudoSeleccionado] = useState<Recaudo | null>(null);
  const [filtro, setFiltro] = useState("");
  const [estado, setEstado] = useState("todos");
  const [fechaDesde, setFechaDesde] = useState<Date | undefined>(undefined);
  const [fechaHasta, setFechaHasta] = useState<Date | undefined>(undefined);
  const [montoMinimo, setMontoMinimo] = useState("");
  const [montoMaximo, setMontoMaximo] = useState("");
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
  
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
  const marcarComoPagado = (id: string) => {
    // Aquí se enviaría la actualización a la API
    toast.success(`Recaudo ${id} marcado como pagado`);
    
    // Actualizamos el estado local
    const recaudosActualizados = recaudos.filter(recaudo => recaudo.id !== id);
    setRecaudos(recaudosActualizados);
  };

  // Función para cambiar estado
  const cambiarEstado = (id: string, nuevoEstado: string) => {
    if (nuevoEstado) {
      // Aquí se enviaría la actualización a la API
      toast.success(`Estado de recaudo ${id} cambiado a ${nuevoEstado}`);
      
      // Actualizamos el estado local
      const recaudosActualizados = recaudos.map(recaudo => 
        recaudo.id === id 
          ? { ...recaudo, estado: nuevoEstado } 
          : recaudo
      );
      setRecaudos(recaudosActualizados);
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

  useEffect(() => {
    filtrarRecaudos();
  }, [filtro, estado]);

  return {
    recaudos,
    recaudoSeleccionado,
    setRecaudoSeleccionado,
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
    cambiarEstado
  };
};
