import React, { useEffect, useMemo, useState } from "react";
import { View } from "@tarojs/components";
import SafeNavBar from "./components/SafeNavBar";
import SearchBar from "./components/SearchBar";
import "./index.scss";
import FilterBar from "./components/FilterBar";
import Divide from "../home/components/Divide";
import { hotelCardType } from "./types";
import HotelList from "./components/HotelList";
import { getFilteredHotelListByPage } from "@/api/list";
import { useCitySelect } from "@/hooks/useCitySelect";
import HotelHotTags from "../home/components/HotelHotTags";
import { useSearchStore } from "@/store/searchStore";
import { SearchTabType } from "@/enum/home";
import { useDebounce } from "@/hooks/useDebounce";
import PageWrapper from "@/components/PageWrapper/PageWrapper";
import ListSkeleton from "./components/ListSkeleton";

const List = () => {
  const pageSize = 10;
  const [loading, setLoading] = useState<boolean>(true);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  /* 表单数据 */
  const {
    location,
    stayDate,
    type,
    hotelName,
    facilities,
    priceRange,
    rate,
    setStayDate,
    setType,
    setHotelName,
    setFacilities,
    setPriceRange,
    setRate,
    distance,
    setDistance,
  } = useSearchStore();

  const { cityName, navigateToCitySelector } = useCitySelect();
  const filterForm = useMemo(() => {
    return {
      type: type,
      distance: distance,
      priceRange: priceRange,
      rate: rate,
    };
  }, [type, priceRange, distance, rate]);
  const setFilterForm = (
    tag: "type" | "distance" | "priceRange" | "rate",
    value: SearchTabType | number | number[] | null,
  ) => {
    switch (tag) {
      case "type":
        setType(value as SearchTabType);
        break;
      case "distance":
        setDistance(value as number[]);
        break;
      case "priceRange":
        setPriceRange(value as number[]);
      case "rate":
        setRate(value as number);
    }
  };
  const [refreshList, setRefreshList] = useState<hotelCardType[]>([]);
  const [refreshHasMore, setRefreshHasMore] = useState(true);
  // 对搜索框的酒店名进行防抖
  const debouncedHotelName = useDebounce(hotelName, 500);

  /* 获取酒店列表 */
  const refreshLoadMore = async (isRefresh = false) => {
    if (listLoading) return;
    if (!isRefresh && !refreshHasMore) return;

    const currentPage = isRefresh ? 1 : page;

    if (isRefresh) setListLoading(true);

    try {
      const res = await getFilteredHotelListByPage({
        location: location.cityName,
        latitude: location.latitude,
        longitude: location.longitude,
        facilities: facilities,
        hotelName: debouncedHotelName,
        currentPage,
        pageSize,
        ...filterForm,
      });

      if (isRefresh) {
        setRefreshList(res.list);
      } else {
        setRefreshList((pre) => [...pre, ...res?.list]);
      }

      setPage(res.currentPage + 1);
      setRefreshHasMore(res.hasMore);
    } catch (error) {
      console.error(error);
    } finally {
      if (loading) setLoading(false);
      setListLoading(false);
    }
  };

  useEffect(() => {
    refreshLoadMore();
  }, []);

  // 监听筛选
  useEffect(() => {
    setPage(1);
    setRefreshHasMore(true);
    refreshLoadMore(true);
  }, [stayDate, cityName, filterForm, facilities, debouncedHotelName]);

  if (loading) {
    return (
      <PageWrapper>
        <ListSkeleton />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <View className="bg-custom-gray dark:bg-dark-bg h-screen flex flex-col">
        {/* 顶部 */}
        <View className="bg-white dark:bg-dark-card h-fit">
          {/* 顶部安全导航栏 */}
          <SafeNavBar />

          {/* 搜索栏 */}
          <SearchBar
            city={cityName}
            startDate={stayDate.startDate}
            endDate={stayDate.endDate}
            searchText={hotelName}
            setSearchText={setHotelName}
            setStayDate={setStayDate}
            onClickDate={navigateToCitySelector}
          />

          {/* 分隔线 */}
          <Divide />

          {/* 筛选框 */}
          <FilterBar filterForm={filterForm} setFilterForm={setFilterForm} />

          {/* 热门标签（设施） */}
          <HotelHotTags
            customClassName="p-2"
            selectedList={facilities}
            setSelectedList={setFacilities}
          />
        </View>

        {/* 列表 */}
        <View className="px-2 py-2 pb-4 flex-1 overflow-y-auto">
          <HotelList
            loading={listLoading}
            refreshHasMore={refreshHasMore}
            refreshList={refreshList}
            refreshLoadMore={refreshLoadMore}
          />
        </View>
      </View>
    </PageWrapper>
  );
};

export default List;
