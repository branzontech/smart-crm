
import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: ReactNode;
}

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Log connection status in development mode
  useEffect(() => {
    if (isDevelopment) {
      // Check the Supabase connection
      const checkConnection = async () => {
        try {
          // Make a simple query to validate connection
          const { data, error } = await supabase.from('clientes').select('count(*)', { count: 'exact' });
          if (error) {
            console.error('Supabase connection error:', error);
          } else {
            console.log('Supabase connection successful:', data);
          }
        } catch (err) {
          console.error('Supabase connection exception:', err);
        }
      };
      
      checkConnection();
    }
  }, []);

  // In development mode, skip authentication check
  if (isDevelopment) {
    return <>{children}</>;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;
