import { create } from 'zustand';
import { AuthState } from 'types/auth/Auth.type';
import { AuthUser } from 'types/auth/User.type';

interface AuthStoreActions {
  setAuthenticated: (isAuthenticated: boolean) => void;
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

type AuthStore = AuthState & AuthStoreActions;

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,
  
  setAuthenticated: (isAuthenticated: boolean) => 
    set({ isAuthenticated }),
  
  setUser: (user: AuthUser | null) => 
    set({ user }),
  
  setToken: (token: string | null) => 
    set({ token }),
  
  setLoading: (isLoading: boolean) => 
    set({ isLoading }),
  
  setError: (error: string | null) => 
    set({ error }),
  
  clearError: () => 
    set({ error: null }),
  
  reset: () => 
    set(initialState),
}));
