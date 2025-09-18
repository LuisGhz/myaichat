import { useAppZustandStore } from "store/AppZustandStore";

export const useAppStore = () => {
  const sideNavCollapsed = useAppZustandStore(
    (state) => state.sideNavCollapsed
  );
  const chatsSummary = useAppZustandStore((state) => state.chatsSummary);
  const isGettingNewChat = useAppZustandStore(
    (state) => state.isGettingNewChat
  );
  return { sideNavCollapsed, chatsSummary, isGettingNewChat };
};

export const useAppStoreActions = () => {
  const setSideNavCollapsed = useAppZustandStore(
    (state) => state.setSideNavCollapsed
  );
  const setChatsSummary = useAppZustandStore((state) => state.setChatsSummary);
  const setIsGettingNewChat = useAppZustandStore(
    (state) => state.setIsGettingNewChat
  );
  return { setSideNavCollapsed, setChatsSummary, setIsGettingNewChat };
};
