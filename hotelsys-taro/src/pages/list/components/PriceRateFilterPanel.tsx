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
import PriceRateSelect from "@/pages/home/components/PriceRateSelect";

interface IProps {
  priceRange: number[] | null;
  setPriceRange: Dispatch<SetStateAction<number[] | null>>;
  rate: number | null;
  setRate: Dispatch<SetStateAction<number | null>>;
  menuId: number;
  handleClose: (id: number) => void;
}

const PriceRateFilterPanel: FC<IProps> = ({
  priceRange,
  setPriceRange,
  rate,
  setRate,
  menuId,
  handleClose,
}) => {
  const handleCloseMenu = () => {
    handleClose(menuId);
  };

  const ancestorId = "price-rate-filter-panel";

  return (
    <View id={ancestorId} className="mx-[-48rpx] my-[-24rpx]">
      <PriceRateSelect
        ancestorId={ancestorId}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        rate={rate}
        setRate={setRate}
        handleClose={handleCloseMenu}
      />
    </View>
  );
};

export default PriceRateFilterPanel;
