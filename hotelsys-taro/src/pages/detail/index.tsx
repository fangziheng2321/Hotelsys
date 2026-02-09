import React, {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
  useRef,
} from "react";
import { View, Text, Image, List } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import SafeNavBar from "./components/SafeNavBar";
import HotelBanner from "./components/HotelBanner";
import DetailInfo from "./components/DetailInfo";
import { DetailInfoType } from "./types";
import Calendar from "./components/Calendar";
import RoomList from "./components/RoomList";
import FunctionBar from "./components/FunctionBar";
import { useRouter } from "@tarojs/taro";
import { getHotelDetailById } from "@/api/detail";
import DetailSkeleton from "./components/DetailSkeleton";

interface IProps {}

const Index: FC<IProps> = (props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { params } = router;
  const [loading, setLoading] = useState<boolean>(false);
  const [hotelInfo, setHotelInfo] = useState<DetailInfoType>({
    id: 1,
    name: "",
    rate: 0,
    imgList: [],
    score: 0.0,
    address: "",
    price: 0,
    facilities: [],
  });

  // 获取酒店详情
  const loadHotelDetail = async (id: number | string) => {
    setLoading(true);
    try {
      const res = await getHotelDetailById(id);
      console.log(res);
      setHotelInfo(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { id } = params;
    if (id) {
      // 请求接口获取酒店详情数据
      loadHotelDetail(id);
    }
  }, []);

  if (loading) {
    return <DetailSkeleton />;
  }

  return (
    <>
      <View className="bg-custom-gray">
        {/* 安全导航栏 */}
        <SafeNavBar title={hotelInfo?.name} />

        {/* 酒店Banner */}
        <HotelBanner list={hotelInfo?.imgList} />

        {/* 酒店信息 */}
        <View className="-translate-y-4 pb-24">
          <View className=" bg-white p-4 rounded-t-2xl">
            <DetailInfo {...hotelInfo} />
          </View>

          {/* 日历与人间夜 */}
          <View className="bg-white p-4 mt-2">
            <Calendar />
          </View>
          {/* 房型价格列表 */}
          <View className="bg-white px-4 mt-2">
            <RoomList />
          </View>
        </View>
      </View>
      {/* 底部栏 */}
      <View className="fixed bottom-0 left-0 right-0 px-4 py-2 bg-white">
        <FunctionBar price={hotelInfo.price} />
      </View>
    </>
  );
};

export default Index;
