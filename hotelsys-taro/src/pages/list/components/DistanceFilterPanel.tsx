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
import { Button } from "@nutui/nutui-react-taro";

interface IProps {
  menuId: number;
  handleClose: (id: number) => void;
}

const DistanceFilterPanel: FC<IProps> = ({ menuId, handleClose }) => {
  const { t } = useTranslation();

  return (
    <View className="flex items-center gap-2">
      <Text className="text-lg font-bold whitespace-nowrap">位置距离</Text>
      <Button type="primary" onClick={() => handleClose(menuId)}>
        关闭
      </Button>
    </View>
  );
};

export default DistanceFilterPanel;
