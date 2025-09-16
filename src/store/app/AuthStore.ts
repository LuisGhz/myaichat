import { useAuthZustandStore } from "store/AuthZustandStore";

// Select individual slices to keep getSnapshot stable and avoid infinite loops
export const useAuthState = () => {
  const isAuthenticated = useAuthZustandStore((state) => state.isAuthenticated);
  const user = useAuthZustandStore((state) => state.user);

  return { isAuthenticated, user };
};

export const useAuthActions = () => {
  const setUser = useAuthZustandStore((state) => state.setUser);
  const setIsAuthenticated = useAuthZustandStore(
    (state) => state.setIsAuthenticated
  );

  return { setUser, setIsAuthenticated };
};
