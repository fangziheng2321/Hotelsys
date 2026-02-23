import { SearchTabType } from "@/enum/home";
import { FacilityItem, timeType } from "@/types";
import { taroStorage } from "@/utils/storage";
import dayjs from "dayjs";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SearchState {
  location: {
    cityName: string;
    latitude: number | null;
    longitude: number | null;
  };
  hotelName: string | null;
  stayDate: {
    startDate: timeType;
    endDate: timeType;
  };
  type: SearchTabType;
  facilities: string[];
  priceRange: number[] | null;
  rate: number | null;
  distance: number[] | null;
  lastViewedHotelId: number | string | null;
  setLocation: (name: string, lat?: number, lng?: number) => void;
  setHotelName: (name: string | null) => void;
  setStayDate: (startDate: timeType, endDate: timeType) => void;
  setType: (type: SearchTabType) => void;
  setFacilities: (facilities: string[]) => void;
  setPriceRange: (priceRange: number[] | null) => void;
  setRate: (rate: number | null) => void;
  setDistance: (distance: number[] | null) => void;
  setLastViewedHotelId: (hotelId: number | string | null) => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      location: {
        cityName: "上海",
        latitude: null,
        longitude: null,
      },
      hotelName: null,
      stayDate: {
        startDate: dayjs(),
        endDate: dayjs().add(1, "day"),
      },
      type: SearchTabType.DOMESTIC,
      facilities: [],
      priceRange: null,
      rate: null,
      distance: null,
      lastViewedHotelId: null,
      setLocation: (name, lat, lng) =>
        set({
          location: {
            cityName: name,
            latitude: lat ?? null,
            longitude: lng ?? null,
          },
        }),
      setHotelName: (name) =>
        set({
          hotelName: name,
        }),
      setStayDate: (start, end) => {
        set({
          stayDate: {
            startDate: start,
            endDate: end,
          },
        });
      },
      setType: (type) => {
        set({
          type: type,
        });
      },
      setFacilities: (facilities) => {
        set({
          facilities: facilities,
        });
      },
      setPriceRange: (priceRange) => {
        set({
          priceRange: priceRange,
        });
      },
      setRate: (rate) => {
        set({
          rate: rate,
        });
      },
      setDistance: (distance) => {
        set({
          distance: distance,
        });
      },
      setLastViewedHotelId: (hotelId) => {
        set({
          lastViewedHotelId: hotelId,
        });
      },
    }),
    {
      name: "easeStay-search-storage",
      storage: createJSONStorage(() => taroStorage),

      onRehydrateStorage: () => (state) => {
        if (state) {
          const today = dayjs();
          if (dayjs(state.stayDate.startDate).isBefore(today)) {
            state.setStayDate(today, dayjs().add(1, "day"));
          }
        }
      },
    },
  ),
);
