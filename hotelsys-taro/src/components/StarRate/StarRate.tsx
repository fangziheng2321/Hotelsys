import React, { FC } from "react";
import { View, Text } from "@tarojs/components";
import { Star3 } from "@nutui/icons-react-taro";

interface IProps {
  rate: number;
  color?: string;
  size?: string;
}

const StarRate: FC<IProps> = ({ rate, color = "#facc15", size = "1rem" }) => {
  return (
    <View className="flex items-center">
      {Array.from({ length: rate }).map((__, index) => (
        <Star3 key={index} color={color} size={size} />
      ))}
    </View>
  );
};

export default StarRate;
