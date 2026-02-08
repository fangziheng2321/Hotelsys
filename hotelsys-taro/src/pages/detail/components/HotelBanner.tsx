import React, {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
  useRef,
} from "react";
import { Image } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import { Swiper } from "@nutui/nutui-react-taro";
import { remToPx } from "@/utils/style";

interface IProps {}

const HotelBanner: FC<IProps> = (props) => {
  const { t } = useTranslation();
  const list = [
    "https://modao.cc/agent-py/media/generated_images/2026-02-07/0f513ec570834b798774104363e44c81.jpg",
    "https://modao.cc/agent-py/media/generated_images/2026-02-03/0356c22d93a042c794e0f0ca57400f1f.jpg",
    "https://modao.cc/agent-py/media/generated_images/2026-02-03/6c6959e198984f0888aa0718f1bd992d.jpg",
  ];

  return (
    <Swiper autoplay={false} height={remToPx(16)} loop>
      {list.map((item, index) => (
        <Swiper.Item key={item}>
          <Image className="size-full" src={item} mode="aspectFill" />
        </Swiper.Item>
      ))}
    </Swiper>
  );
};

export default HotelBanner;
