
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
  DropdownMenuCheckboxItem,
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
  DollarSign
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

  // Función para cambiar visibilidad de columnas
  const toggleColumnaVisibilidad = (id: string) => {
    setColumnas(prevColumnas => 
      prevColumnas.map(col => 
        col.id === id ? { ...col, isVisible: !col.isVisible } : col
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

  // Obtener columnas ordenadas y visibles
  const columnasOrdenadas = [...columnas]
    .sort((a, b) => a.order - b.order)
    .filter(col => col.isVisible);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Columns className="h-4 w-4 mr-2" />
              Columnas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mostrar columnas</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columnas.map((columna) => (
              <DropdownMenuCheckboxItem
                key={columna.id}
                checked={columna.isVisible}
                onCheckedChange={() => toggleColumnaVisibilidad(columna.id)}
              >
                {columna.header}
              </DropdownMenuCheckboxItem>
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
