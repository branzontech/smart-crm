
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const CalendarioPage = () => {
  const [modalFormAbierto, setModalFormAbierto] = useState(false);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

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
    setModalFormAbierto(true);
  };

  const handleEditarTarea = () => {
    setModoEdicion(true);
    setModalDetalleAbierto(false);
    setModalFormAbierto(true);
  };

  const handleGuardarTarea = async (tarea: Partial<CalendarioTarea>) => {
    if (modoEdicion && tareaSeleccionada) {
      await actualizarTarea(tareaSeleccionada.id, tarea);
    } else {
      await crearTarea(tarea as Omit<CalendarioTarea, 'id'>);
    }
    setModalFormAbierto(false);
  };

  const handleCancelarForm = () => {
    setModalFormAbierto(false);
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

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Calendario de Tareas</h1>
          <p className="text-gray-500">
            Gestiona y programa tus tareas y actividades
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Calendario del Mes */}
          <div className="md:col-span-1">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full rounded-lg" />
            ) : (
              <CalendarioMensual
                fecha={fechaSeleccionada}
                tareas={tareas}
                onFechaSeleccionada={setFechaSeleccionada}
              />
            )}
          </div>

          {/* Lista de Tareas */}
          <div className="md:col-span-2">
            {isLoading ? (
              <Skeleton className="h-[500px] w-full rounded-lg" />
            ) : (
              <Tabs defaultValue="dia" className="h-full">
                <TabsList>
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

        {/* Modal para crear/editar tareas */}
        <Dialog open={modalFormAbierto} onOpenChange={setModalFormAbierto}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>
                {modoEdicion ? "Editar Tarea" : "Crear Nueva Tarea"}
              </DialogTitle>
            </DialogHeader>
            <TareaForm
              tareaInicial={modoEdicion ? tareaSeleccionada || undefined : undefined}
              onSubmit={handleGuardarTarea}
              onCancel={handleCancelarForm}
              usuarios={usuarios}
            />
          </DialogContent>
        </Dialog>

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
