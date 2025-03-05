
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Phone, 
  Calendar, 
  Mail, 
  Tag, 
  FileText, 
  Clock, 
  Check, 
  UserPlus, 
  ArrowRight,
  User
} from "lucide-react";

type TimelineEventType = 
  | "contacto" 
  | "llamada" 
  | "correo" 
  | "reunion" 
  | "promocion" 
  | "contrato" 
  | "seguimiento"
  | "venta";

interface TimelineEvent {
  id: number;
  tipo: TimelineEventType;
  fecha: string;
  titulo: string;
  descripcion: string;
  estado?: "pendiente" | "completado" | "cancelado";
  usuario?: string;
}

interface ClienteTimelineProps {
  clienteId: number;
}

export function ClienteTimeline({ clienteId }: ClienteTimelineProps) {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtro, setFiltro] = useState<string>("todos");
  const tabsRef = useRef<HTMLDivElement>(null);

  // Simulación de datos de línea de tiempo
  useEffect(() => {
    // En un caso real, aquí se haría una llamada a la API para obtener la línea de tiempo del cliente
    const fetchTimelineData = () => {
      setIsLoading(true);
      
      // Simulación de carga de datos
      setTimeout(() => {
        // Ejemplo de datos para la línea de tiempo
        const eventos: TimelineEvent[] = [
          {
            id: 1,
            tipo: "contacto",
            fecha: "2024-01-15T10:30:00",
            titulo: "Primer contacto",
            descripcion: "Cliente interesado en nuestros servicios de consultoría. Encontró la empresa a través del sitio web.",
            usuario: "Ana Martínez"
          },
          {
            id: 2,
            tipo: "llamada",
            fecha: "2024-01-20T15:45:00",
            titulo: "Llamada de seguimiento",
            descripcion: "Se discutieron las necesidades específicas y se acordó enviar una propuesta.",
            usuario: "Carlos Ruiz"
          },
          {
            id: 3,
            tipo: "correo",
            fecha: "2024-01-21T09:15:00",
            titulo: "Envío de propuesta",
            descripcion: "Se envió propuesta detallada con opciones de servicios y precios.",
            usuario: "Ana Martínez"
          },
          {
            id: 4,
            tipo: "promocion",
            fecha: "2024-02-05T11:00:00",
            titulo: "Oferta especial",
            descripcion: "Se envió promoción con 15% de descuento en el primer contrato.",
            usuario: "Marketing"
          },
          {
            id: 5,
            tipo: "reunion",
            fecha: "2024-02-10T14:00:00",
            titulo: "Reunión virtual",
            descripcion: "Presentación detallada de nuestros servicios y resolución de dudas.",
            estado: "completado",
            usuario: "Carlos Ruiz"
          },
          {
            id: 6,
            tipo: "seguimiento",
            fecha: "2024-02-15T10:00:00",
            titulo: "Seguimiento post-reunión",
            descripcion: "El cliente solicitó tiempo para evaluar la propuesta con su equipo.",
            usuario: "Carlos Ruiz"
          },
          {
            id: 7,
            tipo: "llamada",
            fecha: "2024-02-25T16:30:00",
            titulo: "Llamada de cierre",
            descripcion: "El cliente decidió proceder con nuestros servicios.",
            usuario: "Ana Martínez"
          },
          {
            id: 8,
            tipo: "contrato",
            fecha: "2024-03-01T11:15:00",
            titulo: "Elaboración de contrato",
            descripcion: "Se preparó el contrato según los términos acordados.",
            estado: "completado",
            usuario: "Departamento Legal"
          },
          {
            id: 9,
            tipo: "venta",
            fecha: "2024-03-10T15:00:00",
            titulo: "Firma de contrato",
            descripcion: "Cliente firmó el contrato y realizó el primer pago.",
            usuario: "Finanzas"
          }
        ];
        
        setTimelineEvents(eventos);
        setIsLoading(false);
      }, 1000);
    };
    
    fetchTimelineData();
  }, [clienteId]);

  // Prevent scrolling when changing tabs
  const handleValueChange = (value: string) => {
    // Store current scroll position
    const scrollPosition = window.scrollY;
    
    // Update filter
    setFiltro(value);
    
    // Restore scroll position after state update
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 0);
  };

  const getTipoIcon = (tipo: TimelineEventType) => {
    switch (tipo) {
      case "contacto": return <UserPlus className="h-5 w-5 text-blue-500" />;
      case "llamada": return <Phone className="h-5 w-5 text-green-500" />;
      case "correo": return <Mail className="h-5 w-5 text-purple-500" />;
      case "reunion": return <Calendar className="h-5 w-5 text-orange-500" />;
      case "promocion": return <Tag className="h-5 w-5 text-pink-500" />;
      case "contrato": return <FileText className="h-5 w-5 text-indigo-500" />;
      case "seguimiento": return <Clock className="h-5 w-5 text-gray-500" />;
      case "venta": return <Check className="h-5 w-5 text-teal" />;
      default: return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTipoBadge = (tipo: TimelineEventType) => {
    const colors: Record<TimelineEventType, string> = {
      contacto: "bg-blue-100 text-blue-700",
      llamada: "bg-green-100 text-green-700",
      correo: "bg-purple-100 text-purple-700",
      reunion: "bg-orange-100 text-orange-700",
      promocion: "bg-pink-100 text-pink-700",
      contrato: "bg-indigo-100 text-indigo-700",
      seguimiento: "bg-gray-100 text-gray-700",
      venta: "bg-[#FEF7CD] text-teal"
    };
    
    const labels: Record<TimelineEventType, string> = {
      contacto: "Contacto Inicial",
      llamada: "Llamada",
      correo: "Correo",
      reunion: "Reunión",
      promocion: "Promoción",
      contrato: "Contrato",
      seguimiento: "Seguimiento",
      venta: "Venta"
    };
    
    return <Badge className={`${colors[tipo]} whitespace-nowrap`}>{labels[tipo]}</Badge>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    }).format(date);
  };

  const filteredEvents = filtro === "todos" 
    ? timelineEvents 
    : timelineEvents.filter(event => event.tipo === filtro);

  // Ordenar eventos por fecha, del más reciente al más antiguo
  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <Tabs 
          defaultValue="todos" 
          className="w-full" 
          onValueChange={handleValueChange}
          ref={tabsRef}
        >
          <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-10 pb-2">
            <TabsList className="w-auto overflow-x-auto py-2">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="contacto">Contactos</TabsTrigger>
              <TabsTrigger value="llamada">Llamadas</TabsTrigger>
              <TabsTrigger value="correo">Correos</TabsTrigger>
              <TabsTrigger value="reunion">Reuniones</TabsTrigger>
              <TabsTrigger value="promocion">Promociones</TabsTrigger>
              <TabsTrigger value="venta">Ventas</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={filtro} className="mt-0 animate-fade-in">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 border-4 border-teal border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500">Cargando historial del cliente...</p>
              </div>
            ) : sortedEvents.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-300" />
                <p className="mt-4 text-gray-500">No hay eventos registrados</p>
              </div>
            ) : (
              <div className="space-y-2 relative">
                <div className="absolute left-[30px] top-0 bottom-0 w-0.5 bg-gray-200 z-0"></div>
                
                {sortedEvents.map((event, index) => (
                  <div key={event.id} className="relative z-10 animate-enter">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="flex-shrink-0 bg-white rounded-full p-2 shadow-md">
                        {getTipoIcon(event.tipo)}
                      </div>
                      
                      <div className="flex-1 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            {getTipoBadge(event.tipo)}
                            {event.estado && (
                              <Badge variant={
                                event.estado === "completado" ? "outline" : 
                                event.estado === "pendiente" ? "secondary" : "destructive"
                              }>
                                {event.estado}
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">{formatDate(event.fecha)}</span>
                        </div>
                        
                        <h4 className="font-semibold text-gray-900 mb-1">{event.titulo}</h4>
                        <p className="text-gray-600 text-sm mb-2">{event.descripcion}</p>
                        
                        {event.usuario && (
                          <div className="flex items-center mt-2">
                            <div className="bg-gray-100 text-xs rounded-full px-3 py-1 text-gray-600">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {event.usuario}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {index < sortedEvents.length - 1 && (
                          <div className="absolute left-[30px] top-12 h-full">
                            <ArrowRight className="h-5 w-5 text-gray-300 absolute -right-[10px] top-6 transform -rotate-90" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
