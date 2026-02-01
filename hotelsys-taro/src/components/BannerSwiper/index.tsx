import React, { FC } from "react";
import {
  Image,
  CommonEventFunction,
  SwiperProps as TaroSwiperProps,
} from "@tarojs/components";
import { Swiper } from "@nutui/nutui-react-taro";

interface IProps {
  imgList: string[];
  autoplay?: boolean;
  showIndicators?: boolean;
  onChange?: CommonEventFunction<TaroSwiperProps.onChangeEventDetail>;
}

const BannerSwiper: FC<IProps> = ({
  imgList,
  autoplay = true,
  showIndicators = true,
  onChange = () => void 0,
}) => {
  return (
    <>
      <Swiper
        autoplay={autoplay}
        indicator={showIndicators}
        onChange={onChange}
      >
        {imgList.map((item, index) => (
          <Swiper.Item key={item}>
            <Image
              className="w-full object-fit"
              onClick={() => console.log(index)}
              src={item}
            />
          </Swiper.Item>
        ))}
      </Swiper>
    </>
  );
};

export default BannerSwiper;
