import { useAppZustandStore } from "store/AppZustandStore";

export const useAppStore = () => {
  const sideNavCollapsed = useAppZustandStore(
    (state) => state.sideNavCollapsed
  );
  return { sideNavCollapsed };
};

export const useAppStoreActions = () => {
  const setSideNavCollapsed = useAppZustandStore(
    (state) => state.setSideNavCollapsed
  );
  return { setSideNavCollapsed };
};
