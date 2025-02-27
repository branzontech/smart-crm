
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Navbar } from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Save, Trash2, Search } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Datos de ejemplo (en una aplicación real vendrían de una API)
const clientes = [
  { id: 1, nombre: "Juan Pérez" },
  { id: 2, nombre: "María García" },
  { id: 3, nombre: "Carlos López" },
];

const proveedores = [
  { id: 1, nombre: "Suministros Industriales S.A." },
  { id: 2, nombre: "Juan Pérez Distribuciones" },
];

const recaudoSchema = z.object({
  numeroRecaudo: z.string(),
  clienteId: z.number(),
  articulos: z.array(z.object({
    descripcion: z.string().min(1, "La descripción es requerida"),
    cantidad: z.number().min(1, "La cantidad debe ser mayor a 0"),
    proveedorId: z.number(),
    precio: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  })),
  aplicaIVA: z.boolean().default(false),
});

type RecaudoForm = z.infer<typeof recaudoSchema>;

export default function NuevoRecaudo() {
  const navigate = useNavigate();
  const [clienteSearch, setClienteSearch] = useState("");
  const [proveedorSearches, setProveedorSearches] = useState<{ [key: number]: string }>({});

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(clienteSearch.toLowerCase())
  );

  const getFilteredProveedores = (search: string) =>
    proveedores.filter(proveedor =>
      proveedor.nombre.toLowerCase().includes(search.toLowerCase())
    );

  const form = useForm<RecaudoForm>({
    resolver: zodResolver(recaudoSchema),
    defaultValues: {
      numeroRecaudo: "0001", // En un caso real, esto vendría del backend
      aplicaIVA: false,
      articulos: [
        {
          descripcion: "",
          cantidad: 1,
          proveedorId: 0,
          precio: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "articulos",
    control: form.control,
  });

  const watchArticulos = form.watch("articulos");
  const watchAplicaIVA = form.watch("aplicaIVA");

  const calcularSubtotal = () => {
    return watchArticulos.reduce((acc, articulo) => {
      return acc + (articulo.cantidad * articulo.precio);
    }, 0);
  };

  const calcularIVA = () => {
    return watchAplicaIVA ? calcularSubtotal() * 0.19 : 0;
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularIVA();
  };

  const onSubmit = async (data: RecaudoForm) => {
    try {
      console.log(data);
      toast.success("Recaudo creado exitosamente");
      navigate("/recaudos");
    } catch (error) {
      toast.error("Error al crear el recaudo");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              className="text-teal hover:text-sage hover:bg-mint/20"
              onClick={() => navigate("/recaudos")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al listado
            </Button>
            <Button
              onClick={() => form.reset()}
              className="bg-teal hover:bg-sage text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Recaudo
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Nuevo Recaudo N° {form.getValues("numeroRecaudo")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="clienteId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Cliente</FormLabel>
                        <div className="relative">
                          <Input
                            placeholder="Buscar cliente..."
                            value={clienteSearch}
                            onChange={(e) => setClienteSearch(e.target.value)}
                            className="w-full pr-10"
                          />
                          <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                          {clienteSearch && filteredClientes.length > 0 && (
                            <Card className="absolute z-10 w-full mt-1">
                              <CardContent className="p-2">
                                {filteredClientes.map((cliente) => (
                                  <Button
                                    key={cliente.id}
                                    variant="ghost"
                                    className="w-full justify-start text-left"
                                    onClick={() => {
                                      form.setValue("clienteId", cliente.id);
                                      setClienteSearch(cliente.nombre);
                                    }}
                                  >
                                    {cliente.nombre}
                                  </Button>
                                ))}
                              </CardContent>
                            </Card>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <Card key={field.id} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`articulos.${index}.descripcion`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Descripción del Artículo</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`articulos.${index}.cantidad`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cantidad</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(parseInt(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`articulos.${index}.precio`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Precio Unitario</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(parseFloat(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`articulos.${index}.proveedorId`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Proveedor</FormLabel>
                                <div className="relative">
                                  <Input
                                    placeholder="Buscar proveedor..."
                                    value={proveedorSearches[index] || ""}
                                    onChange={(e) => {
                                      setProveedorSearches({
                                        ...proveedorSearches,
                                        [index]: e.target.value,
                                      });
                                    }}
                                    className="w-full pr-10"
                                  />
                                  <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                                  {proveedorSearches[index] && getFilteredProveedores(proveedorSearches[index]).length > 0 && (
                                    <Card className="absolute z-10 w-full mt-1">
                                      <CardContent className="p-2">
                                        {getFilteredProveedores(proveedorSearches[index]).map((proveedor) => (
                                          <Button
                                            key={proveedor.id}
                                            variant="ghost"
                                            className="w-full justify-start text-left"
                                            onClick={() => {
                                              form.setValue(`articulos.${index}.proveedorId`, proveedor.id);
                                              setProveedorSearches({
                                                ...proveedorSearches,
                                                [index]: proveedor.nombre,
                                              });
                                            }}
                                          >
                                            {proveedor.nombre}
                                          </Button>
                                        ))}
                                      </CardContent>
                                    </Card>
                                  )}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            className="mt-2 text-red-600 hover:text-red-700"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar artículo
                          </Button>
                        )}
                      </Card>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        append({
                          descripcion: "",
                          cantidad: 1,
                          proveedorId: 0,
                          precio: 0,
                        })
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar artículo
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <FormField
                      control={form.control}
                      name="aplicaIVA"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="m-0">¿Aplica IVA? (19%)</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2 text-right">
                    <p className="text-gray-600">
                      Subtotal: ${calcularSubtotal().toLocaleString()}
                    </p>
                    {watchAplicaIVA && (
                      <p className="text-gray-600">
                        IVA (19%): ${calcularIVA().toLocaleString()}
                      </p>
                    )}
                    <p className="text-xl font-bold text-teal">
                      Total: ${calcularTotal().toLocaleString()}
                    </p>
                  </div>

                  <Button type="submit" className="w-full bg-teal hover:bg-sage">
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Recaudo
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
