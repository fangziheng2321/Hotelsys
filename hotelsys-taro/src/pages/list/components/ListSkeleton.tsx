import React, { FC } from "react";
import { View, Text } from "@tarojs/components";
import HotelCardSkeleton from "./HotelCardSkeleton";

const ListSkeleton: FC = () => {
  return (
    <View className="bg-custom-gray dark:bg-dark-bg min-h-screen">
      <View className="h-52 bg-white dark:bg-dark-bg"></View>
      <View className="bg-custom-gray dark:bg-dark-bg px-2 py-2 pb-4 flex-1 overflow-y-auto">
        <HotelCardSkeleton />
      </View>
    </View>
  );
};

export default ListSkeleton;
