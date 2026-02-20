import React, {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
  useRef,
} from "react";
import { View, Text } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import { DetailInfoType } from "../types";
import StarRate from "@/components/StarRate/StarRate";
import Facility from "./Facility";
import Address from "./Address";
import HotelComment from "./Comment";

interface IProps extends DetailInfoType {}

const DetailInfo: FC<IProps> = ({
  name,
  rate,
  facilities,
  description,
  address,
}) => {
  const { t } = useTranslation();

  return (
    <View className="relative flex flex-col gap-6">
      {/* 口碑推荐 */}
      <View className="absolute right-4 -top-12 w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-50 rounded-lg shadow-sm flex flex-col items-center justify-center border border-orange-200">
        <Text className="text-sm text-orange-800 font-bold">
          {t("detail.info.wordOfMouth")}
        </Text>
        <Text className="text-sm text-orange-800 font-bold">
          {t("detail.info.referral")}
        </Text>
      </View>

      {/* 酒店基础信息 */}
      <View className="flex flex-col gap-2 mt-6">
        {/* 名字 */}
        <Text className="text-xl font-bold text-gray-900 dark:text-dark-text leading-tight truncate">
          {name ?? "N/A"}
        </Text>
        {/* 星级 */}
        <StarRate rate={rate} />
      </View>

      {/* 酒店设施 */}
      <Facility facilities={facilities} />

      {/* 评价与地址 */}
      <View className="flex justify-between items-center h-20 gap-2">
        <HotelComment description={description} />
        <Address address={address} />
      </View>
    </View>
  );
};

export default DetailInfo;
