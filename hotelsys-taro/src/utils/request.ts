import Taro from "@tarojs/taro";
import i18n from "@/i18n";

// 是否使用MOCK数据
const IS_MOCK = false;

const IS_SERVER = true;

// 🌟 关键修改 1: 适配真机调试
const BASE_URL = IS_SERVER
  ? "http://47.110.82.228:3000" // 服务器
  : "http://10.118.172.225:3000"; // 本地

export const IMG_BASE_URL = BASE_URL;

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
  skipErrorHandler: boolean; //是否跳过默认的错误处理
}

export const request = async <T>(options: RequestOptions): Promise<T> => {
  const { url, method = "GET", data, mockData, skipErrorHandler } = options;

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
        // 业务错误
        const errorMsg = backendRes.message || i18n.t("request.error");
        if (!skipErrorHandler) {
          Taro.showToast({ title: errorMsg, icon: "none" });
        }
        // 把后端结果抛出去，让外面拿到
        return Promise.reject(backendRes);
      }
    } else {
      // HTTP 错误 (404, 500 等)
      if (!skipErrorHandler) {
        Taro.showToast({
          title: `${i18n.t("request.internet_error")}${res.statusCode}`,
          icon: "none",
        });
      }
      return Promise.reject(res);
    }
  } catch (err) {
    // 网络连不上等底层错误
    if (!skipErrorHandler) {
      Taro.showToast({
        title: i18n.t("request.internet_timeout"),
        icon: "none",
      });
    }
    return Promise.reject(err);
  }
};
