import React, { FC, useMemo, useRef } from "react";
import { View, Text } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import { ConfigProvider, Menu } from "@nutui/nutui-react-taro";
import { Filter, FilterF } from "@nutui/icons-react-taro";
import DistanceFilterPanel from "./DistanceFilterPanel";
import { FilterType } from "../enums";
import { filterFormType } from "../types";
import { SearchTabType } from "@/enum/home";
import PriceRateFilterPanel from "./PriceRateFilterPanel";

interface IProps {
  filterForm: filterFormType;
  setFilterForm: (
    tag: "type" | "distance" | "priceRange" | "rate",
    value: SearchTabType | number | number[] | null,
  ) => void;
}

const FilterBar: FC<IProps> = ({ filterForm, setFilterForm }) => {
  const { t } = useTranslation();
  const itemRefs = useRef<Record<string | number, any>>({});
  const hasFiltered = useMemo(() => {
    return Object.values(filterForm).some((value) => value !== null);
  }, [filterForm]);

  const menuList = useMemo(
    () => [
      {
        id: "type",
        type: FilterType.TYPE,
        isCustom: false,
        title: t("list.filter_bar.type"),
        customTitleIcon: null,
        options: [
          {
            text: t("home.search_tabs.domestic"),
            value: SearchTabType.DOMESTIC,
          },
          {
            text: t("home.search_tabs.overseas"),
            value: SearchTabType.OVERSEAS,
          },
          {
            text: t("home.search_tabs.hourly"),
            value: SearchTabType.HOURLY,
          },
          {
            text: t("home.search_tabs.homestay"),
            value: SearchTabType.HOMESTAY,
          },
        ],
      },
      {
        id: "distance",
        isCustom: false,
        type: FilterType.DISTANCE,
        customTitleIcon: null,
        title: t("list.filter_bar.distance"),
        options: [
          { text: "0-100m", value: "0-100" },
          { text: "100-500m", value: "100-500" },
          { text: "500-1000m", value: "500-1000" },
        ],
      },
      {
        id: "priceRate",
        isCustom: true,
        type: FilterType.PRICERATE,
        customTitleIcon: null,
        title: t("list.filter_bar.price"),
      },
    ],
    [],
  );

  /* 关闭函数 */
  const handleClose = (id: number) => {
    itemRefs.current[id]?.toggle();
  };

  /* 重置筛选 */
  const resetFilterForm = () => {
    setFilterForm("type", null);
    setFilterForm("distance", null);
    setFilterForm("priceRange", null);
  };

  const setOuterPriceRange = (value: number[] | null) => {
    return setFilterForm("priceRange", value);
  };

  const setOuterRate = (value: number | null) => {
    return setFilterForm("rate", value);
  };

  // 组件映射字典：配置每种类型对应的组件
  const renderPanel = (item: any) => {
    switch (item.type) {
      case FilterType.DISTANCE:
        return (
          <DistanceFilterPanel menuId={item.id} handleClose={handleClose} />
        );
      case FilterType.PRICERATE:
        return (
          <PriceRateFilterPanel
            menuId={item.id}
            handleClose={handleClose}
            rate={filterForm.rate}
            priceRange={filterForm.priceRange}
            setPriceRange={setOuterPriceRange}
            setRate={setOuterRate}
          />
        );
      default:
        return null;
    }
  };

  const customTheme = {
    nutuiMenuBarBoxShadow: "none",
    nutuiMenuBarLineHeight: "auto",
    nutuiMenuItemIconMargin: "1.5rem",
    nutuiMenuContentMaxHeight: "auto",
  };

  // 避免数组比较，改成字符串`min-max`
  const distanceValue = useMemo(() => {
    if (!filterForm.distance) {
      return null;
    }
    return `${filterForm.distance[0]}-${filterForm.distance[1]}`;
  }, [filterForm.distance]);

  return (
    <View className="flex items-center justify-between">
      <ConfigProvider className="flex-1" theme={customTheme}>
        <Menu>
          {menuList.map((item) => (
            <Menu.Item
              ref={(el) => {
                if (el) itemRefs.current[item.id] = el;
              }}
              key={item.id}
              title={item.title}
              value={
                item.id === "distance" ? distanceValue : filterForm[item.id]
              }
              options={item.isCustom ? undefined : item.options}
              titleIcon={item.customTitleIcon ?? undefined}
              onChange={(option) => {
                if (item.id === "distance") {
                  const [start, end] = String(option.value)
                    .split("-")
                    .map((value) => Number(value));
                  if (Number.isFinite(start) && Number.isFinite(end)) {
                    setFilterForm("distance", [start, end]);
                  } else {
                    setFilterForm("distance", null);
                  }
                  return;
                }
                setFilterForm(item.id as any, option.value);
              }}
            >
              {item.isCustom && renderPanel(item)}
            </Menu.Item>
          ))}
        </Menu>
      </ConfigProvider>
      {/* 筛选图标 */}
      <View className="pr-4" onClick={resetFilterForm}>
        {hasFiltered ? <FilterF /> : <Filter />}
      </View>
    </View>
  );
};

export default FilterBar;
