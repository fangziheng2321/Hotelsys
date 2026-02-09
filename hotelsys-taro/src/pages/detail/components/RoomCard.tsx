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
import { RoomType } from "../types";
import { Button } from "@nutui/nutui-react-taro";
import { useCurrency } from "@/utils/currency";

interface IProps extends RoomType {}

const RoomCard: FC<IProps> = ({
  name,
  bedInfo,
  area,
  occupancy,
  floor,
  breakfast,
  canCancel,
  instantConfirm,
  price,
  soldOut,
  imageUrl,
}) => {
  const { t } = useTranslation();
  const { formatAmount } = useCurrency();

  const roomBasicInfo = useMemo(
    () => [bedInfo, area, occupancy, floor].filter(Boolean),
    [bedInfo, area, occupancy, floor],
  );

  return (
    <View className="w-full flex justify-between py-4 h-fit gap-2">
      {/* 房型图片 */}
      <Image
        src={imageUrl}
        className="w-20 h-24 object-cover rounded-lg flex-shrink-0"
        mode="aspectFill"
      />

      {/* 房型信息 */}
      <View className="flex-1 min-w-0 h-full flex flex-col gap-1">
        {/* 房型名称 */}
        <View className="text-sm font-bold truncate">{name ?? "N/A"}</View>
        {/* 房型文本信息 */}
        <View className="flex gap-1 text-xs text-gray-400">
          <Text className="truncate">{roomBasicInfo.join(" | ")}</Text>
        </View>
        {/* 早餐与是否可以取消 */}
        <View className="flex gap-2 items-center text-xs">
          {/* 是否包含早餐 */}
          <Text className="text-green-600">{breakfast ?? "N/A"}</Text>
          {/* 立即确认：蓝色 */}
          {instantConfirm && <Text className="text-blue-600">立即确认</Text>}
          {/* 取消政策：如果是不可取消用灰色，免费取消用绿色 */}
          <Text className={canCancel ? "text-green-400" : "text-gray-400"}>
            {canCancel
              ? t("detail.room.canCancel")
              : t("detail.room.cannotCancel")}
          </Text>
        </View>
        {/* 价格与预订按钮 */}
        <View className="flex w-full items-center justify-between">
          {/* 价格 */}
          <View className="flex gap-1 items-baseline">
            <Text className="text-xs text-gray-600">
              {t("list.hotel_card.price_prefix")}
            </Text>
            <Text className="text-lg font-bold text-orange-600">
              ￥{formatAmount(price ?? 0)}
            </Text>
            <Text className="text-xs text-gray-600">
              {t("list.hotel_card.price_suffix")}
            </Text>
          </View>
          {/* 预订按钮 */}
          <Button type="primary" disabled={soldOut}>
            {soldOut ? t("detail.room.soldOut") : t("detail.room.book")}
          </Button>
        </View>
      </View>
    </View>
  );
};

export default RoomCard;
