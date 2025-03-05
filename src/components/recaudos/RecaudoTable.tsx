
import { useState } from "react";
import { useRecaudos } from "@/hooks/useRecaudos";
import { Recaudo, Column } from "@/pages/recaudos/seguimiento";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Columns,
  GripVertical,
  Calendar,
  Building,
  FileText,
  Check,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  DollarSign,
  ListChecks,
  CheckSquare,
  Square,
} from "lucide-react";

interface RecaudoTableProps {
  onViewDetail: (recaudo: Recaudo) => void;
  onChangeStatus: (recaudo: Recaudo) => void;
  onPayment: (recaudo: Recaudo) => void;
}

export const RecaudoTable = ({ onViewDetail, onChangeStatus, onPayment }: RecaudoTableProps) => {
  const { recaudos } = useRecaudos();
  
  // Definición de columnas
  const [columnas, setColumnas] = useState<Column[]>([
    { id: "id", header: "ID", accessorKey: "id", isVisible: true, order: 0 },
    { id: "cliente", header: "Cliente", accessorKey: "cliente", isVisible: true, order: 1 },
    { id: "factura", header: "Factura", accessorKey: "factura", isVisible: true, order: 2 },
    { id: "monto", header: "Monto", accessorKey: "monto", isVisible: true, order: 3 },
    { id: "fechaVencimiento", header: "Vencimiento", accessorKey: "fechaVencimiento", isVisible: true, order: 4 },
    { id: "estado", header: "Estado", accessorKey: "estado", isVisible: true, order: 5 },
    { id: "acciones", header: "Acciones", accessorKey: "acciones", isVisible: true, order: 6 },
  ]);

  // Estado para el drag & drop
  const [columnaDrag, setColumnaDrag] = useState<string | null>(null);
  const [columnasDropdownOpen, setColumnasDropdownOpen] = useState(false);
  
  // Función para seleccionar o deseleccionar todas las columnas
  const toggleAllColumnas = (checked: boolean) => {
    setColumnas(prevColumnas => 
      prevColumnas.map(col => ({
        ...col,
        isVisible: checked
      }))
    );
  };

  // Función para cambiar visibilidad de columnas
  const toggleColumnaVisibilidad = (id: string, checked: boolean) => {
    setColumnas(prevColumnas => 
      prevColumnas.map(col => 
        col.id === id ? { ...col, isVisible: checked } : col
      )
    );
  };

  // Funciones para drag & drop de columnas
  const handleDragStart = (id: string) => {
    setColumnaDrag(id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableCellElement>, id: string) => {
    e.preventDefault();
    if (columnaDrag && columnaDrag !== id) {
      const columnasList = [...columnas];
      const dragIndex = columnasList.findIndex(col => col.id === columnaDrag);
      const hoverIndex = columnasList.findIndex(col => col.id === id);
      
      if (dragIndex !== -1 && hoverIndex !== -1) {
        // Intercambiar órdenes
        const dragOrder = columnasList[dragIndex].order;
        columnasList[dragIndex].order = columnasList[hoverIndex].order;
        columnasList[hoverIndex].order = dragOrder;
        
        setColumnas(columnasList);
      }
    }
  };

  const handleDragEnd = () => {
    setColumnaDrag(null);
  };

  // Verificar si todas las columnas están seleccionadas
  const allColumnasSelected = columnas.every(col => col.isVisible);
  const someColumnasSelected = columnas.some(col => col.isVisible) && !allColumnasSelected;

  // Obtener columnas ordenadas y visibles
  const columnasOrdenadas = [...columnas]
    .sort((a, b) => a.order - b.order)
    .filter(col => col.isVisible);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <DropdownMenu open={columnasDropdownOpen} onOpenChange={setColumnasDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <ListChecks className="h-4 w-4 mr-2" />
              Columnas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Configurar columnas</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <div className="px-2 py-1.5">
              <div className="flex items-center space-x-2 pb-2">
                <Checkbox 
                  id="select-all-columns"
                  checked={allColumnasSelected}
                  onCheckedChange={(checked) => toggleAllColumnas(checked === true)}
                  className={someColumnasSelected ? "bg-muted text-muted-foreground" : ""}
                />
                <label 
                  htmlFor="select-all-columns" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Seleccionar todas
                </label>
              </div>
            </div>
            
            <DropdownMenuSeparator />
            
            {columnas.map((columna) => (
              <div key={columna.id} className="px-2 py-1.5 hover:bg-muted/50 rounded-sm">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`column-${columna.id}`}
                    checked={columna.isVisible}
                    onCheckedChange={(checked) => toggleColumnaVisibilidad(columna.id, checked === true)}
                  />
                  <label 
                    htmlFor={`column-${columna.id}`} 
                    className="flex flex-1 items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {columna.header}
                  </label>
                </div>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columnasOrdenadas.map((columna) => (
                <TableHead
                  key={columna.id}
                  className={`${
                    columnaDrag === columna.id ? "bg-gray-100" : ""
                  } cursor-grab`}
                  draggable
                  onDragStart={() => handleDragStart(columna.id)}
                  onDragOver={(e) => handleDragOver(e, columna.id)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex items-center">
                    <GripVertical className="h-4 w-4 mr-1 opacity-50" />
                    {columna.header}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {recaudos.length > 0 ? (
              recaudos.map((recaudo) => (
                <TableRow 
                  key={recaudo.id}
                  className={recaudo.estado === "Pagado" ? "bg-green-50" : ""}
                >
                  {columnasOrdenadas.map((columna) => {
                    if (columna.id === "id") {
                      return (
                        <TableCell key={columna.id} className="font-medium">
                          {recaudo.id}
                        </TableCell>
                      );
                    } else if (columna.id === "cliente") {
                      return (
                        <TableCell key={columna.id}>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            {recaudo.cliente}
                          </div>
                        </TableCell>
                      );
                    } else if (columna.id === "factura") {
                      return (
                        <TableCell key={columna.id}>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            {recaudo.factura}
                          </div>
                        </TableCell>
                      );
                    } else if (columna.id === "monto") {
                      return (
                        <TableCell key={columna.id} className="text-right">
                          <span className="font-semibold text-gray-700">
                            ${recaudo.monto.toLocaleString()}
                          </span>
                        </TableCell>
                      );
                    } else if (columna.id === "fechaVencimiento") {
                      return (
                        <TableCell key={columna.id}>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {new Date(recaudo.fechaVencimiento).toLocaleDateString()}
                          </div>
                        </TableCell>
                      );
                    } else if (columna.id === "estado") {
                      return (
                        <TableCell key={columna.id}>
                          <Badge
                            variant="outline"
                            className={`cursor-pointer hover:opacity-80 transition-opacity ${
                              recaudo.estado === "Pendiente" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : ""
                            } ${
                              recaudo.estado === "En proceso" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : ""
                            } ${
                              recaudo.estado === "Vencido" ? "bg-red-100 text-red-800 hover:bg-red-100" : ""
                            } ${
                              recaudo.estado === "Pagado" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""
                            }`}
                            onClick={() => onChangeStatus(recaudo)}
                          >
                            {recaudo.estado === "Pendiente" && (
                              <Clock className="mr-1 h-3 w-3" />
                            )}
                            {recaudo.estado === "En proceso" && (
                              <Clock className="mr-1 h-3 w-3" />
                            )}
                            {recaudo.estado === "Vencido" && (
                              <AlertCircle className="mr-1 h-3 w-3" />
                            )}
                            {recaudo.estado === "Pagado" && (
                              <Check className="mr-1 h-3 w-3" />
                            )}
                            {recaudo.estado}
                            {recaudo.diasVencido > 0 && recaudo.estado !== "Pagado" && ` (${recaudo.diasVencido} días)`}
                          </Badge>
                        </TableCell>
                      );
                    } else if (columna.id === "acciones") {
                      return (
                        <TableCell key={columna.id} className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                              onClick={() => onViewDetail(recaudo)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                            
                            {recaudo.estado !== "Pagado" && (
                              <>
                                <Button
                                  variant="outline"
                                  className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                                  size="sm"
                                  onClick={() => onChangeStatus(recaudo)}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Estado
                                </Button>
                                <Button
                                  variant="outline"
                                  className="bg-teal/10 text-teal hover:bg-teal/20 hover:text-teal-600"
                                  size="sm"
                                  onClick={() => onPayment(recaudo)}
                                >
                                  <DollarSign className="h-4 w-4 mr-1" />
                                  Pagar
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      );
                    }
                    return <TableCell key={columna.id}></TableCell>;
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columnasOrdenadas.length} className="text-center py-6 text-muted-foreground">
                  No hay recaudos que coincidan con los filtros.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

