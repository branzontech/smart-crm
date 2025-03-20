
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
        console.log("Checking session...");
        const { data: { session: activeSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          return;
        }
        
        console.log("Session check result:", activeSession ? "Session found" : "No session");
        setSession(activeSession);
        
        if (activeSession) {
          await fetchUserProfile(activeSession.user.id);
        }
      } catch (error) {
        console.error("Error in checkSession:", error);
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
          console.log("User signed in, fetching profile...");
          await fetchUserProfile(newSession.user.id);
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out");
          setUser(null);
        }
      }
    );

    // Cleanup subscription
    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching user profile for ID:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }

      if (data) {
        console.log("User profile found:", data);
        setUser(data as User);
      } else {
        console.log("No user profile found");
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    }
  };

  // Login function
  const login = async (email: string, password: string, remember: boolean) => {
    setIsLoading(true);
    
    try {
      console.log("Attempting login for email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error);
        toast.error(`Error de inicio de sesión: ${error.message}`);
        throw error;
      }
      
      console.log("Login successful");
      toast.success("Inicio de sesión exitoso");
      // Session and user will be updated via the auth state change listener
    } catch (error) {
      console.error("Error during login:", error);
      if (error instanceof Error) {
        toast.error(`Error de inicio de sesión: ${error.message}`);
      } else {
        toast.error("Error de inicio de sesión desconocido");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signup = async (email: string, password: string, userData: any) => {
    setIsLoading(true);
    
    try {
      console.log("Attempting signup for email:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      
      if (error) {
        console.error("Signup error:", error);
        toast.error(`Error de registro: ${error.message}`);
        throw error;
      }
      
      console.log("Signup successful");
      toast.success("Registro exitoso");
      // Session and user will be updated via the auth state change listener
    } catch (error) {
      console.error("Error during signup:", error);
      if (error instanceof Error) {
        toast.error(`Error de registro: ${error.message}`);
      } else {
        toast.error("Error de registro desconocido");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    
    try {
      console.log("Attempting logout");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        toast.error(`Error al cerrar sesión: ${error.message}`);
        throw error;
      }
      
      console.log("Logout successful");
      toast.success("Sesión cerrada exitosamente");
      // Session and user will be updated via the auth state change listener
    } catch (error) {
      console.error("Error during logout:", error);
      if (error instanceof Error) {
        toast.error(`Error al cerrar sesión: ${error.message}`);
      } else {
        toast.error("Error al cerrar sesión");
      }
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
