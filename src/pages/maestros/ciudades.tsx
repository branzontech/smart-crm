
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CiudadTable } from "@/components/maestros/CiudadTable";
import { Layout } from "@/components/layout/Layout";
import { fetchCiudades, createCiudad, updateCiudad, deleteCiudad } from "@/services/maestrosService";
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
      await createCiudad(data);
      return Promise.resolve();
    } catch (error: any) {
      toast.error(`Error al crear ciudad: ${error.message}`);
      return Promise.reject(error);
    }
  };

  const handleUpdate = async (
    id: string,
    data: Partial<Omit<Ciudad, "id" | "created_at" | "updated_at" | "pais">>
  ) => {
    try {
      await updateCiudad(id, data);
      return Promise.resolve();
    } catch (error: any) {
      toast.error(`Error al actualizar ciudad: ${error.message}`);
      return Promise.reject(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCiudad(id);
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
