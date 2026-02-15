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
import { View, Text } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import PriceRateSelect from "./PriceRateSelect";
import PriceRateSelectPop from "./PriceRateSelectPop";

interface IProps {
  label: string | null;
  priceRange: number[] | null;
  rate: number | null;
  setRate: (rate: number | null) => void;
  setPricePrange: (range: number[] | null) => void;
}

const FilterBar: FC<IProps> = ({
  label,
  priceRange,
  rate,
  setRate,
  setPricePrange,
}) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <View
      onClick={() => setIsVisible(true)}
      className={[
        label ? "font-bold" : "text-custom-placeholder",
        "text-lg  truncate",
      ].join(" ")}
    >
      {label ?? t("home.filter_bar.placeholder")}
      <PriceRateSelectPop
        rate={rate}
        setRate={setRate}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        priceRange={priceRange}
        setPriceRange={setPricePrange}
      />
    </View>
  );
};

export default FilterBar;
