
import { Navbar } from "@/components/layout/Navbar";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Wallet, FileText, ShoppingCart, Coins } from "lucide-react";

// Datos para las gráficas
const actividadData = [
  { name: "Ene", ventas: 4000, visitas: 2400 },
  { name: "Feb", ventas: 3000, visitas: 1398 },
  { name: "Mar", ventas: 2000, visitas: 9800 },
  { name: "Abr", ventas: 2780, visitas: 3908 },
  { name: "May", ventas: 1890, visitas: 4800 },
  { name: "Jun", ventas: 2390, visitas: 3800 },
];

const estadoVentasData = [
  { name: "Pendientes", value: 30 },
  { name: "En proceso", value: 45 },
  { name: "Completadas", value: 25 },
];

const COLORS = ["#8B5CF6", "#D946EF", "#F97316"];

const recaudosData = [
  { name: "Ene", value: 3500 },
  { name: "Feb", value: 2800 },
  { name: "Mar", value: 4200 },
  { name: "Abr", value: 3800 },
  { name: "May", value: 5100 },
  { name: "Jun", value: 4700 },
];

// Nuevos datos para las gráficas adicionales
const clientesData = [
  { name: "Ene", nuevos: 12, activos: 45 },
  { name: "Feb", nuevos: 19, activos: 50 },
  { name: "Mar", nuevos: 8, activos: 55 },
  { name: "Abr", nuevos: 15, activos: 60 },
  { name: "May", nuevos: 21, activos: 75 },
  { name: "Jun", nuevos: 13, activos: 82 },
];

const empresasData = [
  { name: "Tecnología", value: 35 },
  { name: "Servicios", value: 25 },
  { name: "Manufactura", value: 20 },
  { name: "Educación", value: 15 },
  { name: "Otros", value: 5 },
];

const EMPRESA_COLORS = ["#9b87f5", "#7E69AB", "#6E59A5", "#D6BCFA", "#E5DEFF"];

const cotizacionesData = [
  { name: "Ene", enviadas: 28, aprobadas: 15 },
  { name: "Feb", enviadas: 32, aprobadas: 18 },
  { name: "Mar", enviadas: 26, aprobadas: 12 },
  { name: "Abr", enviadas: 34, aprobadas: 22 },
  { name: "May", enviadas: 30, aprobadas: 19 },
  { name: "Jun", enviadas: 38, aprobadas: 24 },
];

const ventasPorProducto = [
  { categoria: "Software", ventas: 8000 },
  { categoria: "Hardware", ventas: 5000 },
  { categoria: "Servicios", ventas: 12000 },
  { categoria: "Consultorías", ventas: 9500 },
  { categoria: "Capacitación", ventas: 3500 },
];

// Datos para gráfico de radar
const rendimientoData = [
  { subject: 'Ventas', A: 120, B: 110, fullMark: 150 },
  { subject: 'Clientes', A: 98, B: 130, fullMark: 150 },
  { subject: 'Recaudos', A: 86, B: 130, fullMark: 150 },
  { subject: 'Cotizaciones', A: 99, B: 100, fullMark: 150 },
  { subject: 'Contratos', A: 85, B: 90, fullMark: 150 },
  { subject: 'Satisfacción', A: 65, B: 85, fullMark: 150 },
];

// Datos para indicadores de rendimiento
const metricas = [
  { 
    titulo: "Clientes Activos", 
    valor: "156", 
    incremento: "+12%", 
    icono: Users, 
    color: "bg-purple-100 text-purple-800"
  },
  { 
    titulo: "Empresas", 
    valor: "34", 
    incremento: "+5%", 
    icono: Building2, 
    color: "bg-blue-100 text-blue-800"
  },
  { 
    titulo: "Saldo Total", 
    valor: "$156,890", 
    incremento: "+23%", 
    icono: Wallet, 
    color: "bg-green-100 text-green-800"
  },
  { 
    titulo: "Cotizaciones", 
    valor: "187", 
    incremento: "+18%", 
    icono: FileText, 
    color: "bg-orange-100 text-orange-800"
  },
  { 
    titulo: "Ventas", 
    valor: "98", 
    incremento: "+15%", 
    icono: ShoppingCart, 
    color: "bg-pink-100 text-pink-800"
  },
  { 
    titulo: "Recaudos", 
    valor: "$42,580", 
    incremento: "+7%", 
    icono: Coins, 
    color: "bg-teal-100 text-teal-800"
  },
];

