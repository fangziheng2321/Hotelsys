import { request } from "@/utils/request";
import { getMockHotelPage } from "@/mock/list";

/**
 * 根据筛选条件，分页获取酒店列表
 * @param {Object} params
 * @param {string} [params.location]
 * @param {number} [params.rate]
 * @param {number} [params.price]
 * @param {Array} [params.facilities]
 * @param {number} [params.distance]
 * @param {number} params.currentPage
 * @param {number} params.pageSize
 */
export const getFilteredHotelListByPage = (params) => {
  const mockResult = getMockHotelPage(params);
  return request<any>({
    url: "/search",
    method: "POST",
    data: params,
    mockData: mockResult.data,
  });
};
