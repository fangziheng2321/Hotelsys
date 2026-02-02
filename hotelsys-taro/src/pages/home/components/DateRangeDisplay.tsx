import React, { FC, useState, useMemo } from "react";
import { View, Text } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import { useTime } from "@/utils/date";
import { timeType } from "../types";

interface IProps {
  startDate: timeType;
  endDate: timeType;
  onClick: () => void;
}

const DateRangeDisplay: FC<IProps> = ({
  startDate,
  endDate,
  onClick,
}: IProps) => {
  const { getDayLabel, getDuration, formatDate } = useTime();
  const { t, i18n } = useTranslation();

  const dateInfo = useMemo(() => {
    const nights = getDuration(startDate, endDate);
    return {
      startText: formatDate(startDate),
      startLabel: getDayLabel(startDate),
      endText: formatDate(endDate),
      endLabel: getDayLabel(endDate),
      nights,
    };
  }, [startDate, endDate, i18n.language]);

  return (
    <View className="flex items-center justify-between" onClick={onClick}>
      <View className="flex items-center gap-2 text-lg font-bold">
        {/* 开始时间 */}
        <View className="flex items-center gap-1">
          <Text>{dateInfo.startText}</Text>
          <Text className="text-sm font-normal">{dateInfo.startLabel}</Text>
        </View>
        {/* 到 */}
        <View className="w-4 h-[1px] bg-custom-gray"></View>
        {/* 结束时间 */}
        <View className="flex items-center gap-1">
          <Text>{dateInfo.endText}</Text>
          <Text className="text-sm font-normal">{dateInfo.endLabel}</Text>
        </View>
      </View>
      <Text className="text-base font-normal">{`${dateInfo.nights} ${t("home.location_bar.nights")}`}</Text>
    </View>
  );
};

export default DateRangeDisplay;
