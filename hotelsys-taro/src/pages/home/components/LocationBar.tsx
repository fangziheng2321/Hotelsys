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
import { ArrowDownSmall } from "@nutui/icons-react-taro";
import { LocationBarIcon } from "@/constant/home";

interface IProps {
  cityName: string | null;
  searchText: string | null;
  onCityClick: () => void;
  onSearchClick: () => void;
  onLocateClick: () => void;
}

const LocationBar: FC<IProps> = (props) => {
  const { t } = useTranslation();

  return (
    <View className="flex justify-between items-center gap-2">
      {/* 定位器 */}
      <View className="flex items-center gap-2" onClick={props?.onCityClick}>
        <Text className="text-lg font-bold truncate max-w-[5em]">
          {props?.cityName ?? t("home.location_bar.myLocation")}
        </Text>
        {/* 图标，点击后跳转定位页面 */}
        <ArrowDownSmall size={"1rem"} />
      </View>
      {/* 分隔线 */}
      <View className="w-[3px] h-4 bg-custom-gray"></View>
      {/* 搜索栏 */}
      <View className="flex-1 min-w-0 flex items-center justify-between gap-4">
        <Text
          className={[
            props.searchText ? "" : "text-custom-placeholder",
            "flex-1  text-lg truncate",
          ].join(" ")}
          onClick={props?.onSearchClick}
        >
          {props.searchText ?? t("home.location_bar.searchTextPlaceholder")}
        </Text>
        <Image
          src={LocationBarIcon.Location}
          className="size-5"
          onClick={props?.onLocateClick}
        ></Image>
      </View>
    </View>
  );
};

export default LocationBar;
