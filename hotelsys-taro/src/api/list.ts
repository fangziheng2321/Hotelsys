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
  // 先调用 Mock 逻辑算出这一页的数据
  const mockResult = getMockHotelPage(params);
  return request<any>({
    url: "/hotel/list",
    method: "POST",
    data: params,
    mockData: mockResult.data,
  });
};
