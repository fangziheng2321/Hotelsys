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
import { hotTagType } from "@/pages/home/types";

interface HotTagProps extends hotTagType {
  isSelected?: boolean;
}

interface IProps {
  list: HotTagProps[];
  selectedList: string[];
  onTagClick: (tag: HotTagProps) => void;
  hotTags: hotTagType[];
  customClassName?: string;
}

interface IHotTagProps extends Partial<HotTagProps> {
  onClick: () => void;
}

/* 标签列表 */
const HotTagList: FC<IProps> = ({
  list,
  selectedList,
  onTagClick,
  hotTags,
  customClassName,
}) => {
  /* 展示列表 */
  // const showList = useMemo(() => {
  //   // 将选中的标签放在最前面
  //   const selectedTags = hotTags.filter((item) =>
  //     selectedList.includes(item.value),
  //   );
  //   // 未选中的标签
  //   const unselectedTags = hotTags.filter(
  //     (item) => !selectedList.includes(item.value),
  //   );
  //   return [...selectedTags, ...unselectedTags];
  // }, [selectedList, hotTags]);

  return (
    <View
      className={[
        "flex items-center gap-2 overflow-x-auto scrollbar-hide",
        customClassName,
      ].join(" ")}
    >
      {list.map((item) => {
        return (
          <HotTag
            key={item.value}
            {...item}
            onClick={() => onTagClick(item)}
            isSelected={selectedList.includes(item.value)}
          />
        );
      })}
    </View>
  );
};

/* 标签 */
export const HotTag: FC<IHotTagProps> = ({ label, isSelected, onClick }) => {
  return (
    <View
      onClick={onClick}
      className={[
        "px-2 py-1 text-xs rounded-md flex-shrink-0 relative transition-colors duration-200 ease-in-out",
        isSelected ? "text-white bg-primary font-bold" : "bg-custom-gray",
      ].join(" ")}
    >
      <Text>{`${label}${isSelected ? " ·" : ""}`}</Text>
    </View>
  );
};

export default HotTagList;
