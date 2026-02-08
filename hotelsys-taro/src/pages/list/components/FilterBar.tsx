import React, {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import { View, Text } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import { ConfigProvider, Menu, Button } from "@nutui/nutui-react-taro";
import { Filter, FilterF } from "@nutui/icons-react-taro";
import DistanceFilterPanel from "./DistanceFilterPanel";
import { FilterType } from "../enums";
import { filterFormType } from "../types";

interface IProps {
  filterForm: filterFormType;
  setFilterForm: Dispatch<SetStateAction<filterFormType>>;
}

const FilterBar: FC<IProps> = ({ filterForm, setFilterForm }) => {
  const { t } = useTranslation();
  const itemRefs = useRef<Record<string | number, any>>({});
  const hasFiltered = useMemo(() => {
    return Object.values(filterForm).some((value) => value !== null);
  }, [filterForm]);
  const menuList = [
    {
      id: "popularity",
      type: FilterType.POPULARITY,
      isCustom: false,
      title: t("list.filter_bar.popularity"),
      customTitleIcon: null,
      options: [
        { text: "欢迎度1", value: 1 },
        { text: "欢迎度2", value: 2 },
      ],
    },
    {
      id: "distance",
      isCustom: false,
      type: FilterType.DISTANCE,
      customTitleIcon: null,
      title: t("list.filter_bar.distance"),
      options: [
        { text: "距离1", value: 1 },
        { text: "距离2", value: 2 },
      ],
    },
    {
      id: "price",
      isCustom: false,
      type: FilterType.PRICE,
      customTitleIcon: null,
      title: t("list.filter_bar.price"),
      options: [
        { text: "星级1", value: 1 },
        { text: "星级2", value: 2 },
      ],
    },
  ];

  /* 关闭函数 */
  const handleClose = (id: number) => {
    itemRefs.current[id]?.toggle();
  };

  /* 重置筛选 */
  const resetFilterForm = () => {
    setFilterForm({
      popularity: null,
      distance: null,
      price: null,
    });
  };

  // 组件映射字典：配置每种类型对应的组件
  const renderPanel = (item: any) => {
    switch (item.type) {
      case FilterType.DISTANCE:
        return (
          <DistanceFilterPanel menuId={item.id} handleClose={handleClose} />
        );
      case FilterType.PRICE:
        return (
          <DistanceFilterPanel menuId={item.id} handleClose={handleClose} />
        );
      default:
        return null;
    }
  };

  const customTheme = {
    nutuiMenuBarBoxShadow: "none",
    nutuiMenuBarLineHeight: "auto",
    nutuiMenuItemIconMargin: "1.5rem",
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
              value={filterForm[item.id]}
              options={item.isCustom ? undefined : item.options}
              titleIcon={item.customTitleIcon ?? undefined}
              onChange={(option) =>
                setFilterForm((pre) => ({
                  ...pre,
                  [item.id]: option.value,
                }))
              }
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
