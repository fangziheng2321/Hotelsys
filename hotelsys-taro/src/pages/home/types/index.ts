import dayjs from "dayjs";

/* 轮播图类型 */
export interface BannerType {
  id: number;
  name: string;
  imgUrl?: string;
}

/* 时间类型 */
export type timeType = string | Date | dayjs.Dayjs;

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
