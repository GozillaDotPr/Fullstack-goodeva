import { create } from 'zustand';

interface useSidebarState {
  isOpen: boolean;
  toggle: () => void;
}

export const useSidebarStore = create<useSidebarState>((set) => ({
  isOpen: true,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));