
import { useState } from "react";
import { toast } from "sonner";
import { Edit, Trash2, Plus, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaestroForm } from "./MaestroForm";

interface MaestroTableProps {
  data: any[];
  isLoading: boolean;
  onRefresh: () => void;
  onAdd: (data: any) => Promise<void>;
  onUpdate: (id: string, data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  tipo: "sector" | "tipoServicio" | "pais" | "origenCliente" | "tipoProducto";
  includeCodigo?: boolean;
}

export function MaestroTable({
  data,
  isLoading,
  onRefresh,
  onAdd,
  onUpdate,
  onDelete,
  tipo,
  includeCodigo = false,
}: MaestroTableProps) {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredData = data.filter((item) =>
    item.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const getTitulo = () => {
    switch (tipo) {
      case "sector":
        return "Sectores";
      case "tipoServicio":
        return "Tipos de Servicio";
      case "tipoProducto":
        return "Tipos de Producto";
      case "pais":
        return "Países";
      case "origenCliente":
        return "Orígenes de Cliente";
      default:
        return "Datos Maestros";
    }
  };

  const handleEdit = (item: any) => {
    setCurrentItem(item);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setCurrentItem(null);
    setDialogOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (data.id) {
      await onUpdate(data.id, data);
    } else {
      await onAdd(data);
    }
    setDialogOpen(false);
    onRefresh();
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(itemToDelete);
      toast.success("Elemento eliminado correctamente");
      onRefresh();
    } catch (error: any) {
      toast.error(`Error al eliminar: ${error.message}`);
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{getTitulo()}</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <MaestroForm
              initialData={currentItem}
              onSubmit={handleSubmit}
              onCancel={() => setDialogOpen(false)}
              tipo={tipo}
              includeCodigo={includeCodigo}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-between items-center">
        <Input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No hay datos disponibles
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                {includeCodigo && <TableHead>Código</TableHead>}
                <TableHead>Descripción</TableHead>
                <TableHead className="w-24 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.nombre}</TableCell>
                  {includeCodigo && <TableCell>{item.codigo || "-"}</TableCell>}
                  <TableCell>{item.descripcion || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente este elemento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
