
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CreateProveedorDialogProps {
  onProveedorCreated: (proveedor: { id: number; nombre: string }) => void;
}

export function CreateProveedorDialog({ onProveedorCreated }: CreateProveedorDialogProps) {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [contacto, setContacto] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim() || !documento.trim()) {
      toast.error("Por favor complete los campos requeridos");
      return;
    }

    // Simular la creación de un proveedor
    // En un caso real, esto sería una llamada a la API
    const nuevoProveedor = {
      id: Math.floor(Math.random() * 1000), // Simulado
      nombre: nombre.trim(),
    };

    onProveedorCreated(nuevoProveedor);
    toast.success("Proveedor creado exitosamente");
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNombre("");
    setDocumento("");
    setContacto("");
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                placeholder="Nombre del proveedor"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="documento">Documento *</Label>
              <Input
                id="documento"
                placeholder="Número de documento"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contacto">Contacto</Label>
              <Input
                id="contacto"
                placeholder="Número de contacto"
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#FEF7CD] hover:bg-[#FEF7CD]/80 text-teal"
            >
              Guardar Proveedor
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
