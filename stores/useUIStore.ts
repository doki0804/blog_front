// lib/store/ui.ts
import { create } from 'zustand';

export const useUIStore = create(set => ({
  selectedTab: null as null | string,
  setSelectedTab: (tab: string) => set({ selectedTab: tab }),
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));
