import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useOAuth2Hook } from 'hooks/auth/useOAuth2';

interface OAuth2ProtectedRouteProps {
  children: ReactNode;
}

export const OAuth2ProtectedRoute = ({ children }: OAuth2ProtectedRouteProps) => {
  const { token, loginInProgress } = useOAuth2Hook();
  const location = useLocation();

  // Show loading while checking authentication
  if (loginInProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
