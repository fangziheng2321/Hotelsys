import { useSearchStore } from "@/store/searchStore";
import Taro, { requirePlugin, useDidShow } from "@tarojs/taro";
import { useCallback } from "react";

// 申请的KEY
const MAP_KEY = process.env.TARO_APP_QQ_MAP_KEY;
// 应用名称
const REFERER = "易宿酒店预订";

export const useCitySelect = () => {
  const { location, setLocation } = useSearchStore();
  const cityName = location.cityName;

  // 跳转到城市选择插件
  const navigateToCitySelector = useCallback(() => {
    const key = MAP_KEY;
    const referer = REFERER;
    const url = `plugin://citySelector/index?key=${key}&referer=${referer}`;
    Taro.navigateTo({ url });
  }, []);

  //   监听插件返回的数据
  useDidShow(() => {
    const citySelector = requirePlugin("citySelector");
    const selectedCity = citySelector.getCity();

    if (selectedCity) {
      console.log("插件返回的数据", selectedCity);
      // 更新到全局Store
      setLocation(
        selectedCity.name,
        selectedCity.location?.latitude,
        selectedCity.location?.longitude,
      );

      // 取完数据后，清空当前页面的数据，否则下次onShow还会重复触发
      if (citySelector) {
        citySelector.clearCity();
      }
    }
  });

  return { cityName, navigateToCitySelector };
};

// 封装一个通过 IP 获取城市的函数
export const fetchCityByIP = async () => {
  const { setLocation } = useSearchStore.getState();

  try {
    // 调用腾讯地图 IP 定位接口
    const res = await Taro.request({
      url: "https://apis.map.qq.com/ws/location/v1/ip",
      method: "GET",
      data: {
        key: MAP_KEY,
        output: "json",
      },
    });

    if (res.data && res.data.status === 0) {
      const result = res.data.result;
      const city = result.ad_info.city; // "北京市"
      const lat = result.location.lat;
      const lng = result.location.lng;

      console.log("IP定位成功:", city);

      const formatCity =
        city.endsWith("市") && city.length > 1 ? city.slice(0, -1) : city;

      // 更新 Store
      setLocation(formatCity, lat, lng);
      return city;
    } else {
      console.warn("IP定位失败:", res.data.message);
    }
  } catch (error) {
    console.error("网络请求失败", error);
  }
};
