
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { EmbeddedClienteForm } from "@/components/EmbeddedClienteForm";
import { getClienteById, updateCliente } from "@/services/clientesService";
import { Cliente } from "@/types/maestros";

const EditarCliente = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCliente = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await getClienteById(id);
        if (response.data) {
          setCliente(response.data);
        } else {
          toast.error("No se pudo cargar el cliente");
          navigate("/clientes");
        }
      } catch (error) {
        console.error("Error al cargar cliente:", error);
        toast.error("Error al cargar el cliente");
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [id, navigate]);

  const handleSubmit = async (formData: any) => {
    if (!id) return;
    
    try {
      const result = await updateCliente(id, formData);
      if (result.data) {
        toast.success("Cliente actualizado con éxito");
        navigate(`/clientes/${id}`);
      }
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      toast.error("Error al actualizar el cliente");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-32 mb-8" />
          <div className="space-y-6">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Editar Cliente</h1>
            <p className="text-gray-500">
              Actualiza la información del cliente
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(`/clientes/${id}`)}>
            Cancelar
          </Button>
        </div>
        
        <Separator className="mb-8" />
        
        {cliente && (
          <EmbeddedClienteForm 
            cliente={cliente} 
            onSubmit={handleSubmit} 
            submitButtonText="Actualizar Cliente"
          />
        )}
      </div>
    </Layout>
  );
};

export default EditarCliente;
