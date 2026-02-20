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
import { getValidRoomImageUrl } from "@/utils/image";
import { formatStr } from "@/utils/i18nHelper";

interface IProps extends RoomType {}

const RoomCard: FC<IProps> = ({
  id,
  name,
  bedInfo,
  area,
  occupancy,
  floor,
  canCancel,
  instantConfirm,
  price,
  stock,
  imageUrl,
}) => {
  const { t } = useTranslation();
  const { formatAmount } = useCurrency();

  const roomBasicInfo = useMemo(() => {
    // === 1. 床型信息 ===
    // 先获取模版字符串: "{number}张{size}米床"
    const bedTemplate = t("detail.room.bed_info");
    const formatBedInfo =
      bedInfo?.size && bedInfo?.number
        ? formatStr(bedTemplate, {
            number: bedInfo.number,
            size: bedInfo.size,
          })
        : "";

    // === 2. 面积 ===
    // 模版: "{val}m²"
    const areaTemplate = t("detail.room.area");
    const formatArea = area ? formatStr(areaTemplate, { val: area }) : "";

    // === 3. 入住人数 ===
    // 模版: "{count}人入住"
    const occupyTemplate = t("detail.room.occupancy");
    const formatOccupy = occupancy
      ? formatStr(occupyTemplate, { count: occupancy })
      : "";

    // === 4. 楼层 ===
    let formatFloor = "";
    if (floor && floor.length > 0) {
      if (floor.length === 2) {
        // 范围模版: "{min}-{max}层"
        const rangeTemplate = t("detail.room.floor_range");
        formatFloor = formatStr(rangeTemplate, {
          min: floor[0],
          max: floor[1],
        });
      } else {
        // 单层模版: "{val}层"
        const singleTemplate = t("detail.room.floor_single");
        formatFloor = formatStr(singleTemplate, { val: floor[0] });
      }
    }

    return [formatBedInfo, formatArea, formatOccupy, formatFloor].filter(
      Boolean,
    );
  }, [bedInfo, area, occupancy, floor, t]);

  return (
    <View className="w-full flex justify-between py-4 h-fit gap-2">
      {/* 房型图片 */}
      <Image
        src={getValidRoomImageUrl(imageUrl, id)}
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
          {/* 剩余数量 */}
          <Text className={stock > 1 ? "text-green-600" : "text-orange-600"}>
            {stock > 1
              ? `${t("detail.room.remaining")} ${stock} ${t("detail.room.room")}`
              : stock === 0
                ? `${t("detail.room.soldOut")}`
                : `${t("detail.room.onlyOneLeft")}`}
          </Text>
          {/* 立即确认：蓝色 */}
          {instantConfirm && (
            <Text className="text-blue-600">
              {t("detail.room.instanceConfirm")}
            </Text>
          )}
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
          <Button type="primary" disabled={stock <= 0}>
            {stock <= 0 ? t("detail.room.soldOut") : t("detail.room.book")}
          </Button>
        </View>
      </View>
    </View>
  );
};

export default RoomCard;
