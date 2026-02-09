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

interface IProps {
  facilities: Array<{ title: string; iconKey: string }>;
  onMoreClick?: () => void;
}

const ICON_MAP: Record<string, string> = FacilityIcon;

const DEFAULT_ICON = FacilityIcon["defaultIcon"];

const Facility: FC<IProps> = ({ facilities, onMoreClick }) => {
  const { t } = useTranslation();
  // 只展示前 4 个
  const displayItems = useMemo(() => {
    return facilities.slice(0, 4);
  }, [facilities]);

  return (
    <View className="flex justify-between items-start">
      {/* 1. 动态渲染前 4 个设施 */}
      {displayItems.map((item, index) => (
        <View key={index} className="flex flex-col items-center gap-2 flex-1">
          {/* 图标区域 */}
          <Image
            src={ICON_MAP[item.iconKey] || DEFAULT_ICON}
            className="w-6 h-6 object-contain"
            mode="aspectFit"
          />
          {/* 文字区域 */}
          <Text className="text-xs text-gray-600 font-normal text-center leading-tight max-w-[6rem] truncate">
            {item?.title ?? "N/A"}
          </Text>
        </View>
      ))}

      {/* 固定显示的“更多”入口 */}
      <View
        className="flex flex-col items-center gap-2 flex-1"
        onClick={onMoreClick}
      >
        <View className="w-6 h-6 flex items-center justify-center">
          <More size={"20"} />
        </View>
        <Text className="text-xs text-gray-600 font-normal text-center leading-tight">
          {t("detail.facility.more")}
        </Text>
      </View>
    </View>
  );
};

export default Facility;
