
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { UsersTable } from "@/components/usuarios/UsersTable";
import { CreateUserDialog } from "@/components/usuarios/CreateUserDialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const UsuariosPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setUsers(data || []);
    } catch (error: any) {
      console.error("Error fetching users:", error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No fue posible cargar los usuarios. " + error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserCreated = () => {
    fetchUsers();
    // This toast is now handled in the CreateUserDialog component
  };

  return (
    <Layout>
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Gestión de Usuarios</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Administra los usuarios que pueden acceder al sistema.
            </p>
          </div>
          <CreateUserDialog onUserCreated={handleUserCreated} />
        </div>

        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
          <UsersTable users={users} loading={loading} onRefresh={fetchUsers} />
        </div>
      </div>
    </Layout>
  );
};

export default UsuariosPage;
