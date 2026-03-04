import React, { FC, useEffect, useRef, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import { InfiniteLoading, Loading, Toast } from "@nutui/nutui-react-taro";
import { hotelCardType } from "../types";
import HotelCard from "./HotelCard";
import { More, Refresh, Top } from "@nutui/icons-react-taro";
import { listIcon } from "@/constant/list";
import HotelCardSkeleton from "./HotelCardSkeleton";
import { useSearchStore } from "@/store/searchStore";
import Taro from "@tarojs/taro";

interface IProps {
  loading: boolean;
  refreshList: hotelCardType[];
  refreshHasMore: boolean;
  refreshLoadMore: (isRefresh: boolean) => Promise<void>;
}

const HotelList: FC<IProps> = ({
  loading,
  refreshList,
  refreshHasMore,
  refreshLoadMore,
}) => {
  const { t } = useTranslation();
  const [show, SetShow] = useState(false);
  const [scrollTop, setScrollTop] = useState<number>();
  const [showBackTop, setShowBackTop] = useState<boolean>(false);
  const observerRef = useRef<Taro.IntersectionObserver | null>(null);
  const { lastViewedHotelId } = useSearchStore();

  const [toastMsg, SetToastMsg] = useState("");
  const toastShow = (msg: any) => {
    SetToastMsg(msg);
    SetShow(true);
  };
  const refresh = async () => {
    refreshLoadMore(true);
    setShowBackTop(false);
    toastShow(t("list.refresh.success"));
  };

  // 监听滚动
  // const onScroll = (height: number) => {
  //   if (height > 300 && !showBackTop) {
  //     setShowBackTop(true);
  //   } else if (height <= 300 && showBackTop) {
  //     setShowBackTop(false);
  //   }
  // };

  const handleBackToTop = () => {
    setScrollTop(Math.random() * 0.001);
  };

  // IntersectionObserver 监听滚动，优化监听
  useEffect(() => {
    if (loading) return;

    Taro.nextTick(() => {
      const observer = Taro.createIntersectionObserver(null as any);

      observer
        .relativeToViewport()
        // 监听列表最上方的锚点
        .observe("#top-anchor", (res) => {
          // 如果 top < 0，说明锚点已经滚出视野上方，即滚动超过了 0px
          if (res.boundingClientRect!.top < 0) {
            setShowBackTop(true);
          } else {
            setShowBackTop(false);
          }
        });

      observerRef.current = observer;
    });

    return () => observerRef.current?.disconnect();
  }, [loading]);

  if (loading) {
    return <HotelCardSkeleton />;
  }

  return (
    <View className="h-full">
      <View id="refreshScroll" className="h-full">
        {/* 无限列表 */}
        <InfiniteLoading
          // onScroll={onScroll}
          scrollTop={scrollTop}
          scrollWithAnimation
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
          onLoadMore={() => refreshLoadMore(false)}
          onRefresh={refresh}
        >
          {/* 哨兵放在列表最前面，直接作为第一个元素 */}
          <View id="top-anchor" className="h-px w-full" />
          {refreshList.map((item, index) => {
            const isLastViewed = item.id === lastViewedHotelId;
            return (
              <HotelCard
                key={item.id}
                {...item}
                customClassName="mb-2"
                isVisited={isLastViewed}
              />
            );
          })}
        </InfiniteLoading>
      </View>
      {/* 工具按钮 */}
      {showBackTop && (
        <View className="fixed bottom-10 left-4 z-50 flex gap-2">
          {/* 返回顶部 */}
          <View
            className=" bg-white dark:bg-dark-bg rounded-full shadow-lg p-3 flex items-center justify-center active:opacity-70 transition-opacity duration-300"
            onClick={handleBackToTop}
          >
            <Top size={20} color="#0052D9" />
          </View>
          {/* 刷新 */}
          <View
            className=" bg-white dark:bg-dark-bg rounded-full shadow-lg p-3 flex items-center justify-center active:opacity-70 transition-opacity duration-300"
            onClick={() => {
              handleBackToTop();
              refresh();
            }}
          >
            <Refresh size={20} color="#0052D9" />
          </View>
        </View>
      )}
      <Toast
        visible={show}
        content={toastMsg}
        duration={1}
        onClose={() => {
          SetShow(false);
        }}
      />
    </View>
  );
};

export default HotelList;
