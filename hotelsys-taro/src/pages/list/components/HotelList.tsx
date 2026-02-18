import React, { FC, useState } from "react";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import { InfiniteLoading, Loading, Toast } from "@nutui/nutui-react-taro";
import { hotelCardType } from "../types";
import HotelCard from "./HotelCard";
import { More, Refresh, Top } from "@nutui/icons-react-taro";
import { listIcon } from "@/constant/list";
import HotelCardSkeleton from "./HotelCardSkeleton";

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

  const [toastMsg, SetToastMsg] = useState("");
  const toastShow = (msg: any) => {
    SetToastMsg(msg);
    SetShow(true);
  };
  const refresh = async () => {
    refreshLoadMore(true);
    toastShow(t("list.refresh.success"));
  };

  const onScroll = (height: number) => {
    if (height > 300 && !showBackTop) {
      setShowBackTop(true);
    } else if (height <= 300 && showBackTop) {
      setShowBackTop(false);
    }
  };

  const handleBackToTop = () => {
    setScrollTop(Math.random() * 0.001);
  };

  if (loading) {
    return <HotelCardSkeleton />;
  }

  return (
    <>
      <View id="refreshScroll" className="h-full">
        <InfiniteLoading
          onScroll={onScroll}
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
          {refreshList.map((item, index) => {
            return <HotelCard key={index} {...item} customClassName="mb-2" />;
          })}
        </InfiniteLoading>
      </View>
      {/* 工具按钮 */}
      {showBackTop && (
        <View className="fixed bottom-10 left-4 z-50 flex gap-2">
          {/* 返回顶部 */}
          <View
            className=" bg-white rounded-full shadow-lg p-3 border border-gray-100 flex items-center justify-center active:opacity-70 transition-opacity duration-300"
            onClick={handleBackToTop}
          >
            <Top size={20} color="#0052D9" />
          </View>
          {/* 刷新 */}
          <View
            className=" bg-white rounded-full shadow-lg p-3 border border-gray-100 flex items-center justify-center active:opacity-70 transition-opacity duration-300"
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
    </>
  );
};

export default HotelList;
