import React, { FC, useState } from "react";
import {
  View,
  Image,
  CommonEventFunction,
  SwiperProps as TaroSwiperProps,
} from "@tarojs/components";
import { Swiper, SwiperItem } from "@tarojs/components";
import { bannerList as bannerImageList } from "@/constant/home";
import { BannerType } from "../types";

const SubBanner: FC = () => {
  const [bannerList, setBannerList] = useState<BannerType[]>(() => {
    return bannerImageList.map((item, index) => ({
      id: index,
      name: `酒店${index + 1}`,
      imgUrl: item,
    }));
  });

  /* 处理点击事件 */
  const handleClickBanner = (item: BannerType) => {
    console.log(item);
  };

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
