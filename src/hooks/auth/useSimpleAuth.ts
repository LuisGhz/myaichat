import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  githubLogin?: string;
  avatarUrl?: string;
}

// Simple hook for authentication state management
export const useSimpleAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for authentication token and validate it
    const validateToken = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
          const response = await fetch(`${apiUrl}/auth/validate`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.valid && data.user) {
              setIsAuthenticated(true);
              setUser(data.user);
            } else {
              // Token is invalid, remove it
              localStorage.removeItem('auth_token');
              setIsAuthenticated(false);
              setUser(null);
            }
          } else {
            // Server error, remove token
            localStorage.removeItem('auth_token');
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (error) {
          console.error('Error validating token:', error);
          // Network error, keep token but don't authenticate
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setIsLoading(false);
    };

    validateToken();
  }, []);

  const logout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    setUser(null);
    // Redirect to login
    window.location.href = '/auth/login';
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    logout
  };
};
