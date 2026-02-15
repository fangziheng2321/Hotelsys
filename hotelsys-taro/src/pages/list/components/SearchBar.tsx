import React, {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
  useRef,
} from "react";
import { View, Text, Span, Image, Input } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import { useTime } from "@/utils/date";
import { timeType } from "@/types";
import dayjs from "dayjs";
import { Search } from "@nutui/icons-react-taro";
import { listIcon } from "@/constant/list";
import CalendarSelect from "@/components/CalendarSelect/CalendarSelect";
import Taro from "@tarojs/taro";

interface IProps {
  city: string;
  startDate: timeType;
  endDate: timeType;
  searchText: string | null;
  setSearchText: (searchText: string | null) => void;
  setStayDate: (star: timeType, end: timeType) => void;
  onClickDate?: () => void;
}

const SearchBar: FC<IProps> = ({
  city,
  startDate,
  endDate,
  searchText,
  setSearchText,
  setStayDate,
  onClickDate,
}) => {
  const { t } = useTranslation();
  const { formatDate } = useTime();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // 控制酒店输入框UI
  const [isSearchFocused, setIsSearchFoucused] = useState<boolean>(false);

  const handleInputSearchText = (e) => {
    const val = e.detail.value;
    if (val) {
      setSearchText(val);
    } else {
      setSearchText(null);
    }
  };

  return (
    <View className="w-full">
      <View className="flex justify-between items-center p-2 gap-2 w-full">
        {/* 搜索栏 */}
        <View className="flex-1 flex px-4 py-2 bg-custom-gray rounded-full items-center overflow-hidden">
          {/* 左侧的位置和日期 */}
          <View
            className={[
              "flex items-center shrink-0 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out gap-2",
              isSearchFocused ? "max-w-0 opacity-0" : "max-w-60 opacity-100",
            ].join(" ")}
          >
            {/* 位置 */}
            <View
              className="text-sm text-primary  max-w-[3em] truncate"
              onClick={onClickDate}
            >
              {city ?? t("list.search_bar.unknown_location")}
            </View>
            {/* 分隔线 */}
            <View className="w-[2px] h-4 bg-custom-placeholder"></View>
            {/* 日期 */}
            <View
              className="flex items-center gap-1"
              onClick={() => setIsVisible(true)}
            >
              {/* 入住 */}
              <Span className="text-sm text-primary">
                {formatDate(startDate)}
              </Span>
              {/* 至 */}
              <Span className="text-sm">-</Span>
              {/* 退房 */}
              <Span className="text-sm text-primary">
                {formatDate(endDate) ?? formatDate(dayjs().add(1, "day"))}
              </Span>
            </View>
            {/* 分隔线 */}
            <View className="w-[2px] h-4 bg-custom-placeholder mr-2"></View>
          </View>
          {/* 搜索框 */}
          <View className="flex-1 flex items-center gap-1 min-w-0">
            <Search size={"1rem"} color="#d0d0d0" className="shrink-0" />
            <Input
              value={searchText ?? ""}
              className="flex-1 text-sm font-bold min-w-0 transition-all duration-300 truncate"
              placeholderClass="text-custom-placeholder font-normal"
              placeholder={t("home.location_bar.searchTextPlaceholder")}
              onInput={handleInputSearchText}
              onFocus={() => setIsSearchFoucused(true)}
              onBlur={() => setIsSearchFoucused(false)}
            ></Input>
          </View>
        </View>

        {/* 地图 */}
        <View
          className="flex flex-col items-center gap-1"
          onClick={() => Taro.navigateTo({ url: "/pages/map/index" })}
        >
          <Image src={listIcon.map} className="size-4"></Image>
          <View className="text-xs">{t("list.search_bar.map")}</View>
        </View>
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

export default SearchBar;
