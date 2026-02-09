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
import { Rate } from "@nutui/nutui-react-taro";
import StarRate from "@/components/StarRate/StarRate";
import CustomTag from "@/components/CustomTag/CustomTag";
import { useCurrency } from "@/utils/currency";
import Taro from "@tarojs/taro";

interface IProps extends hotelCardType {
  customClassName?: string;
}

const HotelCard: FC<IProps> = ({
  id,
  name,
  rate,
  score,
  address,
  tagList,
  price,
  imgUrl,
  customClassName,
}) => {
  const { t, i18n } = useTranslation();
  const { formatAmount } = useCurrency();

  /* 查看酒店详情 */
  const handleViewDetail = () => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`,
    });
  };

  return (
    <View
      className={`bg-white rounded-2xl p-3 h-48 flex items-center gap-3 w-full ${customClassName ?? ""}`}
      onClick={handleViewDetail}
    >
      {/* 图片 */}
      <Image
        src={imgUrl ?? ""}
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
          {/* 星级 */}
          <StarRate rate={rate} size="0.7rem" />
        </View>

        {/* 酒店评分 */}
        <View className="flex items-center gap-2">
          {/* 评分标签 */}
          <CustomTag customClassName="text-white">
            {(score ?? 0).toFixed(1)}
          </CustomTag>
          {/* 评分评价（如果大于等于4.7分，则显示） */}
          {score && score >= 4.7 && (
            <Text className="text-sm text-primary">
              {t("list.score_label")}
            </Text>
          )}
        </View>

        {/* 酒店地址 */}
        <Text className="text-sm text-gray-300 line-clamp-1 min-w-0 break-all">
          {address ?? "N/A"}
        </Text>

        {/* 酒店标签 */}
        <View className="flex flex-wrap gap-2 items-center">
          {tagList?.slice(0, 3).map((tag) => (
            <CustomTag
              key={tag}
              customClassName="bg-transparent border-secondary border border-solid text-secondary text-xs font-normal"
            >
              {tag}
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
