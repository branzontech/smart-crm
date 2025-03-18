
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { handleSupabaseError } from "@/utils/supabaseHelpers";

export type User = {
  id: string;
  email: string;
  username: string;
  nombre: string;
  apellido: string;
};

// Obtener todos los usuarios
export const getUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, username, nombre, apellido")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as User[];
  } catch (error) {
    handleSupabaseError(error, "Error al obtener usuarios");
    return [];
  }
};

// Crear un nuevo usuario
export const createUser = async (
  email: string,
  password: string,
  userData: {
    nombre: string;
    apellido: string;
    username?: string;
  }
): Promise<User | null> => {
  try {
    // Primero creamos el usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (authError) throw authError;

    // El perfil se creará automáticamente mediante el trigger en Supabase
    toast.success("Usuario creado exitosamente");
    
    if (!authData.user) {
      return null;
    }

    return {
      id: authData.user.id,
      email,
      username: userData.username || email.split("@")[0],
      nombre: userData.nombre,
      apellido: userData.apellido,
    };
  } catch (error) {
    handleSupabaseError(error, "Error al crear usuario");
    return null;
  }
};

// Eliminar un usuario
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    // Eliminar usuario en Auth (esto también eliminará el perfil debido a la cascada)
    const { error } = await supabase.auth.admin.deleteUser(userId);
    
    if (error) throw error;
    
    toast.success("Usuario eliminado exitosamente");
    return true;
  } catch (error) {
    handleSupabaseError(error, "Error al eliminar usuario");
    return false;
  }
};
