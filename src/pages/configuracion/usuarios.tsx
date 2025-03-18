
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { UserPlus, Users } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { UserTable } from "@/components/configuracion/UserTable";
import { UserForm } from "@/components/configuracion/UserForm";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ConfiguracionUsuarios = () => {
  const [activeTab, setActiveTab] = useState("listado");
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleUserCreated = () => {
    setActiveTab("listado");
  };

  // Redireccionar si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex bg-background">
      <Navbar />
      <div className="main-container">
        <Header />
        <main className="flex-1 p-8 pt-[var(--header-height)]">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Users className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-semibold text-foreground">Gestión de Usuarios</h1>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="listado" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Listado de Usuarios
                </TabsTrigger>
                <TabsTrigger value="nuevo" className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  Nuevo Usuario
                </TabsTrigger>
              </TabsList>

              <TabsContent value="listado" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Usuarios del Sistema</CardTitle>
                    <CardDescription>
                      Gestiona los usuarios que tienen acceso al sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserTable />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="nuevo" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Crear Nuevo Usuario</CardTitle>
                    <CardDescription>
                      Añade un nuevo usuario con acceso al sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserForm onUserCreated={handleUserCreated} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ConfiguracionUsuarios;
