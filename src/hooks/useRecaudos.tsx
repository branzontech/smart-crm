
import { useEffect } from "react";
import { useRecaudosList } from "./recaudos/useRecaudosList";
import { useRecaudoDetails } from "./recaudos/useRecaudoDetails";
import { useRecaudoFilters } from "./recaudos/useRecaudoFilters";
import { Recaudo } from "@/pages/recaudos/seguimiento";

export const useRecaudos = () => {
  const { 
    recaudos, 
    cargandoRecaudos, 
    cargarRecaudos 
  } = useRecaudosList();
  
  const { 
    recaudoSeleccionado,
    setRecaudoSeleccionado,
    cargandoDetalle,
    obtenerDetalleRecaudo,
    marcarComoPagado,
    cambiarEstado,
    actualizarNotas
  } = useRecaudoDetails(cargarRecaudos);
  
  const {
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
  } = useRecaudoFilters();

  // Cargar detalles cuando se selecciona un recaudo
  useEffect(() => {
    if (recaudoSeleccionado) {
      obtenerDetalleRecaudo(recaudoSeleccionado.id);
    }
  }, [recaudoSeleccionado?.id]);

  // Aplicar filtros
  const aplicarFiltros = () => {
    const recaudosFiltrados = filtrarRecaudos(recaudos);
    setMostrarFiltrosAvanzados(false);
    return recaudosFiltrados;
  };

  return {
    recaudos: filtrarRecaudos(recaudos), // Aplicamos filtros pero mantenemos los datos originales
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
