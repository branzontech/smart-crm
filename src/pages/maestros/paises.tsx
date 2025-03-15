
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
      // Explicitly omit the codigo field as it should be auto-incremented by the database
      const { codigo, ...paisData } = data as any;
      
      console.log("Saving país with data:", paisData); // For debugging
      
      await createPais(paisData);
      handleRefresh();
      toast.success("País creado exitosamente");
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error creating país:", error);
      toast.error(`Error al crear país: ${error.message}`);
      return Promise.reject(error);
    }
  };

  const handleUpdate = async (
    id: string,
    data: Partial<Omit<Pais, "id" | "created_at" | "updated_at">>
  ) => {
    try {
      // Explicitly omit the codigo field as it should not be updated
      const { codigo, ...paisData } = data as any;
      
      console.log("Updating país with data:", paisData); // For debugging
      
      await updatePais(id, paisData);
      handleRefresh();
      toast.success("País actualizado exitosamente");
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error updating país:", error);
      toast.error(`Error al actualizar país: ${error.message}`);
      return Promise.reject(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePais(id);
      handleRefresh();
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
          includeCodigo={false} // Keep this false so the code field isn't shown in the form
        />
      </div>
    </Layout>
  );
};

export default PaisesPage;
