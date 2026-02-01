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

interface IProps {}

const Index: FC<IProps> = (props) => {
  const { t } = useTranslation();

  return (
    <View className="index">
      <Text>{t("home.title")}</Text>
    </View>
  );
};

export default Index;
