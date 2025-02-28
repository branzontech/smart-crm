
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { cuentaCobroService } from "@/services/cuentaCobroService";
import { CuentaCobroFormData } from "@/types/cuentacobro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";

// Esquema de validación con Zod
const cuentaCobroSchema = z.object({
  fechaEmision: z.string().nonempty("La fecha de emisión es requerida"),
  emisor: z.object({
    nombre: z.string().nonempty("El nombre del emisor es requerido"),
    ciudad: z.string().nonempty("La ciudad es requerida"),
    telefono: z.string().nonempty("El teléfono es requerido"),
    email: z.string().email("Correo electrónico inválido").nonempty("El correo es requerido"),
    documento: z.string().optional(),
  }),
  receptor: z.object({
    empresa: z.string().nonempty("El nombre de la empresa es requerido"),
    direccion: z.string().nonempty("La dirección es requerida"),
    ciudad: z.string().nonempty("La ciudad es requerida"),
  }),
  periodo: z.object({
    desde: z.string().nonempty("La fecha de inicio es requerida"),
    hasta: z.string().nonempty("La fecha final es requerida"),
  }),
  servicio: z.object({
    descripcion: z.string().nonempty("La descripción del servicio es requerida"),
    proyecto: z.string().optional(),
    fase: z.string().optional(),
    ordenCompra: z.string().optional(),
  }),
  valor: z.object({
    monto: z.number().positive("El valor debe ser mayor a cero"),
  }),
  datosPago: z.object({
    banco: z.string().nonempty("El banco es requerido"),
    tipoCuenta: z.string().nonempty("El tipo de cuenta es requerido"),
    numeroCuenta: z.string().nonempty("El número de cuenta es requerido"),
    titular: z.string().nonempty("El titular de la cuenta es requerido"),
  }),
  fechaVencimiento: z.string().optional(),
  notas: z.string().optional(),
});

