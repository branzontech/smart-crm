
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Building2, 
  Package2, 
  Receipt, 
  ClipboardList, 
  FileText, 
  FileCheck2, 
  Mail, 
  BarChart3,
  ArrowUp,
  ArrowDown,
  DollarSign
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const Index = () => {
  const navigate = useNavigate();

  // Datos de ejemplo para las métricas
  const metricas = [
    {
      titulo: "Total Clientes",
      valor: "156",
      incremento: "+12%",
      icono: Users,
      tendenciaPositiva: true,
    },
    {
      titulo: "Recaudos Pendientes",
      valor: "$45,678",
      incremento: "-5%",
      icono: Receipt,
      tendenciaPositiva: false,
    },
    {
      titulo: "Ventas del Mes",
      valor: "$89,432",
      incremento: "+23%",
      icono: DollarSign,
      tendenciaPositiva: true,
    },
    {
      titulo: "Proveedores Activos",
      valor: "34",
      incremento: "+8%",
      icono: Package2,
      tendenciaPositiva: true,
    },
  ];

  // Datos para el gráfico de estados de recaudos
  const estadosRecaudos = [
    { nombre: "Pendiente", valor: 30, color: "#fbbf24" },
    { nombre: "En Proceso", valor: 25, color: "#3b82f6" },
    { nombre: "Pagado", valor: 35, color: "#22c55e" },
    { nombre: "Vencido", valor: 10, color: "#ef4444" },
  ];

  // Datos para el gráfico de ventas mensuales
  const ventasMensuales = [
    { mes: "Ene", ventas: 4000 },
    { mes: "Feb", ventas: 3000 },
    { mes: "Mar", ventas: 2000 },
    { mes: "Abr", ventas: 2780 },
    { mes: "May", ventas: 1890 },
    { mes: "Jun", ventas: 2390 },
  ];

  // Accesos rápidos
  const accesosRapidos = [
    { titulo: "Clientes", ruta: "/clientes", icono: Users, color: "bg-blue-500" },
    { titulo: "Empresas", ruta: "/empresas", icono: Building2, color: "bg-green-500" },
    { titulo: "Proveedores", ruta: "/proveedores", icono: Package2, color: "bg-purple-500" },
    { titulo: "Recaudos", ruta: "/recaudos", icono: Receipt, color: "bg-orange-500" },
    { titulo: "Oportunidades", ruta: "/ventas/oportunidades", icono: ClipboardList, color: "bg-teal-500" },
    { titulo: "Contratos", ruta: "/ventas/contratos", icono: FileText, color: "bg-indigo-500" },
    { titulo: "Cotizaciones", ruta: "/ventas/cotizaciones", icono: FileCheck2, color: "bg-pink-500" },
    { titulo: "Comunicaciones", ruta: "/comunicaciones", icono: Mail, color: "bg-yellow-500" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
            <Button onClick={() => navigate("/reportes")} className="bg-teal hover:bg-sage">
              <BarChart3 className="h-4 w-4 mr-2" />
              Ver Reportes Completos
            </Button>
          </div>

          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metricas.map((metrica, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metrica.titulo}
                  </CardTitle>
                  <metrica.icono className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrica.valor}</div>
                  <div className={`flex items-center text-sm ${
                    metrica.tendenciaPositiva ? "text-green-600" : "text-red-600"
                  }`}>
                    {metrica.tendenciaPositiva ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {metrica.incremento} vs mes anterior
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Estados de Recaudos</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={estadosRecaudos}
                      dataKey="valor"
                      nameKey="nombre"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {estadosRecaudos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ventas Mensuales</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ventasMensuales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="ventas" fill="#14b8a6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Accesos Rápidos */}
          <Card>
            <CardHeader>
              <CardTitle>Accesos Rápidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {accesosRapidos.map((acceso, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-gray-50"
                    onClick={() => navigate(acceso.ruta)}
                  >
                    <div className={`p-2 rounded-full ${acceso.color}`}>
                      <acceso.icono className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-medium">{acceso.titulo}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;

