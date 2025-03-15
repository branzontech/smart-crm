
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CiudadTable } from "@/components/maestros/CiudadTable";
import { Layout } from "@/components/layout/Layout";
import { fetchCiudades, createCiudad, updateCiudad, deleteCiudad } from "@/services/maestros";
import { Ciudad } from "@/types/maestros";
import { toast } from "sonner";

const CiudadesPage = () => {
  const [refresh, setRefresh] = useState(0);

  const {
    data: ciudades = [],
    isLoading,
  } = useQuery({
    queryKey: ["ciudades", refresh],
    queryFn: fetchCiudades,
  });

  const handleRefresh = () => {
    setRefresh((prev) => prev + 1);
  };

  const handleAdd = async (data: Omit<Ciudad, "id" | "created_at" | "updated_at" | "pais">) => {
    try {
      const { id, ...ciudadData } = data as any;
      
      if (!ciudadData.pais_id || ciudadData.pais_id === "") {
        throw new Error("El país es requerido");
      }
      
      // Filtrar solo los campos opcionales vacíos, manteniendo los requeridos
      const cleanedData: Omit<Ciudad, "id" | "created_at" | "updated_at" | "pais"> = {
        nombre: ciudadData.nombre,
        pais_id: ciudadData.pais_id,
        // Agregar otros campos opcionales solo si tienen valor
        ...Object.fromEntries(
          Object.entries(ciudadData)
            .filter(([key, value]) => 
              !['nombre', 'pais_id'].includes(key) && value !== "" && value !== undefined
            )
        )
      };
      
      console.log("Saving ciudad with data:", cleanedData);
      
      await createCiudad(cleanedData);
      handleRefresh();
      toast.success("Ciudad creada exitosamente");
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error creating ciudad:", error);
      toast.error(`Error al guardar: ${error.message}`);
      return Promise.reject(error);
    }
  };

  const handleUpdate = async (
    id: string,
    data: Partial<Omit<Ciudad, "id" | "created_at" | "updated_at" | "pais">>
  ) => {
    try {
      // Para actualizaciones, necesitamos asegurarnos de que al menos un campo requerido esté presente
      if (!data.nombre && !data.pais_id) {
        throw new Error("Debe proporcionar al menos un campo para actualizar");
      }
      
      // Filtrar solo los campos vacíos, manteniendo los requeridos y cualquier valor válido
      const cleanedData = Object.fromEntries(
        Object.entries(data)
          .filter(([_, value]) => value !== "")
      );
      
      console.log("Updating ciudad with ID:", id, "and data:", cleanedData);
      
      await updateCiudad(id, cleanedData);
      handleRefresh();
      toast.success("Ciudad actualizada exitosamente");
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error updating ciudad:", error);
      toast.error(`Error al guardar: ${error.message}`);
      return Promise.reject(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCiudad(id);
      handleRefresh();
      toast.success("Ciudad eliminada exitosamente");
      return Promise.resolve();
    } catch (error: any) {
      toast.error(`Error al eliminar ciudad: ${error.message}`);
      return Promise.reject(error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <CiudadTable
          data={ciudades}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    </Layout>
  );
};

export default CiudadesPage;
