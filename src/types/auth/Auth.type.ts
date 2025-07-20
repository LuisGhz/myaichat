import { AuthUser } from './User.type';

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginResponse {
  message: string;
  githubLoginUrl: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
  user?: AuthUser;
  message?: string;
}

export interface AuthContextType extends AuthState {
  login: () => void;
  logout: () => void;
  validateToken: () => Promise<boolean>;
  clearError: () => void;
  handleOAuthCallback?: (token: string) => Promise<void>;
}
