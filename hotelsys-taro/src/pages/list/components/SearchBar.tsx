import React, {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
  useRef,
} from "react";
import { View, Text, Span, Image } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import { useTime } from "@/utils/date";
import { timeType } from "@/types";
import dayjs from "dayjs";
import { Search } from "@nutui/icons-react-taro";
import { listIcon } from "@/constant/list";

interface IProps {
  city: string;
  dateForm?: {
    startDate: timeType;
    endDate: timeType;
  };
  searchText?: string;
}

const SearchBar: FC<IProps> = ({
  city,
  dateForm = { startDate: dayjs(), endDate: dayjs().add(1, "day") },
  searchText,
}) => {
  const { t } = useTranslation();
  const { formatDate } = useTime();

  return (
    <View className="flex justify-between items-center p-2 gap-2 w-full">
      {/* 搜索栏 */}
      <View className="flex-1 flex px-4 py-2 bg-custom-gray rounded-full items-center justify-between gap-1">
        {/* 位置 */}
        <View className="text-sm text-primary  max-w-[3em] truncate">
          {city ?? t("list.search_bar.unknown_location")}
        </View>
        {/* 分隔线 */}
        <View className="w-[2px] h-4 bg-custom-placeholder"></View>
        {/* 入住日期 */}
        <View className="flex items-center gap-1">
          {/* 入住 */}
          <Span className="text-sm text-primary">
            {formatDate(dateForm?.startDate)}
          </Span>
          {/* 至 */}
          <Span className="text-sm">-</Span>
          {/* 退房 */}
          <Span className="text-sm text-primary">
            {formatDate(dateForm?.endDate) ?? formatDate(dayjs().add(1, "day"))}
          </Span>
        </View>
        {/* 分隔线 */}
        <View className="w-[2px] h-4 bg-custom-placeholder"></View>
        {/* 搜索框 */}
        <View className="flex items-center gap-1">
          <Search size={"1rem"} color="#d0d0d0" />
          <Span className="text-sm text-custom-placeholder max-w-[8em] truncate">
            {searchText ?? t("home.location_bar.searchTextPlaceholder")}
          </Span>
        </View>
      </View>

      {/* 地图 */}
      <View className="flex flex-col items-center gap-1">
        <Image src={listIcon.map} className="size-4"></Image>
        <View className="text-xs">{t("list.search_bar.map")}</View>
      </View>
    </View>
  );
};

export default SearchBar;
