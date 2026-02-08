import React, {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
  useRef,
} from "react";
import { View, Text } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Share } from "@nutui/icons-react-taro";
import { remToPx, setStatusBarStyle } from "@/utils/style";
import Taro, { usePageScroll } from "@tarojs/taro";
import { BaseProps } from "@nutui/nutui-react-taro";

interface IProps extends BaseProps {
  title: string;
}

// 滚动的阈值
const SCROLL_THRESHOLD = remToPx(8);

const SafeNavBar: FC<IProps> = ({ title, className }) => {
  const { t } = useTranslation();
  // 胶囊按钮的位置信息
  const [navBarInfo, setNavBarInfo] = useState({
    top: 0,
    height: 32,
    width: 0,
    right: 0,
  });
  const [navOpacity, setNavOpacity] = useState(0);

  /* 监听滚动，计算透明度 */
  usePageScroll((res) => {
    const scrollTop = res.scrollTop;

    // 计算透明度：滚动距离 / 阈值
    // Math.min 保证最大不超过 1，Math.max 保证最小不小于 0
    let nextOpacity = Math.min(scrollTop / SCROLL_THRESHOLD, 1);
    nextOpacity = Math.max(nextOpacity, 0);

    // 只有当差异较大时才更新状态，避免极其微小的变动导致频繁渲染
    if (
      Math.abs(nextOpacity - navOpacity) > 0.05 ||
      nextOpacity === 0 ||
      nextOpacity === 1
    ) {
      setNavOpacity(nextOpacity);

      // 更新状态栏的颜色
      if (nextOpacity > 0.5) {
        setStatusBarStyle("black");
      } else {
        setStatusBarStyle("white");
      }
    }
  });

  /* 初始化获取胶囊位置 */
  useEffect(() => {
    const initNavBar = () => {
      if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
        const menuButton = Taro.getMenuButtonBoundingClientRect();
        setNavBarInfo({
          top: menuButton.top,
          height: menuButton.height,
          width: menuButton.width,
          right: menuButton.right,
        });
      } else {
        // H5 或其他环境的兜底
        setNavBarInfo((prev) => ({ ...prev, top: 40 }));
      }
    };
    initNavBar();
  }, []);

  // 返回上一页
  const handleBack = () => Taro.navigateBack();

  return (
    <View className={`fixed top-0 left-0 right-0 z-50 pb-2 ${className || ""}`}>
      {/* 
         1. 渐变背景层 
         这个 View 负责显示白底，它的透明度随滚动变化
      */}
      <View
        className="absolute inset-0 bg-white shadow-sm"
        style={{ opacity: navOpacity }}
      ></View>

      {/* 
         2. 内容容器
         paddingTop 保证内容不被状态栏遮挡
      */}
      <View style={{ paddingTop: `${navBarInfo.top}px` }} className="relative">
        {/* 导航栏主体内容区域 */}
        <View
          className="flex items-center px-4 relative"
          style={{ height: `${navBarInfo.height}px` }}
        >
          {/* 
             场景 A: 还没划动时的“圆圈返回按钮” 
             当透明度小于 0.5 时显示，做个反向的淡入淡出
          */}
          <View
            className="absolute left-4 z-20 transition-opacity duration-200"
            style={{
              opacity: navOpacity < 0.5 ? 1 : 0,
              pointerEvents: navOpacity < 0.5 ? "auto" : "none",
            }}
          >
            <View
              className="rounded-full p-1 bg-black/40 flex items-center justify-center backdrop-blur-sm border border-white/40"
              onClick={handleBack}
            >
              <ArrowLeft color="white" size={"1.5rem"} />
            </View>
          </View>

          {/* 
             场景 B: 滑动后的“普通返回按钮” + “标题”
             当透明度变大时逐渐浮现
          */}
          <View
            className="flex items-center justify-center w-full h-full transition-opacity duration-200"
            style={{ opacity: navOpacity }}
          >
            {/* 普通黑色返回箭头 */}
            <View className="absolute left-4" onClick={handleBack}>
              <ArrowLeft color="black" size={"1.5rem"} />
            </View>

            {/* 标题 */}
            <Text className="text-lg font-bold text-black max-w-[50%] truncate">
              {title}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SafeNavBar;
