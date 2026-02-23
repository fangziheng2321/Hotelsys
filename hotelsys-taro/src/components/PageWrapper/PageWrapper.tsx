import React, {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
  useRef,
  PropsWithChildren,
} from "react";
import { View, Text } from "@tarojs/components";
import { useThemeStore } from "@/store/themeStore";
import { ConfigProvider } from "@nutui/nutui-react-taro";

// 定义 NutUI 的深色主题覆盖变量
const nutUiDarkTheme = {
  // 导航栏背景颜色
  "--nutui-navbar-background": "#27272a",
  // 标题字体颜色
  "--nutui-color-title": "#f4f4f5",
  // 字体背景
  "--nutui-color-background-overlay": "#27272a",
  // 图标颜色
  "--nut-icon-color": "#f4f4f5",
};

const PageWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { isDark } = useThemeStore();

  return (
    <ConfigProvider theme={isDark ? nutUiDarkTheme : undefined}>
      <View className={isDark ? "dark" : ""}>
        <View className="transition-colors duration-300 bg-white text-black dark:bg-dark-bg dark:text-dark-text">
          {children}
        </View>
      </View>
    </ConfigProvider>
  );
};

export default PageWrapper;
