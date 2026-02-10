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
import { Phone } from "@nutui/icons-react-taro";
import { useCurrency } from "@/utils/currency";
import CustomButton from "@/components/CustomButton/CustomButton";
import Taro from "@tarojs/taro";

interface IProps {
  price: number;
  telephone: null | string;
}

const FunctioinBar: FC<IProps> = ({ price, telephone }) => {
  const { t } = useTranslation();
  const { formatAmount } = useCurrency();

  // 联系酒店
  const handleContact = () => {
    if (!telephone) {
      Taro.showToast({
        title: t("detail.function_bar.makePhoneCall.empty"),
        icon: "error",
      });
      return;
    }
    Taro.makePhoneCall({ phoneNumber: telephone }).catch((error) =>
      console.log(error),
    );
  };

  return (
    <View className="flex justify-between w-full items-center h-16">
      {/* 问酒店 */}
      <View
        className="flex flex-col items-center justify-center gap-2 h-full"
        onClick={handleContact}
      >
        <View className="bg-blue-50 p-2 size-8 rounded-full flex items-center justify-center">
          <Phone color={"#0068f7"} size="1.5rem" />
        </View>
        <Text className="text-xs text-gray-500">
          {t("detail.function_bar.contact")}
        </Text>
      </View>
      {/* 价格 */}
      <View className="ml-auto flex items-center gap-3">
        <View className="flex items-baseline text-primary">
          <Text className="text-xs">{t("list.hotel_card.price_prefix")}</Text>
          <Text className="text-2xl font-bold">
            ￥{formatAmount(price ?? 0)}
          </Text>
          <Text className="text-xs">{t("list.hotel_card.price_suffix")}</Text>
        </View>
        {/* 按钮 */}
        <CustomButton
          useAnimation={true}
          customClassName="text-white rounded-xl w-32 h-12 text-base font-bold"
        >
          {t("detail.function_bar.viewRoom")}
        </CustomButton>
      </View>
    </View>
  );
};

export default FunctioinBar;
