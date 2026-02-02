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
import { Check } from "@nutui/icons-react-taro";

interface HotTagProps extends hotTagType {
  isSelected?: boolean;
}

interface IProps {
  list: HotTagProps[];
  selectedList: string[];
  onTagClick: (tag: HotTagProps) => void;
}

interface IHotTagProps extends Partial<HotTagProps> {
  onClick: () => void;
}

/* 标签列表 */
const HotTagList: FC<IProps> = ({ list, selectedList, onTagClick }) => {
  return (
    <View className="flex items-center gap-2 overflow-x-auto">
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
        "px-2 py-1 bg-custom-gray text-xs rounded-md flex-shrink-0 relative",
      ].join(" ")}
    >
      <Text>{label}</Text>
      {isSelected && (
        <View className="absolute right-0 bottom-0 bg-primary rounded-full flex items-center justify-center p-1">
          <Check size={"0.5rem"} color="white" />
        </View>
      )}
    </View>
  );
};

export default HotTagList;
