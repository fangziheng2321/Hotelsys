import { request } from "@/utils/request";
import { MOCK_HOME_BANNER_LIST } from "@/mock/home";

/**
 * 获取主页轮播图
 */
export const getHomeBannerList = () => {
  return request<any>({
    url: `/banners`,
    method: "GET",
    mockData: MOCK_HOME_BANNER_LIST,
  });
};
