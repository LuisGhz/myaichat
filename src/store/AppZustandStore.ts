import { create } from "zustand";

export const useAppZustandStore = create<AppStore>((set) => ({
  sideNavCollapsed: false,
  chatsSummary: [],
  setSideNavCollapsed: (collapsed) => set({ sideNavCollapsed: collapsed }),
  setChatsSummary: (chats) => set({ chatsSummary: chats }),
}));
