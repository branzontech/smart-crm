
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
      await createOrigenCliente(data);
      return Promise.resolve();
    } catch (error: any) {
      toast.error(`Error al crear origen de cliente: ${error.message}`);
      return Promise.reject(error);
    }
  };

  const handleUpdate = async (
    id: string,
    data: Partial<Omit<OrigenCliente, "id" | "created_at" | "updated_at">>
  ) => {
    try {
      await updateOrigenCliente(id, data);
      return Promise.resolve();
    } catch (error: any) {
      toast.error(`Error al actualizar origen de cliente: ${error.message}`);
      return Promise.reject(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOrigenCliente(id);
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
