import React, { FC, useMemo, Dispatch } from "react";
import { Calendar } from "@nutui/nutui-react-taro";
import { useTime } from "@/utils/date";
import { timeType } from "@/types";
import CustomPopup from "../CustomPopup/CustomPopup";
import { useTranslation } from "react-i18next";
import { RootPortal } from "@tarojs/components";
import PageWrapper from "../PageWrapper/PageWrapper";

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

  return (
    <RootPortal>
      <PageWrapper>
        <Calendar
          title={t("home.stay_date")}
          defaultValue={date}
          autoBackfill
          closeIcon={<></>}
          startText={t("calendar.check-in")}
          endText={t("calendar.check-out")}
          type="range"
          visible={isVisible}
          onClose={closeSwitch}
          onConfirm={setChooseValue}
        />
      </PageWrapper>
    </RootPortal>
  );
};

export default CalendarSelect;
