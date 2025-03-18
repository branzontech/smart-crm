
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { UserCog, RefreshCw, Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { User, userService } from "@/services/userService";
import { UserForm } from "@/components/usuarios/UserForm";
import { UserTable } from "@/components/usuarios/UserTable";
import { useAuth } from "@/contexts/AuthContext";

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("list");
  const { user: currentUser } = useAuth();
  
  // Verificar si el usuario actual es administrador
  const isAdmin = currentUser?.rol_usuario === 'Administrador';
  
  // Cargar usuarios
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      toast.error("Error al cargar los usuarios");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = () => {
    fetchUsers();
  };

  const handleUserCreated = () => {
    fetchUsers();
    setActiveTab("list");
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Navbar />
      <div className="main-container">
        <Header />
        <main className="flex-1 p-8 pt-[var(--header-height)]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <UserCog className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-semibold text-foreground">Gestión de Usuarios</h1>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setActiveTab("create")}
                  disabled={!isAdmin}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Nuevo Usuario
                </Button>
              </div>
            </div>

            {!isAdmin && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <p className="text-amber-600 flex items-center gap-2">
                    <span>Solo los administradores pueden crear y gestionar usuarios.</span>
                  </p>
                </CardContent>
              </Card>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="list">Lista de Usuarios</TabsTrigger>
                <TabsTrigger value="create" disabled={!isAdmin}>Crear Usuario</TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Usuarios del Sistema</CardTitle>
                    <CardDescription>
                      Gestiona los usuarios que tienen acceso al sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex justify-center items-center h-40">
                        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <UserTable users={users} onRefresh={handleRefresh} />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="create" className="space-y-6">
                <UserForm onSuccess={handleUserCreated} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
