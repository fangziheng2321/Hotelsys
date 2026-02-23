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
import { hotelInfo } from "@/constant/detail";
import { useThemeStore } from "@/store/themeStore";
import Taro from "@tarojs/taro";

interface IProps {
  hotelId: string | number;
  address: string;
}

const Address: FC<IProps> = ({ hotelId, address }) => {
  const { isDark } = useThemeStore();

  const goToMap = (id: string | number) => {
    if (!id) {
      return;
    }
    Taro.navigateTo({ url: `/pages/map/index?id=${id}` });
  };

  return (
    <View
      className="flex flex-1 bg-gray-50 dark:bg-slate-800 rounded-2xl gap-2 px-2 items-center h-full"
      onClick={() => goToMap(hotelId)}
    >
      <View className="text-xs text-gray-400 dark:text-gray-300 line-clamp-3 max-h-[3rem] break-all flex-1">
        {address ?? "N/A"}
      </View>
      {/* 地图图标 */}
      <View className="bg-white dark:bg-slate-700 rounded-lg w-8 h-8 p-2 flex items-center justify-center">
        <Image
          src={hotelInfo.map}
          className={["size-full", isDark ? "invert" : ""].join(" ")}
        />
      </View>
    </View>
  );
};

export default Address;
