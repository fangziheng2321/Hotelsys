import React, { useState, useEffect, useMemo } from "react";
import { View, Map } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { MOCK_MAP_HOTELS } from "@/mock/list"; // 引入数据
import { hotelIcon } from "@/constant/map";

const MapSearch = () => {
  // 地图中心点（默认上海）
  const [center, setCenter] = useState({
    latitude: 31.230416,
    longitude: 121.473701,
  });

  // 1. 将酒店数据转换为地图 Markers
  const markers = useMemo(() => {
    return MOCK_MAP_HOTELS.map((hotel) => ({
      id: hotel.id, // 点击时会返回这个 ID
      latitude: hotel.latitude,
      longitude: hotel.longitude,
      width: 30, // 图标宽度
      height: 30,
      iconPath: hotelIcon.hotel,

      // 🌟 核心：自定义气泡（显示价格）
      callout: {
        content: `¥${hotel.price}`, // 显示价格
        color: "#ffffff",
        fontSize: 12,
        borderRadius: 16,
        bgColor: "#0052D9", // 品牌蓝
        padding: 6,
        display: "ALWAYS", // 'ALWAYS': 常显, 'BYCLICK': 点击显示
        textAlign: "center",
        anchorY: -10, // 位置微调
      },
    }));
  }, []);

  // 2. 点击标记点（酒店）触发
  const onMarkerTap = (e) => {
    const hotelId = e.detail.markerId;
    console.log("点击了酒店 ID:", hotelId);

    // 跳转到详情页
    Taro.navigateTo({
      url: `/pages/detail/index?id=${hotelId}`,
    });
  };

  // 3. 获取用户当前位置作为中心点
  useEffect(() => {
    Taro.getLocation({
      type: "gcj02", // 必须用 gcj02 坐标系
      success: (res) => {
        setCenter({
          latitude: res.latitude,
          longitude: res.longitude,
        });
      },
      fail: () => {
        Taro.showToast({ title: "定位失败，使用默认位置", icon: "none" });
      },
    });
  }, []);

  return (
    <View className="w-full h-screen">
      <Map
        id="myMap"
        className="w-full h-full"
        latitude={center.latitude}
        longitude={center.longitude}
        scale={14} // 缩放级别 (3-20)，14 也就是街道级
        markers={markers} // 传入刚才生成的标记点
        onMarkerTap={onMarkerTap} // 绑定点击事件
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
          <View className="text-xs font-bold text-blue-600">我的位置</View>
        </View>
      </Map>
    </View>
  );
};

export default MapSearch;
