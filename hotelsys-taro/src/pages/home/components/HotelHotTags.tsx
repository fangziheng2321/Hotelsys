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
import { HOTEL_FACILITIES } from "@/constant/facility";
import { FacilityItem } from "@/types";

interface IProps {
  selectedList: string[];
  setSelectedList: (selecetedList: string[]) => void;
  customClassName?: string;
}

const HotelHotTags = ({
  selectedList,
  setSelectedList,
  customClassName,
}: IProps) => {
  const handleClickTag = (tag: FacilityItem) => {
    if (selectedList.includes(tag.id)) {
      setSelectedList(selectedList.filter((item) => item !== tag.id));
    } else {
      setSelectedList([...selectedList, tag.id]);
    }
  };

  return (
    <HotTagList
      customClassName={customClassName}
      list={HOTEL_FACILITIES}
      onTagClick={handleClickTag}
      selectedList={selectedList}
    />
  );
};

export default HotelHotTags;
