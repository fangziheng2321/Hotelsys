import React, { FC } from "react";
import { View } from "@tarojs/components";

const DetailSkeleton: FC = () => {
  return (
    <View className="bg-white dark:bg-dark-bg min-h-screen">
      {/* 1. 顶部 Banner 占位 (模拟大图) */}
      <View className="w-full h-64 sk-bg"></View>

      {/* 2. 核心信息区 (模拟标题和评分) */}
      <View className="p-4">
        {/* 标题 */}
        <View className="h-8 w-3/4 mb-4 sk-bg"></View>

        {/* 评分和标签行 */}
        <View className="flex gap-2 mb-6">
          <View className="h-5 w-12 sk-bg"></View>
          <View className="h-5 w-20 sk-bg"></View>
          <View className="h-5 w-16 ml-auto sk-bg"></View>
        </View>

        {/* 3. 设施条占位 (模拟4个圆圈图标) */}
        <View className="flex justify-between mb-6 px-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} className="flex flex-col items-center gap-2">
              <View className="size-8 rounded-full sk-bg"></View>
              <View className="h-3 w-10 sk-bg"></View>
            </View>
          ))}
        </View>

        {/* 4. 分隔块 */}
        <View className="h-2 bg-gray-100 dark:bg-gray-800 mb-4 -mx-4"></View>

        {/* 5. 房型列表占位 (模拟3个卡片) */}
        <View className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <View key={i} className="flex gap-3">
              {/* 左侧房型图 */}
              <View className={`w-24 h-24 flex-shrink-0 sk-bg`}></View>
              {/* 右侧信息 */}
              <View className="flex-1 flex flex-col justify-between py-1">
                <View className="h-5 w-1/2 sk-bg"></View>
                <View className="h-3 w-full sk-bg"></View>
                <View className="h-3 w-2/3 sk-bg"></View>
                <View className="flex justify-end mt-2">
                  <View className="h-8 w-20 rounded-full sk-bg"></View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default DetailSkeleton;
