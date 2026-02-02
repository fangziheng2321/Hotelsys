import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zh from "./locales/zh.json";
import en from "./locales/en.json";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import "dayjs/locale/en";
import Taro from "@tarojs/taro";

// 资源文件
const resources = {
  zh: { translation: zh },
  en: { translation: en },
};

// 获取缓存的语言，如果没有则默认为中文
const savedLanguage = Taro.getStorageSync("locale") || "zh";

i18n
  .use(initReactI18next) // 注入 react-i18next
  .init({
    resources,
    lng: savedLanguage, // 使用缓存的语言
    fallbackLng: "zh", // 如果找不到对应语言，回退到中文
    interpolation: {
      escapeValue: false, // React 默认已经防止 XSS，这里不需要转义
    },
    react: {
      useSuspense: false, // 小程序环境建议关闭 Suspense
    },
  });

// 监听语言变化，同步 dayjs 语言
i18n.on("languageChanged", (lng) => {
  if (lng === "en") {
    dayjs.locale("en");
  } else {
    dayjs.locale("zh-cn");
  }
});

// 初始化 dayjs 语言
if (i18n.language === "en") {
  dayjs.locale("en");
} else {
  dayjs.locale("zh-cn");
}

export default i18n;
