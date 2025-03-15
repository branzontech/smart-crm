
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
      // Omitir campos id y código para crear un nuevo país
      const { codigo, id, ...paisData } = data as any;
      
      // Asegurar que el nombre esté presente y crear un objeto limpio
      const cleanedData: Omit<Pais, "id" | "created_at" | "updated_at"> = {
        nombre: paisData.nombre,
        // Incluir descripción solo si tiene valor
        ...(paisData.descripcion && paisData.descripcion !== "" ? { descripcion: paisData.descripcion } : {})
      };
      
      console.log("Saving país with data:", cleanedData);
      
      await createPais(cleanedData);
      handleRefresh();
      toast.success("País creado exitosamente");
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error creating país:", error);
      toast.error(`Error al guardar: ${error.message}`);
      return Promise.reject(error);
    }
  };

  const handleUpdate = async (
    id: string,
    data: Partial<Omit<Pais, "id" | "created_at" | "updated_at">>
  ) => {
    try {
      // Omitir el código para la actualización
      const { codigo, ...paisData } = data as any;
      
      // Filtrar campos vacíos, manteniendo campos válidos
      const cleanedData = Object.fromEntries(
        Object.entries(paisData).filter(([_, value]) => value !== "")
      );
      
      // Verificar que haya al menos un campo para actualizar
      if (Object.keys(cleanedData).length === 0) {
        throw new Error("Debe proporcionar al menos un campo para actualizar");
      }
      
      console.log("Updating país with ID:", id, "and data:", cleanedData);
      
      await updatePais(id, cleanedData);
      handleRefresh();
      toast.success("País actualizado exitosamente");
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error updating país:", error);
      toast.error(`Error al guardar: ${error.message}`);
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
          includeCodigo={false}
        />
      </div>
    </Layout>
  );
};

export default PaisesPage;
