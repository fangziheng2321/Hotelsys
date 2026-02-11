import React, { FC } from "react";
import {
  Image,
  CommonEventFunction,
  SwiperProps as TaroSwiperProps,
  ITouchEvent,
} from "@tarojs/components";
import { pxTransform, Swiper } from "@nutui/nutui-react-taro";

interface IProps {
  imgList: string[];
  autoplay?: boolean;
  customImgClassName?: string;
  showIndicators?: boolean;
  onChange?: CommonEventFunction<TaroSwiperProps.onChangeEventDetail>;
  onClick?: (index: number) => void;
}

const BannerSwiper: FC<IProps> = ({
  imgList,
  autoplay = true,
  customImgClassName = "",
  showIndicators = true,
  onChange = () => void 0,
  onClick = () => void 0,
}) => {
  return (
    <>
      <Swiper
        width={pxTransform(200)}
        autoplay={autoplay}
        indicator={showIndicators}
        onChange={onChange}
      >
        {imgList.map((item, index) => (
          <Swiper.Item key={item}>
            <Image
              className="w-full h-full"
              onClick={() => onClick(index)}
              src={item}
            />
          </Swiper.Item>
        ))}
      </Swiper>
    </>
  );
};

export default BannerSwiper;
