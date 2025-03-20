
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface CreateUserDialogProps {
  onUserCreated: () => void;
}

const formSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre es obligatorio" }),
  apellido: z.string().min(2, { message: "El apellido es obligatorio" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export const CreateUserDialog = ({ onUserCreated }: CreateUserDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      console.log("Iniciando creación de usuario con datos:", { 
        email: values.email, 
        nombre: values.nombre, 
        apellido: values.apellido 
      });
      
      // First, create the user in auth system without metadata
      // This avoids triggering problematic database triggers
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (authError) {
        console.error("Error en autenticación:", authError);
        throw authError;
      }

      console.log("Usuario creado en sistema de autenticación:", authData);

      // Check if we have user data to confirm success
      if (authData && authData.user) {
        console.log("Insertando en tabla profiles para ID:", authData.user.id);
        
        // Manually insert the user into the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: values.email,
            nombre: values.nombre,
            apellido: values.apellido,
            rol: 'user',
            username: values.email.split('@')[0], // Create a simple username from email
          });

        if (profileError) {
          console.error("Error insertando perfil:", profileError);
          // Continue anyway as the user was created in auth
        } else {
          console.log("Perfil creado exitosamente");
        }

        setOpen(false);
        form.reset();
        toast({
          title: "Usuario creado con éxito",
          description: "El usuario ha sido registrado correctamente.",
        });
        onUserCreated();
      } else {
        // Sometimes Supabase returns success but without user data
        console.log("Supabase devolvió éxito pero sin datos de usuario");
        toast({
          title: "Usuario pendiente de confirmación",
          description: "Se ha enviado un correo de confirmación al usuario.",
        });
        setOpen(false);
        form.reset();
        onUserCreated();
      }
    } catch (error: any) {
      console.error("Error detallado al crear usuario:", error);
      if (error.message) {
        console.error("Mensaje de error:", error.message);
      }
      if (error.details) {
        console.error("Detalles del error:", error.details);
      }
      if (error.code) {
        console.error("Código de error:", error.code);
      }
      
      let errorMessage = "No fue posible crear el usuario.";
      
      // Provide more specific error messages based on the error
      if (error.message.includes("duplicate key")) {
        errorMessage = "Ya existe un usuario con este email.";
      } else if (error.message.includes("invalid email")) {
        errorMessage = "El formato del email es inválido.";
      } else {
        errorMessage += " " + error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Nuevo Usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          <DialogDescription>
            Completa los datos para crear un nuevo usuario en el sistema.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apellido"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input placeholder="Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@ejemplo.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2">Creando...</span>
                    <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  </>
                ) : (
                  "Crear Usuario"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
