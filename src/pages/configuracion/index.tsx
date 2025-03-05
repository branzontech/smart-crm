import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeCustomizer } from "@/components/theme/ThemeCustomizer";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";

const ConfiguracionIndex = () => {
  const { currentTheme } = useTheme();
  
  const handleSave = () => {
    toast.success("Configuración guardada correctamente");
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Navbar />
      <div className="main-container">
        <Header />
        <main className="flex-1 p-8 pt-[var(--header-height)]">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-semibold text-foreground">Configuración</h1>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="temas" className="flex items-center gap-1">
                  <Palette className="h-4 w-4" />
                  Personalización
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración General</CardTitle>
                    <CardDescription>Configura los ajustes básicos de tu CRM</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombreEmpresa">Nombre de la Empresa</Label>
                      <Input id="nombreEmpresa" placeholder="Tu Empresa S.A." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email de Contacto</Label>
                      <Input id="email" type="email" placeholder="contacto@tuempresa.com" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notificaciones</CardTitle>
                    <CardDescription>Gestiona cómo quieres recibir notificaciones</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificaciones por Email</Label>
                        <p className="text-sm text-muted-foreground">Recibe actualizaciones importantes por email</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificaciones del Sistema</Label>
                        <p className="text-sm text-muted-foreground">Recibe notificaciones en el sistema</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="temas" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personalización del Tema</CardTitle>
                    <CardDescription>
                      Personaliza los colores y el aspecto visual de tu CRM
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ThemeCustomizer />
                  </CardContent>
                </Card>
              </TabsContent>

              <div className="flex justify-end">
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </Button>
              </div>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ConfiguracionIndex;
