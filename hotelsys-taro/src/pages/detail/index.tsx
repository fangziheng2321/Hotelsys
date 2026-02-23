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
import SafeNavBar from "./components/SafeNavBar";
import HotelBanner from "./components/HotelBanner";
import DetailInfo from "./components/DetailInfo";
import { DetailInfoType, RoomType } from "./types";
import Calendar from "./components/Calendar";
import RoomList from "./components/RoomList";
import FunctionBar from "./components/FunctionBar";
import { useRouter } from "@tarojs/taro";
import { getHotelDetailById, getHotelRoomListById } from "@/api/detail";
import DetailSkeleton from "./components/DetailSkeleton";
import { useSearchStore } from "@/store/searchStore";
import PageWrapper from "@/components/PageWrapper/PageWrapper";

interface IProps {}

const Index: FC<IProps> = () => {
  const router = useRouter();
  const { id } = router.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [roomListLoading, setRoomListLoading] = useState<boolean>(true);
  const { stayDate } = useSearchStore();
  const [hotelInfo, setHotelInfo] = useState<DetailInfoType>({
    id: 1,
    name: "",
    rate: 0,
    imgList: [],
    description: "",
    address: "",
    price: 0,
    contactPhone: null,
    facilities: [],
  });
  const [roomList, setRoomList] = useState<RoomType[]>([]);

  // 获取酒店详情
  const loadHotelDetail = async (id: number | string) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await getHotelDetailById(id);
      setHotelInfo(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 获取房型列表
  const loadRoomList = async (id: number | string) => {
    if (!id) return;
    setRoomListLoading(true);
    try {
      const res = await getHotelRoomListById(id);
      setRoomList(res);
    } catch (error) {
      console.error(error);
    } finally {
      setRoomListLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      // 请求接口获取酒店详情数据
      loadHotelDetail(id);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      // 请求接口获取房型数据
      loadRoomList(id);
    }
  }, [id, stayDate]);

  const { setLastViewedHotelId } = useSearchStore();

  // 记录 ID
  useEffect(() => {
    if (id) {
      setLastViewedHotelId(Number(id)); // 确保存进去的类型和列表里一致(number/string)
    }
  }, [id, setLastViewedHotelId]);

  if (loading) {
    return (
      <PageWrapper>
        <DetailSkeleton />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <View className="bg-custom-gray dark:bg-dark-bg">
        {/* 安全导航栏 */}
        <SafeNavBar title={hotelInfo?.name} />

        {/* 酒店Banner */}
        <HotelBanner list={hotelInfo?.imgList} />

        {/* 酒店信息 */}
        <View className="-translate-y-4 pb-24">
          <View className=" bg-white dark:bg-dark-card p-4 rounded-t-2xl">
            <DetailInfo {...hotelInfo} />
          </View>

          {/* 日历与人间夜 */}
          <View className="bg-white dark:bg-dark-card p-4 mt-2">
            <Calendar />
          </View>
          {/* 房型价格列表 */}
          <View className="bg-white dark:bg-dark-card px-4 mt-2">
            <RoomList roomList={roomList} loading={roomListLoading} />
          </View>
        </View>
      </View>
      {/* 底部栏 */}
      <View className="fixed bottom-0 left-0 right-0 px-4 py-2 bg-white dark:bg-dark-card ">
        <FunctionBar
          price={hotelInfo.price}
          contactPhone={hotelInfo.contactPhone}
        />
      </View>
    </PageWrapper>
  );
};

export default Index;
