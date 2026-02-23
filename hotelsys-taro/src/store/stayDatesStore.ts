import { timeType } from "@/types";
import dayjs from "dayjs";
import { create } from "zustand";

interface StayDateState {
  startDate: timeType;
  endDate: timeType;
  //更新Action
  setStayDate: (startDate: timeType, endDate: timeType) => void;
}

export const useStayDateStore = create<StayDateState>((set) => ({
  startDate: dayjs(), //默认今天
  endDate: dayjs().add(1, "day"), // 默认明天
  setStayDate: (start, end) => {
    set({
      startDate: start,
      endDate: end,
    });
  },
}));
