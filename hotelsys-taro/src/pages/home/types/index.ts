import { timeType } from "@/types";
/* 轮播图类型 */
export interface BannerType {
  id: number;
  name: string;
  imgUrl?: string;
}

/* 日期范围表单 */
export interface dateFormType {
  startDate: timeType;
  endDate: timeType;
}

/* 热门标签 */
export interface hotTagType {
  label: string;
  value: string;
}