export default function Index() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <div className="main-container">
        <main className="flex-1 content-container">
          <div className="max-w-content px-4 py-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {metricas.map((metrica, index) => (
                <Card key={index} className="border-none shadow-sm">
                  <CardContent className="p-4 flex flex-col">
                    <div className={`p-2 rounded-md w-fit ${metrica.color} mb-2`}>
                      <metrica.icono className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-500">{metrica.titulo}</h3>
                    <p className="text-2xl font-bold">{metrica.valor}</p>
                    <p className="text-xs text-green-600">{metrica.incremento} vs mes anterior</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Fila 1: Actividad de ventas y Estado de ventas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Actividad de ventas y visitas */}
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg font-medium">Actividad de ventas y visitas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={actividadData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="ventas"
                          stroke="#0EA5E9"
                          activeDot={{ r: 8 }}
                        />
                        <Line type="monotone" dataKey="visitas" stroke="#8B5CF6" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Estado de ventas */}
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg font-medium">Estado de ventas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={estadoVentasData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {estadoVentasData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Fila 2: Clientes y Empresas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Clientes */}
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg font-medium">Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={clientesData}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="activos" stackId="1" stroke="#8B5CF6" fill="#D6BCFA" />
                        <Area type="monotone" dataKey="nuevos" stackId="2" stroke="#D946EF" fill="#FFDEE2" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Empresas por sector */}
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg font-medium">Empresas por sector</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={empresasData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {empresasData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={EMPRESA_COLORS[index % EMPRESA_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Fila 3: Cotizaciones y Ventas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Cotizaciones */}
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg font-medium">Cotizaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={cotizacionesData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="enviadas" name="Enviadas" fill="#9b87f5" />
                        <Bar dataKey="aprobadas" name="Aprobadas" fill="#6E59A5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Ventas por Producto */}
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg font-medium">Ventas por categoría</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={ventasPorProducto}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 40,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="categoria" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="ventas" name="Ventas ($)" fill="#F97316" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recaudos */}
              <Card className="border-none shadow-sm lg:col-span-2">
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg font-medium">Recaudos mensuales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={recaudosData}
                        margin={{
                          top: 5,
                          right: a30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Recaudos" fill="#1EAEDB" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Rendimiento comparativo (Radar Chart) */}
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg font-medium">Rendimiento Comparativo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={rendimientoData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} />
                        <Radar name="Actual" dataKey="A" stroke="#8B5CF6" fill="#D6BCFA" fillOpacity={0.6} />
                        <Radar name="Meta" dataKey="B" stroke="#0EA5E9" fill="#D3E4FD" fillOpacity={0.6} />
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Información adicional */}
              <div className="space-y-6 lg:col-span-3">
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-lg font-medium">Actividad Reciente</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border-l-2 border-blue-500 pl-3">
                      <p className="font-medium">Nueva cotización creada</p>
                      <p className="text-xs text-gray-500">Hace 2 horas</p>
                    </div>
                    <div className="border-l-2 border-green-500 pl-3">
                      <p className="font-medium">Cliente actualizado</p>
                      <p className="text-xs text-gray-500">Hace 3 horas</p>
                    </div>
                    <div className="border-l-2 border-purple-500 pl-3">
                      <p className="font-medium">Contrato firmado</p>
                      <p className="text-xs text-gray-500">Hace 1 día</p>
                    </div>
                    <div className="border-l-2 border-orange-500 pl-3">
                      <p className="font-medium">Nuevo recaudo registrado</p>
                      <p className="text-xs text-gray-500">Hace 1 día</p>
                    </div>
                    <div className="border-l-2 border-red-500 pl-3">
                      <p className="font-medium">Cotización aprobada</p>
                      <p className="text-xs text-gray-500">Hace 2 días</p>
                    </div>
                    <div className="border-l-2 border-teal-500 pl-3">
                      <p className="font-medium">Nueva empresa registrada</p>
                      <p className="text-xs text-gray-500">Hace 3 días</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
