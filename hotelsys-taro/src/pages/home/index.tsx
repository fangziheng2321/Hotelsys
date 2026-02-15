import React, { useMemo, useState } from "react";
import { View, Text, Button, Image } from "@tarojs/components";
import SearchTabs from "./components/SearchTabs";
import { BannerType, dateFormType } from "./types/index";
import { SearchTabType } from "@/enum/home";
import LocationBar from "./components/LocationBar";
import Divide from "./components/Divide";
import { useTranslation } from "react-i18next";
import LanguageChange from "@/components/LanguageChange/LanguageChange";
import DateRangeDisplay from "./components/DateRangeDisplay";
import CustomButton from "@/components/CustomButton/CustomButton";
import FilterBar from "./components/FilterBar";
import HotelHotTags from "./components/HotelHotTags";
import Header from "./components/Header";
import SubBanner from "./components/SubBanner";
import Taro from "@tarojs/taro";
import { fetchCityByIP, useCitySelect } from "@/hooks/useCitySelect";
import { useSearchStore } from "@/store/searchStore";

const Home = () => {
  const { t } = useTranslation();
  const { navigateToCitySelector, cityName } = useCitySelect();
  /* 表单数据 */
  const {
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
  } = useSearchStore();

  /* UI控制数据 */
  const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(false);

  /* 价格/星级显示文本 */
  const filterLabel = useMemo(() => {
    let priceLabel = "";
    let rateLabel = "";
    if (priceRange) {
      priceLabel = `￥${priceRange[0]} - ￥${priceRange[1]}`;
    }
    if (rate) {
      rateLabel = `${rate}星级`;
    }
    const showLabel = priceLabel + " " + rateLabel;
    return showLabel === " " ? null : showLabel;
  }, [priceRange, rate]);

  /* 修改选中搜索Tabs */
  const handleChangeTab = (type: SearchTabType) => {
    setType(type);
    console.log("选中的类型：", type);
  };

  /* 点击城市选择器 */
  const handleClickCity = () => {
    console.log("跳转修改城市页面");
    navigateToCitySelector();
  };

  /* 点击定位器器 */
  const handleClickLocation = () => {
    console.log("进行定位，获取当前位置");
    Taro.showLoading();
    try {
      fetchCityByIP();
      Taro.showToast({
        title: t("home.location_bar.getLocation.success"),
        icon: "success",
      });
    } catch (error) {
      Taro.showToast({
        title: t("home.location_bar.getLocation.fail"),
        icon: "error",
      });
    } finally {
      Taro.hideLoading();
    }
  };

  /* 点击日期选择器 */
  const handleClickDateRange = () => {
    setIsCalendarVisible(true);
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
            <SearchTabs activeType={type} onChange={handleChangeTab} />
            {/* 分隔线 */}
            <Divide></Divide>
            {/* 位置筛选 */}
            <LocationBar
              cityName={cityName}
              searchText={hotelName}
              setSearchText={setHotelName}
              onCityClick={handleClickCity}
              onLocateClick={handleClickLocation}
            />
            {/* 分隔线 */}
            <Divide></Divide>
            {/* 日期选择器 */}
            <DateRangeDisplay
              startDate={stayDate.startDate}
              endDate={stayDate.endDate}
              isVisible={isCalendarVisible}
              setIsVisible={setIsCalendarVisible}
              setStayDate={setStayDate}
              onClick={handleClickDateRange}
            />
            {/* 分隔线 */}
            <Divide></Divide>

            {/* 筛选器 */}
            <FilterBar
              rate={rate}
              setRate={setRate}
              label={filterLabel}
              priceRange={priceRange}
              setPricePrange={setPriceRange}
            />

            {/* 分隔线 */}
            <Divide></Divide>

            {/* 热门标签 */}
            <HotelHotTags
              selectedList={facilities}
              setSelectedList={setFacilities}
            />

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
