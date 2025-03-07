
import React, { createContext, useState, useContext, ReactNode } from "react";

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
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, remember: boolean) => Promise<void>;
  logout: () => Promise<void>;
};

// Default context values
const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  logout: async () => {},
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Login function (mock implementation)
  const login = async (username: string, password: string, remember: boolean) => {
    setIsLoading(true);
    
    try {
      // Este es un login simulado, será reemplazado con la implementación real
      // de autenticación cuando esté disponible
      console.log("Login attempt:", { username, password, remember });
      
      // Simulamos un retraso de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulamos un usuario autenticado
      const mockUser: User = {
        id: "1",
        username,
        nombre: "Usuario",
        apellido: "Prueba",
        email: "usuario@ejemplo.com",
        rol: "admin",
      };
      
      setUser(mockUser);
      
      // Si remember está activo, guardaríamos el token en localStorage
      // en lugar de sessionStorage en una implementación real
      if (remember) {
        console.log("Guardando sesión para recordar al usuario");
      }
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Simulamos un retraso de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Limpiar el estado de usuario
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Context values
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
