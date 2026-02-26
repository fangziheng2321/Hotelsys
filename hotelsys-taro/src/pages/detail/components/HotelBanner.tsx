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
import { resolveImageUrl } from "@/utils/image";

interface IProps {
  list: string[];
}

const HotelBanner: FC<IProps> = ({ list }) => {
  const { t } = useTranslation();

  return (
    <Swiper autoplay={false} height={remToPx(16)} loop>
      {list.map((item, index) => (
        <Swiper.Item key={item}>
          <Image
            className="size-full"
            src={resolveImageUrl(item)}
            mode="aspectFill"
          />
        </Swiper.Item>
      ))}
    </Swiper>
  );
};

export default HotelBanner;
