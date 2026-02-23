import React, { FC, useMemo, Dispatch } from "react";
import { Calendar } from "@nutui/nutui-react-taro";
import { useTime } from "@/utils/date";
import { timeType } from "@/types";
import CustomPopup from "../CustomPopup/CustomPopup";
import { useTranslation } from "react-i18next";

interface IProps {
  isVisible: boolean;
  startDate: timeType;
  endDate: timeType;
  setIsVisible: Dispatch<React.SetStateAction<boolean>>;
  setStayDate: (startDate: timeType, endDate: timeType) => void;
}

const CalendarSelect: FC<IProps> = ({
  isVisible,
  startDate,
  endDate,
  setIsVisible,
  setStayDate,
}) => {
  const { formatDate } = useTime();
  const { t } = useTranslation();
  const format = "YYYY-MM-DD";

  const date = useMemo(() => {
    return [formatDate(startDate, format), formatDate(endDate, format)];
  }, [startDate, endDate]);

  const closeSwitch = () => {
    setIsVisible(false);
  };

  const setChooseValue = (param: string) => {
    setStayDate(param[0][3], param[1][3]);
  };

  const select = (param: string[]) => {
    console.log(param);
  };

  return (
    <CustomPopup
      isVisible={isVisible}
      onClose={closeSwitch}
      customClassName="h-4/5"
    >
      <Calendar
        title={t("home.stay_date")}
        defaultValue={date}
        type="range"
        popup={false}
        onClose={closeSwitch}
        onConfirm={setChooseValue}
        onDayClick={select}
      />
    </CustomPopup>
  );
};

export default CalendarSelect;
