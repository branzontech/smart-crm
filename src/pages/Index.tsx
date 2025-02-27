import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Users, Building2, Package2, Receipt, ClipboardList, 
  FileText, FileCheck2, Mail, BarChart3, ArrowUp, 
  ArrowDown, DollarSign, Cake, PartyPopper, Gift, GripHorizontal
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from "react";

interface SortableCardProps {
  id: string;
  children: React.ReactNode;
}

const SortableCard = ({ id, children }: SortableCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? 'cursor-grabbing' : ''}`}
      {...attributes}
    >
      <div className="absolute top-2 right-2 cursor-grab text-gray-400 hover:text-gray-600 z-10" {...listeners}>
        <GripHorizontal className="h-5 w-5" />
      </div>
      {children}
    </div>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [cardsOrder, setCardsOrder] = useState([
    'cumpleanos',
    'metricas',
    'recaudos',
    'ventas',
    'accesos'
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Datos de ejemplo para cumpleaños
  const cumpleanos = {
    hoy: [
      { id: 1, nombre: "Carlos Ruiz", empresa: "Tech Solutions", fecha: new Date() },
      { id: 2, nombre: "Ana López", empresa: "Green Energy", fecha: new Date() }
    ],
    proximos: [
      { 
        id: 3, 
        nombre: "María García", 
        empresa: "Global Logistics", 
        fecha: new Date(new Date().setDate(new Date().getDate() + 2))
      },
      { 
        id: 4, 
        nombre: "Juan Pérez", 
        empresa: "Digital Systems", 
        fecha: new Date(new Date().setDate(new Date().getDate() + 3))
      },
      { 
        id: 5, 
        nombre: "Laura Torres", 
        empresa: "Smart Solutions", 
        fecha: new Date(new Date().setDate(new Date().getDate() + 5))
      }
    ]
  };

  // Datos para las métricas
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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCardsOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  const renderCards = () => {
    return cardsOrder.map((cardId) => {
      const cardContent = {
        cumpleanos: (
          <Card className="bg-gradient-to-br from-teal-50 to-mint-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-teal flex items-center gap-2">
                  <Cake className="h-6 w-6" />
                  Cumpleaños
                </CardTitle>
                <PartyPopper className="h-6 w-6 text-teal animate-bounce" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-teal mb-4 flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Cumpleaños de Hoy
                  </h3>
                  {cumpleanos.hoy.length > 0 ? (
                    <div className="space-y-3">
                      {cumpleanos.hoy.map((persona) => (
                        <div
                          key={persona.id}
                          className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-teal/10 hover:border-teal/20 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{persona.nombre}</p>
                            <p className="text-sm text-gray-500">{persona.empresa}</p>
                          </div>
                          <Cake className="h-5 w-5 text-teal ml-4" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No hay cumpleaños hoy</p>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-teal mb-4 flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Próximos Cumpleaños
                  </h3>
                  <div className="space-y-3">
                    {cumpleanos.proximos.map((persona) => (
                      <div
                        key={persona.id}
                        className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-teal/10 hover:border-teal/20 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{persona.nombre}</p>
                          <p className="text-sm text-gray-500">{persona.empresa}</p>
                          <p className="text-xs text-teal mt-1">
                            {persona.fecha.toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long'
                            })}
                          </p>
                        </div>
                        <PartyPopper className="h-5 w-5 text-teal ml-4" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ),
        metricas: (
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
        ),
        recaudos: (
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
        ),
        ventas: (
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
        ),
        accesos: (
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
        ),
      }[cardId];

      return (
        <SortableCard key={cardId} id={cardId}>
          <div className={`transition-all duration-200 ${activeId === cardId ? 'scale-[1.02]' : ''}`}>
            {cardContent}
          </div>
        </SortableCard>
      );
    });
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 overflow-hidden">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
              <Button onClick={() => navigate("/reportes")} className="bg-teal hover:bg-sage">
                <BarChart3 className="h-4 w-4 mr-2" />
                Ver Reportes Completos
              </Button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={cardsOrder} 
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-6 overflow-y-auto overflow-x-hidden">
                  {renderCards()}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
