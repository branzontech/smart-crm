
import { useState } from "react";
import { Recaudo } from "@/pages/recaudos/seguimiento";

export const useRecaudoFilters = () => {
  const [filtro, setFiltro] = useState("");
  const [estado, setEstado] = useState("todos");
  const [fechaDesde, setFechaDesde] = useState<Date | undefined>(undefined);
  const [fechaHasta, setFechaHasta] = useState<Date | undefined>(undefined);
  const [montoMinimo, setMontoMinimo] = useState("");
  const [montoMaximo, setMontoMaximo] = useState("");
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);

  // Función para filtrar recaudos
  const filtrarRecaudos = (recaudos: Recaudo[]) => {
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

  const handleLimpiarFiltros = () => {
    setFiltro("");
    setEstado("todos");
    setFechaDesde(undefined);
    setFechaHasta(undefined);
    setMontoMinimo("");
    setMontoMaximo("");
  };

  return {
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
    filtrarRecaudos,
    handleLimpiarFiltros
  };
};
