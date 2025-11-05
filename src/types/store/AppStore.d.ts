type AppStore = {
  sideNavCollapsed: boolean;
  chatsSummary: ChatSummary[];
  isGettingNewChat: boolean;
  // Actions
  setSideNavCollapsed: (collapsed: boolean) => void;
  closeSideNav: () => void;
  setChatsSummary: (chats: ChatSummary[]) => void;
  setIsGettingNewChat: (isGetting: boolean) => void;
  messageApi: MessageInstance | null;
  setMessageApi: (api: MessageInstance) => void;
}