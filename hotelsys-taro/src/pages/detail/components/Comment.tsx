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
  expanded: boolean;
}

const Comment: FC<IProps> = ({ description, expanded }) => {
  const { t } = useTranslation();
  const { isDark } = useThemeStore();

  return (
    <View
      className={[
        "w-full bg-sky-50/50 dark:bg-slate-800/50 px-3 rounded-2xl border border-sky-100/50 dark:border-slate-700/50 h-full flex items-center justify-between gap-2 overflow-hidden",
        expanded ? "py-3" : "",
      ].join(" ")}
    >
      {/* 描述图标 */}
      <View className="bg-blue-200/50 dark:bg-blue-900/50 rounded-lg w-8 h-8 p-2 flex items-center justify-center">
        <Image
          src={hotelInfo.description}
          className={["size-full", isDark ? "invert" : ""].join(" ")}
        />
      </View>
      <View
        className={[
          "text-xs text-blue-800/70 dark:text-blue-200/70 break-all flex-1",
          expanded ? "" : "line-clamp-3",
        ].join(" ")}
      >
        {description ?? "N/A"}
      </View>
    </View>
  );
};

export default Comment;
