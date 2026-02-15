import { timeType } from "@/types";
/* 轮播图类型 */
export interface BannerType {
  id: number;
  imgUrl?: string;
}

/* 日期范围表单 */
export interface dateFormType {
  startDate: timeType;
  endDate: timeType;
}
