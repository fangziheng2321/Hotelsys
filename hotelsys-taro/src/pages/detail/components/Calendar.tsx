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
import dayjs from "dayjs";
import { dateFormType } from "@/pages/home/types";
import { useTime } from "@/utils/date";
import { ArrowRight } from "@nutui/icons-react-taro";
import CustomTag from "@/components/CustomTag/CustomTag";

interface IProps {}

const Calendar: FC<IProps> = (props) => {
  const { t } = useTranslation();
  const { formatDate, getDayLabel, getDuration } = useTime();
  const [dateForm, setDateForm] = useState<dateFormType>({
    startDate: dayjs(),
    endDate: dayjs().add(1, "day"),
  });

  return (
    <View className="flex items-center justify-between gap-4">
      {/* 入住时间 */}
      <View className="flex flex-col gap-1">
        <Text className="text-xs text-gray-400">
          {formatDate(dateForm?.startDate ?? dayjs())}
        </Text>
        <Text className="text-sm">
          {getDayLabel(dateForm?.startDate ?? dayjs())}
        </Text>
      </View>
      {/* 间隔时间 */}
      <CustomTag customClassName="bg-transparent text-secondary text-sm border-secondary border">
        {`${getDuration(
          dateForm?.startDate ?? dayjs(),
          dateForm?.endDate ?? dayjs().add(1, "day"),
        )}${t("home.location_bar.nights")}`}
      </CustomTag>
      {/* 退房时间 */}
      <View className="flex flex-col gap-1">
        <Text className="text-xs text-gray-400">
          {formatDate(dateForm?.endDate ?? dayjs().add(1, "day"))}
        </Text>
        <Text className="text-sm">
          {getDayLabel(dateForm?.endDate ?? dayjs().add(1, "day"))}
        </Text>
      </View>
      {/* 打开日历图标 */}
      <ArrowRight size={"1.5rem"} className="ml-auto" />
    </View>
  );
};

export default Calendar;
