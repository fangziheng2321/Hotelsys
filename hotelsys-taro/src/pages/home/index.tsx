// src/pages/home/index.tsx
import React, { useState } from "react";
import { View, Text } from "@tarojs/components";
import { Button } from "@nutui/nutui-react-taro";
import Taro from "@tarojs/taro";
import BannerSwiper from "@/components/BannerSwiper";
import SearchTabs from "./components/SearchTabs";
import { SearchTabType } from "@/enum/home";
import { bannerList } from "@/constant/banner";

const Home = () => {
  const [activeTabType, setActiveTabType] = useState<SearchTabType>(
    SearchTabType.DOMESTIC,
  );

  /* 修改选中搜索Tabs */
  const handleChangeTab = (type: SearchTabType) => {
    setActiveTabType(type);
  };

  return (
    <View className="bg-custom-gray min-h-screen">
      {/* 轮播图 */}
      <BannerSwiper imgList={bannerList} showIndicators={false} />
      {/*  */}

      {/* 查询区域 */}
      <View className="bg-white w-[95%] rounded-md mx-auto -translate-y-5 py-4 px-6">
        <SearchTabs activeType={activeTabType} onChange={handleChangeTab} />
      </View>
    </View>
  );
};

export default Home;
