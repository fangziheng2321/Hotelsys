import React, { FC, useEffect, useState } from "react";
import {
  View,
  Image,
  CommonEventFunction,
  SwiperProps as TaroSwiperProps,
} from "@tarojs/components";
import { Swiper, SwiperItem } from "@tarojs/components";
import { bannerList as bannerImageList } from "@/constant/home";
import { BannerType } from "../types";
import { getHomeBannerList } from "@/api/home";
import Taro from "@tarojs/taro";
import BannerSkeleton from "./BannerSkeleton";

const SubBanner: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [bannerList, setBannerList] = useState<BannerType[]>([]);

  // 获取主页酒店轮播图
  const loadBannerList = async () => {
    setLoading(true);
    try {
      const res = await getHomeBannerList();
      setBannerList(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* 处理点击事件 */
  const handleClickBanner = ({ id }: BannerType) => {
    if (!id) {
      return;
    }
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`,
    });
  };

  useEffect(() => {
    loadBannerList();
  }, []);

  if (loading) {
    return <BannerSkeleton />;
  }

  return (
    <View className="w-full">
      <Swiper
        className="h-20"
        displayMultipleItems={3}
        circular
        autoplay
        previousMargin="24rpx"
        nextMargin="24rpx"
      >
        {bannerList.map((item) => (
          <SwiperItem key={item.id}>
            <View className="px-1 h-full box-border">
              <Image
                onClick={() => handleClickBanner(item)}
                src={item?.imgUrl ?? ""}
                className="w-full h-full rounded-xl border-4 border-white box-border"
                mode="aspectFill"
              />
            </View>
          </SwiperItem>
        ))}
      </Swiper>
    </View>
  );
};

export default SubBanner;
