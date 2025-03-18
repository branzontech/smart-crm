
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
        console.log("Checking for active session...");
        const { data: { session: activeSession } } = await supabase.auth.getSession();
        setSession(activeSession);
        
        if (activeSession) {
          console.log("Session found, fetching user profile...");
          await fetchUserProfile(activeSession.user.id);
        } else {
          console.log("No active session found");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
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
          console.log("User signed out, clearing user data");
          setUser(null);
          setIsLoading(false);
        } else {
          // Make sure we set loading to false for other auth events too
          setIsLoading(false);
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
      console.log("Fetching user profile for ID:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      if (data) {
        console.log("User profile found:", data);
        setUser(data as User);
      } else {
        console.log("No user profile found for ID:", userId);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string, remember: boolean): Promise<void> => {
    try {
      console.log("Attempting login for:", email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error);
        setIsLoading(false); // Make sure to set loading to false on error
        throw error;
      }
      
      console.log("Login successful:", data);
      // Don't set isLoading to false here, as the auth state change listener will handle it
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      setIsLoading(false); // Make sure to set loading to false on error
      throw error;
    }
  };

  // Sign up function
  const signup = async (email: string, password: string, userData: any): Promise<void> => {
    try {
      console.log("Attempting signup for:", email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      
      if (error) {
        console.error("Signup error:", error);
        setIsLoading(false); // Make sure to set loading to false on error
        throw error;
      }
      
      console.log("Signup successful:", data);
      // Don't set isLoading to false here, as the auth state change listener will handle it
    } catch (error) {
      console.error("Error de registro:", error);
      setIsLoading(false); // Make sure to set loading to false on error
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log("Logging out...");
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        setIsLoading(false); // Make sure to set loading to false on error
        throw error;
      }
      
      console.log("Logout successful");
      // Don't set isLoading to false here, as the auth state change listener will handle it
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setIsLoading(false); // Make sure to set loading to false on error
      toast.error("Error al cerrar sesión");
    }
  };

  // Context values
  const value: AuthContextType = {
    user,
    session,
    isAuthenticated: !!session && !!user,
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
