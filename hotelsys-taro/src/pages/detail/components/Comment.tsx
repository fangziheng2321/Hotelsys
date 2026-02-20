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
  description: string;
}

const Comment: FC<IProps> = ({ description }) => {
  const { t } = useTranslation();
  const { isDark } = useThemeStore();

  return (
    <View className="w-1/2 bg-sky-50/50 dark:bg-slate-800/50 p-3 rounded-2xl border border-sky-100/50 dark:border-slate-700/50 h-full flex justify-between gap-2">
      {/* 描述图标 */}
      <View className="bg-blue-200/50 dark:bg-blue-900/50 rounded-lg w-8 h-8 p-2 flex items-center justify-center">
        <Image
          src={hotelInfo.description}
          className={["size-full", isDark ? "invert" : ""].join(" ")}
        />
      </View>
      <View className="text-xs text-blue-800/70 dark:text-blue-200/70 line-clamp-3 max-h-[3rem] break-all flex-1">
        {description ?? "N/A"}
      </View>
    </View>
  );
};

export default Comment;
