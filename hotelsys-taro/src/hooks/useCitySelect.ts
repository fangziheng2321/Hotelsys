import { useCityStore } from "@/store/cityStore";
import Taro, { useDidShow } from "@tarojs/taro";
import { useCallback } from "react";

// 申请的KEY
const MAP_KEY = process.env.TARO_APP_QQ_MAP_KEY;
// 应用名称
const REFERER = "易宿酒店预订";
// 热门城市
const HOT_CITIES = "北京,上海,广州,深圳,成都,杭州";

// export const useCitySelect = () => {
//   const { setCity, cityName } = useCityStore();

//   // 跳转到城市选择插件
//   const navigateToCitySelector = useCallback(() => {
//     const key = MAP_KEY;
//     const referer = REFERER;
//     const hotCitys = HOT_CITIES;
//     const url = `plugin://citySelector/index?key=${key}&referer=${referer}&hotCitys=${hotCitys}`;
//     Taro.navigateTo({ url });
//   }, []);

//   //   监听插件返回的数据
//   useDidShow(() => {
//     const pages = Taro.getCurrentPages();
//     const currentPage = pages[pages.length - 1];

//     const selectedCity = currentPage?.data?.citySelected;

//     if (selectedCity) {
//       console.log("插件返回的数据", selectedCity);
//       // 更新到全局Store
//       setCity(
//         selectedCity.name,
//         selectedCity.location?.latitude,
//         selectedCity.locale?.longitude,
//       );

//       // 取完数据后，清空当前页面的数据，否则下次onShow还会重复触发
//       currentPage.setData({ citySelected: null });
//     }
//   });

//   return { cityName, navigateToCitySelector };
// };

// 封装一个通过 IP 获取城市的函数
export const fetchCityByIP = async () => {
  const { setCity } = useCityStore.getState(); // Zustand 在组件外获取 state 的写法

  try {
    // 调用腾讯地图 IP 定位接口
    // sig 签名校验如果没开可以不传，如果开了需要算一下，建议开发阶段先不开
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

      // 更新 Store
      setCity(city, lat, lng);
      return city;
    } else {
      console.warn("IP定位失败:", res.data.message);
    }
  } catch (error) {
    console.error("网络请求失败", error);
  }
};
