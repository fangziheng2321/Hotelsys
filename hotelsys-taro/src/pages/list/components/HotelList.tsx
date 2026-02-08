import React, {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
  useRef,
  CSSProperties,
} from "react";
import { View, Text, Image } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import {
  Cell,
  InfiniteLoading,
  Loading,
  Toast,
  VirtualList,
} from "@nutui/nutui-react-taro";
import { hotelCardType } from "../types";
import HotelCard from "./HotelCard";
import { More } from "@nutui/icons-react-taro";
import { hotelImg, listIcon } from "@/constant/list";

interface IProps {}

const sleep = (time: number): Promise<unknown> =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

const HotelList: FC<IProps> = (props) => {
  const { t } = useTranslation();
  const [refreshList, setRefreshList] = useState<hotelCardType[]>([]);
  const [refreshHasMore, setRefreshHasMore] = useState(true);

  const [show, SetShow] = useState(false);
  const [toastMsg, SetToastMsg] = useState("");
  const toastShow = (msg: any) => {
    SetToastMsg(msg);
    SetShow(true);
  };

  useEffect(() => {
    init();
  }, []);

  /* 初始化列表 */
  const init = () => {
    const list: hotelCardType[] = [];
    /* 模拟请求 */
    for (let i = 0; i < 10; i++) {
      list.push({
        id: i,
        name: `陆家嘴禧玥酒店${i}`,
        rate: Math.floor(Math.random() * 4) + 1,
        score: Math.random() * 4,
        address: "近外滩 · 东方明珠",
        tagList: ["免费升房", "新中式风", "一线江景"],
        price: Math.floor(Math.random() * 900) + 100,
        imgUrl: hotelImg[i % hotelImg.length],
      });
    }
    setRefreshList(list);
  };

  const refreshLoadMore = async () => {
    await sleep(500);
    const curLen = refreshList.length;
    const newData: hotelCardType[] = [];
    for (let i = curLen; i < curLen + 10; i++) {
      newData.push({
        id: i,
        name: `陆家嘴禧玥酒店${i}`,
        rate: Math.floor(Math.random() * 4) + 1,
        score: Math.random() * 4,
        address: "近外滩 · 东方明珠",
        tagList: ["免费升房", "新中式风", "一线江景"],
        price: Math.floor(Math.random() * 900) + 100,
        imgUrl: hotelImg[i % hotelImg.length],
      });
    }
    const newList = [...refreshList, ...newData];
    if (newList.length >= 30) {
      setRefreshHasMore(false);
      setRefreshList(newList);
    } else {
      setRefreshList(newList);
    }
  };

  const refresh = async () => {
    await sleep(500);
    toastShow("刷新成功");
  };

  return (
    <>
      <View id="refreshScroll" className="h-full">
        <InfiniteLoading
          pullingText={
            <View className="flex items-center gap-2 font-bold text-sm">
              <Loading />
              {t("list.tips.refresh")}
            </View>
          }
          loadingText={
            <View className="flex items-center gap-2 font-bold text-sm">
              <More />
              {t("list.tips.loading")}
            </View>
          }
          loadMoreText={
            <View className="flex flex-col items-center gap-2 font-bold text-sm">
              <Image src={listIcon.noMore} className="size-6" />
              {t("list.tips.noMore")}
            </View>
          }
          target="refreshScroll"
          pullRefresh
          hasMore={refreshHasMore}
          onLoadMore={refreshLoadMore}
          onRefresh={refresh}
        >
          {refreshList.map((item, index) => {
            return <HotelCard key={index} {...item} customClassName="mb-2" />;
          })}
        </InfiniteLoading>
      </View>
      <Toast
        visible={show}
        content={toastMsg}
        onClose={() => {
          SetShow(false);
        }}
      />
    </>
  );
};

export default HotelList;
