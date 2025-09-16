import { useAppZustandStore } from "store/AppZustandStore";

export const useAppStore = () => {
  const sideNavCollapsed = useAppZustandStore(
    (state) => state.sideNavCollapsed
  );
  const chatsSummary = useAppZustandStore((state) => state.chatsSummary);
  return { sideNavCollapsed, chatsSummary };
};

export const useAppStoreActions = () => {
  const setSideNavCollapsed = useAppZustandStore(
    (state) => state.setSideNavCollapsed
  );
  const setChatsSummary = useAppZustandStore((state) => state.setChatsSummary);
  return { setSideNavCollapsed, setChatsSummary };
};
