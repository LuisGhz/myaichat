import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useSimpleAuth } from 'hooks/auth/useSimpleAuth';

interface SimpleProtectedRouteProps {
  children: ReactNode;
}

export const SimpleProtectedRoute = ({ children }: SimpleProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useSimpleAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Render protected content
  return <>{children}</>;
};
