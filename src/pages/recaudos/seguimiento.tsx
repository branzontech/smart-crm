
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Grid, List } from "lucide-react";

// Datos de ejemplo - reemplazar con datos reales posteriormente
const recaudos = [
  {
    id: 1,
    numeroRecaudo: "REC-001",
    cliente: "Tech Solutions SA",
    agente: "Juan Pérez",
    estado: "Pendiente",
    monto: 25000,
    fechaCreacion: "2024-03-15",
    fechaVencimiento: "2024-04-15",
  },
  {
    id: 2,
    numeroRecaudo: "REC-002",
    cliente: "Global Logistics",
    agente: "María García",
    estado: "Pagado",
    monto: 15000,
    fechaCreacion: "2024-03-10",
    fechaVencimiento: "2024-04-10",
  },
];

export default function SeguimientoRecaudos() {
  const [vista, setVista] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Seguimiento de Recaudos</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVista("grid")}
                className={vista === "grid" ? "bg-muted" : ""}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVista("list")}
                className={vista === "list" ? "bg-muted" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="todos" className="w-full">
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
              <TabsTrigger value="pagados">Pagados</TabsTrigger>
            </TabsList>

            <TabsContent value="todos" className="mt-6">
              {vista === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recaudos.map((recaudo) => (
                    <Card key={recaudo.id}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {recaudo.numeroRecaudo}
                        </CardTitle>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Cliente:</span>
                            <span className="text-sm font-medium">{recaudo.cliente}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Agente:</span>
                            <span className="text-sm">{recaudo.agente}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Monto:</span>
                            <span className="text-sm">${recaudo.monto.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Estado:</span>
                            <span className={`text-sm px-2 py-0.5 rounded-full ${
                              recaudo.estado === "Pagado" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {recaudo.estado}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recaudos.map((recaudo) => (
                    <Card key={recaudo.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{recaudo.numeroRecaudo}</p>
                            <p className="text-sm text-muted-foreground">{recaudo.cliente}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="text-sm font-medium">${recaudo.monto.toLocaleString()}</p>
                            <span className={`text-sm px-2 py-0.5 rounded-full ${
                              recaudo.estado === "Pagado" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {recaudo.estado}
                            </span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pendientes">
              {/* Filtrar y mostrar solo recaudos pendientes */}
            </TabsContent>

            <TabsContent value="pagados">
              {/* Filtrar y mostrar solo recaudos pagados */}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
