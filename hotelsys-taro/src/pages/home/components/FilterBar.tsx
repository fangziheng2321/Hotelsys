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

interface IProps {
  label: string | null;
  onClick: () => void;
}

const FilterBar: FC<IProps> = ({ label, onClick }) => {
  const { t } = useTranslation();

  return (
    <View
      onClick={onClick}
      className={[
        label ? "" : "text-custom-placeholder",
        "text-lg  truncate",
      ].join(" ")}
    >
      {label ?? t("home.filter_bar.placeholder")}
    </View>
  );
};

export default FilterBar;
