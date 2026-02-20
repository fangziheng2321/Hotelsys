import Taro from "@tarojs/taro";

// 是否使用MOCK数据
const IS_MOCK = true;

// 🌟 关键修改 1: 适配真机调试
const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:3000" // 开发环境
    : "http://192.168.1.26:3000";

const API_PREFIX = "/api/home";

// 定义后端返回的标准结构
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  code?: number;
}

interface RequestOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
  mockData?: any;
}

export const request = async <T>(options: RequestOptions): Promise<T> => {
  const { url, method = "GET", data, mockData } = options;

  // Mock 逻辑，返回假数据
  if (IS_MOCK && mockData) {
    console.log(`[Mock Request]: ${url}`, data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData as T);
      }, 500);
    });
  }

  try {
    const res = await Taro.request({
      url: BASE_URL + API_PREFIX + url,
      method,
      data,
      header: {
        "Content-Type": "application/json",
      },
    });

    if (res.statusCode >= 200 && res.statusCode < 300) {
      // 🌟 关键修改 3: 处理业务状态码 & 解包
      // 拿到后端返回的完整体
      const backendRes = res.data as ApiResponse<T>;

      if (backendRes.success) {
        return backendRes.data;
      } else {
        const errorMsg = backendRes.message || "请求失败";
        Taro.showToast({ title: errorMsg, icon: "none" });
        return Promise.reject(new Error(errorMsg));
      }
    } else {
      // HTTP 错误 (404, 500 等)
      Taro.showToast({ title: `网络错误 ${res.statusCode}`, icon: "none" });
      return Promise.reject(res);
    }
  } catch (err) {
    // 网络连不上等底层错误
    Taro.showToast({ title: "网络连接超时", icon: "none" });
    return Promise.reject(err);
  }
};
