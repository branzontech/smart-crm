
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";

// Define user types
type User = {
  id: string;
  username: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
};

// Auth context state
type AuthContextType = {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, userData: any) => Promise<void>;
};

// Default context values
const defaultContext: AuthContextType = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  signup: async () => {},
};

// Create context
const AuthContext = createContext<AuthContextType>(defaultContext);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for active session on component mount
    const checkSession = async () => {
      try {
        console.log("Verificando sesión existente...");
        const { data: { session: activeSession } } = await supabase.auth.getSession();
        setSession(activeSession);
        
        if (activeSession) {
          console.log("Sesión encontrada, obteniendo perfil de usuario...");
          await fetchUserProfile(activeSession.user.id);
        } else {
          console.log("No hay sesión activa");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event);
        setSession(newSession);
        
        if (event === "SIGNED_IN" && newSession) {
          toast.info("Sesión iniciada");
          await fetchUserProfile(newSession.user.id);
        } else if (event === "SIGNED_OUT") {
          toast.info("Sesión cerrada");
          setUser(null);
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Obteniendo perfil para el usuario:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        console.log("Perfil encontrado:", data);
        setUser(data as User);
      } else {
        console.log("No se encontró perfil para este usuario");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Login function
  const login = async (email: string, password: string, remember: boolean) => {
    setIsLoading(true);
    
    try {
      console.log("Intentando iniciar sesión con email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      console.log("Login exitoso:", data);
      // Session and user will be updated via the auth state change listener
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signup = async (email: string, password: string, userData: any) => {
    setIsLoading(true);
    
    try {
      console.log("Registrando nuevo usuario:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      
      if (error) throw error;
      
      console.log("Registro exitoso:", data);
      // Session and user will be updated via the auth state change listener
    } catch (error) {
      console.error("Error de registro:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    
    try {
      console.log("Cerrando sesión...");
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      console.log("Sesión cerrada correctamente");
      // Session and user will be updated via the auth state change listener
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Context values
  const value = {
    user,
    session,
    isAuthenticated: !!session,
    isLoading,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
