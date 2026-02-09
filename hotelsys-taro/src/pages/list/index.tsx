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
import HotelCard from "./components/HotelCard";

const List = () => {
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

        {/* 热门标签 */}
        <HotTagFilter
          selectedList={selectTags}
          setSelectedList={setSelectTags}
        />
      </View>

      {/* 列表 */}
      <View className="px-2 py-2 pb-4 flex-1 overflow-y-auto">
        <HotelList />
      </View>
    </View>
  );
};

export default List;
