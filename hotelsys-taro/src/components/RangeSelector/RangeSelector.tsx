import React, { FC, Dispatch, SetStateAction } from "react";
import { Range } from "@nutui/nutui-react-taro";
import { Input, View, Button } from "@tarojs/components";
import Divide from "@/pages/home/components/Divide";
import { presetRanges, priceRange } from "@/constant/home";

interface IProps {
  rangeValue: number[];
  setRangeValue: Dispatch<SetStateAction<number[]>>;
}

const RangeSelector: FC<IProps> = ({ rangeValue, setRangeValue }) => {
  const handleMinInput = (e) => {
    const val = parseInt(e.detail.value);
    if (!isNaN(val)) {
      setRangeValue([val, rangeValue[1]]);
    } else if (e.detail.value === "") {
      setRangeValue([0, rangeValue[1]]);
    }
  };

  const handleMaxInput = (e) => {
    const val = parseInt(e.detail.value);
    if (!isNaN(val)) {
      setRangeValue([rangeValue[0], val]);
    } else if (e.detail.value === "") {
      setRangeValue([rangeValue[0], 0]);
    }
  };

  const handlePresetClick = (index: number) => {
    if (index === 0) {
      setRangeValue([0, presetRanges[1]]);
    } else {
      setRangeValue([
        presetRanges[index],
        presetRanges[index + 1] || priceRange.MAX,
      ]);
    }
  };

  const isPresetSelected = (index: number) => {
    const start = index === 0 ? 0 : presetRanges[index];
    const end = presetRanges[index + 1] || priceRange.MAX;
    return rangeValue[0] === start && rangeValue[1] === end;
  };

  return (
    <View className="flex flex-col items-center gap-6 w-full">
      {/* 范围区间滚动条 */}
      <Range
        min={priceRange.MIN}
        max={priceRange.MAX}
        range
        currentDescription={null}
        value={rangeValue}
        onChange={(val: number[]) => setRangeValue(val)}
      />
      {/* 输入框 */}
      <View className="flex items-center justify-between gap-2">
        {/* 最低价 */}
        <Input
          className="p-2 text-base border-primary border border-solid rounded-lg"
          type="number"
          value={String(rangeValue[0])}
          controlled
          placeholder="最小值"
          onInput={handleMinInput}
        />
        {/* 到 */}
        <View>-</View>
        {/* 最高价 */}
        <Input
          className="p-2 text-base border-primary border border-solid rounded-lg"
          type="number"
          value={String(rangeValue[1])}
          controlled
          placeholder="最大值"
          onInput={handleMaxInput}
        />
      </View>

      {/* 分隔线 */}
      <Divide />

      {/* 操作面板 */}
      <View className="flex flex-wrap gap-3 w-full justify-between">
        {presetRanges.slice(0, -1).map((val, index) => {
          const start = val;
          const end = presetRanges[index + 1];
          const label = index === 0 ? `￥${end}以下` : `￥${start}-${end}`;
          return (
            /* 单选项 */
            <View
              key={val}
              className={[
                "w-24 h-12 flex items-center justify-center rounded-lg text-base border border-solid transition-colors duration-200",
                isPresetSelected(index)
                  ? "bg-primary text-white border-primary"
                  : "bg-gray-100 text-gray-600 border-transparent",
              ].join(" ")}
              onClick={() => handlePresetClick(index)}
            >
              {label}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default RangeSelector;
