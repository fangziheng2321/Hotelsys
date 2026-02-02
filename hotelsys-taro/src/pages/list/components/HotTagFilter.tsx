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
import HotTagList from "@/components/HotTagList/HotTagList";
import { hotTagType } from "../types";

const HotTagFilter = () => {
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
    setSelectedList((pre) => {
      if (pre.includes(tag.value)) {
        return pre.filter((item) => item !== tag.value);
      } else {
        return [...pre, tag.value];
      }
    });
  };

  return (
    <HotTagList
      list={hotTags}
      onTagClick={handleClickTag}
      selectedList={selectedList}
    />
  );
};

export default HotTagFilter;
