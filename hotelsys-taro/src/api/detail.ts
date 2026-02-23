import { request } from "@/utils/request";
import { MOCK_HOTEL_DETAIL, MOCK_ROOM_LIST } from "@/mock/hotel";

/**
 * 获取酒店详情
 * @param hotelId
 */
export const getHotelDetailById = (hotelId: number | string) => {
  return request<any>({
    url: `/hotels/${hotelId}`,
    method: "GET",
    mockData: MOCK_HOTEL_DETAIL,
  });
};

/**
 * 获取酒店房型
 * @param hotelId
 */
export const getHotelRoomListById = (hotelId: number | string) => {
  return request<any>({
    url: `/hotels/${hotelId}/rooms`,
    method: "GET",
    mockData: MOCK_ROOM_LIST,
  });
};
