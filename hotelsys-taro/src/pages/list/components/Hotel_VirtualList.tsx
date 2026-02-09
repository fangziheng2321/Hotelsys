import React, {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
  useRef,
} from "react";
import { View, Text } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import { VirtualList } from "@nutui/nutui-react-taro";
import { hotelCardType } from "../types";
import HotelCard from "./HotelCard";
import Taro from "@tarojs/taro";
import { remToPx } from "@/utils/style";

interface IProps {}

const HotelList: FC<IProps> = (props) => {
  const { t } = useTranslation();
  const [list, setList] = useState<hotelCardType[]>([]);
  // 分页
  const [pageNo, setPageNo] = useState(1);
  const isLoading = useRef(false);
  const getData = () => {
    /* 模拟请求 */
    const data: hotelCardType[] = [];
    const pageSize = 5;
    for (let i = (pageNo - 1) * pageSize; i < pageNo * pageSize; i++) {
      const num = i;
      data.push({
        id: num,
        name: `陆家嘴禧玥酒店${num}`,
        rate: Math.floor(Math.random() * 4) + 1,
        score: Math.random() * 4,
        address: "近外滩 · 东方明珠",
        facilities: ["免费升房", "新中式风", "一线江景"],
        price: Math.floor(Math.random() * 900) + 100,
        imgUrl:
          "https://modao.cc/agent-py/media/generated_images/2026-02-03/6c6959e198984f0888aa0718f1bd992d.jpg",
      });
    }
    setList((list) => {
      return [...list, ...data];
    });
    setTimeout(() => {
      isLoading.current = false;
    }, 30);
  };
  const itemRender = (data: hotelCardType) => {
    return <HotelCard {...data} />;
  };
  const onScroll = () => {
    if (pageNo > 25 || isLoading.current) return;
    isLoading.current = true;
    setPageNo(pageNo + 1);
  };
  useEffect(() => {
    getData();
  }, [pageNo]);

  return (
    <VirtualList
      list={list}
      itemRender={itemRender}
      itemHeight={remToPx(12)}
      onScroll={onScroll}
    />
  );
};

export default HotelList;
