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
import CustomPopup from "@/components/CustomPopup/CustomPopup";
import PriceRateSelect from "@/components/PriceRateSelect/PriceRateSelect";

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

  const ancestorId = "home-custom-popup";
  return (
    <CustomPopup
      isVisible={isVisible}
      onClose={() => setIsVisible(false)}
      customClassName="h-fit"
      id={ancestorId}
    >
      <View className="flex justify-center items-center p-3">
        <Text className="text-base font-bold">
          {t("home.filter_bar.price_rate_select")}
        </Text>
      </View>
      <PriceRateSelect
        ancestorId={ancestorId}
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
