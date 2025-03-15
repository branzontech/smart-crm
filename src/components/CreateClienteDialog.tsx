
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
    <Drawer open={open} onOpenChange={setOpen} direction="left">
      <DrawerTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="text-teal hover:bg-[#FEF7CD] hover:text-teal"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh] pt-6 w-1/2 left-0 right-auto">
        <DrawerHeader className="max-w-4xl mx-auto w-full">
          <DrawerTitle className="text-xl">Crear Nuevo Cliente</DrawerTitle>
        </DrawerHeader>
        <div className="max-w-4xl mx-auto w-full px-6 pb-6 overflow-y-auto">
          <EmbeddedClienteForm onClienteCreated={handleClienteCreated} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
