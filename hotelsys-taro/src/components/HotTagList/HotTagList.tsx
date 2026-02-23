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
import { FacilityItem } from "@/types";
import { useTranslation } from "react-i18next";

interface HotTagProps extends FacilityItem {
  isSelected?: boolean;
}

interface IProps {
  list: HotTagProps[];
  selectedList: string[];
  onTagClick: (tag: HotTagProps) => void;
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
  customClassName,
}) => {
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
            key={item.id}
            {...item}
            onClick={() => onTagClick(item)}
            isSelected={selectedList.includes(item.id)}
          />
        );
      })}
    </View>
  );
};

/* 标签 */
export const HotTag: FC<IHotTagProps> = ({ name, isSelected, onClick }) => {
  const { t } = useTranslation();
  return (
    <View
      onClick={onClick}
      className={[
        "px-2 py-1 text-xs rounded-md flex-shrink-0 relative transition-colors duration-200 ease-in-out",
        isSelected
          ? "text-white bg-primary font-bold dark:text-dark-text"
          : "bg-custom-gray dark:bg-dark-bg",
      ].join(" ")}
    >
      <Text>{`${t(name as any)}${isSelected ? " ·" : ""}`}</Text>
    </View>
  );
};

export default HotTagList;
