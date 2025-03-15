
import { useState } from "react";
import { Recaudo } from "@/pages/recaudos/seguimiento";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Edit,
  CreditCard
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RecaudoTableProps {
  onViewDetail: (recaudo: Recaudo) => void;
  onChangeStatus: (recaudo: Recaudo) => void;
  onPayment: (recaudo: Recaudo) => void;
}

export const RecaudoTable = ({ 
  onViewDetail,
  onChangeStatus, 
  onPayment 
}: RecaudoTableProps) => {
  // Use hook to access recaudos data
  const navigate = useNavigate();
  
  // Importing data from parent component via props
  const { recaudos } = useRecaudosContext();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  // Handle click on row to view details
  const handleViewDetails = (recaudo: Recaudo, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Stop event propagation
    onViewDetail(recaudo);
  };
  
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Nº Factura</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead className="text-center">Vencimiento</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-center w-[140px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recaudos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No hay recaudos para mostrar
                </TableCell>
              </TableRow>
            ) : (
              recaudos.map((recaudo) => (
                <TableRow 
                  key={recaudo.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={(e) => handleViewDetails(recaudo, e)}
                >
                  <TableCell className="font-medium">{recaudo.factura}</TableCell>
                  <TableCell>{recaudo.cliente}</TableCell>
                  <TableCell className="text-right">{formatCurrency(recaudo.monto)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col">
                      <span>{formatDate(recaudo.fechaVencimiento)}</span>
                      {recaudo.diasVencido > 0 && recaudo.estado !== "Pagado" && (
                        <span className="text-xs text-red-500">
                          {recaudo.diasVencido} días vencido
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={`
                        ${recaudo.estado === "Pendiente" ? "bg-yellow-100 text-yellow-800" : ""}
                        ${recaudo.estado === "En proceso" ? "bg-blue-100 text-blue-800" : ""}
                        ${recaudo.estado === "Vencido" ? "bg-red-100 text-red-800" : ""}
                        ${recaudo.estado === "Pagado" ? "bg-green-100 text-green-800" : ""}
                      `}
                    >
                      {recaudo.estado === "Pendiente" && <Clock className="mr-1 h-3 w-3" />}
                      {recaudo.estado === "En proceso" && <Clock className="mr-1 h-3 w-3" />}
                      {recaudo.estado === "Vencido" && <AlertCircle className="mr-1 h-3 w-3" />}
                      {recaudo.estado === "Pagado" && <CheckCircle className="mr-1 h-3 w-3" />}
                      {recaudo.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center space-x-1">
                      <Button variant="ghost" size="icon" onClick={(e) => handleViewDetails(recaudo, e)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={(e) => {
                        e.stopPropagation();
                        onChangeStatus(recaudo);
                      }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {recaudo.estado !== "Pagado" && (
                        <Button variant="ghost" size="icon" onClick={(e) => {
                          e.stopPropagation();
                          onPayment(recaudo);
                        }}>
                          <CreditCard className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Context hook to access recaudos data
const useRecaudosContext = () => {
  // This would normally come from a context, but for simplicity we're importing from a parent component
  // This is mocked to prevent errors
  const { recaudos } = useRecaudosFromProps();
  return { recaudos };
};

// Mock hook to get recaudos data
const useRecaudosFromProps = () => {
  // This would be replaced with your actual hook or context
  const [recaudos, setRecaudos] = useState<Recaudo[]>([]);
  return { recaudos };
};