export default function NuevaCuentaCobro() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Configurar formulario con react-hook-form y zod
  const form = useForm<z.infer<typeof cuentaCobroSchema>>({
    resolver: zodResolver(cuentaCobroSchema),
    defaultValues: {
      fechaEmision: new Date().toLocaleDateString('en-CA'),
      emisor: {
        nombre: "",
        ciudad: "",
        telefono: "",
        email: "",
        documento: "",
      },
      receptor: {
        empresa: "",
        direccion: "",
        ciudad: "",
      },
      periodo: {
        desde: "",
        hasta: "",
      },
      servicio: {
        descripcion: "",
        proyecto: "",
        fase: "",
        ordenCompra: "",
      },
      valor: {
        monto: 0,
      },
      datosPago: {
        banco: "",
        tipoCuenta: "",
        numeroCuenta: "",
        titular: "",
      },
      fechaVencimiento: "",
      notas: "",
    },
  });

  const onSubmit = (data: z.infer<typeof cuentaCobroSchema>) => {
    try {
      // Aquí está el problema: necesitamos asegurarnos de que todos los campos requeridos estén presentes
      // Creamos un objeto que corresponde exactamente al tipo CuentaCobroFormData
      const formData: CuentaCobroFormData = {
        fechaEmision: data.fechaEmision,
        emisor: {
          nombre: data.emisor.nombre,
          ciudad: data.emisor.ciudad,
          telefono: data.emisor.telefono,
          email: data.emisor.email,
          documento: data.emisor.documento,
        },
        receptor: {
          empresa: data.receptor.empresa,
          direccion: data.receptor.direccion,
          ciudad: data.receptor.ciudad,
        },
        periodo: {
          desde: data.periodo.desde,
          hasta: data.periodo.hasta,
        },
        servicio: {
          descripcion: data.servicio.descripcion,
          proyecto: data.servicio.proyecto,
          fase: data.servicio.fase,
          ordenCompra: data.servicio.ordenCompra,
        },
        valor: {
          monto: Number(data.valor.monto),
        },
        datosPago: {
          banco: data.datosPago.banco,
          tipoCuenta: data.datosPago.tipoCuenta,
          numeroCuenta: data.datosPago.numeroCuenta,
          titular: data.datosPago.titular,
        },
        fechaVencimiento: data.fechaVencimiento,
        notas: data.notas,
      };

      // Crear la cuenta de cobro
      const nuevaCuenta = cuentaCobroService.create(formData);

      // Mostrar mensaje de éxito
      toast({
        title: "Cuenta de cobro creada",
        description: `La cuenta de cobro ${nuevaCuenta.id} ha sido creada exitosamente.`,
      });

      // Redirigir a la lista de cuentas de cobro
      navigate("/cuentas-cobro");
    } catch (error) {
      console.error("Error al crear la cuenta de cobro:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al crear la cuenta de cobro. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <div className="main-container pt-[var(--header-height)]">
        <Header />
        <main className="flex-1 content-container">
          <div className="max-w-content">
            <Button 
              variant="ghost" 
              className="mb-4"
              onClick={() => navigate("/cuentas-cobro")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver
            </Button>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Nueva Cuenta de Cobro</h1>
                <p className="text-gray-500">Completa el formulario para crear una nueva cuenta de cobro</p>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Información general */}
                <Card>
                  <CardHeader>
                    <CardTitle>Información General</CardTitle>
                    <CardDescription>Datos básicos de la cuenta de cobro</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fechaEmision"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de emisión</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Información del emisor */}
                <Card>
                  <CardHeader>
                    <CardTitle>Emisor</CardTitle>
                    <CardDescription>Información de quien emite la cuenta de cobro</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="emisor.nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre y apellidos" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="emisor.ciudad"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ciudad</FormLabel>
                            <FormControl>
                              <Input placeholder="Ciudad" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="emisor.documento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Documento de identidad (opcional)</FormLabel>
                            <FormControl>
                              <Input placeholder="CC 123456789" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="emisor.telefono"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teléfono</FormLabel>
                            <FormControl>
                              <Input placeholder="Teléfono de contacto" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="emisor.email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Correo electrónico</FormLabel>
                            <FormControl>
                              <Input placeholder="correo@ejemplo.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Información del receptor */}
                <Card>
                  <CardHeader>
                    <CardTitle>Receptor</CardTitle>
                    <CardDescription>Información de la empresa a quien se emite la cuenta</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="receptor.empresa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de la empresa</FormLabel>
                          <FormControl>
                            <Input placeholder="Empresa S.A.S." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="receptor.direccion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dirección</FormLabel>
                          <FormControl>
                            <Input placeholder="Dirección completa" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="receptor.ciudad"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ciudad</FormLabel>
                          <FormControl>
                            <Input placeholder="Ciudad" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Información del servicio */}
                <Card>
                  <CardHeader>
                    <CardTitle>Servicio</CardTitle>
                    <CardDescription>Detalles del servicio prestado</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="periodo.desde"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Periodo desde</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Enero 01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="periodo.hasta"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Periodo hasta</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Enero 31" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="servicio.descripcion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción del servicio</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descripción detallada del servicio prestado" 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="servicio.proyecto"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Proyecto (opcional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre del proyecto" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="servicio.fase"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fase (opcional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Fase 1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="servicio.ordenCompra"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Orden de compra (opcional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: OC-12345" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="valor.monto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor a cobrar</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Monto en pesos"
                              min="0"
                              step="1000" 
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            El valor en texto se generará automáticamente
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Información de pago */}
                <Card>
                  <CardHeader>
                    <CardTitle>Datos de Pago</CardTitle>
                    <CardDescription>Información bancaria para recibir el pago</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="datosPago.banco"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Banco</FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre del banco" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="datosPago.tipoCuenta"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de cuenta</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Ahorros, Corriente" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="datosPago.numeroCuenta"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de cuenta</FormLabel>
                            <FormControl>
                              <Input placeholder="Número de cuenta bancaria" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="datosPago.titular"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Titular de la cuenta</FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre completo del titular" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="fechaVencimiento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de vencimiento (opcional)</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notas adicionales (opcional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Notas o información adicional" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Botones de acción */}
                <div className="flex justify-end gap-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate("/cuentas-cobro")}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-teal hover:bg-teal/90">
                    <Save className="mr-2 h-4 w-4" /> Guardar Cuenta de Cobro
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </main>
      </div>
    </div>
  );
}
