import React, { FC, ReactNode } from "react";
import { Button } from "@tarojs/components";
import "./index.scss";

interface IProps {
  customClassName?: string;
  disabled?: boolean;
  useAnimation?: boolean;
  children?: ReactNode;
  onClick?: () => void;
}

const CutomButton: FC<IProps> = ({
  customClassName,
  disabled = false,
  useAnimation = false,
  children,
  onClick,
}) => {
  return (
    <Button
      className={[
        "bg-gradient-to-r from-primary to-secondary flex items-center justify-center",
        useAnimation ? "animation" : "",
        customClassName,
      ].join(" ")}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default CutomButton;
