
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { EmbeddedClienteForm } from "./EmbeddedClienteForm";

interface CreateClienteDialogProps {
  onClienteCreated: (cliente: { id: number | string; nombre: string }) => void;
}

export function CreateClienteDialog({ onClienteCreated }: CreateClienteDialogProps) {
  const [open, setOpen] = useState(false);

  const handleClienteCreated = (cliente: any) => {
    onClienteCreated(cliente);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="text-teal hover:bg-[#FEF7CD] hover:text-teal"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Cliente</DialogTitle>
        </DialogHeader>
        <EmbeddedClienteForm onClienteCreated={handleClienteCreated} />
      </DialogContent>
    </Dialog>
  );
}
