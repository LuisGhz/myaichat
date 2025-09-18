import { create } from "zustand";

export const useAppZustandStore = create<AppStore>((set) => ({
  sideNavCollapsed: false,
  chatsSummary: [],
  isGettingNewChat: false,
  setSideNavCollapsed: (collapsed) => set({ sideNavCollapsed: collapsed }),
  setChatsSummary: (chats) => set({ chatsSummary: chats }),
  setIsGettingNewChat: (isGetting) => set({ isGettingNewChat: isGetting }),
}));
