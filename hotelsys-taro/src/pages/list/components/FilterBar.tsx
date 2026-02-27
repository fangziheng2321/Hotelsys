import React, { FC, useMemo, useRef } from "react";
import { View, Text } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import { ConfigProvider, Menu } from "@nutui/nutui-react-taro";
import { Filter, FilterF } from "@nutui/icons-react-taro";
import DistanceFilterPanel from "./DistanceFilterPanel";
import { FilterType, Order } from "../enums";
import { filterFormType } from "../types";
import { SearchTabType } from "@/enum/home";
import PriceRateFilterPanel from "./PriceRateFilterPanel";
import { useSearchStore } from "@/store/searchStore";

interface IProps {
  filterForm: filterFormType;
  setFilterForm: (
    tag: "type" | "distance" | "priceRange" | "rate" | "sortOrder" | "sortBy",
    value: SearchTabType | number | number[] | string | "asc" | "desc" | null,
  ) => void;
}

const FilterBar: FC<IProps> = ({ filterForm, setFilterForm }) => {
  const { t } = useTranslation();
  const itemRefs = useRef<Record<string | number, any>>({});
  const { setHotelName, setFacilities } = useSearchStore();
  const hasFiltered = useMemo(() => {
    return Object.values(filterForm).some((value) => value !== null);
  }, [filterForm]);

  const menuList = useMemo(
    () => [
      {
        id: FilterType.SORT,
        type: FilterType.SORT,
        isCustom: false,
        title: t("list.filter_bar.order"),
        customTitleIcon: null,
        options: [
          {
            text: t("list.order.price_asc"),
            value: Order.PRICE_ASC,
          },
          {
            text: t("list.order.price_desc"),
            value: Order.PRICE_DESC,
          },
          {
            text: t("list.order.rate_desc"),
            value: Order.RATE_DESC,
          },
          {
            text: t("list.order.rate_asc"),
            value: Order.RATE_ASC,
          },
        ],
      },
      {
        id: FilterType.TYPE,
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
        id: FilterType.DISTANCE,
        isCustom: false,
        type: FilterType.DISTANCE,
        customTitleIcon: null,
        title: t("list.filter_bar.distance"),
        options: [
          { text: "0-500m", value: "0-500" },
          { text: "500-1000m", value: "500-1000" },
          { text: "1000-3000m", value: "1000-3000" },
          { text: "3000m+", value: "3000-99999" },
        ],
      },
      {
        id: FilterType.PRICERATE,
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
    if(!hasFiltered) {
      return;
    }
    setFilterForm("type", null);
    setFilterForm("distance", null);
    setFilterForm("priceRange", null);
    setFilterForm("rate", null);
    setFilterForm("sortOrder", null);
    setFilterForm("sortBy", null);
    setHotelName(null);
    setFacilities([]);
  };

  const setOuterPriceRange = (value: number[] | null) => {
    return setFilterForm("priceRange", value);
  };

  const setOuterRate = (value: number | null) => {
    return setFilterForm("rate", value);
  };

  // 避免数组比较，改成字符串`min-max`
  const distanceValue = useMemo(() => {
    if (!filterForm.distance) {
      return null;
    }
    return `${filterForm.distance[0]}-${filterForm.distance[1]}`;
  }, [filterForm.distance]);

  const orderValue = useMemo(() => {
    if (!filterForm.sortOrder || !filterForm.sortBy) {
      return null;
    }
    return `${filterForm.sortBy}_${filterForm.sortOrder}`;
  }, [filterForm.sortBy, filterForm.sortOrder]);

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

  // 获取菜单选项值
  const getMenuValue = (item: { id: FilterType }) => {
    switch (item.id) {
      case FilterType.DISTANCE:
        return distanceValue;
      case FilterType.SORT:
        return orderValue;
      default:
        return filterForm[item.id];
    }
  };

  // 修改菜单选项
  const changeMenu = (item, option) => {
    // 如果是距离筛选
    if (item.id === FilterType.DISTANCE) {
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
    // 如果是排序
    if (item.id === FilterType.SORT) {
      const [sortBy, order] = String(option.value).split("_");
      console.log(sortBy, order);
      if (sortBy && order) {
        (setFilterForm("sortOrder", order as "desc" | "asc"),
          setFilterForm("sortBy", sortBy as string));
      } else {
        (setFilterForm("sortOrder", null), setFilterForm("sortBy", null));
      }
      return;
    }
    setFilterForm(item.id as any, option.value);
  };

  const customTheme = {
    nutuiMenuBarBoxShadow: "none",
    nutuiMenuBarLineHeight: "auto",
    nutuiMenuItemIconMargin: "1.5rem",
    nutuiMenuContentMaxHeight: "auto",
  };

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
              value={getMenuValue(item)}
              options={item.isCustom ? undefined : item.options}
              titleIcon={item.customTitleIcon ?? undefined}
              onChange={(option) => changeMenu(item, option)}
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
