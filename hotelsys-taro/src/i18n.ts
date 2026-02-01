import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zh from "./locales/zh.json";
import en from "./locales/en.json";

// 资源文件
const resources = {
  zh: { translation: zh },
  en: { translation: en },
};

i18n
  .use(initReactI18next) // 注入 react-i18next
  .init({
    resources,
    lng: "zh", // 默认语言
    fallbackLng: "zh", // 如果找不到对应语言，回退到中文
    interpolation: {
      escapeValue: false, // React 默认已经防止 XSS，这里不需要转义
    },
    react: {
      useSuspense: false, // 小程序环境建议关闭 Suspense
    },
  });

export default i18n;
