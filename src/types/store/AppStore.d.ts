type AppStore = {
  sideNavCollapsed: boolean;
  chatsSummary: ChatSummary[];
  isGettingNewChat: boolean;
  // Actions
  setSideNavCollapsed: (collapsed: boolean) => void;
  setChatsSummary: (chats: ChatSummary[]) => void;
  setIsGettingNewChat: (isGetting: boolean) => void;
}