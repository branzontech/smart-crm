
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MaestroTable } from "@/components/maestros/MaestroTable";
import { Layout } from "@/components/layout/Layout";
import { fetchTiposProductos, createTipoProducto, updateTipoProducto, deleteTipoProducto } from "@/services/maestros";
import { TipoProducto } from "@/types/maestros";
import { toast } from "sonner";

const TiposProductosPage = () => {
  const [refresh, setRefresh] = useState(0);

  const {
    data: tiposProductos = [],
    isLoading,
  } = useQuery({
    queryKey: ["tiposProductos", refresh],
    queryFn: fetchTiposProductos,
  });

  const handleRefresh = () => {
    setRefresh((prev) => prev + 1);
  };

  const handleAdd = async (data: Omit<TipoProducto, "id" | "created_at" | "updated_at">) => {
    try {
      // Remove any id field if it exists (let Supabase generate it)
      const { id, ...tipoProductoData } = data as any;
      
      // Asegurar que el nombre siempre esté presente
      const cleanedData: Omit<TipoProducto, "id" | "created_at" | "updated_at"> = {
        nombre: tipoProductoData.nombre,
        // Incluir descripción solo si tiene valor
        ...(tipoProductoData.descripcion && tipoProductoData.descripcion !== "" ? { descripcion: tipoProductoData.descripcion } : {})
      };
      
      console.log("Saving tipo producto with data:", cleanedData);
      
      await createTipoProducto(cleanedData);
      handleRefresh();
      toast.success("Tipo de producto creado exitosamente");
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error creating tipo producto:", error);
      toast.error(`Error al guardar: ${error.message}`);
      return Promise.reject(error);
    }
  };

  const handleUpdate = async (
    id: string,
    data: Partial<Omit<TipoProducto, "id" | "created_at" | "updated_at">>
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
      
      console.log("Updating tipo producto with ID:", id, "and data:", cleanedData);
      
      await updateTipoProducto(id, cleanedData);
      handleRefresh();
      toast.success("Tipo de producto actualizado exitosamente");
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error updating tipo producto:", error);
      toast.error(`Error al guardar: ${error.message}`);
      return Promise.reject(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTipoProducto(id);
      handleRefresh();
      toast.success("Tipo de producto eliminado exitosamente");
      return Promise.resolve();
    } catch (error: any) {
      toast.error(`Error al eliminar tipo de producto: ${error.message}`);
      return Promise.reject(error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <MaestroTable
          data={tiposProductos}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          tipo="tipoProducto"
        />
      </div>
    </Layout>
  );
};

export default TiposProductosPage;
