
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { 
  Search, 
  Calendar as CalendarIcon, 
  DollarSign 
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRecaudos } from "@/hooks/useRecaudos";

export const RecaudoFilterBar = () => {
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
    aplicarFiltros, 
    handleLimpiarFiltros 
  } = useRecaudos();

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>Filtrar Recaudos</CardTitle>
        <CardDescription>
          Utilice los filtros para encontrar recaudos específicos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por cliente, factura o ID"
                className="pl-10"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={estado}
                onValueChange={setEstado}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en proceso">En proceso</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
              className="text-teal"
            >
              {mostrarFiltrosAvanzados ? "Ocultar filtros avanzados" : "Mostrar filtros avanzados"}
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={handleLimpiarFiltros}
              className="text-gray-500"
            >
              Limpiar filtros
            </Button>
          </div>
          
          {mostrarFiltrosAvanzados && (
            <div className="p-4 bg-gray-50 rounded-md space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-teal" />
                    Rango de fechas
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {fechaDesde ? format(fechaDesde, 'PP', { locale: es }) : "Fecha desde"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={fechaDesde}
                            onSelect={setFechaDesde}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {fechaHasta ? format(fechaHasta, 'PP', { locale: es }) : "Fecha hasta"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={fechaHasta}
                            onSelect={setFechaHasta}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-teal" />
                    Rango de montos
                  </h3>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="Monto mínimo"
                        value={montoMinimo}
                        onChange={(e) => setMontoMinimo(e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="Monto máximo"
                        value={montoMaximo}
                        onChange={(e) => setMontoMaximo(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  className="bg-teal hover:bg-teal/90"
                  onClick={aplicarFiltros}
                >
                  Aplicar filtros
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
