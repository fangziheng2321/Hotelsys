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
import { useThemeStore } from "@/store/themeStore";

interface IProps {
  address: string;
}

const Address: FC<IProps> = ({ address }) => {
  const { t } = useTranslation();
  const { isDark } = useThemeStore();

  return (
    <View className="flex flex-1 bg-gray-50 dark:bg-slate-800 rounded-2xl gap-2 p-3 h-full">
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
