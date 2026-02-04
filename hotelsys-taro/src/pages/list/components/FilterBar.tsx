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
import { ConfigProvider, Menu, Button } from "@nutui/nutui-react-taro";
import { Filter } from "@nutui/icons-react-taro";
import DistanceFilterPanel from "./DistanceFilterPanel";
import { FilterType } from "../enums";

interface IProps {}

const FilterBar: FC<IProps> = (props) => {
  const { t } = useTranslation();
  const itemRefs = useRef<Record<string | number, any>>({});
  const menuList = [
    {
      id: 1,
      type: FilterType.POPULARITY,
      isCutom: false,
      title: t("list.filter_bar.popularity"),
      customTitleIcon: null,
      options: [
        { text: "欢迎度1", value: 1 },
        { text: "欢迎度2", value: 2 },
      ],
    },
    {
      id: 2,
      isCustom: true,
      type: FilterType.DISTANCE,
      customTitleIcon: null,
      title: t("list.filter_bar.distance"),
    },
    {
      id: 3,
      isCustom: true,
      type: FilterType.PRICE,
      customTitleIcon: null,
      title: t("list.filter_bar.price"),
    },
    {
      id: 4,
      isCustom: true,
      type: FilterType.ICON,
      customTitleIcon: <Filter />,
      title: "",
      disable: true,
    },
  ];

  /* 关闭函数 */
  const handleClose = (id: number) => {
    itemRefs.current[id]?.toggle();
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
      case FilterType.ICON:
        return <></>;
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
    <ConfigProvider theme={customTheme}>
      <Menu>
        {menuList.map((item) => (
          <Menu.Item
            ref={(el) => {
              if (el) itemRefs.current[item.id] = el;
            }}
            key={item.id}
            title={item.title}
            options={item.isCustom ? undefined : item.options}
            titleIcon={item.customTitleIcon ?? undefined}
            disabled={item.disable ?? false}
          >
            {item.isCustom && renderPanel(item)}
          </Menu.Item>
        ))}
      </Menu>
    </ConfigProvider>
  );
};

export default FilterBar;
