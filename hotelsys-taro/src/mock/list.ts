import { hotelImg } from "@/constant/list";
import { hotelCardType } from "@/pages/list/types";

// 模拟酒店列表数据
export const MOCK_HOTEL_LIST: hotelCardType[] = Array.from({ length: 30 }).map(
  (_, index) => {
    return {
      id: index,
      name: `酒店数据${index}`,
      rate: Math.floor(Math.random() * 4) + 1,
      score: Math.random() * 4,
      address: "近外滩 · 东方明珠",
      facilities: ["免费升房", "新中式风", "一线江景"],
      price: Math.floor(Math.random() * 900) + 100,
      imgUrl: hotelImg[index % hotelImg.length],
    };
  },
);

// 2. 编写一个“假后端”处理函数
// 这个函数接收参数，负责筛选 + 切片
export const getMockHotelPage = (params: any) => {
  const { currentPage = 1, pageSize = 10, price, rate } = params;

  // --- 第一步：模拟筛选 (Filter) ---
  let filteredList = MOCK_HOTEL_LIST;

  // 模拟价格筛选 (比如：只显示价格低于多少的)
  if (price) {
    // 假设传进来的 price 是最高价限制，或者是 1=低价, 2=高价 的枚举
    // 这里简单演示：如果传了 price，就过滤掉这就价格以上的
    // 实际业务看你跟后端的约定
    // filteredList = filteredList.filter(item => item.price <= price);
  }

  // 模拟评分筛选
  if (rate) {
    filteredList = filteredList.filter((item) => item.score >= rate);
  }

  // --- 第二步：模拟分页 (Slice) ---
  const total = filteredList.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // 截取当前页的数据
  const pageList = filteredList.slice(startIndex, endIndex);

  // --- 第三步：返回标准结构 ---
  return {
    code: 200,
    msg: "success",
    data: {
      list: pageList,
      total: total,
      currentPage: currentPage,
      // 告诉前端还有没有下一页
      hasMore: endIndex < total,
    },
  };
};
