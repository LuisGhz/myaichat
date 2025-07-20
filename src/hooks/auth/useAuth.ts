import { useCallback, useEffect } from 'react';
import { useAuthStore } from 'store/features/auth/useAuthStore';
import {
  getStoredTokenService,
  getStoredUserService,
  validateTokenService,
  getLoginInfoService,
  storeTokenService,
  storeUserService,
  getCurrentUserService,
  removeTokenService,
} from 'services/auth/auth.service';
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
    const storedToken = getStoredTokenService();
    const storedUser = getStoredUserService();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      // Validate token with backend
      try {
        const validation = await validateTokenService(storedToken);
        if (validation.valid && validation.user) {
          setAuthenticated(true);
          setUser(validation.user);
          storeUserService(validation.user);
        } else {
          // Token is invalid, clear everything
          removeTokenService();
          reset();
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        removeTokenService();
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
      const loginInfo = await getLoginInfoService();
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
    removeTokenService();
    reset();
  }, [reset]);

  /**
   * Validate current token
   */
  const validateToken = useCallback(async (): Promise<boolean> => {
    const currentToken = token || getStoredTokenService();
    if (!currentToken) {
      return false;
    }
    try {
      const validation = await validateTokenService(currentToken);
      if (validation.valid && validation.user) {
        setAuthenticated(true);
        setUser(validation.user);
        setToken(currentToken);
        storeUserService(validation.user);
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
      storeTokenService(authToken);
      setToken(authToken);
      // Get user information
      const user = await getCurrentUserService(authToken);
      setUser(user);
      storeUserService(user);
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
