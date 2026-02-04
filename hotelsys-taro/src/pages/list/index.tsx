import React, { useState } from "react";
import { View } from "@tarojs/components";
import { Button, NavBar, harmony } from "@nutui/nutui-react-taro";
import SafeNavBar from "./components/SafeNavBar";
import SearchBar from "./components/SearchBar";
import "./index.scss";
import dayjs from "dayjs";
import FilterBar from "./components/FilterBar";
import Divide from "../home/components/Divide";

const List = () => {
  const [city, setCity] = useState("上海");
  const [dateForm, setDateForm] = useState({
    startDate: dayjs(),
    endDate: dayjs().add(1, "day"),
  });

  return (
    <View className="bg-custom-gray min-h-screen">
      <View className="bg-white">
        {/* 顶部安全导航栏 */}
        <SafeNavBar />

        {/* 搜索栏 */}
        <SearchBar city={city} dateForm={dateForm} />

        {/* 分隔线 */}
        <Divide />

        {/* 筛选框 */}
        <FilterBar />
      </View>
    </View>
  );
};

export default List;
