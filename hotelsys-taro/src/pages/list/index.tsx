import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import SafeNavBar from "./components/SafeNavBar";
import SearchBar from "./components/SearchBar";
import "./index.scss";
import dayjs from "dayjs";
import FilterBar from "./components/FilterBar";
import Divide from "../home/components/Divide";
import { filterFormType, hotelCardType } from "./types";
import HotTagFilter from "./components/HotTagFilter";
import HotelList from "./components/HotelList";
import { getFilteredHotelListByPage } from "@/api/list";

const List = () => {
  const pageSize = 10;
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [city, setCity] = useState("上海");
  const [dateForm, setDateForm] = useState({
    startDate: dayjs(),
    endDate: dayjs().add(1, "day"),
  });
  const [filterForm, setFilterForm] = useState<filterFormType>({
    popularity: null,
    distance: null,
    price: null,
  });
  const [selectTags, setSelectTags] = useState<string[]>([]);
  const [refreshList, setRefreshList] = useState<hotelCardType[]>([]);
  const [refreshHasMore, setRefreshHasMore] = useState(true);

  /* 获取酒店列表 */
  const refreshLoadMore = async (isRefresh = false) => {
    if (loading) return;
    if (!isRefresh && !refreshHasMore) return;

    const currentPage = isRefresh ? 1 : page;

    if (isRefresh) setLoading(true);

    try {
      const res = await getFilteredHotelListByPage({
        location: city,
        facilities: selectTags,
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
      setLoading(false);
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
  }, [city, filterForm, selectTags]);

  return (
    <View className="bg-custom-gray h-screen flex flex-col">
      {/* 顶部 */}
      <View className="bg-white h-fit">
        {/* 顶部安全导航栏 */}
        <SafeNavBar />

        {/* 搜索栏 */}
        <SearchBar city={city} dateForm={dateForm} />

        {/* 分隔线 */}
        <Divide />

        {/* 筛选框 */}
        <FilterBar filterForm={filterForm} setFilterForm={setFilterForm} />

        {/* 热门标签（设施） */}
        <HotTagFilter
          selectedList={selectTags}
          setSelectedList={setSelectTags}
        />
      </View>

      {/* 列表 */}
      <View className="px-2 py-2 pb-4 flex-1 overflow-y-auto">
        <HotelList
          loading={loading}
          refreshHasMore={refreshHasMore}
          refreshList={refreshList}
          refreshLoadMore={refreshLoadMore}
        />
      </View>
    </View>
  );
};

export default List;
