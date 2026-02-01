// src/pages/home/index.tsx
import React from "react";
import { View } from "@tarojs/components";
import { Button } from "@nutui/nutui-react-taro";
import Taro from "@tarojs/taro";

// 这里的 className 用的是 UnoCSS/Tailwind 写法
const Home = () => {
  const handleSearch = () => {
    console.log("去搜索...");
    // 路由跳转逻辑写在这里，下面会讲
  };

  return (
    <View className="p-4 bg-gray-100 min-h-screen">
      <View className="text-2xl font-bold text-center mb-6 text-primary">
        易宿酒店预订
      </View>

      <View className="bg-white rounded-lg p-4 shadow-md">
        <View className="mb-4">这里放城市选择组件</View>
        <View className="mb-4">这里放日期选择组件</View>

        <Button type="primary" block onClick={handleSearch}>
          开始搜索
        </Button>
      </View>
    </View>
  );
};

export default Home;
