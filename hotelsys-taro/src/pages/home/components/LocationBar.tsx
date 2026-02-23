import React, {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import { View, Text, Image, Input } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import { ArrowDownSmall } from "@nutui/icons-react-taro";
import { LocationBarIcon } from "@/constant/home";

interface IProps {
  cityName: string | null;
  searchText: string | null;
  setSearchText: Dispatch<SetStateAction<string | null>>;
  onCityClick: () => void;
  onLocateClick: () => void;
}

const LocationBar: FC<IProps> = (props) => {
  const { t } = useTranslation();

  const handleInputSearchText = (e) => {
    const val = e.detail.value;
    if (val) {
      props.setSearchText(val);
    } else {
      props.setSearchText(null);
    }
  };

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
        {/* <Text
          className={[
            props.searchText ? "" : "text-custom-placeholder",
            "flex-1  text-lg truncate",
          ].join(" ")}
          onClick={props?.onSearchClick}
        >
          {props.searchText ?? t("home.location_bar.searchTextPlaceholder")}
        </Text> */}
        <Input
          value={props?.searchText ?? ""}
          className="text-lg flex-1"
          placeholderClass="text-custom-placeholder"
          placeholder={t("home.location_bar.searchTextPlaceholder")}
          onInput={handleInputSearchText}
        ></Input>
        <Image
          src={LocationBarIcon.Location}
          className="w-5 h-5 shrink-0"
          mode="aspectFit"
          onClick={props?.onLocateClick}
        ></Image>
      </View>
    </View>
  );
};

export default LocationBar;
