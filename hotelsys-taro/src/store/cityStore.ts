import { create } from "zustand";

interface CityState {
  cityName: string;
  latitude: number | null;
  longitude: number | null;
  // 更新城市的 Action
  setCity: (name: string, lat?: number, lng?: number) => void;
}

export const useCityStore = create<CityState>((set) => ({
  cityName: "上海市", // 默认值
  latitude: null,
  longitude: null,
  setCity: (name, lat, lng) =>
    set({
      cityName: name,
      latitude: lat || null,
      longitude: lng || null,
    }),
}));
