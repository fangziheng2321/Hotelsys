import { FacilityIcon } from "@/enum/detail";

// 模拟酒店详情页面数据
export const MOCK_HOTEL_DETAIL = {
  id: 1,
  name: "陆家嘴禧玥酒店",
  rate: 5,
  imgList: [
    "https://modao.cc/agent-py/media/generated_images/2026-02-07/0f513ec570834b798774104363e44c81.jpg",
    "https://modao.cc/agent-py/media/generated_images/2026-02-03/0356c22d93a042c794e0f0ca57400f1f.jpg",
    "https://modao.cc/agent-py/media/generated_images/2026-02-03/6c6959e198984f0888aa0718f1bd992d.jpg",
  ],
  description: "这家酒店是中式风格装修，舒适安逸",
  address: "浦东新区浦明路868弄3号楼",
  price: Math.floor(Math.random() * 900) + 100,
  telephone: "12345678954",
  facilities: ["免费WiFi", "停车场", "餐厅", "健身房", "游泳池", "会议室"],
};

// 模拟酒店房型的数据
export const MOCK_ROOM_LIST = [
  {
    id: 1,
    name: "经典双床房",
    imageUrl:
      "https://modao.cc/agent-py/media/generated_images/2026-02-07/0cbd04f694c84e51b8229a4407611a4b.jpg",
    bedInfo: {
      size: 1.2,
      number: 2,
    },
    area: 40,
    occupancy: 2,
    floor: [5, 15],
    stock: 1,
    canCancel: true,
    instantConfirm: true,
    price: 936,
  },
  {
    id: 2,
    name: "禧玥大床房",
    imageUrl:
      "https://modao.cc/agent-py/media/generated_images/2026-02-07/8de0363cdbf64ed59e385d5322dcca9b.jpg",
    bedInfo: {
      size: 1.8,
      number: 1,
    },
    area: 45,
    occupancy: 2,
    floor: [16, 25],
    stock: 10,
    canCancel: false,
    instantConfirm: false,
    price: 1280,
  },
  {
    id: 3,
    name: "禧玥标间",
    imageUrl:
      "https://modao.cc/agent-py/media/generated_images/2026-02-07/8de0363cdbf64ed59e385d5322dcca9b.jpg",
    bedInfo: {
      size: 1.5,
      number: 1,
    },
    area: 45,
    occupancy: 1,
    floor: [16, 25],
    stock: 0,
    canCancel: false,
    instantConfirm: false,
    price: 640,
  },
];
