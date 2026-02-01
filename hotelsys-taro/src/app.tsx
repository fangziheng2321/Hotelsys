import { PropsWithChildren } from "react";
import { useLaunch } from "@tarojs/taro";
import { ConfigProvider } from "@nutui/nutui-react-taro"; // 1. 引入 ConfigProvider
import { useTranslation } from "react-i18next"; // 2. 引入 hook 获取当前语言状态

// 3. 引入 NutUI 的自带语言包
import zhCN from "@nutui/nutui-react-taro/dist/es/locales/zh-CN";
import enUS from "@nutui/nutui-react-taro/dist/es/locales/en-US";

// 4. 引入刚才创建的 i18n 配置文件 (确保这个文件存在 src/i18n.ts)
import "./i18n";

import "./app.scss";
import "@nutui/nutui-react-taro/dist/style.css";

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log("App launched.");
  });

  // 5. 获取 i18n 实例
  const { i18n } = useTranslation();

  const nutuiLocale = i18n.language === "en" ? enUS : zhCN;

  // 7. 用 ConfigProvider 包裹 children
  return <ConfigProvider locale={nutuiLocale}>{children}</ConfigProvider>;
}

export default App;
