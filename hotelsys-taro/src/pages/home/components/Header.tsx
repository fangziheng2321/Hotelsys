import React, {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
  useRef,
} from "react";
import { View, Text, Image } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import { background } from "@/constant/home";

interface IProps {}

const Header: FC<IProps> = (props) => {
  const { t } = useTranslation();
  return (
    <View className="absolute top-0 left-0 right-0">
      <Image src={background.imgUrl} className="w-full" mode="aspectFill" />
      <View className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-white flex-col flex items-start py-12 px-5">
        <Text className="text-2xl text-white font-bold">
          {t("home.header.easeStay")}
        </Text>
        <Text className="text-lg text-gray-200">{t("home.header.slogan")}</Text>
      </View>
    </View>
  );
};

export default Header;
