import React, { useState } from "react";
import { View, Text, Button, Image } from "@tarojs/components";
import SearchTabs from "./components/SearchTabs";
import { BannerType, dateFormType } from "./types/index";
import Banner from "./components/Banner";
import { SearchTabType } from "@/enum/home";
import LocationBar from "./components/LocationBar";
import Divide from "./components/Divide";
import { useTranslation } from "react-i18next";
import LanguageChange from "@/components/LanguageChange/LanguageChange";
import DateRangeDisplay from "./components/DateRangeDisplay";
import dayjs from "dayjs";
import CustomButton from "@/components/CustomButton/CustomButton";
import FilterBar from "./components/FilterBar";
import HotelHotTags from "./components/HotelHotTags";
import Header from "./components/Header";
import SubBanner from "./components/SubBanner";
import Taro from "@tarojs/taro";
import { useCityStore } from "@/store/cityStore";
import { fetchCityByIP } from "@/hooks/useCitySelect";

const Home = () => {
  const { t } = useTranslation();
  const { cityName } = useCityStore();
  /* 表单数据 */
  const [activeTabType, setActiveTabType] = useState<SearchTabType>(
    SearchTabType.DOMESTIC,
  );
  const [searchText, setSearchText] = useState<string | null>(null);
  const [dateForm, setDateForm] = useState<dateFormType>({
    startDate: dayjs(),
    endDate: dayjs().add(1, "day"),
  });
  const [filterLabel, setFilterLabel] = useState<string | null>(null);

  /* UI控制数据 */
  const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(false);

  /* 修改选中搜索Tabs */
  const handleChangeTab = (type: SearchTabType) => {
    setActiveTabType(type);
  };

  /* 点击城市选择器 */
  const handleClickCity = () => {
    console.log("跳转修改城市页面");
  };

  /* 点击定位器器 */
  const handleClickLocation = () => {
    console.log("进行定位，获取当前位置");
    fetchCityByIP();
  };

  /* 点击搜索栏 */
  const handleClickSearch = () => {
    console.log("点击搜索栏");
  };

  /* 点击日期选择器 */
  const handleClickDateRange = () => {
    setIsCalendarVisible(true);
  };

  /* 点击筛选器 */
  const handleClickFilterBar = () => {
    console.log("点击筛选器");
  };

  /* 点击查询按钮 */
  const handleClickSearchButton = () => {
    Taro.navigateTo({
      url: "/pages/list/index",
    });
  };

  return (
    <>
      <View className="bg-custom-gray min-h-screen">
        {/* 头部背景图与Slogan */}
        <Header />

        {/* 剩余部分 */}
        <View className="translate-y-32">
          {/* 轮播图 */}
          {/* <Banner onClick={handleClickBanner}></Banner> */}
          <SubBanner />

          {/* 查询区域 */}
          <View className="bg-white w-[95%] rounded-xl mx-auto p-6 flex flex-col gap-6 mt-4">
            {/* 顶部Tab筛选 */}
            <SearchTabs activeType={activeTabType} onChange={handleChangeTab} />
            {/* 分隔线 */}
            <Divide></Divide>
            {/* 位置筛选 */}
            <LocationBar
              cityName={cityName}
              searchText={searchText}
              onCityClick={handleClickCity}
              onSearchClick={handleClickSearch}
              onLocateClick={handleClickLocation}
            />
            {/* 分隔线 */}
            <Divide></Divide>
            {/* 日期选择器 */}
            <DateRangeDisplay
              dateForm={dateForm}
              isVisible={isCalendarVisible}
              setIsVisible={setIsCalendarVisible}
              setDateForm={setDateForm}
              onClick={handleClickDateRange}
            />
            {/* 分隔线 */}
            <Divide></Divide>

            {/* 筛选器 */}
            <FilterBar label={filterLabel} onClick={handleClickFilterBar} />

            {/* 分隔线 */}
            <Divide></Divide>

            {/* 热门标签 */}
            <HotelHotTags />

            {/* 查询按钮 */}
            <CustomButton
              onClick={handleClickSearchButton}
              useAnimation={true}
              customClassName="rounded-xl w-full text-white text-xl py-3 font-bold tracking-widest"
            >
              {t("home.search_button")}
            </CustomButton>
          </View>
        </View>

        <LanguageChange customClassName="fixed bottom-4 right-4" />
      </View>
    </>
  );
};

export default Home;
