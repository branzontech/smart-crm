
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre es obligatorio" }),
  apellido: z.string().min(2, { message: "El apellido es obligatorio" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export type RegisterFormValues = z.infer<typeof formSchema>;

interface RegisterFormProps {
  onSuccess: (userData: any) => void;
  onError?: (error: any) => void;
  submitButtonText?: string;
  showPasswordToggle?: boolean;
}

export const RegisterForm = ({ 
  onSuccess, 
  onError, 
  submitButtonText = "Registrarse",
  showPasswordToggle = true
}: RegisterFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setIsLoading(true);
      console.log("Iniciando registro de usuario con datos:", { 
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
        if (onError) onError(authError);
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
          if (onError) onError(profileError);
          // Continue anyway as the user was created in auth
        } else {
          console.log("Perfil creado exitosamente");
        }

        form.reset();
        toast({
          title: "Usuario creado con éxito",
          description: "El usuario ha sido registrado correctamente.",
        });
        onSuccess(authData.user);
      } else {
        // Sometimes Supabase returns success but without user data
        console.log("Supabase devolvió éxito pero sin datos de usuario");
        toast({
          title: "Usuario pendiente de confirmación",
          description: "Se ha enviado un correo de confirmación al usuario.",
        });
        form.reset();
        onSuccess({});
      }
    } catch (error: any) {
      console.error("Error detallado al crear usuario:", error);
      
      let errorMessage = "No fue posible crear el usuario.";
      
      // Provide more specific error messages based on the error
      if (error?.message?.includes("duplicate key")) {
        errorMessage = "Ya existe un usuario con este email.";
      } else if (error?.message?.includes("invalid email")) {
        errorMessage = "El formato del email es inválido.";
      } else if (error?.message) {
        errorMessage += " " + error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      
      if (onError) onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    {...field}
                    className={showPasswordToggle ? "pr-10" : ""}
                  />
                  {showPasswordToggle && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="mr-2">Creando...</span>
              <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
            </>
          ) : (
            submitButtonText
          )}
        </Button>
      </form>
    </Form>
  );
};
