import { apiClient } from 'api/fetch.api';
import { LoginResponse, ValidateTokenResponse } from 'types/auth/Auth.type';
import { AuthUser } from 'types/auth/User.type';

export class AuthService {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'auth_user';

  /**
   * Get login information and GitHub OAuth URL
   */
  static async getLoginInfo(): Promise<LoginResponse> {
    const response = await apiClient.get<LoginResponse>('/auth/login');
    if (!response) {
      throw new Error('Failed to get login information');
    }
    return response;
  }

  /**
   * Validate the current token with the backend
   */
  static async validateToken(token: string): Promise<ValidateTokenResponse> {
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
  }

  /**
   * Get current user information
   */
  static async getCurrentUser(token: string): Promise<AuthUser> {
    const response = await apiClient.get<AuthUser>('/auth/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response) {
      throw new Error('Failed to get current user');
    }
    return response;
  }

  /**
   * Store token in localStorage
   */
  static storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Get token from localStorage
   */
  static getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Remove token from localStorage
   */
  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Store user in localStorage
   */
  static storeUser(user: AuthUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Get user from localStorage
   */
  static getStoredUser(): AuthUser | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Check if user is authenticated (has valid token)
   */
  static isAuthenticated(): boolean {
    const token = this.getStoredToken();
    return !!token;
  }

  /**
   * Get auth status endpoint for health check
   */
  static async getAuthStatus(): Promise<{ status: string; version: string }> {
    const response = await apiClient.get<{ status: string; version: string }>('/auth/status');
    if (!response) {
      throw new Error('Failed to get auth status');
    }
    return response;
  }
}
