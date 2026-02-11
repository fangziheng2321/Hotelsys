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

interface IProps {
  children: React.ReactNode;
  customClassName?: string;
  onClick?: () => void;
}

const CustomTag: FC<IProps> = ({ children, customClassName, onClick }) => {
  const { t } = useTranslation();

  return (
    <View
      className={[
        customClassName ?? "",
        `flex items-center justify-center px-2 text-sm bg-primary rounded-md font-bold`,
      ].join(" ")}
      onClick={onClick}
    >
      {children}
    </View>
  );
};

export default CustomTag;
