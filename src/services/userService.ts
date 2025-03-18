
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type UserRole = 'Administrador' | 'Agente' | 'Contratista' | 'Pagador' | 'Financiero';

export interface User {
  id: string;
  email: string;
  username?: string;
  nombre?: string;
  apellido?: string;
  rol: string;
  rol_usuario: UserRole;
  created_at: string;
}

export interface NewUserData {
  email: string;
  password: string;
  username: string;
  nombre: string;
  apellido: string;
  rol_usuario: UserRole;
}

export const userService = {
  /**
   * Obtener listado de usuarios
   */
  async getUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error al obtener usuarios:", error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error("Error en getUsers:", error);
      throw error;
    }
  },

  /**
   * Crear un nuevo usuario
   */
  async createUser(userData: NewUserData): Promise<User | null> {
    try {
      // 1. Crear usuario en auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          username: userData.username,
          nombre: userData.nombre,
          apellido: userData.apellido,
          rol_usuario: userData.rol_usuario
        }
      });

      if (authError) {
        console.error("Error al crear usuario en auth:", authError);
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error("No se pudo crear el usuario");
      }

      // El perfil se crea automáticamente mediante el trigger handle_new_user
      
      // 2. Recuperar el perfil creado
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error("Error al obtener el perfil creado:", profileError);
        // No lanzamos error aquí porque el usuario ya fue creado
      }

      return profileData || null;
    } catch (error) {
      console.error("Error en createUser:", error);
      throw error;
    }
  },
  
  /**
   * Eliminar un usuario
   */
  async deleteUser(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) {
        console.error("Error al eliminar usuario:", error);
        throw new Error(error.message);
      }
      
      return true;
    } catch (error) {
      console.error("Error en deleteUser:", error);
      throw error;
    }
  },
  
  /**
   * Actualizar rol de usuario
   */
  async updateUserRole(userId: string, role: UserRole): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ rol_usuario: role })
        .eq('id', userId)
        .select()
        .single();
        
      if (error) {
        console.error("Error al actualizar rol de usuario:", error);
        throw new Error(error.message);
      }
      
      return data;
    } catch (error) {
      console.error("Error en updateUserRole:", error);
      throw error;
    }
  }
};
