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
import { hotelCardType } from "../types";
import StarRate from "@/components/StarRate/StarRate";
import CustomTag from "@/components/CustomTag/CustomTag";
import { useCurrency } from "@/utils/currency";
import Taro from "@tarojs/taro";
import { getValidThumbHotelImageUrl } from "@/utils/image";
import { HOTEL_FACILITIES } from "@/constant/facility";

interface IProps extends hotelCardType {
  customClassName?: string;
}

const HotelCard: FC<IProps> = ({
  id,
  name,
  rate,
  score,
  address,
  facilities,
  price,
  imgUrl,
  customClassName,
}) => {
  const { t } = useTranslation();
  const { formatAmount } = useCurrency();

  /* 查看酒店详情 */
  const handleViewDetail = () => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`,
    });
  };

  // 获取图标
  const getFacilityLabel = (id: string) => {
    const item = HOTEL_FACILITIES.find((facility) => facility.id === id);
    return item ? t(item.name) : "N/A";
  };
  return (
    <View
      className={`bg-white dark:bg-dark-card rounded-2xl p-3 h-48 flex items-center gap-3 w-full ${customClassName ?? ""}`}
      onClick={handleViewDetail}
    >
      {/* 图片 */}
      <Image
        src={getValidThumbHotelImageUrl(imgUrl, id)}
        className="h-full rounded-lg w-28 flex-shrink-0"
        mode="aspectFill"
      ></Image>
      {/* 介绍 */}

      <View className="h-full flex-1 flex flex-col justify-between items-start gap-2">
        {/* 酒店名称/星级 */}
        <View className="flex min-w-0 gap-2 items-baseline">
          {/* 酒店名字 */}
          <Text className="flex-1 text-lg font-bold line-clamp-2 min-w-0 break-all">
            {name ?? "N/A"}
          </Text>
        </View>

        {/* 酒店星级 */}
        <View className="flex items-center gap-2">
          {/* 星级 */}
          <StarRate rate={rate} size="1rem" />
        </View>

        {/* 酒店地址 */}
        <Text className="text-sm text-gray-300 line-clamp-1 min-w-0 break-all">
          {address ?? "N/A"}
        </Text>

        {/* 酒店标签 */}
        <View className="flex flex-wrap gap-2 items-center">
          {facilities?.slice(0, 3).map((tag) => (
            <CustomTag
              key={tag}
              customClassName="bg-transparent border-secondary border border-solid text-secondary text-xs font-normal"
            >
              {getFacilityLabel(tag)}
            </CustomTag>
          ))}
        </View>

        {/* 酒店价格 */}
        <View className="mt-auto flex justify-end w-full">
          <View className="flex items-baseline gap-1">
            <Text className="text-sm text-gray-300">
              {t("list.hotel_card.price_prefix")}
            </Text>
            <Text className="text-lg font-bold text-primary">
              ￥{formatAmount(price ?? 0)}
            </Text>
            <Text className="text-sm text-gray-300">
              {t("list.hotel_card.price_suffix")}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HotelCard;
