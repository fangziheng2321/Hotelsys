import Taro from "@tarojs/taro";

/**
 * 将 rem 单位转换为 px
 * 默认假设 1rem = 32rpx (Taro/Tailwind 常用配置)
 * @param rem rem 数值
 * @returns 转换后的 px 数值
 */
export const remToPx = (rem: number): number => {
  const systemInfo = Taro.getWindowInfo();
  const rpx = rem * 32;
  return (rpx * systemInfo.windowWidth) / 750;
};

/**
 * 设置状态栏颜色
 * @param color 状态栏颜色，默认值为 'black'
 * @returns void
 */
export const setStatusBarStyle = (color: string = "black") => {
  // 设置状态栏样式
  Taro.setNavigationBarColor({
    frontColor: color === "black" ? "#000000" : "#ffffff", // 前景色（文字颜色）
    backgroundColor: color === "black" ? "#ffffff" : "#000000", // 背景色
  });
};
