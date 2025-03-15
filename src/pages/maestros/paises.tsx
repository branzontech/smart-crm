
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MaestroTable } from "@/components/maestros/MaestroTable";
import { Layout } from "@/components/layout/Layout";
import { fetchPaises, createPais, updatePais, deletePais } from "@/services/maestrosService";
import { Pais } from "@/types/maestros";
import { toast } from "sonner";

const PaisesPage = () => {
  const [refresh, setRefresh] = useState(0);

  const {
    data: paises = [],
    isLoading,
  } = useQuery({
    queryKey: ["paises", refresh],
    queryFn: fetchPaises,
  });

  const handleRefresh = () => {
    setRefresh((prev) => prev + 1);
  };

  const handleAdd = async (data: Omit<Pais, "id" | "created_at" | "updated_at">) => {
    try {
      // Remove descripcion field if it exists in the data
      // Ensure we're not passing an empty string for código which could cause UUID conversion issues
      const { descripcion, ...paisData } = data as any;
      const cleanData = {
        ...paisData,
        codigo: paisData.codigo || null // Ensure código is null if empty
      };
      
      await createPais(cleanData);
      handleRefresh(); // Refresh the data after adding
      toast.success("País creado exitosamente");
      return Promise.resolve();
    } catch (error: any) {
      toast.error(`Error al crear país: ${error.message}`);
      return Promise.reject(error);
    }
  };

  const handleUpdate = async (
    id: string,
    data: Partial<Omit<Pais, "id" | "created_at" | "updated_at">>
  ) => {
    try {
      // Remove descripcion field if it exists in the data
      // Ensure we're not passing an empty string for código which could cause UUID conversion issues
      const { descripcion, ...paisData } = data as any;
      const cleanData = {
        ...paisData,
        codigo: paisData.codigo || null // Ensure código is null if empty
      };
      
      await updatePais(id, cleanData);
      handleRefresh(); // Refresh the data after updating
      toast.success("País actualizado exitosamente");
      return Promise.resolve();
    } catch (error: any) {
      toast.error(`Error al actualizar país: ${error.message}`);
      return Promise.reject(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePais(id);
      handleRefresh(); // Refresh the data after deleting
      toast.success("País eliminado exitosamente");
      return Promise.resolve();
    } catch (error: any) {
      toast.error(`Error al eliminar país: ${error.message}`);
      return Promise.reject(error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <MaestroTable
          data={paises}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          tipo="pais"
          includeCodigo={true}
        />
      </div>
    </Layout>
  );
};

export default PaisesPage;
