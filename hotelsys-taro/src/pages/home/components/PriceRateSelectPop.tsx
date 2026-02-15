import React, {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import { View, Text, RootPortal } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import { Popup } from "@nutui/nutui-react-taro";
import { Close } from "@nutui/icons-react-taro";
import RangeSelector from "@/components/RangeSelector/RangeSelector";
import CustomPopup from "@/components/CustomPopup/CustomPopup";
import Divide from "./Divide";
import StarRateSelector from "@/components/StarRateSelector/StarRateSelector";
import CustomButton from "@/components/CustomButton/CustomButton";
import { priceRange as priceRangeValue } from "@/constant/home";
import PriceRateSelect from "./PriceRateSelect";

interface IProps {
  priceRange: number[] | null;
  isVisible: boolean;
  setPriceRange: Dispatch<SetStateAction<number[] | null>>;
  rate: number | null;
  setRate: Dispatch<SetStateAction<number | null>>;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

const PriceRateSelectPop: FC<IProps> = ({
  priceRange,
  setPriceRange,
  rate,
  setRate,
  isVisible,
  setIsVisible,
}) => {
  const { t } = useTranslation();
  const handleClose = () => {
    return setIsVisible(false);
  };
  return (
    <CustomPopup
      isVisible={isVisible}
      onClose={() => setIsVisible(false)}
      customClassName="h-fit"
    >
      <View className="flex justify-center items-center p-3">
        <Text className="text-base font-bold">
          {t("home.filter_bar.price_rate_select")}
        </Text>
      </View>
      <PriceRateSelect
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        rate={rate}
        setRate={setRate}
        handleClose={handleClose}
      />
    </CustomPopup>
  );
};

export default PriceRateSelectPop;
