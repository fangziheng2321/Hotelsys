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
  facilities: [
    {
      title: "2020年开业",
      iconKey: FacilityIcon.CALENDAR,
    },
    {
      title: "新中式风",
      iconKey: FacilityIcon.HOUSE,
    },
    {
      title: "免费停车",
      iconKey: FacilityIcon.PARKING,
    },
    {
      title: "一线江景",
      iconKey: FacilityIcon.VIEW,
    },
  ],
};

// 模拟酒店房型的数据
export const MOCK_ROOM_LIST = [
  {
    id: 1,
    name: "经典双床房",
    imageUrl:
      "https://modao.cc/agent-py/media/generated_images/2026-02-07/0cbd04f694c84e51b8229a4407611a4b.jpg",
    bedInfo: "2张1.2米单人床",
    area: "40m²",
    occupancy: "2人入住",
    floor: "5-15层",
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
    bedInfo: "1张1.8米大床",
    area: "45m²",
    occupancy: "2人入住",
    floor: "16-25层",
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
    bedInfo: "1张1.5米大床",
    area: "45m²",
    occupancy: "1人入住",
    floor: "16-25层",
    stock: 0,
    canCancel: false,
    instantConfirm: false,
    price: 640,
  },
];
