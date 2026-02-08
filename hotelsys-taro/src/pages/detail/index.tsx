import React, {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
  useRef,
} from "react";
import { View, Text, Image } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import SafeNavBar from "./components/SafeNavBar";
import HotelBanner from "./components/HotelBanner";

interface IProps {}

const Index: FC<IProps> = (props) => {
  const { t } = useTranslation();
  const [hotelInfo, setHotelInfo] = useState({
    id: 1,
    name: "陆家嘴禧玥酒店",
    imgList: [
      "https://modao.cc/agent-py/media/generated_images/2026-02-07/0f513ec570834b798774104363e44c81.jpg",
    ],
  });

  return (
    <View>
      {/* 安全导航栏 */}
      <SafeNavBar
        title={hotelInfo.name}
        className="fixed z-10 top-0 left-0 right-0"
      />

      {/* 酒店Banner */}
      <HotelBanner />

      {/* 酒店详情 */}
    </View>
  );
};

export default Index;
