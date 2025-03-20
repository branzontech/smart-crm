
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { CalendarioMensual } from "@/components/calendario/CalendarioMensual";
import { ListaTareas } from "@/components/calendario/ListaTareas";
import { TareaForm } from "@/components/calendario/TareaForm";
import { TareaDetalle } from "@/components/calendario/TareaDetalle";
import { CalendarioTarea } from "@/types/calendario";
import { useCalendario } from "@/hooks/useCalendario";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

const CalendarioPage = () => {
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [sheetAbierto, setSheetAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    tareas,
    usuarios,
    isLoading,
    fechaSeleccionada,
    tareaSeleccionada,
    setFechaSeleccionada,
    setTareaSeleccionada,
    crearTarea,
    actualizarTarea,
    cambiarEstadoTarea,
    eliminarTarea,
    getNombreUsuario,
    getColorUsuario
  } = useCalendario();

  // Handlers para la gestión de tareas
  const handleAgregarTarea = () => {
    setTareaSeleccionada(null);
    setModoEdicion(false);
    setSheetAbierto(true);
  };

  const handleEditarTarea = () => {
    setModoEdicion(true);
    setModalDetalleAbierto(false);
    setSheetAbierto(true);
  };

  const handleGuardarTarea = async (tarea: Partial<CalendarioTarea>) => {
    if (modoEdicion && tareaSeleccionada) {
      await actualizarTarea(tareaSeleccionada.id, tarea);
    } else {
      await crearTarea(tarea as Omit<CalendarioTarea, 'id'>);
    }
    setSheetAbierto(false);
  };

  const handleCancelarForm = () => {
    setSheetAbierto(false);
  };

  const handleSeleccionarTarea = (tarea: CalendarioTarea) => {
    setTareaSeleccionada(tarea);
    setModalDetalleAbierto(true);
  };

  const handleCambiarEstado = async (tarea: CalendarioTarea, completada: boolean) => {
    await cambiarEstadoTarea(tarea, completada);
  };

  const handleEliminarTarea = async () => {
    if (tareaSeleccionada) {
      const exito = await eliminarTarea(tareaSeleccionada.id);
      if (exito) {
        setModalDetalleAbierto(false);
      }
    }
  };

  const TareaFormDrawer = () => (
    <SheetContent className="sm:max-w-xl w-[95vw]" side="right">
      <SheetHeader>
        <SheetTitle>
          {modoEdicion ? "Editar Tarea" : "Crear Nueva Tarea"}
        </SheetTitle>
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
          <X className="h-4 w-4" />
          <span className="sr-only">Cerrar</span>
        </SheetClose>
      </SheetHeader>
      <div className="mt-6">
        <TareaForm
          tareaInicial={modoEdicion ? tareaSeleccionada || undefined : undefined}
          onSubmit={handleGuardarTarea}
          onCancel={handleCancelarForm}
          usuarios={usuarios}
        />
      </div>
    </SheetContent>
  );

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Calendario de Tareas</h1>
            <p className="text-gray-500">
              Gestiona y programa tus tareas y actividades
            </p>
          </div>
          <Button onClick={handleAgregarTarea} className="bg-blue-600">
            <Plus className="mr-1 h-4 w-4" /> Nueva Tarea
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          {/* Calendario de Tareas */}
          <div className="lg:col-span-5">
            {isLoading ? (
              <Skeleton className="h-[600px] w-full rounded-lg" />
            ) : (
              <CalendarioMensual
                fecha={fechaSeleccionada}
                tareas={tareas}
                onFechaSeleccionada={setFechaSeleccionada}
              />
            )}
          </div>

          {/* Lista de Tareas */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <Skeleton className="h-[500px] w-full rounded-lg" />
            ) : (
              <Tabs defaultValue="dia" className="h-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="dia">Día Seleccionado</TabsTrigger>
                  <TabsTrigger value="todas">Todas las Tareas</TabsTrigger>
                </TabsList>
                <TabsContent value="dia" className="h-full">
                  <ListaTareas
                    tareas={tareas}
                    fecha={fechaSeleccionada}
                    onAgregarTarea={handleAgregarTarea}
                    onSeleccionarTarea={handleSeleccionarTarea}
                    onCambiarEstado={handleCambiarEstado}
                  />
                </TabsContent>
                <TabsContent value="todas" className="h-full">
                  <ListaTareas
                    tareas={tareas}
                    onAgregarTarea={handleAgregarTarea}
                    onSeleccionarTarea={handleSeleccionarTarea}
                    onCambiarEstado={handleCambiarEstado}
                  />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>

        {/* Sheet for creating/editing tasks */}
        <Sheet open={sheetAbierto} onOpenChange={setSheetAbierto}>
          {TareaFormDrawer()}
        </Sheet>

        {/* Modal para ver detalle de tarea */}
        <Dialog open={modalDetalleAbierto} onOpenChange={setModalDetalleAbierto}>
          <DialogContent className="sm:max-w-[600px]">
            {tareaSeleccionada && (
              <TareaDetalle
                tarea={tareaSeleccionada}
                onEdit={handleEditarTarea}
                onDelete={handleEliminarTarea}
                onToggleCompletada={() => 
                  handleCambiarEstado(tareaSeleccionada, !tareaSeleccionada.completada)
                }
                getNombreUsuario={getNombreUsuario}
                getColorUsuario={getColorUsuario}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default CalendarioPage;
