
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { Settings, Save, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeCustomizer } from "@/components/theme/ThemeCustomizer";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import { CompanyConfigForm } from "@/components/configuracion/CompanyConfigForm";
import { CompanyConfig, fetchCompanyConfig, saveCompanyConfig } from "@/services/configService";

const PersonalizacionIndex = () => {
  const { currentTheme } = useTheme();
  const [companyConfig, setCompanyConfig] = useState<CompanyConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadConfig = async () => {
      setIsLoading(true);
      try {
        const config = await fetchCompanyConfig();
        setCompanyConfig(config);
      } catch (error) {
        console.error("Error loading company config:", error);
        toast.error("Error al cargar la configuración de la empresa");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConfig();
  }, []);
  
  const handleSaveConfig = async (data: CompanyConfig) => {
    try {
      const savedConfig = await saveCompanyConfig(data);
      if (savedConfig) {
        setCompanyConfig(savedConfig);
      }
    } catch (error) {
      console.error("Error saving company config:", error);
      toast.error("Error al guardar la configuración de la empresa");
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Navbar />
      <div className="main-container">
        <Header />
        <main className="flex-1 p-8 pt-[var(--header-height)]">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Palette className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-semibold text-foreground">Personalización</h1>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="temas" className="flex items-center gap-1">
                  <Palette className="h-4 w-4" />
                  Temas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración General</CardTitle>
                    <CardDescription>Configura los datos principales de tu empresa</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CompanyConfigForm 
                      initialData={companyConfig}
                      onSubmit={handleSaveConfig}
                    />
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
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PersonalizacionIndex;
