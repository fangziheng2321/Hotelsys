import React, {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
  useRef,
} from "react";
import { View, Text, Image, List } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import SafeNavBar from "./components/SafeNavBar";
import HotelBanner from "./components/HotelBanner";
import DetailInfo from "./components/DetailInfo";
import { DetailInfoType } from "./types";
import { FacilityIcon } from "@/enum/detail";
import Calendar from "./components/Calendar";
import RoomList from "./components/RoomList";
import FunctionBar from "./components/FunctionBar";

interface IProps {}

const Index: FC<IProps> = (props) => {
  const { t } = useTranslation();
  const [hotelInfo, setHotelInfo] = useState<DetailInfoType>({
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
    tagList: ["免费升房", "新中式风", "一线江景"],
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
  });

  return (
    <>
      <View className="bg-custom-gray">
        {/* 安全导航栏 */}
        <SafeNavBar title={hotelInfo?.name} />

        {/* 酒店Banner */}
        <HotelBanner list={hotelInfo?.imgList} />

        {/* 酒店信息 */}
        <View className="-translate-y-4 pb-24">
          <View className=" bg-white p-4 rounded-t-2xl">
            <DetailInfo {...hotelInfo} />
          </View>

          {/* 日历与人间夜 */}
          <View className="bg-white p-4 mt-2">
            <Calendar />
          </View>
          {/* 房型价格列表 */}
          <View className="bg-white px-4 mt-2">
            <RoomList />
          </View>
        </View>
      </View>
      {/* 底部栏 */}
      <View className="fixed bottom-0 left-0 right-0 px-4 py-2 bg-white">
        <FunctionBar price={hotelInfo.price} />
      </View>
    </>
  );
};

export default Index;
