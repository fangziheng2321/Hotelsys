import { PropsWithChildren, useEffect, useState } from "react";
import { useLaunch } from "@tarojs/taro";
import { ConfigProvider } from "@nutui/nutui-react-taro"; // 1. 引入 ConfigProvider
import { useTranslation } from "react-i18next"; // 2. 引入 hook 获取当前语言状态

// 引入 NutUI 的自带语言包
import zhCN from "@nutui/nutui-react-taro/dist/es/locales/zh-CN";
import enUS from "@nutui/nutui-react-taro/dist/es/locales/en-US";

// 引入i18n 配置文件
import "./i18n";

import "./app.scss";
import "@nutui/nutui-react-taro/dist/style.css";

import { BaseLang } from "@nutui/nutui-react-taro/dist/es/locales/base";
import { fetchCityByIP } from "./hooks/useCitySelect";

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log("App launched.");
    fetchCityByIP();
  });

  const { i18n } = useTranslation();
  const [nutuiLocale, setNutuiLocale] = useState<BaseLang>(zhCN);

  useEffect(() => {
    if (i18n.language === "en") {
      setNutuiLocale(enUS);
    } else {
      setNutuiLocale(zhCN);
    }
  }, [i18n.language]);

  return <ConfigProvider locale={nutuiLocale}>{children}</ConfigProvider>;
}

export default App;
