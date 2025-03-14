
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
      await createTipoServicio(data);
      return Promise.resolve();
    } catch (error: any) {
      toast.error(`Error al crear tipo de servicio: ${error.message}`);
      return Promise.reject(error);
    }
  };

  const handleUpdate = async (
    id: string,
    data: Partial<Omit<TipoServicio, "id" | "created_at" | "updated_at">>
  ) => {
    try {
      await updateTipoServicio(id, data);
      return Promise.resolve();
    } catch (error: any) {
      toast.error(`Error al actualizar tipo de servicio: ${error.message}`);
      return Promise.reject(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTipoServicio(id);
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
