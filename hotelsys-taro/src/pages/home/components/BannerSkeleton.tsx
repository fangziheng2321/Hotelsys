import React, { FC } from "react";
import { View, Text } from "@tarojs/components";

interface IProps {}

const BannerSkeleton: FC<IProps> = (props) => {
  return (
    <View className="flex items-center gap-2 px-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <View className="h-20 w-40 sk-bg rounded-xl" key={index}></View>
      ))}
    </View>
  );
};

export default BannerSkeleton;
