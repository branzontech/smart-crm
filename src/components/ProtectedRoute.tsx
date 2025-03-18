
import { ReactNode, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDevMode } from '@/contexts/DevModeContext';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { isDevelopmentMode } = useDevMode();
  const navigate = useNavigate();

  // Debug info
  useEffect(() => {
    console.log('Protected Route State:', { 
      isAuthenticated, 
      isLoading, 
      isDevelopmentMode,
      user: user ? `${user.nombre} ${user.apellido}` : 'No user'
    });
  }, [isAuthenticated, isLoading, isDevelopmentMode, user]);

  // In development mode, bypass authentication
  if (isDevelopmentMode) {
    console.log('Development mode active: bypassing authentication');
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

  // If not authenticated and not in development mode, redirect to login
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    toast.error('Sesión no válida. Por favor inicia sesión.');
    return <Navigate to="/auth/login" replace />;
  }

  // If authenticated, render children
  console.log('User authenticated, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
