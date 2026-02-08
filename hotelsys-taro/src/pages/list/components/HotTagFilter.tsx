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
import HotTagList from "@/components/HotTagList/HotTagList";
import { hotTagType } from "../types";

interface IProps {
  selectedList: string[];
  setSelectedList: Dispatch<SetStateAction<string[]>>;
}

const HotTagFilter = ({ selectedList, setSelectedList }: IProps) => {
  const hotTags = [
    {
      id: 1,
      label: "免费停车场",
      value: "free_parking",
    },
    {
      id: 2,
      label: "免费 wifi",
      value: "free_wifi",
    },
    {
      id: 3,
      label: "免费早餐",
      value: "free_breakfast",
    },
    {
      id: 4,
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
      customClassName="p-2"
      onTagClick={handleClickTag}
      selectedList={selectedList}
      hotTags={hotTags}
    />
  );
};

export default HotTagFilter;
