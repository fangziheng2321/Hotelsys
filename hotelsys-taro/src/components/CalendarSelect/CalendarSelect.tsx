import React, { FC, useState, useEffect, useMemo, Dispatch } from "react";
import { View, Text, RootPortal } from "@tarojs/components";
import { Calendar } from "@nutui/nutui-react-taro";
import { dateFormType } from "@/pages/home/types";
import { useTime } from "@/utils/date";

interface IProps {
  isVisible: boolean;
  dateForm: dateFormType;
  setIsVisible: Dispatch<React.SetStateAction<boolean>>;
  setDateForm: Dispatch<React.SetStateAction<dateFormType>>;
}

const CalendarSelect: FC<IProps> = ({
  isVisible,
  setIsVisible,
  dateForm,
  setDateForm,
}) => {
  const [renderVisible, setRenderVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  const { formatDate } = useTime();

  const format = "YYYY-MM-DD";

  const date = useMemo(() => {
    return [
      formatDate(dateForm?.startDate, format),
      formatDate(dateForm?.endDate, format),
    ];
  }, [dateForm]);

  const closeSwitch = () => {
    setIsVisible(false);
  };

  const setChooseValue = (param: string) => {
    setDateForm(() => {
      return {
        startDate: param[0][3],
        endDate: param[1][3],
      };
    });
  };

  const select = (param: string[]) => {
    console.log(param);
  };

  useEffect(() => {
    if (isVisible) {
      setRenderVisible(true);
      setTimeout(() => setAnimateIn(true), 10);
      return;
    }
    setAnimateIn(false);
    const timer = setTimeout(() => setRenderVisible(false), 200);
    return () => clearTimeout(timer);
  }, [isVisible]);

  if (!renderVisible) {
    return null;
  }

  return (
    <RootPortal>
      <View className="fixed inset-0 z-50">
        <View
          className={[
            "absolute inset-0 bg-black/40 transition-opacity duration-200",
            animateIn ? "opacity-100" : "opacity-0",
          ].join(" ")}
          onClick={closeSwitch}
        />
        <View
          className={[
            "absolute left-0 right-0 bottom-0 transition-transform duration-200 h-4/5",
            animateIn ? "translate-y-0" : "translate-y-full",
          ].join(" ")}
        >
          <View className="h-full rounded-t-2xl overflow-hidden bg-white">
            <Calendar
              defaultValue={date}
              type="range"
              popup={false}
              onClose={closeSwitch}
              onConfirm={setChooseValue}
              onDayClick={select}
            />
          </View>
        </View>
      </View>
    </RootPortal>
  );
};

export default CalendarSelect;
