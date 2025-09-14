import { create } from "zustand";

export const useAppZustandStore = create<AppStore>((set) => ({
  sideNavCollapsed: false,
  setSideNavCollapsed: (collapsed) => set({ sideNavCollapsed: collapsed }),
}));
