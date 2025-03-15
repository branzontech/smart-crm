
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MaestroTable } from "@/components/maestros/MaestroTable";
import { Layout } from "@/components/layout/Layout";
import { fetchOrigenesCliente, createOrigenCliente, updateOrigenCliente, deleteOrigenCliente } from "@/services/maestrosService";
import { OrigenCliente } from "@/types/maestros";
import { toast } from "sonner";

const OrigenesClientePage = () => {
  const [refresh, setRefresh] = useState(0);

  const {
    data: origenesCliente = [],
    isLoading,
  } = useQuery({
    queryKey: ["origenesCliente", refresh],
    queryFn: fetchOrigenesCliente,
  });

  const handleRefresh = () => {
    setRefresh((prev) => prev + 1);
  };

  const handleAdd = async (data: Omit<OrigenCliente, "id" | "created_at" | "updated_at">) => {
    try {
      // Remove any id field if it exists (let Supabase generate it)
      const { id, ...origenClienteData } = data as any;
      
      // Asegurar que el nombre siempre esté presente
      const cleanedData: Omit<OrigenCliente, "id" | "created_at" | "updated_at"> = {
        nombre: origenClienteData.nombre,
        // Incluir descripción solo si tiene valor
        ...(origenClienteData.descripcion && origenClienteData.descripcion !== "" ? { descripcion: origenClienteData.descripcion } : {})
      };
      
      console.log("Saving origen cliente with data:", cleanedData);
      
      await createOrigenCliente(cleanedData);
      handleRefresh();
      toast.success("Origen de cliente creado exitosamente");
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error creating origen cliente:", error);
      toast.error(`Error al guardar: ${error.message}`);
      return Promise.reject(error);
    }
  };

  const handleUpdate = async (
    id: string,
    data: Partial<Omit<OrigenCliente, "id" | "created_at" | "updated_at">>
  ) => {
    try {
      // Filtrar campos vacíos pero mantener campos válidos
      const cleanedData = Object.fromEntries(
        Object.entries(data as any).filter(([_, value]) => value !== "")
      );
      
      // Verificar que haya al menos un campo para actualizar
      if (Object.keys(cleanedData).length === 0) {
        throw new Error("Debe proporcionar al menos un campo para actualizar");
      }
      
      console.log("Updating origen cliente with ID:", id, "and data:", cleanedData);
      
      await updateOrigenCliente(id, cleanedData);
      handleRefresh();
      toast.success("Origen de cliente actualizado exitosamente");
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error updating origen cliente:", error);
      toast.error(`Error al guardar: ${error.message}`);
      return Promise.reject(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOrigenCliente(id);
      handleRefresh();
      toast.success("Origen de cliente eliminado exitosamente");
      return Promise.resolve();
    } catch (error: any) {
      toast.error(`Error al eliminar origen de cliente: ${error.message}`);
      return Promise.reject(error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <MaestroTable
          data={origenesCliente}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          tipo="origenCliente"
        />
      </div>
    </Layout>
  );
};

export default OrigenesClientePage;
