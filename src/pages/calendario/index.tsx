
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
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Plus, X, Calendar as CalendarIcon } from "lucide-react";

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
    cambiarEstadoSubtarea,
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

  const handleCambiarEstadoSubtarea = async (subtareaId: string, completada: boolean) => {
    if (tareaSeleccionada) {
      await cambiarEstadoSubtarea(subtareaId, completada);
    }
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
    <SheetContent className="sm:max-w-2xl md:max-w-3xl w-[95vw] p-4 overflow-hidden" side="right">
      <SheetHeader className="z-10 sticky top-0 bg-background pb-2">
        <SheetTitle className="text-xl font-semibold">
          {modoEdicion ? "Editar Tarea" : "Crear Nueva Tarea"}
        </SheetTitle>
        <SheetClose className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-100 transition-colors">
          <X className="h-4 w-4" />
          <span className="sr-only">Cerrar</span>
        </SheetClose>
      </SheetHeader>
      <div>
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
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <CalendarIcon className="mr-3 h-8 w-8 text-primary" />
              Calendario de Tareas
            </h1>
            <p className="text-gray-500 mt-1">
              Gestiona y programa tus tareas y actividades
            </p>
          </div>
          <Button 
            onClick={handleAgregarTarea} 
            className="bg-primary hover:bg-primary/90 shadow-md transition-all rounded-full px-5 py-2 h-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> Nueva Tarea
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          {/* Calendario de Tareas */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {isLoading ? (
                <Skeleton className="h-[600px] w-full rounded-lg" />
              ) : (
                <CalendarioMensual
                  fecha={fechaSeleccionada}
                  tareas={tareas}
                  onFechaSeleccionada={setFechaSeleccionada}
                  onTareaSeleccionada={handleSeleccionarTarea}
                />
              )}
            </div>
          </div>

          {/* Lista de Tareas */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
              {isLoading ? (
                <Skeleton className="h-[500px] w-full" />
              ) : (
                <ListaTareas
                  tareas={tareas}
                  fecha={fechaSeleccionada}
                  onAgregarTarea={handleAgregarTarea}
                  onSeleccionarTarea={handleSeleccionarTarea}
                  onCambiarEstado={handleCambiarEstado}
                  getNombreUsuario={getNombreUsuario}
                  getColorUsuario={getColorUsuario}
                />
              )}
            </div>
          </div>
        </div>

        {/* Sheet for creating/editing tasks */}
        <Sheet open={sheetAbierto} onOpenChange={setSheetAbierto}>
          {TareaFormDrawer()}
        </Sheet>

        {/* Modal para ver detalle de tarea */}
        <Dialog open={modalDetalleAbierto} onOpenChange={setModalDetalleAbierto}>
          <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-xl">
            {tareaSeleccionada && (
              <TareaDetalle
                tarea={tareaSeleccionada}
                onEdit={handleEditarTarea}
                onDelete={handleEliminarTarea}
                onToggleCompletada={() => 
                  handleCambiarEstado(tareaSeleccionada, !tareaSeleccionada.completada)
                }
                onToggleSubtarea={handleCambiarEstadoSubtarea}
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
