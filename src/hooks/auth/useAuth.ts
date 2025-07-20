import { useCallback, useEffect } from 'react';
import { useAuthStore } from 'store/features/auth/useAuthStore';
import { AuthService } from 'services/auth/auth.service';
import { AuthContextType } from 'types/auth/Auth.type';

export const useAuth = (): AuthContextType => {
  const {
    isAuthenticated,
    user,
    token,
    isLoading,
    error,
    setAuthenticated,
    setUser,
    setToken,
    setLoading,
    setError,
    clearError,
    reset,
  } = useAuthStore();

  /**
   * Initialize authentication state from localStorage
   */
  const initializeAuth = useCallback(async () => {
    const storedToken = AuthService.getStoredToken();
    const storedUser = AuthService.getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      
      // Validate token with backend
      try {
        const validation = await AuthService.validateToken(storedToken);
        if (validation.valid && validation.user) {
          setAuthenticated(true);
          setUser(validation.user);
          AuthService.storeUser(validation.user);
        } else {
          // Token is invalid, clear everything
          AuthService.removeToken();
          reset();
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        AuthService.removeToken();
        reset();
      }
    }
  }, [setToken, setUser, setAuthenticated, reset]);

  /**
   * Handle login - redirects to GitHub OAuth
   */
  const login = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const loginInfo = await AuthService.getLoginInfo();
      
      // Get the full backend URL and construct the OAuth URL
      const backendUrl = import.meta.env.VITE_API_URL;
      const oauthUrl = `${backendUrl}${loginInfo.githubLoginUrl}`;
      
      // Redirect to GitHub OAuth
      window.location.href = oauthUrl;
    } catch (error) {
      console.error('❌ Login error:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
      setLoading(false);
    }
  }, [setLoading, setError]);

  /**
   * Handle logout
   */
  const logout = useCallback(() => {
    AuthService.removeToken();
    reset();
  }, [reset]);

  /**
   * Validate current token
   */
  const validateToken = useCallback(async (): Promise<boolean> => {
    const currentToken = token || AuthService.getStoredToken();
    
    if (!currentToken) {
      return false;
    }

    try {
      const validation = await AuthService.validateToken(currentToken);
      if (validation.valid && validation.user) {
        setAuthenticated(true);
        setUser(validation.user);
        setToken(currentToken);
        AuthService.storeUser(validation.user);
        return true;
      }
    } catch (error) {
      console.error('Token validation error:', error);
    }
    
    return false;
  }, [token, setAuthenticated, setUser, setToken]);

  /**
   * Handle successful OAuth callback
   * This will be called when the user returns from GitHub OAuth
   */
  const handleOAuthCallback = useCallback(async (authToken: string) => {
    setLoading(true);
    setError(null);

    try {
      // Store the token
      AuthService.storeToken(authToken);
      setToken(authToken);

      // Get user information
      const user = await AuthService.getCurrentUser(authToken);
      setUser(user);
      AuthService.storeUser(user);
      
      setAuthenticated(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Authentication failed');
      logout();
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setToken, setUser, setAuthenticated, logout]);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    isAuthenticated,
    user,
    token,
    isLoading,
    error,
    login,
    logout,
    validateToken,
    clearError,
    handleOAuthCallback,
  };
};
