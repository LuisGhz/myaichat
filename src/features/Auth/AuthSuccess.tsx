import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from 'hooks/auth/useAuth';

export const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const auth = useAuth();
  const { isLoading, error } = auth;
  const handleOAuthCallback = auth.handleOAuthCallback;

  useEffect(() => {
    const handleCallback = async () => {
      // Get token from URL parameters
      const token = searchParams.get('token');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        console.error('OAuth error:', errorParam);
        navigate('/auth/login?error=' + encodeURIComponent(errorParam));
        return;
      }

      if (token && handleOAuthCallback) {
        try {
          await handleOAuthCallback(token);
          // Redirect to home page after successful login
          navigate('/', { replace: true });
        } catch (error) {
          console.error('OAuth callback error:', error);
          navigate('/auth/login?error=' + encodeURIComponent('Authentication failed'));
        }
      } else {
        console.error('No token received in OAuth callback or callback handler not available');
        navigate('/auth/login?error=' + encodeURIComponent('No authentication token received'));
      }
    };

    handleCallback();
  }, [searchParams, handleOAuthCallback, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Authentication Error</p>
            <p>{error}</p>
          </div>
          <button
            onClick={() => navigate('/auth/login')}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};
