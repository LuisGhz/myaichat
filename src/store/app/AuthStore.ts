import { useAuthZustandStore } from "store/AuthZustandStore";

export const useAuth = () => {
  const { isAuthenticated, user } = useAuthZustandStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  }));

  return { isAuthenticated, user };
};

export const useAuthActions = () => {
  const { setUser, setIsAuthenticated } = useAuthZustandStore((state) => ({
    setUser: state.setUser,
    setIsAuthenticated: state.setIsAuthenticated,
  }));

  return { setUser, setIsAuthenticated };
};
