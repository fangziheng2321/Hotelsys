import React, { FC, Dispatch, SetStateAction } from "react";
import { View } from "@tarojs/components";
import { Rate } from "@nutui/nutui-react-taro";

interface IProps {
  rateValue: number;
  setRateValue: Dispatch<SetStateAction<number | null>>;
}

const StarRateSelector: FC<IProps> = ({ rateValue, setRateValue }) => {
  const editRate = (value: number) => {
    setRateValue(value);
  };

  return (
    <View>
      <Rate value={rateValue} size="large" count={5} onChange={editRate} />
    </View>
  );
};

export default StarRateSelector;
