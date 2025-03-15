
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MaestroTable } from "@/components/maestros/MaestroTable";
import { Layout } from "@/components/layout/Layout";
import { fetchTiposServicios, createTipoServicio, updateTipoServicio, deleteTipoServicio } from "@/services/maestrosService";
import { TipoServicio } from "@/types/maestros";
import { toast } from "sonner";

const TiposServiciosPage = () => {
  const [refresh, setRefresh] = useState(0);

  const {
    data: tiposServicios = [],
    isLoading,
  } = useQuery({
    queryKey: ["tiposServicios", refresh],
    queryFn: fetchTiposServicios,
  });

  const handleRefresh = () => {
    setRefresh((prev) => prev + 1);
  };

  const handleAdd = async (data: Omit<TipoServicio, "id" | "created_at" | "updated_at">) => {
    try {
      // Remove any id field if it exists (let Supabase generate it)
      const { id, ...tipoServicioData } = data as any;
      
      // Filter out any empty string values that might be for UUID fields
      const cleanedData = Object.fromEntries(
        Object.entries(tipoServicioData).filter(([_, value]) => value !== "")
      );
      
      console.log("Saving tipo servicio with data:", cleanedData); // For debugging
      
      await createTipoServicio(cleanedData);
      handleRefresh();
      toast.success("Tipo de servicio creado exitosamente");
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error creating tipo servicio:", error);
      toast.error(`Error al guardar: ${error.message}`);
      return Promise.reject(error);
    }
  };

  const handleUpdate = async (
    id: string,
    data: Partial<Omit<TipoServicio, "id" | "created_at" | "updated_at">>
  ) => {
    try {
      // Filter out any empty string values that might be for UUID fields
      const cleanedData = Object.fromEntries(
        Object.entries(data as any).filter(([_, value]) => value !== "")
      );
      
      console.log("Updating tipo servicio with ID:", id, "and data:", cleanedData); // For debugging
      
      await updateTipoServicio(id, cleanedData);
      handleRefresh();
      toast.success("Tipo de servicio actualizado exitosamente");
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error updating tipo servicio:", error);
      toast.error(`Error al guardar: ${error.message}`);
      return Promise.reject(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTipoServicio(id);
      handleRefresh();
      toast.success("Tipo de servicio eliminado exitosamente");
      return Promise.resolve();
    } catch (error: any) {
      toast.error(`Error al eliminar tipo de servicio: ${error.message}`);
      return Promise.reject(error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <MaestroTable
          data={tiposServicios}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          tipo="tipoServicio"
        />
      </div>
    </Layout>
  );
};

export default TiposServiciosPage;
