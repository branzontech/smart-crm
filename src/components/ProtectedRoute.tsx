
import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, testSupabaseConnection } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: ReactNode;
}

// Set this to true to bypass authentication during development
const DEVELOPMENT_MODE = true;

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [connectionTested, setConnectionTested] = useState(false);
  const [connectionOk, setConnectionOk] = useState(false);

  // Test Supabase connection on mount
  useEffect(() => {
    const testConnection = async () => {
      const isConnected = await testSupabaseConnection();
      setConnectionOk(isConnected);
      setConnectionTested(true);
      
      if (!isConnected) {
        toast.error('No se pudo conectar a la base de datos. Revise la consola para más detalles.');
      }
    };

    testConnection();
    
    // Log current auth state
    const logSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log('Current session:', data.session);
    };
    
    logSession();
  }, []);

  // Show loading state
  if (isLoading && !DEVELOPMENT_MODE) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  // Show connection testing state
  if (!connectionTested && !DEVELOPMENT_MODE) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-2">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        <p className="text-gray-600">Probando conexión a la base de datos...</p>
      </div>
    );
  }

  // Show connection error
  if (connectionTested && !connectionOk && !DEVELOPMENT_MODE) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <div className="text-red-500 text-5xl">⚠️</div>
        <h2 className="text-xl font-bold text-red-700">Error de conexión</h2>
        <p className="text-gray-600">No se pudo conectar a la base de datos.</p>
        <p className="text-gray-500">Revise la consola del navegador para más detalles.</p>
      </div>
    );
  }

  // If in development mode, always render children
  if (DEVELOPMENT_MODE) {
    return <>{children}</>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;
