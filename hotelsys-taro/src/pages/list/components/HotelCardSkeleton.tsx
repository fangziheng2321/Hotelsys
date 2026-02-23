import React, { FC } from "react";
import { View, Text } from "@tarojs/components";

interface IProps {}

const HotelCardSkeleton: FC<IProps> = (props) => {
  return Array.from({ length: 3 }).map((_, index) => (
    <View className="bg-white dark:bg-dark-card rounded-2xl p-3 h-48 flex items-center gap-3 w-full mb-2">
      {/* 图片 */}
      <View className="h-full rounded-lg w-28 flex-shrink-0 sk-bg"></View>
      <View className="h-full flex-1 flex flex-col justify-between items-start gap-2">
        {/* 酒店名称/星级 */}
        <View className="flex min-w-0 gap-2 items-baseline">
          {/* 酒店名字 */}
          <Text className="h-6 w-14 sk-bg"></Text>
          {/* 星级 */}
          <View className="h-6 w-14 sk-bg"></View>
        </View>

        {/* 酒店评分 */}
        <View className="flex items-center gap-2">
          {/* 评分标签 */}
          <View className="w-8 h-5 sk-bg"></View>
        </View>

        {/* 酒店地址 */}
        <View className="w-10 h-3 sk-bg"></View>

        {/* 酒店标签 */}
        <View className="flex flex-wrap gap-2 items-center">
          {[1, 2, 3].map((_) => (
            <View className="w-8 h-5 sk-bg"></View>
          ))}
        </View>

        {/* 酒店价格 */}
        <View className="mt-auto flex justify-end w-full">
          <View className="flex items-baseline gap-1">
            <View className="w-12 h-5 sk-bg"></View>
          </View>
        </View>
      </View>
    </View>
  ));
};

export default HotelCardSkeleton;
