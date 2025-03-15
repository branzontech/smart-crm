
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
import { createProveedor } from "@/services/proveedoresService";
import { toast } from "sonner";
import { EmbeddedProveedorForm } from "./EmbeddedProveedorForm";

interface CreateProveedorDialogProps {
  onProveedorCreated: (proveedor: { id: number | string; nombre: string }) => void;
}

export function CreateProveedorDialog({ onProveedorCreated }: CreateProveedorDialogProps) {
  const [open, setOpen] = useState(false);

  const handleProveedorCreated = async (proveedorData: any) => {
    try {
      // Use the existing service to create a provider
      const nuevoProveedor = await createProveedor(proveedorData);
      
      onProveedorCreated({
        id: nuevoProveedor.id,
        nombre: nuevoProveedor.nombre
      });
      
      toast.success("Proveedor creado exitosamente");
      setOpen(false);
    } catch (error: any) {
      toast.error(`Error al crear proveedor: ${error.message}`);
      console.error("Error creating proveedor:", error);
    }
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
          Nuevo Proveedor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Proveedor</DialogTitle>
        </DialogHeader>
        <EmbeddedProveedorForm onProveedorCreated={handleProveedorCreated} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
