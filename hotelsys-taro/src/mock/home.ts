import { bannerList } from "@/constant/home";

// 模拟获取首页轮播图数据
export const MOCK_HOME_BANNER_LIST = bannerList.map((item, index) => {
  return {
    id: index + 1,
    imgUrl: item,
  };
});
