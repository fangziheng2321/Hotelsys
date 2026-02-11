import React, { FC, useState } from "react";
import { View, Text } from "@tarojs/components";
import {
  CommonEventFunction,
  SwiperProps as TaroSwiperProps,
} from "@tarojs/components";
import BannerSwiper from "@/components/BannerSwiper/BannerSwiper";
import { BannerType } from "../types";
import SubBanner from "./SubBanner";

interface IProps {
  onChange?: CommonEventFunction<TaroSwiperProps.onChangeEventDetail>;
  onClick?: (item: BannerType) => void;
}

const Banner: FC<IProps> = ({
  onChange = () => void 0,
  onClick = () => void 0,
}) => {
  const [bannerList, setBannerList] = useState<BannerType[]>([
    {
      id: 1,
      name: "酒店1",
      imgUrl: "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
    },
    {
      id: 2,
      name: "酒店2",
      imgUrl: "https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg",
    },
    {
      id: 3,
      name: "酒店3",
      imgUrl: "https://storage.360buyimg.com/jdc-article/welcomenutui.jpg",
    },
    {
      id: 4,
      name: "酒店4",
      imgUrl: "https://storage.360buyimg.com/jdc-article/fristfabu.jpg",
    },
  ]);

  return (
    <BannerSwiper
      customImgClassName="w-full h-full"
      imgList={bannerList.map((item) => item?.imgUrl ?? "")}
      showIndicators={false}
      onChange={onChange}
      onClick={(index) => onClick(bannerList[index])}
    />
  );
};

export default Banner;
