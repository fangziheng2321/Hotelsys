import React, { FC, useState, useMemo, Dispatch } from "react";
import { View, Text } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import { useTime } from "@/utils/date";
import { timeType } from "@/types";
import CalendarSelect from "@/components/CalendarSelect/CalendarSelect";

interface IProps {
  startDate: timeType;
  endDate: timeType;
  isVisible: boolean;
  setIsVisible: Dispatch<React.SetStateAction<boolean>>;
  setStayDate: (startDate: timeType, endDate: timeType) => void;
  onClick: () => void;
}

const DateRangeDisplay: FC<IProps> = ({
  startDate,
  endDate,
  isVisible,
  setStayDate,
  setIsVisible,
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
    <View>
      <View className="flex items-center justify-between" onClick={onClick}>
        <View className="flex items-center gap-2">
          {/* 开始时间 */}
          <View className="flex flex-wrap items-baseline gap-1">
            <Text className="text-lg font-bold whitespace-nowrap">
              {dateInfo.startText}
            </Text>
            <Text className="text-sm font-normal whitespace-nowrap text-gray-500">
              {dateInfo.startLabel}
            </Text>
          </View>

          {/* 分隔线 */}
          <View className="w-3 h-[1px] bg-gray-300 mx-1 flex-shrink-0"></View>

          {/* 结束时间 */}
          <View className="flex flex-wrap items-baseline gap-1">
            <Text className="text-lg font-bold whitespace-nowrap">
              {dateInfo.endText}
            </Text>
            <Text className="text-sm font-normal whitespace-nowrap text-gray-500">
              {dateInfo.endLabel}
            </Text>
          </View>
        </View>

        {/* 右侧晚数 */}
        <Text className="text-base font-normal text-gray-600 flex-shrink-0">
          {`${dateInfo.nights} ${t("home.location_bar.nights")}`}
        </Text>
      </View>
      <CalendarSelect
        isVisible={isVisible}
        startDate={startDate}
        endDate={endDate}
        setIsVisible={setIsVisible}
        setStayDate={setStayDate}
      />
    </View>
  );
};

export default DateRangeDisplay;
