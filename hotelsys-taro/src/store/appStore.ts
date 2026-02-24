import { create } from "zustand";

interface AppState {
  // 列表刷新信号
  refreshListSignal: boolean;
  setRefreshListSignal: (val: boolean) => void;

  // 或者：移除指定项的信号
  removeHotelIdSignal: string | number | null;
  setRemoveHotelIdSignal: (id: string | number | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  refreshListSignal: false,
  setRefreshListSignal: (val) => set({ refreshListSignal: val }),

  removeHotelIdSignal: null,
  setRemoveHotelIdSignal: (id) => set({ removeHotelIdSignal: id }),
}));
