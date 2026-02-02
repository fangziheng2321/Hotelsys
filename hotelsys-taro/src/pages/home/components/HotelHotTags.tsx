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
import { HotTag } from "@/components/HotTagList/HotTagList";
import { hotTagType } from "../types";

const HotelHotTags = () => {
  const [selectedList, setSelectedList] = useState<string[]>([]);
  const hotTags = [
    {
      label: "免费停车场",
      value: "free_parking",
    },
    {
      label: "免费 wifi",
      value: "free_wifi",
    },
    {
      label: "免费早餐",
      value: "free_breakfast",
    },
    {
      label: "24小时服务",
      value: "24_hour_service",
    },
  ];

  const handleClickTag = (tag: hotTagType) => {
    console.log(tag);
  };

  return (
    <View className="flex items-center gap-2 overflow-x-auto">
      {hotTags.map((item) => {
        return (
          <HotTag
            key={item.value}
            onClick={() => handleClickTag(item)}
            label={item.label}
          ></HotTag>
        );
      })}
    </View>
  );
};

export default HotelHotTags;
