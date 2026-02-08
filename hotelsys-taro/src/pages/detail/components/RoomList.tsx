import React, {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
  useRef,
} from "react";
import { View, Text } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import RoomCard from "./RoomCard";
import Divide from "@/pages/home/components/Divide";

interface IProps {}

const RoomList: FC<IProps> = (props) => {
  const { t } = useTranslation();
  const [rommList, setRoomList] = useState([
    {
      id: 1,
      name: "经典双床房",
      imageUrl:
        "https://modao.cc/agent-py/media/generated_images/2026-02-07/0cbd04f694c84e51b8229a4407611a4b.jpg",
      bedInfo: "2张1.2米单人床",
      area: "40m²",
      occupancy: "2人入住",
      floor: "5-15层",
      breakfast: "不含早",
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
      breakfast: "含双早",
      canCancel: false,
      instantConfirm: false,
      price: 1280,
    },
  ]);

  return (
    <View className="flex flex-col justify-between">
      {rommList.map((item, index) => (
        <>
          <RoomCard key={item.id} {...item} />
          {index !== rommList.length - 1 && <Divide />}
        </>
      ))}
    </View>
  );
};

export default RoomList;
