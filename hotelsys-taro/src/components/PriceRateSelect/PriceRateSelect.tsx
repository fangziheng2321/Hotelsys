import React, {
  FC,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { View, Text } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import RangeSelector from "@/components/RangeSelector/RangeSelector";
import Divide from "../../pages/home/components/Divide";
import StarRateSelector from "@/components/StarRateSelector/StarRateSelector";
import CustomButton from "@/components/CustomButton/CustomButton";
import { priceRange as priceRangeValue } from "@/constant/home";

interface IProps {
  priceRange: number[] | null;
  setPriceRange: Dispatch<SetStateAction<number[] | null>>;
  rate: number | null;
  setRate: Dispatch<SetStateAction<number | null>>;
  handleClose: () => void;
  ancestorId: string;
}

const DEFAULT_RANGE = [priceRangeValue.MIN, priceRangeValue.MAX];
const DEFAULT_RATE = 0;

const PriceRateSelect: FC<IProps> = ({
  priceRange,
  setPriceRange,
  rate,
  setRate,
  handleClose,
  ancestorId,
}) => {
  const { t } = useTranslation();

  const [localRate, setLocalRate] = useState<number>(rate || DEFAULT_RATE);
  const [localRange, setLocalRange] = useState<number[]>(
    priceRange || DEFAULT_RANGE,
  );

  // 重置
  const handleReset = () => {
    setPriceRange(null);
    setRate(null);
  };
  // 确认
  const handleConfirm = () => {
    if (
      localRange[0] === DEFAULT_RANGE[0] &&
      localRange[1] === DEFAULT_RANGE[1]
    ) {
      setPriceRange(null);
    } else {
      setPriceRange(localRange);
    }
    if (localRate === DEFAULT_RATE) {
      setRate(null);
    } else {
      setRate(localRate);
    }
    // 关闭弹窗
    handleClose();
  };

  useEffect(() => {
    if (priceRange) {
      setLocalRange(priceRange);
    } else {
      setLocalRange(DEFAULT_RANGE);
    }
  }, [priceRange]);
  useEffect(() => {
    if (rate) {
      setLocalRate(rate);
    } else {
      setLocalRate(DEFAULT_RATE);
    }
  }, [rate]);

  return (
    <View className="flex flex-col h-full p-4 gap-3">
      {/* 标题 */}
      <View id="price-rate-select">
        <View className="text-sm font-bold mb-4">
          - {t("home.filter_bar.price_select.title")}
        </View>
        {/* 价格选择 */}
        <RangeSelector
          ancestorId={ancestorId}
          rangeValue={localRange}
          setRangeValue={setLocalRange}
        />
      </View>
      <Divide />
      {/* 星级选择 */}
      <View>
        <View className="text-sm font-bold mb-4">
          - {t("home.filter_bar.rate_select.title")}
        </View>
        <StarRateSelector rateValue={localRate} setRateValue={setLocalRate} />
      </View>
      {/* 底部按钮 */}
      <View className="flex w-full gap-4 mt-1">
        <CustomButton
          customClassName="w-1/2 text-base text-black dark:text-dark-text p-2 rounded-lg"
          customBg="bg-custom-gray dark:bg-dark-card"
          onClick={handleReset}
        >
          {t("home.filter_bar.price_select.reset")}
        </CustomButton>
        <CustomButton
          useAnimation={true}
          customClassName="w-1/2 text-base text-white p-2 rounded-lg"
          onClick={handleConfirm}
        >
          {t("home.filter_bar.price_select.confirm")}
        </CustomButton>
      </View>
    </View>
  );
};

export default PriceRateSelect;
