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
  score: 4.8,
  address: "浦东新区浦明路868弄3号楼",
  price: Math.floor(Math.random() * 900) + 100,
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
