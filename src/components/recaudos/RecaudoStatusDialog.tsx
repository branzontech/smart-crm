
import { Recaudo } from "@/pages/recaudos/seguimiento";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Clock, Check, AlertCircle, DollarSign } from "lucide-react";

interface RecaudoStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recaudo: Recaudo | null;
  nuevoEstado: string;
  onEstadoChange: (estado: string) => void;
  onConfirm: () => void;
}

export const RecaudoStatusDialog = ({ 
  open, 
  onOpenChange, 
  recaudo, 
  nuevoEstado,
  onEstadoChange,
  onConfirm
}: RecaudoStatusDialogProps) => {
  if (!recaudo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar Estado del Recaudo</DialogTitle>
          <DialogDescription>
            Seleccione el nuevo estado para este recaudo
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup value={nuevoEstado} onValueChange={onEstadoChange}>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="Pendiente" id="pendiente" />
              <Label htmlFor="pendiente" className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                Pendiente
              </Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="En proceso" id="proceso" />
              <Label htmlFor="proceso" className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-blue-500" />
                En proceso
              </Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="Vencido" id="vencido" />
              <Label htmlFor="vencido" className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                Vencido
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Pagado" id="pagado" />
              <Label htmlFor="pagado" className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                Pagado
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            className="bg-teal hover:bg-teal/90"
            onClick={onConfirm}
          >
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
