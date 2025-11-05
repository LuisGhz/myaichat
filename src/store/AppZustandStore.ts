import { MessageInstance } from "antd/es/message/interface";
import { create } from "zustand";

export const useAppZustandStore = create<AppStore>((set) => ({
  sideNavCollapsed: false,
  chatsSummary: [],
  isGettingNewChat: false,
  setSideNavCollapsed: (collapsed) => set({ sideNavCollapsed: collapsed }),
  closeSideNav: () => set({ sideNavCollapsed: true }),
  setChatsSummary: (chats) => set({ chatsSummary: chats }),
  setIsGettingNewChat: (isGetting) => set({ isGettingNewChat: isGetting }),
  messageApi: null,
  setMessageApi: (api: MessageInstance) => set({ messageApi: api }),
}));
