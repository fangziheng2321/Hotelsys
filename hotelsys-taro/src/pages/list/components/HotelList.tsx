import React, { FC, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import { InfiniteLoading, Loading, Toast } from "@nutui/nutui-react-taro";
import { hotelCardType } from "../types";
import HotelCard from "./HotelCard";
import { More } from "@nutui/icons-react-taro";
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

  const [toastMsg, SetToastMsg] = useState("");
  const toastShow = (msg: any) => {
    SetToastMsg(msg);
    SetShow(true);
  };
  const refresh = async () => {
    refreshLoadMore(true);
    toastShow(t("list.refresh.success"));
  };

  if (loading) {
    return <HotelCardSkeleton />;
  }

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
          onLoadMore={() => refreshLoadMore(false)}
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
