
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MaestroTable } from "@/components/maestros/MaestroTable";
import { Layout } from "@/components/layout/Layout";
import { fetchSectores, createSector, updateSector, deleteSector } from "@/services/maestrosService";
import { Sector } from "@/types/maestros";
import { toast } from "sonner";

const SectoresPage = () => {
  const [refresh, setRefresh] = useState(0);

  const {
    data: sectores = [],
    isLoading,
  } = useQuery({
    queryKey: ["sectores", refresh],
    queryFn: fetchSectores,
  });

  const handleRefresh = () => {
    setRefresh((prev) => prev + 1);
  };

  const handleAdd = async (data: Omit<Sector, "id" | "created_at" | "updated_at">) => {
    try {
      // Remove any id field if it exists (let Supabase generate it)
      const { id, ...sectorData } = data as any;
      
      // Asegurar que el nombre siempre esté presente
      const cleanedData: Omit<Sector, "id" | "created_at" | "updated_at"> = {
        nombre: sectorData.nombre,
        // Incluir descripción solo si tiene valor
        ...(sectorData.descripcion && sectorData.descripcion !== "" ? { descripcion: sectorData.descripcion } : {})
      };
      
      console.log("Saving sector with data:", cleanedData);
      
      await createSector(cleanedData);
      handleRefresh();
      toast.success("Sector creado exitosamente");
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error creating sector:", error);
      toast.error(`Error al guardar: ${error.message}`);
      return Promise.reject(error);
    }
  };

  const handleUpdate = async (
    id: string,
    data: Partial<Omit<Sector, "id" | "created_at" | "updated_at">>
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
      
      console.log("Updating sector with ID:", id, "and data:", cleanedData);
      
      await updateSector(id, cleanedData);
      handleRefresh();
      toast.success("Sector actualizado exitosamente");
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error updating sector:", error);
      toast.error(`Error al guardar: ${error.message}`);
      return Promise.reject(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSector(id);
      handleRefresh();
      toast.success("Sector eliminado exitosamente");
      return Promise.resolve();
    } catch (error: any) {
      toast.error(`Error al eliminar sector: ${error.message}`);
      return Promise.reject(error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <MaestroTable
          data={sectores}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          tipo="sector"
        />
      </div>
    </Layout>
  );
};

export default SectoresPage;
