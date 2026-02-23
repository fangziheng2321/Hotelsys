import dayjs from "dayjs";

/* 时间类型 */
export type timeType = string | Date | dayjs.Dayjs;

/* 设施 */
export interface FacilityItem {
  id: string; // 唯一标识，用于 key 或后端传参
  name: string; // 展示的中文名称
  icon: string; // 图标名称，用于动态匹配图标组件或图片路径
}
