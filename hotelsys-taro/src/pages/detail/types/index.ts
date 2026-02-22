// 酒店详细信息
export interface DetailInfoType {
  id: number | string;
  name: string;
  imgList: string[];
  description: string;
  rate: 0 | 1 | 2 | 3 | 4 | 5;
  address: string;
  price: number;
  facilities: string[];
  contactPhone: null | string;
}

// 设施
export interface FacilityItemType {
  title: string;
  iconKey: string;
}

// 房型
export interface RoomType {
  id: string | number;
  name: string; // 房型名称： "经典双床房"
  imageUrl: string; // 封面图 URL
  bedInfo: {
    size: number;
    number: number;
  }; // 床型："2张1.2米单人床"
  area: string; // 面积："40m²"
  occupancy: string; // 入住人数："2人入住"
  floor: number[]; // 楼层："5-15层"
  stock: number; //剩余数量
  canCancel: boolean; // 取消政策
  instantConfirm: boolean;
  price: number;
}
