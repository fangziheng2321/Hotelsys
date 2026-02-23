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
import { SearchTabType } from "@/enum/home";

interface IProps {
  activeType: SearchTabType;
  onChange: (type: string) => void;
}

const SearchTabs: FC<IProps> = (props) => {
  const { t, i18n } = useTranslation();

  const isEn = i18n.language.startsWith("en");
  const fontSizeClass = isEn ? "text-sm" : "text-lg";
  const containerClass = isEn ? "px-2 justify-around" : "px-4 justify-between";

  const searchTypes = [
    {
      label: t("home.search_tabs.domestic"),
      value: SearchTabType.DOMESTIC,
    },
    {
      label: t("home.search_tabs.overseas"),
      value: SearchTabType.OVERSEAS,
    },
    {
      label: t("home.search_tabs.hourly"),
      value: SearchTabType.HOURLY,
    },
    {
      label: t("home.search_tabs.homestay"),
      value: SearchTabType.HOMESTAY,
    },
  ];

  return (
    <View className={`flex items-center ${containerClass}`}>
      {searchTypes.map((item) => (
        <Text
          className={[
            item.value === props.activeType
              ? "text-primary font-bold"
              : "text-gray-500",
            fontSizeClass,
            "whitespace-nowrap", // 强制不换行
          ].join(" ")}
          key={item.value}
          onClick={() => props.onChange(item.value)}
        >
          {item.label}
        </Text>
      ))}
    </View>
  );
};

export default SearchTabs;
