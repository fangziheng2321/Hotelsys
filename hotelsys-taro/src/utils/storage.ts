import Taro from "@tarojs/taro";
import { StateStorage } from "zustand/middleware";

export const taroStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      const value = Taro.getStorageSync(name);
      return value ? value : null;
    } catch (e) {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      Taro.setStorageSync(name, value);
    } catch (e) {
      console.error("存储失败", e);
    }
  },
  removeItem: (name: string): void => {
    try {
      Taro.removeStorageSync(name);
    } catch (e) {
      console.error("移除存储失败", e);
    }
  },
};
