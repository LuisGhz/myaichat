import { apiClient } from 'api/fetch.api';
import { LoginResponse, ValidateTokenResponse } from 'types/auth/Auth.type';
import { AuthUser } from 'types/auth/User.type';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/**
 * Get login information and GitHub OAuth URL
 */
export const getLoginInfoService = async (): Promise<LoginResponse> => {
  const response = await apiClient.get<LoginResponse>('/auth/login');
  if (!response) {
    throw new Error('Failed to get login information');
  }
  return response;
};

/**
 * Validate the current token with the backend
 */
export const validateTokenService = async (token: string): Promise<ValidateTokenResponse> => {
  const response = await apiClient.post<ValidateTokenResponse, { headers: { Authorization: string } }>(
    '/auth/validate',
    undefined,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  if (!response) {
    throw new Error('Failed to validate token');
  }
  return response;
};

/**
 * Get current user information
 */
export const getCurrentUserService = async (token: string): Promise<AuthUser> => {
  const response = await apiClient.get<AuthUser>('/auth/user', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response) {
    throw new Error('Failed to get current user');
  }
  return response;
};

/**
 * Store token in localStorage
 */
export const storeTokenService = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Get token from localStorage
 */
export const getStoredTokenService = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove token from localStorage
 */
export const removeTokenService = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Store user in localStorage
 */
export const storeUserService = (user: AuthUser): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Get user from localStorage
 */
export const getStoredUserService = (): AuthUser | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Check if user is authenticated (has valid token)
 */
export const isAuthenticatedService = (): boolean => {
  const token = getStoredTokenService();
  return !!token;
};

/**
 * Get auth status endpoint for health check
 */
export const getAuthStatusService = async (): Promise<{ status: string; version: string }> => {
  const response = await apiClient.get<{ status: string; version: string }>('/auth/status');
  if (!response) {
    throw new Error('Failed to get auth status');
  }
  return response;
};
