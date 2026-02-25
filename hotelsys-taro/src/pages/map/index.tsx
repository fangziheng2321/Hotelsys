import React, { useEffect, useState, useMemo } from "react";
import { View, Map } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { useSearchStore } from "@/store/searchStore";
import { getFilteredHotelListByPage } from "@/api/list";
import { hotelIcon } from "@/constant/map";
import { useTranslation } from "react-i18next";
import { getHotelDetailById } from "@/api/detail";
import { hotelCardType } from "../list/types";
import hotelMarkerIcon from "@/assets/map/hotel.png";

const MapPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.params; // 尝试获取 id 参数

  // 从 Store 获取筛选条件
  const { location, type, hotelName, facilities, priceRange, rate, distance } =
    useSearchStore();

  const [markers, setMarkers] = useState<any[]>([]);
  const defaultCenter = { lat: 39.92, lng: 116.46 };
  const [center, setCenter] = useState(defaultCenter); // 默认中心

  useEffect(() => {
    if (id) {
      // 单店模式 (从详情页跳过来)
      initSingleMode(id);
    } else {
      // 列表模式 (从列表页跳过来)
      initListMode();
    }
  }, [id]);

  // 只展示一个酒店
  const initSingleMode = async (hotelId: string) => {
    Taro.setNavigationBarTitle({ title: t("map.showHotelLocation") });
    try {
      // 这里可以直接复用详情接口，或者让上个页面把 lat/lng/price 传过来也行(仅限少量数据)
      const data = await getHotelDetailById(hotelId);
      const marker = createMarker(data); // true 表示是高亮/中心点
      setMarkers([marker]);
      setCenter({
        lat: marker.latitude,
        lng: marker.longitude,
      });
    } catch (e) {}
  };

  // 展示筛选后的列表
  const initListMode = async () => {
    Taro.setNavigationBarTitle({ title: t("map.searchHotelOnMap") });
    try {
      const params = {
        location: location.cityName,
        latitude: location.latitude,
        longitude: location.longitude,
        currentPage: 1,
        pageSize: 100,
        facilities,
        hotelName,
        distance,
        type,
        rate,
        priceRange,
      };
      const res = await getFilteredHotelListByPage(params);
      const list = res.list.map((item: hotelCardType) => createMarker(item));
      setMarkers(list);
    } catch (error) {
      console.error(error);
    }
  };

  // 辅助函数：生成 Marker 数据结构
  const getValidCoord = (value: unknown, fallback: number) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  };

  const createMarker = (hotel: any) => ({
    id: hotel.id,
    latitude: getValidCoord(hotel?.latitude, defaultCenter.lat),
    longitude: getValidCoord(hotel?.longitude, defaultCenter.lng),
    iconPath: hotelIcon.hotel,
    width: 30,
    height: 30,
    callout: {
      content: `¥${hotel.price}`,
      display: "ALWAYS",
      padding: 8,
      borderRadius: 4,
      bgColor: "#0052D9",
      color: "#ffffff",
    },
  });

  // 点击标记点（酒店）触发
  const onMarkerTap = (e) => {
    // 如果是单店模式，就不允许再跳转了
    if (id) {
      return;
    }
    const hotelId = e.detail.markerId;
    // 跳转到详情页
    Taro.navigateTo({
      url: `/pages/detail/index?id=${hotelId}`,
    });
  };

  return (
    <View className="w-full h-screen">
      <Map
        id="myMap"
        className="w-full h-full"
        latitude={center.lat}
        longitude={center.lng}
        scale={14} // 缩放级别 (3-20)，14 也就是街道级
        markers={markers} // 传入刚才生成的标记点
        onMarkerTap={onMarkerTap} // 绑定点击事件
        onError={(error) => console.log(error)}
        showLocation={true} // 显示带有方向的当前定位点
      >
        {/* 可以在这里放一个“回到我的位置”的悬浮按钮 */}
        <View
          className="fixed bottom-10 right-4 bg-white p-2 rounded-full shadow-lg"
          onClick={() => {
            const mapCtx = Taro.createMapContext("myMap");
            mapCtx.moveToLocation({});
          }}
        >
          <View className="text-xs font-bold text-blue-600">
            {t("map.myLocation")}
          </View>
        </View>
      </Map>
    </View>
  );
};

export default MapPage;
