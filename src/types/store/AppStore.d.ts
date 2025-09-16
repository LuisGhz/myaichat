type AppStore = {
  sideNavCollapsed: boolean;
  chatsSummary: ChatSummary[];
  // Actions
  setSideNavCollapsed: (collapsed: boolean) => void;
  setChatsSummary: (chats: ChatSummary[]) => void;
}