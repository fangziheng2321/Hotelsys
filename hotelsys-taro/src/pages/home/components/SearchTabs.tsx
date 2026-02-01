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
  const { t } = useTranslation();
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
    <View className="flex justify-between items-center">
      {searchTypes.map((item) => (
        <Text
          className={[
            item.value === props.activeType ? "text-primary font-bold" : "",
            "text-base",
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
