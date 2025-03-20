import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarioTarea, CalendarioSubtarea, UsuarioCalendario } from "@/types/calendario";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SubtareasList } from "./SubtareasList";
import { SubtareaForm } from "./SubtareaForm";
import { CheckCircle2, ListTodo } from "lucide-react";

// Esquema de validación
const tareaSchema = z.object({
  titulo: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  descripcion: z.string().optional(),
  fechaInicio: z.string().nonempty("La fecha de inicio es requerida"),
  horaInicio: z.string().optional(),
  fechaFin: z.string().optional(),
  horaFin: z.string().optional(),
  todoElDia: z.boolean().default(false),
  completada: z.boolean().default(false),
  prioridad: z.enum(["alta", "media", "baja"]).default("media"),
  agentes: z.array(z.string()).min(1, "Debe seleccionar al menos un usuario"),
  categoria: z.enum(["reunion", "entrega", "seguimiento", "otro"]).default("otro"),
});

type TareaFormValues = z.infer<typeof tareaSchema>;

interface TareaFormProps {
  tareaInicial?: CalendarioTarea;
  onSubmit: (tarea: Partial<CalendarioTarea>) => void;
  onCancel: () => void;
  usuarios: UsuarioCalendario[];
}

export const TareaForm = ({ tareaInicial, onSubmit, onCancel, usuarios }: TareaFormProps) => {
  const [subtareas, setSubtareas] = useState<CalendarioSubtarea[]>([]);
  const [activeTab, setActiveTab] = useState("detalles");

  // Preparar valores iniciales del formulario
  const getValoresIniciales = (): TareaFormValues => {
    if (tareaInicial) {
      return {
        titulo: tareaInicial.titulo,
        descripcion: tareaInicial.descripcion || "",
        fechaInicio: format(tareaInicial.fechaInicio, "yyyy-MM-dd"),
        horaInicio: tareaInicial.todoElDia ? undefined : format(tareaInicial.fechaInicio, "HH:mm"),
        fechaFin: tareaInicial.fechaFin ? format(tareaInicial.fechaFin, "yyyy-MM-dd") : undefined,
        horaFin: tareaInicial.fechaFin && !tareaInicial.todoElDia ? format(tareaInicial.fechaFin, "HH:mm") : undefined,
        todoElDia: tareaInicial.todoElDia,
        completada: tareaInicial.completada,
        prioridad: tareaInicial.prioridad,
        agentes: tareaInicial.agentes,
        categoria: tareaInicial.categoria,
      };
    }

    return {
      titulo: "",
      descripcion: "",
      fechaInicio: format(new Date(), "yyyy-MM-dd"),
      horaInicio: format(new Date(), "HH:mm"),
      fechaFin: undefined,
      horaFin: undefined,
      todoElDia: false,
      completada: false,
      prioridad: "media",
      agentes: [],
      categoria: "otro",
    };
  };

  const form = useForm<TareaFormValues>({
    resolver: zodResolver(tareaSchema),
    defaultValues: getValoresIniciales(),
  });

  // Este efecto actualiza el formulario cuando cambia la tarea inicial
  useEffect(() => {
    if (tareaInicial) {
      form.reset(getValoresIniciales());
      setSubtareas(tareaInicial.subtareas || []);
    } else {
      setSubtareas([]);
    }
  }, [tareaInicial]);

  const handleSubmit = (values: TareaFormValues) => {
    // Construir fechas
    const fechaInicio = new Date(values.fechaInicio);
    if (values.horaInicio && !values.todoElDia) {
      const [horas, minutos] = values.horaInicio.split(":").map(Number);
      fechaInicio.setHours(horas, minutos);
    } else {
      fechaInicio.setHours(0, 0, 0, 0);
    }

    let fechaFin = undefined;
    if (values.fechaFin) {
      fechaFin = new Date(values.fechaFin);
      if (values.horaFin && !values.todoElDia) {
        const [horas, minutos] = values.horaFin.split(":").map(Number);
        fechaFin.setHours(horas, minutos);
      } else {
        fechaFin.setHours(23, 59, 59, 999);
      }
    }

    // Preparar datos para enviar
    const tareaDatos: Partial<CalendarioTarea> = {
      titulo: values.titulo,
      descripcion: values.descripcion,
      fechaInicio,
      fechaFin,
      todoElDia: values.todoElDia,
      completada: values.completada,
      prioridad: values.prioridad,
      agentes: values.agentes,
      categoria: values.categoria,
      subtareas: subtareas
    };

    onSubmit(tareaDatos);
  };

  const handleAgregarSubtarea = (nuevaSubtarea: Omit<CalendarioSubtarea, "id" | "tareaId">) => {
    setSubtareas(prev => [
      ...prev,
      {
        id: `temp-${Date.now()}`, // ID temporal, se reemplazará en el servidor
        tareaId: tareaInicial?.id || '', // Provide the tareaId, empty string for new tasks
        ...nuevaSubtarea
      }
    ]);
  };

  const handleToggleSubtarea = (subtareaId: string, completada: boolean) => {
    setSubtareas(prev => prev.map(s => s.id === subtareaId ? { ...s, completada } : s));
  };

  const handleEliminarSubtarea = (subtareaId: string) => {
    setSubtareas(prev => prev.filter(s => s.id !== subtareaId));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="detalles" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Detalles de tarea
            </TabsTrigger>
            <TabsTrigger value="subtareas" className="flex items-center gap-2">
              <ListTodo className="h-4 w-4" />
              Subtareas ({subtareas.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="detalles" className="space-y-4">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título de la tarea" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descripción de la tarea" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fechaInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de inicio</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!form.watch("todoElDia") && (
                <FormField
                  control={form.control}
                  name="horaInicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de inicio</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fechaFin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de fin (opcional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!form.watch("todoElDia") && (
                <FormField
                  control={form.control}
                  name="horaFin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de fin (opcional)</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="todoElDia"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Todo el día</FormLabel>
                      <FormDescription>
                        Marcar si la tarea ocupa todo el día
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="completada"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Completada</FormLabel>
                      <FormDescription>
                        Marcar si la tarea ya fue completada
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="prioridad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridad</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona prioridad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="baja">Baja</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="reunion">Reunión</SelectItem>
                        <SelectItem value="entrega">Entrega</SelectItem>
                        <SelectItem value="seguimiento">Seguimiento</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="agentes"
              render={() => (
                <FormItem>
                  <FormLabel>Usuarios asignados</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {usuarios.map((usuario) => (
                      <FormField
                        key={usuario.id}
                        control={form.control}
                        name="agentes"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={usuario.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(usuario.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, usuario.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== usuario.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{ backgroundColor: usuario.color }}
                                ></div>
                                {usuario.nombre} {usuario.apellido}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="subtareas" className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Subtareas</h3>
              <p className="text-sm text-gray-600 mb-4">
                Agrega subtareas para dividir esta tarea en partes más pequeñas y gestionables
              </p>
              
              <SubtareasList 
                subtareas={subtareas}
                onToggleCompletada={handleToggleSubtarea}
                onEliminar={handleEliminarSubtarea}
              />
              
              <SubtareaForm onAgregar={handleAgregarSubtarea} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {tareaInicial ? "Actualizar" : "Crear"} Tarea
          </Button>
        </div>
      </form>
    </Form>
  );
};
