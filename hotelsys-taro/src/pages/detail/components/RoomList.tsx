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
import { RoomType } from "../types";
import RoomCardSkeleton from "./RoomCardSkeleton";

interface IProps {
  roomList: RoomType[];
  loading: boolean;
}

const RoomList: FC<IProps> = ({ roomList, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return <RoomCardSkeleton />;
  }

  return (
    <View className="flex flex-col justify-between">
      {roomList?.map((item, index) => (
        <>
          <RoomCard key={item.id} {...item} />
          {index !== roomList.length - 1 && <Divide />}
        </>
      ))}
    </View>
  );
};

export default RoomList;
