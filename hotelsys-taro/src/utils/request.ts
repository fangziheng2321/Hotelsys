import Taro from "@tarojs/taro";
import { t } from "i18next";

// 🚨 Mock 开关：设置为 true 时使用假数据，false 时请求真实接口
const IS_MOCK = true;

const BASE_URL = "https://your-api.com/api"; // 后端真实地址

interface RequestOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
  mockData?: any;
}

export const request = async <T>(options: RequestOptions): Promise<T> => {
  const { url, method = "GET", data, mockData } = options;

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
      url: BASE_URL + url,
      method,
      data,
      header: {
        "Content-Type": "application/json",
        // 'Authorization': Taro.getStorageSync('token') // 此处处理 Token
      },
    });

    // 这里根据你们后端的约定处理
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data as T;
    } else {
      Taro.showToast({ title: t("request.success"), icon: "none" });
      return Promise.reject(res);
    }
  } catch (err) {
    Taro.showToast({ title: t("request.error"), icon: "none" });
    return Promise.reject(err);
  }
};
