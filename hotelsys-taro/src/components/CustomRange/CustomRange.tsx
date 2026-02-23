import React, { useState, useEffect, useMemo } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { remToPx } from "@/utils/style";

interface IProps {
  min: number;
  max: number;
  value: number[];
  ancestorId: string;
  onChange: (val: number[]) => void;
}

// 设定滑块宽度  w-6
const THUMB_WIDTH = remToPx(1.5);

const CustomRange: React.FC<IProps> = ({
  min,
  max,
  value,
  onChange,
  ancestorId,
}) => {
  const [rect, setRect] = useState({ width: 0, left: 0 });
  const [isDragging, setIsDragging] = useState(true);

  const trackId = useMemo(
    () => `range-track-${Math.random().toString(36).slice(2, 9)}`,
    [],
  );

  // 获取容器宽度和位置
  const updateRect = (retryCount = 0) => {
    const query = Taro.createSelectorQuery();

    query
      .select(`#${ancestorId} >>> .${trackId}`)
      .boundingClientRect((res) => {
        if (res && (res as { width: number }).width > 0) {
          setRect({
            width: (res as { width: number }).width,
            left: (res as { left: number }).left,
          });
        } else {
          // 如果没找到，且重试次数小于 5 次，延迟 50ms 再试一次
          if (retryCount < 5) {
            setTimeout(() => updateRect(retryCount + 1), 50);
          }
        }
      })
      .exec();
  };

  useEffect(() => {
    // 使用 nextTick 确保 DOM 树已经更新
    Taro.nextTick(() => {
      setTimeout(() => updateRect(0), 100);
    });
  }, []);

  // === 核心计算逻辑 ===

  // 使用纯 CSS calc 计算位置，确保在 rect 未获取时也能正确显示
  // 公式：Left = Ratio * (100% - ThumbWidth)
  // 这样 0% 时在最左 (0px)，100% 时在最右 (100% - ThumbWidth)
  const getRatio = (val: number) => (val - min) / (max - min);

  const ratio0 = getRatio(value[0]);
  const ratio1 = getRatio(value[1]);

  // 左滑块位置
  const leftStyle = `calc(${ratio0 * 100}% - ${ratio0 * THUMB_WIDTH}px)`;
  // 右滑块位置
  const rightStyle = `calc(${ratio1 * 100}% - ${ratio1 * THUMB_WIDTH}px)`;

  // 进度条宽度
  // Width = (RightLeft + ThumbWidth) - LeftLeft
  //       = (Ratio1 * (100% - W) + W) - (Ratio0 * (100% - W))
  //       = (Ratio1 - Ratio0) * (100% - W) + W
  //       = Delta * 100% + (1 - Delta) * W
  const delta = ratio1 - ratio0;
  const barWidthStyle = `calc(${delta * 100}% + ${(1 - delta) * THUMB_WIDTH}px)`;

  // === 触摸事件处理 ===

  const handleTouchStart = () => {
    setIsDragging(true);
    updateRect();
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e, index) => {
    e.stopPropagation();
    // 触摸移动依赖 rect 计算具体数值
    if (!rect.width) return;

    // 有效滑动宽度
    const availableWidth = rect.width - THUMB_WIDTH;
    if (availableWidth <= 0) return;

    const clientX = e.touches[0].clientX;
    const relativeX = clientX - rect.left;

    // 限制范围在 [0, availableWidth]
    let clampedX = relativeX;
    if (clampedX < 0) clampedX = 0;
    if (clampedX > availableWidth) clampedX = availableWidth;

    // 像素转数值
    let val = Math.round((clampedX / availableWidth) * (max - min) + min);

    // 边界检查
    const newVal = [...value];
    if (index === 0) {
      if (val > value[1]) val = value[1];
    } else {
      if (val < value[0]) val = value[0];
    }

    if (newVal[index] !== val) {
      newVal[index] = val;
      onChange(newVal);
    }
  };

  // 动画样式：拖动时无动画（跟手），松开或外部改变时有动画（丝滑）
  const transitionStyle = isDragging
    ? "none"
    : "left 0.2s ease-out, width 0.2s ease-out";

  return (
    <View className="py-3 w-full px-2" catchMove>
      {/* 轨道背景 (灰色) */}
      <View
        className={[
          "relative w-full h-2 bg-gray-200 dark:bg-dark-bg rounded-full",
          trackId,
        ].join(" ")}
      >
        {/* === 中间高亮进度条 === */}
        <View
          className="absolute h-full bg-primary rounded-full"
          style={{
            left: leftStyle,
            width: barWidthStyle,
            transition: transitionStyle,
          }}
        />

        {/* === 左滑块 === */}
        <View
          className="absolute top-1/2 -mt-3 bg-white dark:bg-dark-bg rounded-full shadow-sm border border-primary z-10 flex items-center justify-center"
          style={{
            width: `${THUMB_WIDTH}px`,
            height: `${THUMB_WIDTH}px`,
            left: leftStyle,
            transition: transitionStyle,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={(e) => handleTouchMove(e, 0)}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <View className="w-10 h-10 absolute bg-transparent" />
        </View>

        {/* === 右滑块 === */}
        <View
          className="absolute top-1/2 -mt-3 bg-white dark:bg-dark-bg rounded-full shadow-sm border border-primary z-10 flex items-center justify-center"
          style={{
            width: `${THUMB_WIDTH}px`,
            height: `${THUMB_WIDTH}px`,
            left: rightStyle,
            transition: transitionStyle,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={(e) => handleTouchMove(e, 1)}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <View className="w-10 h-10 absolute bg-transparent" />
        </View>
      </View>

      {/* 显示数值 */}
      <View className="flex justify-between mt-4 text-sm font-bold text-primary">
        <View>¥{value[0]}</View>
        <View>¥{value[1]}</View>
      </View>
    </View>
  );
};

export default CustomRange;
