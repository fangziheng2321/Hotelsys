import React, { FC, ReactNode } from "react";
import { Button } from "@tarojs/components";
import "./index.scss";

interface IProps {
  customClassName?: string;
  disabled?: boolean;
  useAnimation?: boolean;
  children?: ReactNode;
  customBg?: string;
  onClick?: () => void;
}

const CutomButton: FC<IProps> = ({
  customClassName,
  disabled = false,
  useAnimation = false,
  children,
  customBg,
  onClick,
}) => {
  return (
    <Button
      className={[
        customClassName,
        "flex items-center justify-center",
        customBg
          ? customBg
          : "bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg shadow-blue-200",
        useAnimation ? "animation" : "",
      ].join(" ")}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default CutomButton;
