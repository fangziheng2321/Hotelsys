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
import { FacilityIcon } from "@/constant/detail";
import { More } from "@nutui/icons-react-taro";
import { HOTEL_FACILITIES } from "@/constant/facility";
import { useThemeStore } from "@/store/themeStore";

interface IProps {
  facilities: string[];
  onMoreClick?: () => void;
}

const DEFAULT_ICON = FacilityIcon["defaultIcon"];

const Facility: FC<IProps> = ({ facilities, onMoreClick }) => {
  const { t } = useTranslation();

  const { isDark } = useThemeStore();

  // 获取图标
  const getFacilityIcon = (id: string) => {
    const item = HOTEL_FACILITIES.find((facility) => facility.id === id);
    return item ? FacilityIcon[item.icon] : DEFAULT_ICON;
  };

  // 获取名称
  const getFacilityLabel = (id: string) => {
    const item = HOTEL_FACILITIES.find((facility) => facility.id === id);
    return item ? t(item.name) : "N/A";
  };

  return (
    <View className="flex items-start overflow-x-auto gap-2">
      {/* 1. 动态渲染前 4 个设施 */}
      {facilities.map((item, index) => (
        <View
          key={index}
          className="shrink-0 flex flex-col items-center gap-2 flex-1"
        >
          {/* 图标区域 */}
          <Image
            src={getFacilityIcon(item)}
            className={["w-6 h-6 object-contain", isDark ? "invert" : ""].join(
              " ",
            )}
            mode="aspectFit"
          />
          {/* 文字区域 */}
          <Text className="text-xs text-gray-600 dark:text-dark-muted font-normal text-center leading-tight max-w-[6rem] truncate">
            {getFacilityLabel(item)}
          </Text>
        </View>
      ))}

      {/* 固定显示的“更多”入口 */}
      {/* <View
        className="flex flex-col items-center gap-2 flex-1"
        onClick={onMoreClick}
      >
        <View className="w-6 h-6 flex items-center justify-center">
          <More size={"20"} />
        </View>
        <Text className="text-xs text-gray-600 font-normal text-center leading-tight">
          {t("detail.facility.more")}
        </Text>
      </View> */}
    </View>
  );
};

export default Facility;
