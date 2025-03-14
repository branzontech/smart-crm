
import { useEffect, useState } from "react";
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
    refetch,
  } = useQuery({
    queryKey: ["sectores", refresh],
    queryFn: fetchSectores,
  });

  const handleRefresh = () => {
    setRefresh((prev) => prev + 1);
  };

  const handleAdd = async (data: Omit<Sector, "id" | "created_at" | "updated_at">) => {
    try {
      await createSector(data);
      return Promise.resolve();
    } catch (error: any) {
      toast.error(`Error al crear sector: ${error.message}`);
      return Promise.reject(error);
    }
  };

  const handleUpdate = async (
    id: string,
    data: Partial<Omit<Sector, "id" | "created_at" | "updated_at">>
  ) => {
    try {
      await updateSector(id, data);
      return Promise.resolve();
    } catch (error: any) {
      toast.error(`Error al actualizar sector: ${error.message}`);
      return Promise.reject(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSector(id);
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
