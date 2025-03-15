
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
    <Drawer open={open} onOpenChange={setOpen} direction="left">
      <DrawerTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="text-teal hover:bg-[#FEF7CD] hover:text-teal"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Proveedor
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh] pt-6 w-1/2 left-0 right-auto">
        <DrawerHeader className="max-w-4xl mx-auto w-full">
          <DrawerTitle className="text-xl">Crear Nuevo Proveedor</DrawerTitle>
        </DrawerHeader>
        <div className="max-w-4xl mx-auto w-full px-6 pb-6 overflow-y-auto">
          <EmbeddedProveedorForm 
            onProveedorCreated={handleProveedorCreated} 
            onCancel={() => setOpen(false)} 
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
