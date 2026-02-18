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
import { useSearchStore } from "@/store/searchStore";
import CalendarSelect from "@/components/CalendarSelect/CalendarSelect";

interface IProps {}

const Calendar: FC<IProps> = (props) => {
  const { t } = useTranslation();
  const { formatDate, getDayLabel, getDuration } = useTime();
  const { stayDate, setStayDate } = useSearchStore();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <View>
      <View
        className="flex items-center justify-between gap-4"
        onClick={() => setIsVisible(true)}
      >
        {/* 入住时间 */}
        <View className="flex flex-col gap-1">
          <Text className="text-xs text-gray-400">
            {formatDate(stayDate?.startDate ?? dayjs())}
          </Text>
          <Text className="text-sm">
            {getDayLabel(stayDate?.startDate ?? dayjs())}
          </Text>
        </View>
        {/* 间隔时间 */}
        <CustomTag customClassName="bg-transparent text-secondary text-sm border-secondary border">
          {`${getDuration(
            stayDate?.startDate ?? dayjs(),
            stayDate?.endDate ?? dayjs().add(1, "day"),
          )}${t("home.location_bar.nights")}`}
        </CustomTag>
        {/* 退房时间 */}
        <View className="flex flex-col gap-1">
          <Text className="text-xs text-gray-400">
            {formatDate(stayDate?.endDate ?? dayjs().add(1, "day"))}
          </Text>
          <Text className="text-sm">
            {getDayLabel(stayDate?.endDate ?? dayjs().add(1, "day"))}
          </Text>
        </View>
        {/* 打开日历图标 */}
        <ArrowRight size={"1.5rem"} className="ml-auto" />
      </View>
      <CalendarSelect
        isVisible={isVisible}
        startDate={stayDate?.startDate}
        endDate={stayDate?.endDate}
        setIsVisible={setIsVisible}
        setStayDate={setStayDate}
      />
    </View>
  );
};

export default Calendar;
