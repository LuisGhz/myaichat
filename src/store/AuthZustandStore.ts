import { User } from "shared/models/User";
import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuthZustandStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),
  user: null,
  setUser: (user) => set({ user }),
}));
