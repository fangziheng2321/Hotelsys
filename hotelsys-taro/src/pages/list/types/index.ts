/* 热门标签 */
export interface hotTagType {
  label: string;
  value: string;
}

/* 筛选表单 */
export interface filterFormType {
  popularity?: number | null;
  distance?: number | null;
  price?: number | null;
}

/* 酒店卡片 */
export interface hotelCardType {
  id: number | string;
  name: string;
  rate: number;
  score: number;
  address: string;
  tagList: string[];
  price: number;
  imgUrl: string;
}
