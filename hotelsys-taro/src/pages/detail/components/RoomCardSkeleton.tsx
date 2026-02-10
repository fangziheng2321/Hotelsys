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

interface IProps {}

const RoomCardSkeleton: FC<IProps> = (props) => {
  const { t } = useTranslation();

  return (
    <View className="flex flex-col gap-4 py-2">
      {[1, 2, 3].map((i) => (
        <View key={i} className="flex gap-3">
          {/* 左侧房型图 */}
          <View className={`w-24 h-24 flex-shrink-0 sk-bg`}></View>
          {/* 右侧信息 */}
          <View className="flex-1 flex flex-col justify-between py-1">
            <View className={`h-5 w-1/2 sk-bg`}></View>
            <View className={`h-3 w-full sk-bg`}></View>
            <View className={`h-3 w-2/3 sk-bg`}></View>
            <View className="flex justify-end mt-2">
              <View className={`h-8 w-20 rounded-full sk-bg`}></View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default RoomCardSkeleton;
