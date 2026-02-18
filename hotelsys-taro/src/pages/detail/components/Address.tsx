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
import { hotelInfo } from "@/constant/detail";

interface IProps {
  address: string;
}

const Address: FC<IProps> = ({ address }) => {
  const { t } = useTranslation();

  return (
    <View className="flex flex-1 bg-gray-50 rounded-2xl gap-2 p-3 h-full">
      <View className="text-xs text-gray-400 line-clamp-3 max-h-[3rem] break-all flex-1">
        {address ?? "N/A"}
      </View>
      {/* 地图图标 */}
      <View className="bg-white rounded-lg w-8 h-8 p-2 flex items-center justify-center">
        <Image src={hotelInfo.map} className="size-full" />
      </View>
    </View>
  );
};

export default Address;
