import { useAppZustandStore } from "store/AppZustandStore";

export const useAppStore = () => {
  const sideNavCollapsed = useAppZustandStore(
    (state) => state.sideNavCollapsed
  );
  const chatsSummary = useAppZustandStore((state) => state.chatsSummary);
  const isGettingNewChat = useAppZustandStore(
    (state) => state.isGettingNewChat
  );
  const messageApi = useAppZustandStore((state) => state.messageApi);
  return { sideNavCollapsed, chatsSummary, isGettingNewChat, messageApi };
};

export const useAppStoreActions = () => {
  const setSideNavCollapsed = useAppZustandStore(
    (state) => state.setSideNavCollapsed
  );
  const setChatsSummary = useAppZustandStore((state) => state.setChatsSummary);
  const setIsGettingNewChat = useAppZustandStore(
    (state) => state.setIsGettingNewChat
  );
  const setMessageApi = useAppZustandStore((state) => state.setMessageApi);
  const closeSideNav = useAppZustandStore((state) => state.closeSideNav);
  return {
    setSideNavCollapsed,
    setChatsSummary,
    setIsGettingNewChat,
    setMessageApi,
    closeSideNav,
  };
};
