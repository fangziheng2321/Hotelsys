import { request } from "@/utils/request";
import { MOCK_HOTEL_DETAIL } from "@/mock/hotel";

/**
 * 获取酒店详情
 * @param id
 */
export const getHotelDetailById = (hotelId: number | string) => {
  return request<any>({
    url: `/hotel/${hotelId}`,
    method: "GET",
    mockData: MOCK_HOTEL_DETAIL,
  });
};
