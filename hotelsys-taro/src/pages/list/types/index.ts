/* 热门标签 */
export interface hotTagType {
  label: string;
  value: string;
}

/* 筛选表单 */
export interface filterFormType {
  type: string | null;
  distance: number[] | null;
  priceRange: number[] | null;
  rate: number | null;
}

/* 酒店卡片 */
export interface hotelCardType {
  id: number | string;
  name: string;
  rate: number;
  score: number;
  address: string;
  facilities: string[];
  price: number;
  imgUrl: string;
  latitude: string;
  longitude: string;
}
