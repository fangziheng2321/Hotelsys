import React, { FC, useState, useEffect, ReactNode } from "react";
import { View, RootPortal } from "@tarojs/components";

interface IProps {
  isVisible: boolean;
  customClassName?: string;
  onClose: () => void;
  children: ReactNode;
}

const CustomPopup: FC<IProps> = ({
  isVisible,
  customClassName,
  onClose,
  children,
}) => {
  const [renderVisible, setRenderVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setRenderVisible(true);
      setTimeout(() => setAnimateIn(true), 10);
      return;
    }
    setAnimateIn(false);
    const timer = setTimeout(() => setRenderVisible(false), 200);
    return () => clearTimeout(timer);
  }, [isVisible]);

  if (!renderVisible) {
    return null;
  }

  return (
    <RootPortal>
      <View className="fixed inset-0 z-50">
        <View
          className={[
            "absolute inset-0 bg-black/40 transition-opacity duration-200",
            animateIn ? "opacity-100" : "opacity-0",
          ].join(" ")}
          onClick={onClose}
        />
        <View
          className={[
            "absolute left-0 right-0 bottom-0 transition-transform duration-200",
            customClassName,
            animateIn ? "translate-y-0" : "translate-y-full",
          ].join(" ")}
        >
          <View className="h-full rounded-t-2xl overflow-hidden bg-white">
            {children}
          </View>
        </View>
      </View>
    </RootPortal>
  );
};

export default CustomPopup;
